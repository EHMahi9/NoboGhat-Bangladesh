import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Handle legacy HTML path redirects from Spring Boot OAuth2
  if (pathname === '/pages/dashboard.html' || pathname === '/dashboard.html') {
    return NextResponse.redirect(new URL(`/dashboard${search}`, request.url));
  }
  if (pathname === '/pages/login.html' || pathname === '/login.html') {
    return NextResponse.redirect(new URL(`/login${search}`, request.url));
  }
  if (pathname === '/pages/routes.html' || pathname === '/routes.html') {
    return NextResponse.redirect(new URL(`/routes${search}`, request.url));
  }

  // 2. Get token from cookies OR URL search params (e.g. returning from Google OAuth2 redirect)
  const token = request.cookies.get('token')?.value || request.nextUrl.searchParams.get('token');

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access auth pages WITH a token, redirect to dashboard
  if (isAuthPage && token && !request.nextUrl.searchParams.has('registered')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/pages/:path*',
    '/dashboard.html',
    '/login.html',
    '/routes.html',
  ],
};
