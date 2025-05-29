import { AppSidebar } from '@/components/AppSidebar';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PanelLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ProtectedLayout>
        <AppSidebar />
        <main className="w-full mx-8 mb-8 mt-4 md:m-8">
          <div className="md:hidden w-full flex flex-row justify-between items-center mb-8">
            <SidebarTrigger />
            <Link href="/">
              <Image
                src="/logos/logo_red.svg"
                alt="Logo"
                width={48}
                height={48}
              />
            </Link>
            <PanelLeftIcon className="invisible" />
          </div>

          {children}
        </main>
      </ProtectedLayout>
    </SidebarProvider>
  );
}
