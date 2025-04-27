'use client';

import { signInWithGoogle } from '@/lib/better-auth/sign-in';
import { Button } from './ui/button';
import { useState } from 'react';
import Spinner from './Spinner';

export const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      // setTimeout(() => {
      //   setIsLoading(false);
      // }, 1000)
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGoogleSignIn} disabled={isLoading} className='bg-background text-foreground border-neutral-150 border hover:bg-neutral-50'>
      {isLoading ? (
        <>
          <Spinner color="blue-500"/> 
          <span>Redirecting to login...</span>{' '}
        </>
      ) : (
        <>
          <img src="/logos/google.svg" height={16} width={16} ></img>
          <span>Continue with Google</span>{' '}
        </>
      )}
    </Button>
  );
};
