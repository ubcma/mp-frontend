// lib/mutations/auth.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

export function useSignInMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignInPayload) => {

      const res = await fetch(
        `/api/auth/sign-in/email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        const error = new Error(errorData.message || 'Login failed') as any;
        error.code = errorData.code;
        throw error;
      }

      const result = await res.json();

      const cookieRes = await fetch('/api/auth/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.token }),
      });

      if (!cookieRes.ok) {
        const text = await cookieRes.text();
        throw new Error(`Failed to set session: ${text}`);
      }

      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/home');
    },
  });
}

export function useSignUpMutation() {

  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: SignUpPayload) => {
      const res = await fetch(
        `/api/auth/sign-up/email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Sign-up failed');
      }

      const result = await res.json();

      await fetch('/api/auth/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.token }),
      });

      return result;
    },
    onSuccess: async (data) => {
       await queryClient.invalidateQueries({ queryKey: ['user'] });
       router.push('/home');
    },
    onError: (error) => {
      toast('Signup error:' + error);
    },
  });
}

export function useSignoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const signoutRes = await fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/sign-in');
      toast('Logged out successfully!');
    },
    onError: (error) => {
      console.error('Signout failed:', error);
      toast.error('Logout failed!');
    },
  });
}