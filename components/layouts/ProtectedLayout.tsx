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

  let session;
  try {
    session = await getServerSession(cookieHeader);
  } catch {
    session = null;
  }

  if (!session) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
