import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export const signInWithGoogle = async () => {
  const frontendBaseURL =
    process.env.NEXT_PUBLIC_FRONTEND_URL;

  const response = await authClient.signIn.social({
    provider: 'google',
    callbackURL: `${frontendBaseURL}/home`,
    errorCallbackURL: `${frontendBaseURL}/error`,
    newUserCallbackURL: `${frontendBaseURL}/home`,
  });

  if (response.error) {
    console.error('Error signing in with Google:', response.error);
    throw new Error(response.error.message);
  }

  return response;
};

export const signInWithEmail = async (email: string, password: string) => {
  const response = await authClient.signIn.email(
    {
      email,
      password,
      callbackURL: '/home',
      rememberMe: true,
    },
    {
      //callbacks
    }
  );
  if (response.error) {
    console.error('Error signing in with email:', response.error.message);
    toast.error(response.error.message);
    throw new Error(response.error.message);
  }
  return response;
};
