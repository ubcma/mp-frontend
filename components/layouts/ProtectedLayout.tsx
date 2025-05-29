// app/(protected)/layout.tsx
import { getServerSession } from '@/lib/auth-server';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  const res = await getServerSession(cookieHeader);

  console.log('ProtectedLayout session:', res);

  if (!res) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
