import { AlertBanner } from '@/components/AlertBanner';
import { AppSidebar } from '@/components/AppSidebar';
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
        <AppSidebar />
        <main className="w-full space-y-8 mx-8 mb-8 mt-4 md:m-8">
          <div className="md:hidden w-full flex flex-row justify-between items-center mb-8">
            <SidebarTrigger />
            <Link href="/" prefetch={true}>
              <Image
                src="/logos/logo_red.svg"
                alt="Logo"
                width={48}
                height={48}
              />
            </Link>
            <PanelLeftIcon className="invisible" />
          </div>

          {showBanner && (
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
          )}

          {children}
        </main>
      </ProtectedLayout>
    </SidebarProvider>
  );
}
