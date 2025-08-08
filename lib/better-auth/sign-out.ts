import { toast } from 'sonner';
import { authClient } from '../auth-client';

export const signOut = async () => {

  const response = await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        toast.success('Signed out successfully!');
        sessionStorage.removeItem('onboarding_skipped');
      },
    },
  });

  if (response.error) {
    console.error('Error signing out', response.error);
    throw new Error(response.error.message);
  }

  return response;
};
