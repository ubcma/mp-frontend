'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, CheckCircle, Mail } from 'lucide-react';
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
import { authClient } from '../../lib/auth-client'; // Import your auth client

export default function SignUpForm() {
  const router = useRouter();
  const [isWaitingForVerification, setIsWaitingForVerification] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  
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
          setUserEmail(value.email);
          setIsWaitingForVerification(true);
          toast.success('Account created! Please check your email for verification.');
        }
      } catch (error) {
        handleClientError('Sign Up Error', error);
      }
    },
  });

  // Poll for email verification status
  React.useEffect(() => {
    if (!isWaitingForVerification) return;

    const checkVerificationStatus = async () => {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user?.emailVerified) {
          toast.success('Email verified! Redirecting to onboarding...');
          router.push('/onboarding');
        }
      } catch (error) {
        console.error('Error checking verification status:', error);
      }
    };

    // Check immediately, then every 3 seconds
    checkVerificationStatus();
    const interval = setInterval(checkVerificationStatus, 3000);

    // Clean up interval after 10 minutes (optional timeout)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      toast.error('Verification timeout. Please try signing in.');
    }, 600000); // 10 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isWaitingForVerification, router]);

  // Show verification waiting screen
  if (isWaitingForVerification) {
    return (
      <div className="flex flex-col gap-6 h-fit justify-center md:w-[24rem] w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6 place-items-center text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-ma-red" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Check your email</h2>
            <p className="text-gray-600">
              We've sent a verification link to <strong>{userEmail}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Spinner size={50} />
            <span>Waiting for verification...</span>
          </div>

          {/* <div className="space-y-3 w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Resend verification email logic here
                toast.info('Verification email resent!');
              }}
            >
              Resend verification email
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setIsWaitingForVerification(false)}
            >
              Back to form
            </Button>
          </div> */}

          <p className="text-xs text-gray-500">
            Can't find the email? Check your spam folder or{' '}
            <button 
              className="text-ma-red hover:underline"
              onClick={() => setIsWaitingForVerification(false)}
            >
              try a different email
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  // Original form
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
                const id = field.name;

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