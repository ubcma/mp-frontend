import { signInWithGoogle } from '@/lib/better-auth/sign-in';
import { Button } from './ui/button';

export const GoogleSignInButton = () => {

  return <Button onClick={signInWithGoogle}>Sign In with Google</Button>;
};
