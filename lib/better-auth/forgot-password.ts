// lib/better-auth/forgot-password.ts
import { authClient } from '../auth-client';
import { handleServerError } from '../error/handleServer';

export const sendForgotPasswordEmail = async (email: string) => {
  const { data, error } = await authClient.forgetPassword({
    email,
    redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password`,
  });

  if (error) {
    handleServerError('Error sending forgot password email, please contact our team for support');
    throw new Error(error.message);
  }
  
  return data;
};

export const resetPassword = async (token: string, password: string) => {
  const { data, error } = await authClient.resetPassword({
    newPassword: password,
    token,
  });

  if (error) {
    handleServerError('Error resetting password, please contact our team for support');
    throw new Error(error.message);
  }
  
  return data;
};