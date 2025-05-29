import { fetchFromAPI } from './httpHandlers';

export async function getServerSession() {
  const res = await fetchFromAPI('/api/auth/get-session', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', cookie: "" },
    credentials: 'include',
  });

  const session = await res.json();
  return session?.user ? session : null;
}
