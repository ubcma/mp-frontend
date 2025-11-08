import { handleServerError } from '@/lib/error/handleServer';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { UserProfileData } from '@/lib/types';
import { cookies } from 'next/headers';

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
    handleServerError('Error fetching user role');
    throw error;
  }
}
