import type { Metadata } from 'next';
import { Onest } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from './providers/query-provider';
import { ThemeProvider } from './providers/theme-provider';
import { ThemeToggle } from '@/components/ThemeToggle';

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
    <html lang="en" suppressHydrationWarning>
      <body className={onest.className}>
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
          <QueryProvider>
            {children}
          </QueryProvider>

          <Toaster richColors />

        </ThemeProvider>
      </body>
    </html>
  );
}
