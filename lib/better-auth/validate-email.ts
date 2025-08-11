'use server'

import { fetchFromAPI } from '../httpHandlers';
import { ValidateEmailResponse } from '../types/validate-email';

export async function validateEmail(email: string) {
  const response = await fetchFromAPI('/api/validate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to validate email');
  }

  const data = (await response.json()) as ValidateEmailResponse;

  if (!data.hasAccount) {
    throw new Error('No account found for this email');
  }

  return data;
}
