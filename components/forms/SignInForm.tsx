'use client';

import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import Spinner from '../Spinner';
import { toast } from 'sonner';
import { RenderInputField } from './FormComponents';
import { GoogleSignInButton } from '../GoogleSignInButton';
import { signInWithEmail } from '@/lib/better-auth/sign-in';

export default function SignInForm() {

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await new Promise<void>(() => {
          signInWithEmail(value.email, value.password);
        });
      } catch (error) {
        toast.error(String(error));
      }
    },
  });

  return (
    <div className="flex flex-col gap-6 h-full justify-center mx-8">
      <div>
        <h1 className="font-semibold text-xl">Sign In</h1>
        <h1 className="font-normal text-sm text-muted-foreground">
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
              disabled={isSubmitting || !canSubmit}
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
      <div className="flex items-center justify-between">
        <hr className="w-full border-neutral-300" />
        <span className="mx-2 text-neutral-400 font-light">OR</span>
        <hr className="w-full border-neutral-300" />
      </div>
      <GoogleSignInButton />
      <h1 className="font-normal text-sm">
        New here?{' '}
        <Link href="/sign-up" className="text-ma-red font-semibold">
          Sign Up
        </Link>
      </h1>
    </div>
  );
}
