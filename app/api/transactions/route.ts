import { cookies } from 'next/headers';
import { genericGetRequest } from '@/lib/httpHandlers';
import { NextResponse } from 'next/server';


export async function GET() {
  const cookieStore = cookies();

  const sessionCookie = (await cookieStore).get(
    'membership-portal.session_token' // get current session token from portal from user cookie store
   )?.value;

  if (!sessionCookie) {
    return NextResponse.json({ error: 'No session cookie found' }, { status: 401 });
  }

  try {
    const cookieHeader = `membership-portal.session_token=${sessionCookie}`;

    const transactions = await genericGetRequest(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/transactions`,
      cookieHeader
    );

    if (!transactions) {
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
