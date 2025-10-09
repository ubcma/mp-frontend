import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and API routes
  const allowlist = [
    // '/maintenance',
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

  // Check for session cookies (try multiple possible names)
  const sessionCookie = request.cookies.get(
    process.env.NODE_ENV === 'production'
      ? '__Secure-membership-portal.session_token'
      : 'membership-portal.session_token'
  )?.value;

  const publicAuthRoutes = [
    '/sign-in',
    '/sign-up',
    '/reset-password',
    '/forgot-password',
  ];

  const isAuthPage = publicAuthRoutes.includes(pathname);

  const publicPageRoutes = ['/terms-of-service', '/privacy-policy'];

  const isPublicPage =
    publicPageRoutes.includes(pathname);

  if (!sessionCookie) {
    if (isAuthPage || isPublicPage) return NextResponse.next();
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
