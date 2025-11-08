import { authClient } from '../auth-client';
import { handleServerError } from '../error/handleServer';

export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string
) => {
  const { data, error } = await authClient.signUp.email(
    {
      email,
      password,
      name,
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/home`, // This needs to be either /home or /onboarding based on whether the user is new or not. If onboarding isn't complete does it automatically redirect or no?
    },
    {
      onRequest: (ctx) => {
        console.log('Request to sign up with email:', ctx);
      },
      onSuccess: (ctx) => {
        console.log('Signed up with email:', ctx);
      },
      onError: (ctx) => {
        console.error('Error signing up with email:', ctx);
      },
    }
  );

  if (error) {
    handleServerError('Error signing up with email, please contact our team for support.');
    throw new Error(error.message);
  }
  
  return data;
};
