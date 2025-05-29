// app/(protected)/layout.tsx
import { getServerSession } from '@/lib/auth-server';
import { cookies } from 'next/headers';

import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieHeader = (await cookies()).toString();

  const res = await getServerSession(cookieHeader);

  if (!res) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
