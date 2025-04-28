import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('membership-portal.session_token')?.value;
  const { pathname } = request.nextUrl;

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
    '/',
    '/home/:path*', 
    '/events/:path*',  
    '/profile/:path*', 
    '/sign-in',
    '/sign-up',
    '/forgot-password',
  ],
};