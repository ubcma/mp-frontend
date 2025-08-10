import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessCode = request.cookies.get('access_code')?.value;
  const expectedCode = process.env.ACCESS_CODE;
  const { pathname } = request.nextUrl;

  // Static assets and API routes
  const allowlist = [
    '/maintenance',
    '/favicon.ico',
    '/robots.txt',
    '/_next',
    '/api',
    '/logos', // Add your static assets
  ];

  const isStaticAsset = pathname.match(
    /\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|otf|eot|mp4|webm)$/
  );

  const isAllowlisted =
    allowlist.some((path) => pathname.startsWith(path)) || isStaticAsset;

  if (isAllowlisted) {
    return NextResponse.next();
  }

  // Access code check first
  if (accessCode !== expectedCode) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  // Check for session cookies (try multiple possible names)
  const sessionCookies = [
    request.cookies.get('membership-portal.session_token')?.value,
    request.cookies.get('__Secure-membership-portal.session_token')?.value,
    request.cookies.get('membership-portal.session')?.value,
  ];
  
  const hasSession = sessionCookies.some(cookie => cookie);

  const isAuthPage =
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/forgot-password');

  const isPublicPage = pathname === '/'; // Add other public pages here

  // If no session and trying to access protected route
  if (!hasSession && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If has session and on auth page, redirect to home
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Root redirect
  if (pathname === '/' && hasSession) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
};