import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { handleServerError } from '../error/handleServer';

export const signInWithGoogle = async () => {
  const frontendBaseURL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const response = await authClient.signIn.social({
    provider: 'google',
    callbackURL: `${frontendBaseURL}/home`,
    errorCallbackURL: `${frontendBaseURL}/error`,
    newUserCallbackURL: `${frontendBaseURL}/home`, // TODO: change to onboarding
  });

  if (response.error) {
    handleServerError('Error signing in with Google:', response.error);
  }

  const redirectUrl = response.data?.url;
  if (redirectUrl) {
    window.location.href = redirectUrl;
  } else {
    throw new Error("Google OAuth redirect URL not found in response.");
  }

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
      onSuccess(ctx) {
        console.log('Sign in successful:', ctx);
        toast.success('Sign in successful!');
      },
    }
  );
  if (response.error) {
    handleServerError('Error', response.error.message);
  }
  return response;
};
