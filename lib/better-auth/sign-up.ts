import { authClient } from '../auth-client';

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
      callbackURL: '/home',
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
    console.error('Error signing up with email:', error);
    throw new Error(error.message);
  }
  
  return data;
};
