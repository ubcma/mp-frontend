// app/api/events/[slug]/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

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

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/${slug}`,
      {
        method: 'GET',
        headers: {
          Cookie: `membership-portal.session_token=${sessionCookie}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error || 'Failed to fetch event details' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching event details:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
