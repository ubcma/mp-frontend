'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarTrigger, useSidebar } from './ui/sidebar';
import { cn } from '@/lib/utils';
import { PanelLeft } from 'lucide-react';
import { Button } from './ui/button';

export function Breadcrumbs() {
  const { toggleSidebar } = useSidebar();

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const isAtHomePage = pathname === '/home';

  const breadcrumbs = isAtHomePage
    ? []
    : segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        if (href === '/home') return null;

        const isLast = index === segments.length - 1;

        const label = decodeURIComponent(segment)
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={href} className="flex items-center gap-2">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={href}>{label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        );
      });

  return (
    <Breadcrumb className="mb-8 hidden md:block">
      <BreadcrumbList>
        <BreadcrumbItem>
          {isAtHomePage ? (
            <BreadcrumbPage>Home</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href="/home">Home</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {breadcrumbs}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
