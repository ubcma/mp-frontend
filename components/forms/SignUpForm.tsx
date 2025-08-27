'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { CreditCardIcon } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Spinner from '../common/Spinner';
import {
  FieldInfo,
  RenderCheckboxField,
  RenderInputField,
} from './FormComponents';
import { signUpWithEmail } from '@/lib/better-auth/sign-up';
import { handleClientError } from '@/lib/error/handleClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthCardHeader from '../auth/AuthCardHeader';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export default function SignUpForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      agreeToTerms: false,
    },
    onSubmit: async ({ value }) => {
      try {
        const fullName = `${value.firstName} ${value.lastName}`;
        const data = await signUpWithEmail(
          fullName,
          value.email,
          value.password
        );

        if (data?.user) {
          toast.success(
            'Sign up successful! Please check your email for verification.'
          );
          router.push('/sign-in');
        }
      } catch (error) {
        handleClientError('Sign Up Error', error);
      }
    },
  });

  return (
    <div className="flex flex-col gap-6 h-fit justify-center md:w-[24rem] w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6 place-items-center text-center"
      >
        <Image
          src="/logos/logo_red.svg"
          width={128}
          height={128}
          alt="UBC MA Logo"
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AuthCardHeader
            heading="Sign Up"
            subheading="Enter your details to register for an account."
          />
        </motion.div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4 w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Password is required.' : undefined,
              }}
              children={(field) => (
                <RenderInputField
                  type="password"
                  label="Password"
                  field={field}
                />
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <form.Field
              name="agreeToTerms"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'You must agree to the privacy policy' : undefined,
              }}
              children={(field) => {
                const id = field.name; // unique id for checkbox + label

                return (
                  <div className="flex flex-col gap-2 text-left mb-4">
                    <div className="flex flex-row gap-2">
                      <Checkbox
                      className='data-[state=checked]:bg-blue-500 data-[state=checked]:border-none'
                        id={id}
                        checked={field.state.value}
                        onCheckedChange={() =>
                          field.setValue(!field.state.value)
                        }
                      />
                      <Label
                        className="inline text-xs text-muted-foreground font-normal select-none"
                      >
                        By signing up, you are agreeing to our <Link href="/terms-of-service" className='text-blue-500 hover:underline'>terms of service</Link> 
                        {" and "} <Link href="/privacy-policy" className='text-blue-500 hover:underline'>privacy policy.</Link>
                      </Label>
                    </div>
                  </div>
                );
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  className="cursor-pointer font-regular bg-ma-red w-full"
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
                      <div>Create Account</div>
                    </>
                  )}
                </Button>
              )}
            />
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1 className="font-normal text-sm">
            Have an account?{' '}
            <Link href="/sign-in" className="text-ma-red font-semibold">
              Sign In
            </Link>
          </h1>
        </motion.div>
      </motion.div>
    </div>
  );
}
