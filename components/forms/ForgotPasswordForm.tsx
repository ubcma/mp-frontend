'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Spinner from '../common/Spinner';
import { RenderInputField } from './FormComponents';
import { sendForgotPasswordEmail } from '@/lib/better-auth/forgot-password';
import { handleClientError } from '@/lib/error/handleClient';
import Image from 'next/image';
import AuthCardHeader from '../auth/AuthCardHeader';

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await sendForgotPasswordEmail(value.email);
        setUserEmail(value.email);
        setEmailSent(true);
        toast.success('Password reset email sent! Check your inbox.');
      } catch (error) {
        handleClientError('Forgot Password Error', error);
      }
    },
  });

  // Show success screen after email is sent
  if (emailSent) {
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
              We've sent a password reset link to <strong>{userEmail}</strong>
            </p>
          </div>

          {/* <div className="space-y-3 w-full">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                // Resend forgot password email
                form.handleSubmit();
              }}
            >
              Resend reset email
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              Try different email
            </Button>
          </div> */}

          <div className="flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Back to sign in
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            Can't find the email? Check your spam folder
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
            heading="Forgot Password"
            subheading="Enter your email address and we'll send you a link to reset your password."
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
            transition={{ delay: 0.3 }}
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
                      <div>Sending Reset Link</div>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <div>Send Reset Link</div>
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
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <Link href="/sign-in" className="text-ma-red hover:underline">
            Back to sign in
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}