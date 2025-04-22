// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  cookieStore.set('token', '', {
    path: '/',
    maxAge: 0,
  });

  return NextResponse.json({ success: true });
}