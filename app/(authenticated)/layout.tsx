import { AppSidebar } from '@/components/AppSidebar';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Prompts } from '@/components/Prompts';
import MobileNav from '@/components/layouts/MobileNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { getServerSession } from '@/lib/auth-server';
import { getOnboardingStatus } from '@/lib/queries/server/onboardingStatus';
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

  const [sessionResult, userRole, onboardingStatus] = await Promise.all([
    getServerSession(cookieHeader)
      .then((s) => ({ data: s, error: false as const }))
      .catch(() => ({ data: null, error: true as const })),
    getUserRole().catch(() => null),
    getOnboardingStatus().catch(() => null),
  ]);

  if (!sessionResult.data && !sessionResult.error) {
    redirect('/sign-in');
  }

  const showMembershipPrompt = userRole === 'Basic';
  const showOnboardingPrompt = onboardingStatus !== null && !onboardingStatus;
  const showPrompts = showMembershipPrompt || showOnboardingPrompt;

  return (
    <SidebarProvider>
      <MobileNav/>
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <div className="m-6 lg:m-12 mt-24">
          {showPrompts ? (
            <Prompts
              showOnboardingPrompt={showOnboardingPrompt}
              showMembershipPrompt={showMembershipPrompt}
            />
          ) : (
            <Breadcrumbs />
          )}

          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
