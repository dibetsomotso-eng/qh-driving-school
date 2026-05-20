import { NextRequest, NextResponse } from 'next/server';
import { insforgeLogin } from '@/lib/insforge';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

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
