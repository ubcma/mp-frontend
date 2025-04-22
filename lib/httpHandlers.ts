import { NextResponse } from 'next/server';

async function genericGetRequest<T>(url: string, token?: string): Promise<T> {
  try {

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      credentials: 'include',
    });

    const contentType = res.headers.get('Content-Type') || '';

    if (!res.ok) {
      if (contentType.includes('application/json')) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch');
      } else {
        const text = await res.text();
        throw new Error(text || 'Failed to fetch');
      }
    }

    if (!contentType.includes('application/json')) {
      throw new Error('Unexpected response format');
    }

    return res.json();
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
}

async function genericPostRequest(url: string, body: any) {
  try {
    console.log('Sending POST request to:', url);
    console.log('Request body:', body);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Response data:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('POST request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function genericPutRequest(url: string, body: any) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('PUT request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function genericDeleteRequest(url: string) {
  try {
    const response = await fetch(url, { method: 'DELETE' });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('DELETE request error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export { genericGetRequest, genericPostRequest, genericPutRequest, genericDeleteRequest };
