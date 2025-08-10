import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const submittedCode = body.code;
  const validCode = process.env.ACCESS_CODE;

  if (submittedCode === validCode) {
    const res = NextResponse.json({ success: true });

    res.cookies.set('access_code', submittedCode, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}