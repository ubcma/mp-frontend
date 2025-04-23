import { genericPostRequest } from '@/lib/httpHandlers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    console.log("HERE")
    const body = await req.json();
    const result = await genericPostRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-in/email`, body);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}