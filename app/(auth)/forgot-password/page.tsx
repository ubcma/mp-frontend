import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ForgotPasswordPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Forgot Password Placeholder</h1>
    </div>
  )
}
