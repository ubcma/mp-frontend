import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest) {
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

  const res = await fetch(`${process.env.BACKEND_URL}/api/events/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `membership-portal.session_token=${sessionCookie}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    return NextResponse.json(res, { status: res.status })
  }

  return NextResponse.json(res)
}
