import { AlertBanner } from '@/components/AlertBanner';
import { AppSidebar } from '@/components/AppSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import MobileNav from '@/components/layouts/MobileNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getServerSession } from '@/lib/auth-server';
import { getUserRole } from '@/lib/queries/server/userRole';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Layout({
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

  const showBanner = userRole === 'Basic';

  return (
    <SidebarProvider>
      <MobileNav/>
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <div className="m-6 lg:m-12 mt-24">
          {showBanner ? (
            <div className="mb-8">
              <AlertBanner color="blue">
                <div>
                  Looks like you're not a member yet!{' '}
                  <a
                    href="/purchase-membership"
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
    </SidebarProvider>
  );
}
