import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = (await cookies()).get('sessionToken')?.value;

    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-out`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    }

    (await cookies()).set('sessionToken', '', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Signout failed:', error);
    return NextResponse.json({ message: 'Failed to sign out.' }, { status: 500 });
  }
}