// app/api/set-session/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ message: 'Missing token' }, { status: 400 });
    }

    (await cookies()).set('sessionToken', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ message: 'Session set' });
  } catch (err) {
    console.error('Error setting session:', err);
    return NextResponse.json({ message: 'Failed to set session' }, { status: 500 });
  }
}
