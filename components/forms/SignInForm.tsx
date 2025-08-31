'use client';

import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../common/Spinner';
import { RenderInputField } from './FormComponents';
import { GoogleSignInButton } from '../GoogleSignInButton';
import { signInWithEmail } from '@/lib/better-auth/sign-in';
import { handleClientError } from '@/lib/error/handleClient';
import Image from 'next/image';
import { validateEmail } from '@/lib/better-auth/validate-email';
import AuthCardHeader from '../auth/AuthCardHeader';

export default function SignInForm() {
  const [step, setStep] = useState<'email' | 'password' | 'google'>('email');
  const [email, setEmail] = useState('');

  const emailForm = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const data = await validateEmail(value.email);
        setEmail(value.email);

        if (!data.hasAccount) {
          throw new Error('No account found for this email');
        } else if (data.provider === 'google') {
          setStep('google');
        } else {
          setStep('password');
        }

      } catch (error) {
        console.error('Submit error:', error);
        handleClientError('Error', error);
      }
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await signInWithEmail(email, value.password);
      } catch (error) {
        console.error('Submit error:', error);
        handleClientError('Error', error);
      }
    },
  });

  const handleGoBack = () => {
    setStep('email');
    passwordForm.reset();
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const fadeVariants = {
    enter: {
      opacity: 0,
    },
    center: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
  };

  const transition = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
    duration: 0.3,
  };

  const fadeTransition = {
    duration: 0.3,
  };

  return (
    <div className="flex flex-col gap-6 h-fit justify-center md:w-[24rem] w-full">
      <AnimatePresence mode="wait" custom={step === 'password' || step === 'google' ? 1 : -1}>
        {step === 'email' ? (
          <motion.div
            key="email"
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={fadeTransition}
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
              <AuthCardHeader heading="Welcome to the MA Portal" subheading="Enter your email to sign in" />
            </motion.div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                emailForm.handleSubmit();
              }}
              className="flex flex-col gap-4 w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <emailForm.Field
                  name="email"
                  validators={{
                    onBlur: ({ value }) =>
                      !value
                        ? 'Email is required.'
                        : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                              value
                            )
                          ? 'Invalid email address.'
                          : undefined,
                  }}
                  children={(field) => (
                    <RenderInputField
                      type="email"
                      label="Email"
                      field={field}
                    />
                  )}
                />
                <emailForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button
                      className="cursor-pointer font-regular bg-ma-red w-full"
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
                        <div>Continue</div>
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
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex items-center justify-between">
                <hr className="w-full border-foreground/20" />
                <span className="mx-2 text-muted-foreground font-regular text-xs">OR</span>
                <hr className="w-full border-foreground/20" />
              </div>
              <GoogleSignInButton />
              <h1 className="font-normal text-sm">
                New here?{' '}
                <Link href="/sign-up" className="text-ma-red font-semibold">
                  Sign Up
                </Link>
              </h1>
            </motion.div>
          </motion.div>
        ) : step === 'password' ? (
          <motion.div
            key="password"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-semibold text-xl mb-2">Welcome back</h1>
              <h1 className="font-normal text-sm text-muted-foreground">
                Enter your password for{' '}
                <motion.span
                  className="font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {email}
                </motion.span>
              </h1>
            </motion.div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                passwordForm.handleSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <passwordForm.Field
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

              {/* Added Forgot Password Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-right"
              >
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-ma-red hover:underline"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-2"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>

                <passwordForm.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <Button
                      className="cursor-pointer font-regular bg-ma-red flex-1"
                      variant="ma"
                      type="submit"
                      disabled={isSubmitting || !canSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner />
                          <div>Signing In</div>
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
              </motion.div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="google"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="flex flex-col gap-6 place-items-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="font-semibold text-xl mb-2">
                Account Found
              </h1>
              <h1 className="font-normal text-sm text-muted-foreground">
                We found an associated Google account with this email.
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GoogleSignInButton />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-normal text-sm">
                Or
                <span onClick={() => setStep('password')} className="text-ma-red font-semibold cursor-pointer">
                  {' '}click here{' '}
                </span>
                to continue with email
              </h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}