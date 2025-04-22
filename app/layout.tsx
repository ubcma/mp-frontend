import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from './providers/query-provider';

const onest = Onest({
  subsets: ['latin'],
  variable: '--font-onest',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Membership Portal',
  description: 'Welcome to MA!',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={onest.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
