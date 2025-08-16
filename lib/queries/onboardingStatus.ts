import { cookies } from 'next/headers';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';
import { handleServerError } from '../error/handleServer';

export async function getOnboardingStatus() {
  try {

    const cookieHeader = await cookies();
    
    const res = await fetchFromAPI('/api/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader.toString(),
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch onboarding status');
    }

    const data = (await res.json()) as UserProfileData;

    return data.onboardingComplete;
  } catch (error) {
    handleServerError('Error fetching user role:', error);
    throw error;
  }
}
