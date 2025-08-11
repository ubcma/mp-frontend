import ProtectedLayout from '@/components/layouts/ProtectedLayout';

export const dynamic = 'force-dynamic';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ProtectedLayout>
      <main className="w-full">
        {children}
      </main>
    </ProtectedLayout>
  );
}
