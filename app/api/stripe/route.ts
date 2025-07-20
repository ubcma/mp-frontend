// proxy to the backend for establishing purchases
// POST method signifies the creation of the Stripe PaymentIntent 
// GET method fetches the stripe PaymentIntent (with client secret 

// we use as a proxy to establish a new payment intent, initiating process to render the checkout form 
import { genericPostRequest } from '@/lib/httpHandlers';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  /*
  post request to create a paymentIntent in the backend, receives client secret as server response 
  */
  const body = await req.json();
  const cookieStore = cookies(); // get user cookie store from request to Next.js server
  const sessionCookie = (await cookieStore).get(
      'membership-portal.session_token' // get current session token from portal from user cookie store
    )?.value;

  if (!sessionCookie) return NextResponse.json({ error: 'No session' }, { status: 401 });

  const cookieHeader = `membership-portal.session_token=${sessionCookie}`;
  /*
  const response = await genericPostRequest(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-payment-intent`,
    body,
    cookieHeader
  );
  */
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `membership-portal.session_token=${sessionCookie}`,
    },
    body: JSON.stringify(body),
  });

  if (!response) return NextResponse.json({ error: 'PaymentIntent failed' }, { status: 500 });

  const data = await response.json() 
  return NextResponse.json(data);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  /*
  fetch an existing paymentIntent object (once created in Backend)
  */
  const body = await req.json();
  const cookieStore = cookies();
  const intentId = params.id;
  const sessionCookie = (await cookieStore).get('membership-portal.session_token')?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/payment-intent/${intentId}`,
    {
      method: 'GET',
      headers: {
        Cookie: `membership-portal.session_token=${sessionCookie}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return NextResponse.json({ error: errorData.error }, { status: res.status });
  }

  const data = await res.json(); // expects backend returns { metadata: {...} }
  return NextResponse.json(data);
}

