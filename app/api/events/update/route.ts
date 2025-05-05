import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  const body = await req.json()

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

  const res = await fetch(`${process.env.BACKEND_URL}/api/events/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `membership-portal.session_token=${sessionCookie}`,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status })
  }

  return NextResponse.json(data)
}
