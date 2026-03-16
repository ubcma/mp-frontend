import { AppSidebar } from '@/components/AppSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import MobileNav from '@/components/layouts/MobileNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getServerSession } from '@/lib/auth-server';
import { getUserRole } from '@/lib/queries/server/userRole';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  const [session, userRole] = await Promise.all([
    getServerSession(cookieHeader).catch(() => null),
    getUserRole().catch(() => null),
  ]);

  if (!session) {
    redirect('/sign-in');
  }

  if (userRole !== 'Admin') {
    redirect('/home');
  }

  return (
    <SidebarProvider>
      <MobileNav/>
      <AppSidebar />
      <main className="flex-1 w-full overflow-x-hidden p-8 md:p-12">
        <Breadcrumbs />
        {children}
      </main>
    </SidebarProvider>
  );
}
