'use client';
import Link from 'next/link';
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Users,
  Home,
  LogOut,
  CalendarCog,
  BadgeDollarSign,
  BriefcaseBusiness,
  Handshake,
  BadgePercent,
  UserCircle2,
  Settings2,
  BadgeCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_MOBILE,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';
import { useUserQuery } from '@/lib/queries/user';
import { Skeleton } from './ui/skeleton';
import { signOut } from '@/lib/better-auth/sign-out';
import { useState } from 'react';
import Spinner from './common/Spinner';
import Image from 'next/image';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function AppSidebar() {
  const {
    state,
    // open,
    setOpen,
    // openMobile,
    setOpenMobile,
    isMobile,
    // toggleSidebar,
  } = useSidebar();

  const router = useRouter();

  const pathname = usePathname();

  const { data: user, isLoading } = useUserQuery();

  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  const publicMenu = [
    {
      href: '/home',
      icon: Home,
      label: 'Home',
      disabled: false,
    },
    {
      href: '/events',
      icon: Calendar,
      label: 'Events',
      disabled: false,
    },
  ];

  const memberMenu = [
    {
      href: '/job-board',
      icon: BriefcaseBusiness,
      label: 'Job Board (Coming Soon)',
      disabled: true,
    },
    {
      href: '/alumni-network',
      icon: Handshake,
      label: 'Alumni Network (Coming Soon)',
      disabled: true,
    },
    {
      href: '/discounts',
      icon: BadgePercent,
      label: 'Member Discounts (Coming Soon)',
      disabled: true,
    },
  ];

  const adminMenu = [
    {
      href: '/admin-dashboard',
      icon: LayoutDashboard,
      label: 'Admin Dashboard',
      disabled: false,
    },
    {
      href: '/create-event',
      icon: PlusCircle,
      label: 'Create New Event',
      disabled: false,
    },
    {
      href: '/manage-events',
      icon: CalendarCog,
      label: 'Manage Events',
      disabled: false,
    },
    {
      href: '/manage-members',
      icon: Users,
      label: 'Manage Members',
      disabled: false,
    },
    {
      href: '/admin-transactions',
      icon: BadgeDollarSign,
      label: 'Transactions',
      disabled: false,
    },
  ];

  const handleSignOut = async () => {
    try {
      setIsSignOutLoading(true);
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Failed to sign out', error);
      setIsSignOutLoading(false);
    }
  };

  return (
    <Sidebar collapsible="icon" side={isMobile ? 'right' : 'left'}>
      <SidebarHeader className="p-2 pt-4">
        <Link href="/home" className="flex items-center" prefetch={true}>
          <Image
            src={`${'/logos/logo_red.svg'}`}
            width={128}
            height={96}
            alt="UBCMA Logo"
            onClick={() => setOpenMobile(false)}
            className={`w-fit ${state === 'collapsed' && !isMobile ? 'h-8' : 'h-[64px] mr-2'}`}
          />
          {state === 'expanded' && (
            <div className="text-[#f03050] text-nowrap">
              <p className="font-semibold text-lg -mb-1">UBCMA</p>
              <p className="font-medium text-xs">Membership Portal</p>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <ProfilePopover
          isLoading={isLoading}
          user={
            user
              ? { name: user.name, role: user.role, avatar: user.avatar }
              : null
          }
          state={state}
          isMobile={isMobile}
        />

        <div className=''>
          <SidebarSection
            label="Explore"
            menuItems={publicMenu}
            pathname={pathname}
            setOpenMobile={setOpenMobile}
            isVisible={true}
            activeMatch="startsWith"
          />

          <SidebarSection
            label="Member Apps"
            menuItems={memberMenu}
            pathname={pathname}
            setOpenMobile={setOpenMobile}
            isVisible={user?.role === 'Member' || user?.role === 'Admin'}
            activeMatch="startsWith"
          />

          <SidebarSection
            label="Admin"
            menuItems={adminMenu}
            pathname={pathname}
            setOpenMobile={setOpenMobile}
            isVisible={user?.role === 'Admin'}
            activeMatch="exact"
          />
        </div>

        {/* Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={handleSignOut} className="cursor-pointer">
                    {isSignOutLoading ? (
                      <>
                        <Spinner color="blue-500" size={4} />
                        <span> Signing out... </span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </>
                    )}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface SidebarSectionProps {
  label: string;
  menuItems: MenuItem[];
  pathname: string;
  setOpenMobile: (open: boolean) => void;
  isVisible?: boolean;
  activeMatch?: 'exact' | 'startsWith';
}

export function SidebarSection({
  label,
  menuItems,
  pathname,
  setOpenMobile,
  isVisible = true,
  activeMatch = 'startsWith',
}: SidebarSectionProps) {
  if (!isVisible) return null;

  return (
    <SidebarGroup className='py-1'>
      <SidebarGroupLabel className='font-normal'>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive =
              activeMatch === 'exact'
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link
                    href={item.href}
                    aria-disabled={item.disabled}
                    onClick={() => setOpenMobile(false)}
                    {...(item.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    prefetch={true}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

interface ProfilePopoverProps {
  isLoading: boolean;
  user: {
    name: string;
    role: string;
    avatar?: string;
  } | null;
  state: 'collapsed' | 'expanded';
  isMobile: boolean;
}

export function ProfilePopover({
  isLoading,
  user,
  state,
  isMobile,
}: ProfilePopoverProps) {
  return (
    <SidebarGroup>
      {isLoading ? (
        <div className="flex items-center space-x-4 p-2 brightness-[0.95]">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px] rounded-md" />
            <Skeleton className="h-3 w-[100px] rounded-md" />
          </div>
        </div>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={`flex w-full items-center gap-4 md:gap-3 transition-all duration-300 ease-in-out hover:opacity-70 focus:outline-none ${
                state === 'collapsed' && !isMobile ? 'p-0' : 'p-2'
              }`}
            >
              <Avatar
                className={`rounded-md ${
                  state === 'collapsed' && !isMobile ? 'h-8 w-8' : 'h-12 w-12'
                }`}
              >
                {user?.avatar ? (
                  <AvatarImage
                    src={user.avatar}
                    alt="Profile Image"
                    className="object-cover w-full h-full rounded-md"
                  />
                ) : (
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                )}
              </Avatar>
              {state !== 'collapsed' && (
                <div className="text-left">
                  <h3 className="text-lg md:text-md font-medium text-nowrap">
                    {user?.name}
                  </h3>
                  <p className="text-sm md:text-xs text-muted-foreground text-nowrap">
                    {user?.role}
                  </p>
                </div>
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className={`md:w-[15rem]
               w-[19rem] p-1 md:text-sm text-md`}
          >
            {/* md:w-[15rem] */}
            <Link
              href="/profile"
              className="block rounded-md p-4 py-3 md:p-2 hover:bg-accent"
            >
              View Profile
            </Link>
            <Link
              href="/preferences"
              className="block rounded-md p-4 py-3 md:p-2 hover:bg-accent"
            >
              Preferences
            </Link>
            <Link
              href="/membership"
              className="block rounded-md p-4 py-3 md:p-2 hover:bg-accent"
            >
              Membership
            </Link>
          </PopoverContent>
        </Popover>
      )}
    </SidebarGroup>
  );
}
