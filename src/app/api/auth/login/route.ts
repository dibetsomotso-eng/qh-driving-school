import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { insforgeLogin } from '@/lib/insforge';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// OWASP A07: Aggressive brute-force protection — 5 attempts per 15 minutes per IP.
const LOGIN_RATE_LIMIT = { windowMs: 15 * 60_000, max: 5 };

// Validate login body shape and lengths to prevent oversized payloads.
const LoginSchema = z.object({
  email:    z.string().email().max(254).trim(),
  password: z.string().min(1).max(256),
});

export async function POST(req: NextRequest) {
  // SECURITY: Check rate limit first — before parsing the body or touching the DB.
  const ip = getClientIp(req.headers);
  const rl = checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    // SECURITY: Return a generic message — don't reveal which field failed.
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  try {
    const { email, password } = parsed.data;
    const { token, user } = await insforgeLogin(email, password);

    const response = NextResponse.json({ user });

    // Store JWT in a secure, httpOnly cookie — never accessible from JS
    response.cookies.set('insforge-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('[auth/login]', err);
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
}
