import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getCurrentUserRole } from '@/lib/getCurrentUserRole';
import { UserProfileData } from '@/lib/types';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const userRole = await getCurrentUserRole()

  if (userRole !== 'Admin') {
    redirect('/home')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full m-8">{children}</main>
    </SidebarProvider>
  );
}
