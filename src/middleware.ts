
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // In a real app, you'd verify a JWT. For this, we check a session cookie Firebase Auth SDK sets.
  // Note: This cookie name can vary based on your setup. You may need to inspect your browser's cookies.
  // Common names are `__session` or a cookie containing `firebase-auth-decoded`.
  // The presence of any firebase auth cookie is a good indicator for this purpose.
  const hasAuthCookie = request.cookies.getAll().some(cookie => cookie.name.includes('firebase-auth-decoded'));

  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  // If trying to access a protected admin route without being authenticated...
  if (isAdminRoute && !isLoginPage && !hasAuthCookie) {
    // ...redirect to the login page.
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If the user is authenticated and tries to access the login page...
  if (isLoginPage && hasAuthCookie) {
    // ...redirect them to the admin dashboard.
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Otherwise, allow the request to proceed.
  return NextResponse.next()
}

// Config to specify that the middleware should only run on admin routes.
export const config = {
  matcher: ['/admin/:path*'],
}
