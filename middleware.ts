import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/admin'];
const LOGIN_PAGE = '/admin/login';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some(
    (p) => pathname.startsWith(p) && pathname !== LOGIN_PAGE
  );

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('insforge-token')?.value;

  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = LOGIN_PAGE;
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
