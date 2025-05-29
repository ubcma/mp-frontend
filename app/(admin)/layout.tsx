import { AppSidebar } from '@/components/AppSidebar';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getUserRole } from '@/lib/queries/userRole';
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
        <AppSidebar />
        <main className="w-full m-8">{children}</main>
      </ProtectedLayout>
    </SidebarProvider>
  );
}
