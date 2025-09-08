import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOnboardingStatus } from './lib/queries/server/onboardingStatus';

export async function middleware(request: NextRequest) {
  const accessCode = request.cookies.get('access_code')?.value;
  const expectedCode = process.env.ACCESS_CODE;
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

  // Access code check first
  const isMaintenance = pathname.startsWith('/maintenance');

  if (process.env.VERCEL_ENV === 'preview') {
    if (!isMaintenance && accessCode !== expectedCode) {
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  }

  // Check for session cookies (try multiple possible names)
  const sessionCookie = request.cookies.get(
    process.env.NODE_ENV === 'production'
      ? '__Secure-membership-portal.session_token'
      : 'membership-portal.session_token'
  )?.value;

  let skipOnboarding = request.cookies.get('onboarding_skipped')?.value;

  if (!skipOnboarding) {
    const response = NextResponse.next();
    response.cookies.set('onboarding_skipped', 'false', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    skipOnboarding = 'false';
    return response;
  }

  let onboardingComplete: boolean | undefined = false;

  if (sessionCookie) {
    onboardingComplete = await getOnboardingStatus();
  }

  const publicAuthRoutes = [
    '/sign-in',
    '/sign-up',
    '/reset-password',
    '/forgot-password',
  ];

  const isAuthPage = publicAuthRoutes.includes(pathname);

  const publicPageRoutes = ['/terms-of-service', '/privacy-policy'];

  const isPublicPage =
    publicPageRoutes.includes(pathname) || pathname.startsWith('/events');

  if (!sessionCookie) {
    if (isAuthPage || isPublicPage) return NextResponse.next();
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (isAuthPage || isMaintenance) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (
    !onboardingComplete &&
    pathname !== '/onboarding' &&
    skipOnboarding === 'false'
  ) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
