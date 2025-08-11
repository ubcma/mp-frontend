import { cookies } from 'next/headers';
import { fetchFromAPI } from '../../httpHandlers';
import { handleServerError } from '../../error/handleServer';

export async function createPaymentIntent(body: Record<string, any>) {
  try {

    console.log('here')

    const cookieHeader = await cookies();
    
    const res = await fetchFromAPI('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader.toString(),
      },
      body: body,
    });

    if (!res.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await res.json();

    return clientSecret;
  } catch (error) {
    handleServerError('Stripe Error', error);
    throw error;
  }
}

export async function getPaymentIntent(intentId: string) {
  try {
    const cookieHeader = await cookies();
    
    const res = await fetchFromAPI(`/api/stripe/payment-intent/${intentId}`, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader.toString(),
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch payment intent');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    handleServerError('Stripe Error', error);
    throw error;
  }
}