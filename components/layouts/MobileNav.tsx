import Image from 'next/image';
import Link from 'next/link';
import { SidebarTrigger } from '../ui/sidebar';

export default function MobileNav() {
  return (
    <div className="md:hidden fixed w-full flex flex-row justify-between items-center px-4 py-2 bg-background/90 backdrop-blur-lg z-30 border-b dark:border-b-[0.5px] border-muted">
      <Link href="/" prefetch={true}>
        <Image src="/logos/logo_red.svg" alt="Logo" width={40} height={40} />
      </Link>
      <SidebarTrigger />
    </div>
  );
}