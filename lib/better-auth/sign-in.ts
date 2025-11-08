import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { handleServerError } from '../error/handleServer';

export const signInWithGoogle = async () => {
  const frontendBaseURL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const response = await authClient.signIn.social(
    {
      provider: 'google',
      callbackURL: `${frontendBaseURL}/home`,
      errorCallbackURL: `${frontendBaseURL}/error`,
      newUserCallbackURL: `${frontendBaseURL}/home`,
    }
  );

  if (response.error) {
    handleServerError('Error signing in with Google, please contact our team for support');
    throw new Error(response.error.message);
  }

  const redirectUrl = response.data?.url;
  if (redirectUrl) {
    window.location.href = redirectUrl;
  } else {
    throw new Error("Google OAuth redirect URL not found in response.");
  }

};

export const signInWithEmail = async (email: string, password: string) => {
    const frontendBaseURL = process.env.NEXT_PUBLIC_FRONTEND_URL;

  const response = await authClient.signIn.email(
    {
      email,
      password,
      callbackURL: frontendBaseURL + '/home',
      rememberMe: true,
    },
    {
      onSuccess(ctx) {
        toast.success('Sign in successful!');
      },
    }
  );

  if (response.error) {
    if (response.error.message == "Email not verified") {
      toast.error("Please verify your email before signing in.");
    }
    else {
      throw new Error(response.error.message);
    }
  }
  return response;
};
