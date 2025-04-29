import { NextRequest, NextResponse } from 'next/server';
import { genericPostRequest } from '@/lib/httpHandlers'; // helper to forward
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    console.log("HERE")

    const body = await req.json();

    const cookieStore = cookies();

    const sessionCookie = (await cookieStore).get(
      'membership-portal.session_token'
    )?.value;

    const cookieHeader = `membership-portal.session_token=${sessionCookie}`;

    const response = await genericPostRequest(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/create`,
      body,
      cookieHeader
    );

    if (!response) {
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
