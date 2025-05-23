
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {

  const accessCode = request.cookies.get('access_code')?.value;
  const expectedCode = process.env.ACCESS_CODE;

  const token = request.cookies.get('membership-portal.session_token')?.value;
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'development' && accessCode !== expectedCode) {
    const allowlist = [
      '/maintenance',
      '/favicon.ico',
      '/robots.txt',
      '/_next',
      '/api',
    ];
    const isAllowed = allowlist.some(path => pathname.startsWith(path));
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
    return NextResponse.next();
  }

  const publicPaths = ['/sign-in', '/sign-up', '/forgot-password'];

  const isPublic = publicPaths.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/api');

  if (isPublic) {
    if (token && (pathname === '/sign-in' || pathname === '/sign-up')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
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
