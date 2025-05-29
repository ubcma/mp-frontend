type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export async function fetchFromAPI(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {

  const { method = 'GET', body, credentials, headers: customHeaders = {} } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
    method,
    headers,
    credentials: credentials || 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = 'Failed to fetch data from' + endpoint;

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      console.warn('Failed to parse error response as JSON');
    }

    throw new Error(errorMessage);
  }

  return res;
}
