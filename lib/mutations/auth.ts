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

export function useLogoutMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const signoutRes = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (!signoutRes.ok) {
        const errorData = await signoutRes.json();
        throw new Error(errorData.error || 'Signout failed');
      }

      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      return true;
    },
    onSuccess: () => {
      console.log('Logged out successfully!');

      queryClient.clear();

      router.push('/sign-in');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
}

export function useSignInMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

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

      const result = await res.json();

      await fetch('/api/auth/set-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.token }),
      });

      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

export function useSignUpMutation() {

  const queryClient = useQueryClient();
  const router = useRouter();

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
       router.push('/dashboard');
    },
    onError: (error) => {
      toast('Signup error:' + error);
    },
  });
}
