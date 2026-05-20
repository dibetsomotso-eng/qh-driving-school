/**
 * Edge-compatible in-memory sliding-window rate limiter.
 *
 * Limitation: state is per-process/Edge-worker instance, so limits are
 * approximate across concurrent serverless instances. For a small-traffic
 * driving-school site this gives meaningful abuse protection without needing
 * a Redis service. Upgrade to @upstash/ratelimit if traffic grows.
 */

interface WindowEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowEntry>();
let lastCleanup = Date.now();

/** Remove entries older than 1 hour to prevent unbounded memory growth. */
function cleanupStore(): void {
  const now = Date.now();
  if (now - lastCleanup < 5 * 60 * 1000) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now - entry.windowStart > 60 * 60 * 1000) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Window length in milliseconds. */
  windowMs: number;
  /** Maximum requests allowed within the window. */
  max: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the current window resets (only relevant when allowed=false). */
  retryAfterSec: number;
}

/**
 * Check and increment the counter for `key`.
 * The key should encode both the route label and the client identifier
 * (e.g. `"login:203.0.113.42"`).
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  cleanupStore();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= config.windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: config.max - 1, retryAfterSec: 0 };
  }

  if (entry.count >= config.max) {
    const retryAfterSec = Math.ceil(
      (config.windowMs - (now - entry.windowStart)) / 1000,
    );
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: config.max - entry.count,
    retryAfterSec: 0,
  };
}

/** Extract the best available client IP from request headers. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
