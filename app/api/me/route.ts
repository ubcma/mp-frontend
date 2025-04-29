import { genericGetRequest, genericPostRequest } from '@/lib/httpHandlers';
import { UpdateMeInput } from '@/lib/types';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();

  const sessionCookie = (await cookieStore).get(
    'membership-portal.session_token'
  )?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { error: 'No session cookie found' },
      { status: 401 }
    );
  }

  const user = await genericGetRequest(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`,
    `membership-portal.session_token=${sessionCookie}`
  );

  if (!user) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 401 });
  }

  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {

  try {
    const data = await req.json();

    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get('membership-portal.session_token')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found' }, { status: 401 });
    }

    const cookieHeader = `membership-portal.session_token=${sessionCookie}`;

    const response = await genericPostRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, data, cookieHeader);

    if (!response) {
      return NextResponse.json({ error: 'Failed to update' }, { status: 401 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in update POST:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

}