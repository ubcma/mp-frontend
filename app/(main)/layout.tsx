import { AlertBanner } from '@/components/AlertBanner';
import { AppSidebar } from '@/components/AppSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import MobileNav from '@/components/layouts/MobileNav';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getUserRole } from '@/lib/queries/userRole';
import { PanelLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userRole = await getUserRole();

  let showBanner = userRole === 'Basic';

  return (
    <SidebarProvider>
      <ProtectedLayout>
        <MobileNav/>
        <AppSidebar />
        <main className="w-full">
          <div className="m-6 lg:m-12 mt-24">
            {showBanner ? (
              <div className="mb-8">
                <AlertBanner color="blue">
                  <div>
                    Looks like you're not a member yet!{' '}
                    <a
                      href="/membership"
                      className="underline underline-offset-2 font-semibold hover:opacity-80 transition"
                    >
                      Purchase a membership
                    </a>{' '}
                    to gain access to all features! 🚀
                  </div>
                </AlertBanner>
              </div>
            ) : (
              <Breadcrumbs />
            )}

            {children}
          </div>
        </main>
      </ProtectedLayout>
    </SidebarProvider>
  );
}
