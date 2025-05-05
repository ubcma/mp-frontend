import { NextResponse } from 'next/server';

async function genericGetRequest<T>(url: string, cookie?: string): Promise<T> {

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (cookie) {
    headers['Cookie'] = cookie;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Failed to fetch';

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        console.warn('Failed to parse error response as JSON');
      }

      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
}

async function genericPostRequest<T>(
  url: string,
  body: any,
  cookie?: string,
): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    console.log("Sending request with body: " + body)

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Request failed';

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        console.warn('Failed to parse error response as JSON');
      }

      const error = new Error(errorMessage) as any;
      throw error;
    }

    return res.json();
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
}

async function genericPutRequest<T>(
  url: string,
  body: any,
  cookie?: string,
): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    console.log('Sending PUT request with body:', body);

    const res = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Request failed';

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        console.warn('Failed to parse error response as JSON');
      }

      const error = new Error(errorMessage) as any;
      throw error;
    }

    return res.json();
  } catch (error) {
    console.error('PUT request error:', error);
    throw error;
  }
}

export async function genericRequest<T>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  body?: any,
  cookie?: string,
): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    console.log(`${method} request to ${url}`, body);

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = 'Request failed';

      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.message || errorMessage;
      } catch {
        console.warn('Failed to parse error response as JSON');
      }

      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    console.error(`${method} request error:`, error);
    throw error;
  }
}



export {
  genericGetRequest,
  genericPostRequest,
  genericPutRequest,
};
