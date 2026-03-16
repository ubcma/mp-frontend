import { cache } from 'react';
import { fetchFromAPI } from './httpHandlers';

function extractSessionToken(cookieHeader: string): string {
  const prefix =
    process.env.NODE_ENV === 'production'
      ? '__Secure-membership-portal.session_token'
      : 'membership-portal.session_token';
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]+)`)
  );
  return match?.[1] ?? '';
}

export const getServerSession = cache(async (cookieHeader: string) => {
  const token = extractSessionToken(cookieHeader);
  if (!token) return null;

  const res = await fetchFromAPI('/api/auth/get-session', {
    method: 'GET',
    headers: { cookie: cookieHeader },
    credentials: 'include',
  });
  return res.json();
});