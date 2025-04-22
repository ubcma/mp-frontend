import { genericGetRequest } from '@/lib/httpHandlers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function getUserFromSessionToken(token: string | undefined) {
  if (!token) return null;
  const userData = await genericGetRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, token)
  return userData;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  console.log('Token:', token);

  const user = await getUserFromSessionToken(token);
  console.log('User:', user);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(user);
}
