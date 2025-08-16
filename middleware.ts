import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getOnboardingStatus } from './lib/queries/onboardingStatus';

export async function middleware(request: NextRequest) {
  const accessCode = request.cookies.get('access_code')?.value;
  const sessionCookie = request.cookies.get(
    'membership-portal.session_token'
  )?.value;
  const expectedCode = process.env.ACCESS_CODE;
  const { pathname } = request.nextUrl;

  let skipOnboarding = request.cookies.get('onboarding_skipped')?.value;

  if (!skipOnboarding) {
    const response = NextResponse.next();
    response.cookies.set('onboarding_skipped', 'false', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    skipOnboarding = 'false'
    return response;
  }

  const onboardingComplete = await getOnboardingStatus();

  const allowlist = [
    '/maintenance',
    '/favicon.ico',
    '/robots.txt',
    '/_next',
    '/api',
  ];

  const isStaticAsset = pathname.match(
    /\.(png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|otf|eot|mp4|webm)$/
  );

  const isAllowlisted =
    allowlist.some((path) => pathname.startsWith(path)) || isStaticAsset;

  if (isAllowlisted) {
    return NextResponse.next();
  }

  const isAuthPage =
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up') ||
    pathname.startsWith('/forgot-password');

  const isMaintenance = pathname.startsWith('/maintenance');

  if (accessCode !== expectedCode) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  if (!sessionCookie) {
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (
    !onboardingComplete &&
    pathname !== '/onboarding' &&
    skipOnboarding === 'false'
  ) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (pathname === '/') {
    console.log('TEST');
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (isAuthPage || isMaintenance) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/:path*'],
};
