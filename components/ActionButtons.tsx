'use client';

import type React from 'react';

import Link from 'next/link';
import { BriefcaseBusiness, Handshake, LucideIcon, Puzzle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  className: string;
  icon: LucideIcon;
  disabled?: boolean;
}

function ActionButton({
  href,
  children,
  className,
  icon,
  disabled = false,
}: ActionButtonProps) {
  const IconComponent = icon;
  const isMobile = useIsMobile();
  return (
    <Link href={href}>
      <button
        className={cn(
          `
          relative flex justify-start items-end rounded-xl h-48 md:h-64 w-full text-left p-6 text-lg font-semibold duration-300 ease-out shadow-[inset_8px_-8px_50px_rgba(255,255,255,0.8)]  overflow-hidden 
        `,
          className,
          !disabled ?
            'hover:shadow-[inset_8px_-8px_50px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-[0.97] hover:opacity-80' :
            'opacity-60'
          
        )}
        disabled={disabled}
      >
        {disabled && <div className="font-medium text-sm absolute top-6 left-6 z-10"> (Coming Soon) </div>}
        {children}
        <IconComponent
          size={isMobile ? 164 : 196}
          className="absolute -top-8 right-8 mix-blend-overlay stroke-2 rotate-12"
        />
      </button>
    </Link>
  );
}

export function ActionButtons() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ActionButton
        href="/events"
        className="bg-[#f8d1ff] text-[#704D73]"
        icon={Puzzle}
      >
        <div className="space-y-1 text-3xl font-bold z-[5]">
          <div>Browse</div>
          <div>Events</div>
        </div>
      </ActionButton>

    {/* comment test */} 
      <ActionButton
        href="/job-board"
        className="bg-[#d5e6ff] text-[#1E58AD]"
        icon={BriefcaseBusiness}
        disabled={true}
      >
        <div className="space-y-1 text-3xl font-bold z-[5]">
          <div>Job</div>
          <div>Board</div>
        </div>
      </ActionButton>

      <ActionButton
        href="/alumni-network"
        className="bg-[#D5FFBA] text-[#507D33]"
        icon={Handshake}
        disabled={true}
      >
        <div className="space-y-1 text-3xl font-bold z-[5]">
          <div>Alumni</div>
          <div>Network</div>
        </div>
      </ActionButton>
    </div>
  );
}
