// lib/mutations/auth.ts
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type SignInPayload = {
  email: string;
  password: string;
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: async (data: SignInPayload) => {
      const res = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Login failed');
      }

      return await res.json();
    },
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: async (data: SignUpPayload) => {
      const res = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      return await res.json();
    },
    onSuccess: (data) => {
      toast('Signup successful!', data);
    },
    onError: (error) => {
      toast('Signup error:' + error );
    },
  });
}
