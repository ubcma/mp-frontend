import { handleServerError } from './error/handleServer';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const DEFAULT_TIMEOUT_MS = 8000;

interface FetchOptions {
  method?: HttpMethod;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  timeoutMs?: number;
}

export async function fetchFromAPI(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    method = 'GET',
    body,
    credentials,
    headers: customHeaders = {},
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...customHeaders,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
      method,
      headers,
      credentials: credentials || 'include',
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error: unknown) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request to ${endpoint} timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
  clearTimeout(timeout);

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = 'Failed to fetch data from ' + endpoint;

    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      console.warn('Failed to parse error response as JSON');
    }

    if (res.status === 429) {
      throw new Error(
        'Too many attempts. Please wait 10 minutes before trying again.'
      );
    }

    handleServerError('An error occured, please contact our team for support');
    throw new Error(errorMessage);
  }

  return res;
}
