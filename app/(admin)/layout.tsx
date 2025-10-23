import { AppSidebar } from '@/components/AppSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import MobileNav from '@/components/layouts/MobileNav';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getUserRole } from '@/lib/queries/server/userRole';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRole();

  if (userRole !== 'Admin') {
    redirect('/home');
  }

  return (
    <SidebarProvider>
      <ProtectedLayout>
        <MobileNav/>
        <AppSidebar />
        <main className="flex-1 w-full overflow-x-hidden p-8 md:p-12">
          <Breadcrumbs />
          {children}
        </main>
      </ProtectedLayout>
    </SidebarProvider>
  );
}
