// app/api/set-session/route.ts
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  (await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
  });

  return NextResponse.json({ success: true });
}
