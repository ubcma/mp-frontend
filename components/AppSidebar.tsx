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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
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
import Spinner from './Spinner';

export function AppSidebar() {
  const {
    state,
    // open,
    // setOpen,
    // openMobile,
    // setOpenMobile,
    // isMobile,
    // toggleSidebar,
  } = useSidebar();

  const router = useRouter();

  const pathname = usePathname();

  const { data: user, isLoading } = useUserQuery();

  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  const memberMenu = [
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
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2 pt-4">
        <Link href="/home" className="flex items-center" prefetch={true}>
          <img
            src={`${
              state === 'collapsed'
                ? '/logos/logo_red.svg'
                : '/logos/portal_logo_red.svg'
            }`}
            alt="UBCMA Logo"
            className={`${state === 'collapsed' ? 'h-8' : 'h-[64px]'}`}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* User Profile */}
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
            <Link
              href="/profile"
              className={`flex items-center gap-3 transition-all duration-300 ease-in-out hover:opacity-70 ${
                state === 'collapsed' ? 'p-0' : 'p-2'
              }`}
              prefetch={true}
            >
              <Avatar
                className={`rounded-md ${
                  state === 'collapsed' ? 'h-8 w-8' : 'h-10 w-10'
                }`}
              >
                {user?.avatarUrl ? (
                  <AvatarImage
                    src={user.avatarUrl}
                    alt="Profile Image"
                    className="object-cover w-full h-full rounded-md"
                  />
                ) : (
                  <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium text-nowrap">{user?.name}</h3>
                <p className="text-xs text-muted-foreground text-nowrap">
                  {user?.role}
                </p>
              </div>
            </Link>
          )}
        </SidebarGroup>

        {/* Explore Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {memberMenu.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link
                      href={item.href}
                      aria-disabled={item.disabled}
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {user?.role === 'Admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenu.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <Link
                        href={item.href}
                        aria-disabled={item.disabled}
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
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={handleSignOut} className="cursor-pointer">
                    {isSignOutLoading ? (
                      <>
                        <Spinner color="blue-500" />
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
