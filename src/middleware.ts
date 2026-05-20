import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// ---------------------------------------------------------------------------
// Rate-limit policy table
// Rules are evaluated in order; first match wins.
// ---------------------------------------------------------------------------
const RATE_POLICIES: Array<{
  label: string;
  match: (path: string, method: string) => boolean;
  windowMs: number;
  max: number;
}> = [
  // Auth login — strict, brute-force protection
  {
    label: 'login',
    match: (p, m) => p === '/api/auth/login' && m === 'POST',
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5,
  },
  // AI chat — protect Google GenAI costs
  {
    label: 'chat',
    match: (p, m) => p === '/api/chat' && m === 'POST',
    windowMs: 60 * 1000, // 1 min
    max: 15,
  },
  // Email sending — prevent spam relay abuse
  {
    label: 'email',
    match: (p) =>
      p === '/api/send-email' || p === '/api/send-booking-email',
    windowMs: 15 * 60 * 1000, // 15 min
    max: 10,
  },
  // Public booking form
  {
    label: 'bookings-create',
    match: (p, m) => p === '/api/bookings' && m === 'POST',
    windowMs: 15 * 60 * 1000, // 15 min
    max: 20,
  },
  // Catch-all for any remaining /api/* routes
  {
    label: 'api-default',
    match: (p) => p.startsWith('/api/'),
    windowMs: 60 * 1000, // 1 min
    max: 60,
  },
];

function tooManyRequests(retryAfterSec: number): NextResponse {
  return new NextResponse(
    JSON.stringify({
      success: false,
      message: 'Too many requests — please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSec),
      },
    },
  );
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ── Admin auth ─────────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const hasAuthCookie = request.cookies
      .getAll()
      .some((c) => c.name.includes('firebase-auth-decoded'));

    if (!isLoginPage && !hasAuthCookie) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (isLoginPage && hasAuthCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // ── API rate limiting ──────────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const policy = RATE_POLICIES.find((r) => r.match(pathname, method));
    if (policy) {
      const ip = getClientIp(request.headers);
      const key = `${policy.label}:${ip}`;
      const result = checkRateLimit(key, {
        windowMs: policy.windowMs,
        max: policy.max,
      });

      if (!result.allowed) {
        return tooManyRequests(result.retryAfterSec);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
