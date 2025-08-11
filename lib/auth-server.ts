import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { fetchFromAPI } from './httpHandlers';

export const getServerSession = cache(async (cookieHeader: string) => {
  return unstable_cache(
    async () => {
      const res = await fetchFromAPI('/api/auth/get-session', {
        method: 'GET',
        headers: { cookie: cookieHeader },
        credentials: 'include',
      });
      return res.json();
    },
    ['session', cookieHeader],
    { revalidate: 60 } 
  )();
});