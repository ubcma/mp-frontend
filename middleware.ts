import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessCode = request.cookies.get('access_code')?.value;
  const expectedCode = process.env.ACCESS_CODE;
  const { pathname } = request.nextUrl;

  // Maintenance Mode: Only allow access with a valid access code
  if (accessCode !== expectedCode) {
    const allowlist = [
      '/maintenance',
      '/favicon.ico',
      '/robots.txt',
      '/_next',
      '/api',
    ];
    const isAllowed = allowlist.some((path) => pathname.startsWith(path));
    if (!isAllowed) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
    return NextResponse.next();
  }

  // Prevent access to root and redirect to /home
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
