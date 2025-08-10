'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import Spinner from '../common/Spinner';
import { RenderInputField } from './FormComponents';
import { signUpWithEmail } from '@/lib/better-auth/sign-up';
import { handleClientError } from '@/lib/error/handleClient';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {

  const router = useRouter();
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const fullName = `${value.firstName} ${value.lastName}`;
        const data = await signUpWithEmail(fullName, value.email, value.password);

        if (data?.user) {
          toast.success('Sign up successful! Please check your email for verification.');
          router.push('/sign-in');
        }
        
      } catch (error) {
        handleClientError('Sign Up Error', error);
      }
    },
  });

  return (
    <div className="flex flex-col gap-8 h-full justify-center mx-8">
      <div>
        <h1 className="font-semibold text-xl">Sign Up</h1>
        <h1 className="font-normal text-sm text-muted-foreground">
          Enter your details to register for an account.
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
        <div className="grid grid-cols-2 gap-4">
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) =>
                !value ? 'First name is required.' : undefined,
            }}
            children={(field) => {
              return <RenderInputField label="First Name" field={field} />;
            }}
          />
          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }) =>
                !value ? 'Last name is required.' : undefined,
            }}
            children={(field) => (
              <RenderInputField label="Last Name" field={field} />
            )}
          />
        </div>

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
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <div>Loading</div>
                </>
              ) : (
                <>
                  <CreditCardIcon />
                  <div>
                    {' '} Create Account {' '}
                  </div>
                </>
              )}
            </Button>
          )}
        />
      </form>
      <h1 className="font-normal text-sm">
        Have an account?{' '}
        <Link href="/sign-in" className="text-ma-red font-semibold">
          Sign In
        </Link>
      </h1>
    </div>
  );
}
