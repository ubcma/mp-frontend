import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { genericGetRequest } from './httpHandlers';

export async function getCurrentUserRole() {
  const cookieStore = cookies();

  const sessionToken = (await cookieStore).get(
    'membership-portal.session_token'
  )?.value;

  if (!sessionToken) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
    headers: {
      Cookie: `membership-portal.session_token=${sessionToken}`,
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const user = await res.json();
  return user.role || null;
}
