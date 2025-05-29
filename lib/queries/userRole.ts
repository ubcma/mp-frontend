import { cookies } from 'next/headers';
import { fetchFromAPI } from '../httpHandlers';
import { UserProfileData } from '../types';
import { handleError } from '../error/handle';

export async function getUserRole() {
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
      throw new Error('Failed to fetch user role');
    }

    const data = (await res.json()) as UserProfileData;

    return data.role;
  } catch (error) {
    handleError('Error fetching user role:', error);
    throw error;
  }
}
