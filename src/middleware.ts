
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasAuthCookie = request.cookies.has('firebase-auth-decoded'); // A simple check for any auth cookie

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // If user is trying to access admin routes but has no auth cookie,
  // and is not already on the login page, redirect to login.
  if (isAdminRoute && !isLoginPage && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If user is logged in and tries to access the login page,
  // redirect them to the admin dashboard.
  if (isLoginPage && hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin/:path*',
}
