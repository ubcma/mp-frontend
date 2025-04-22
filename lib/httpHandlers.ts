import { NextResponse } from 'next/server';

async function genericGetRequest<T>(url: string, token?: string): Promise<T> {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      credentials: 'include',
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Failed to fetch');
      } catch {
        throw new Error(errorText || 'Failed to fetch');
      }
    }

    return res.json();
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
}

async function genericPostRequest<T>(url: string, body: any, token?: string): Promise<T> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const { message = 'Request failed', code } = await res.json().catch(() => ({}));
      const error = new Error(message) as any;
      if (code) error.code = code;
      throw error;
    }

    return res.json();
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
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