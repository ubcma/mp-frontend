import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {

  const token = request.cookies.get('membership-portal.session_token')?.value;
  const { pathname } = request.nextUrl;

  if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
    const allowlist = [
      '/maintenance',
      '/favicon.ico',
      '/robots.txt',
      '/_next', // static files
      '/api',
    ];
    const isAllowed = allowlist.some(path => pathname.startsWith(path));
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/sign-in' || pathname === '/sign-up' || pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/:path',
    '/',
    '/home/:path*', 
    '/events/:path*',  
    '/profile/:path*', 
    '/sign-in',
    '/sign-up',
    '/forgot-password',
  ],
};