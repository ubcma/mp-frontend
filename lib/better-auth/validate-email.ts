'use server'

import { fetchFromAPI } from '../httpHandlers';
import { ValidateEmailResponse } from '../types/validate-email';

export async function validateEmail(email: string) {
  const response = await fetchFromAPI('/api/validate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error('Failed to validate email');
  }

  if (!data.hasAccount) {
    throw new Error('No account found for this email');
  }

  return data as ValidateEmailResponse;
}
