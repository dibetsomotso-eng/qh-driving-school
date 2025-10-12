
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  // This is a simplified check. In a real app, you might verify a JWT.
  // For this context, we check for the presence of a cookie that Firebase sets.
  const hasAuthCookie = request.cookies.has('firebase-auth-decoded'); 

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // If trying to access a protected admin route without being authenticated, redirect to login.
  if (isAdminRoute && !isLoginPage && !hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If authenticated user tries to access the login page, redirect to the admin dashboard.
  if (isLoginPage && hasAuthCookie) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Allow the request to proceed if none of the above conditions are met.
  return NextResponse.next()
}

// Config to specify that the middleware should run on all admin routes.
export const config = {
  matcher: ['/admin/:path*'],
}
