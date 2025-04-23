'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import type { AnyFieldApi } from '@tanstack/react-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSignInMutation } from '@/lib/mutations/auth';
import Spinner from '../Spinner';
import { toast } from 'sonner';
import { RenderInputField } from './FormComponents';

export default function SignInForm() {
  const loginMutation = useSignInMutation();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await new Promise<void>((resolve, reject) => {
          loginMutation.mutate(
            { email: value.email, password: value.password },
            {
              onSuccess: () => {
                resolve();
              },
              onError: (error) => {
                toast.error(error.message,
                  {
                    style: {
                      background: '#FFE6E8',
                      color: '#EF3050',
                      border: '1px solid #EF3050',
                    },
                  }
                );
                reject(error);
              },
            }
          );
        });
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  });

  return (
    <div className="flex flex-col gap-8 h-full justify-center">
      <div>
        <h1 className="font-semibold text-xl">Sign In</h1>
        <h1 className="font-normal text-sm">
          Enter your email and password to access your account.
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Email is required.'
                : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                  ? 'Invalid email address.'
                  : undefined,
          }}
          children={(field) => (
            <RenderInputField type="email" label="Email" field={field} />
          )}
        />

        <form.Field
          name="password"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Password is required.' : undefined,
          }}
          children={(field) => (
            <RenderInputField type="password" label="Password" field={field} />
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              className="cursor-pointer font-regular bg-ma-red"
              variant="ma"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <div>Loading</div>
                </>
              ) : (
                <>
                  <LogIn />
                  <div>Sign In</div>
                </>
              )}
            </Button>
          )}
        />
      </form>
      <h1 className="font-normal text-sm">
        New here?{' '}
        <Link href="/sign-up" className="text-ma-red font-semibold">
          Sign Up
        </Link>
      </h1>
    </div>
  );
}
