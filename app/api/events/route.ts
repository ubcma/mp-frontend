import { genericGetRequest } from '@/lib/httpHandlers';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const events = await genericGetRequest(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events`
  );

  if (!events) {
    return NextResponse.json(
      { error: 'Failed to retrieve events' },
      { status: 401 }
    );
  }

  return NextResponse.json(events);
}
