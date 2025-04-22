import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SignUpForm from '@/components/forms/SignUpForm';

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    redirect('/dashboard');
  }

  return <SignUpForm />;
}
