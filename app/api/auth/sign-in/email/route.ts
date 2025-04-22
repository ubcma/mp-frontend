// app/api/login/route.ts
import { genericPostRequest } from '@/lib/httpHandlers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  return genericPostRequest(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/sign-in/email`, body);
}