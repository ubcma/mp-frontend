"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Network,
  PlusCircle,
  Calendar,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { getInitials } from "@/helpers/getInitials";
import { useUserQuery } from "@/lib/queries/user";
import { LogoutButton } from "./LogoutButton";

export function AppSidebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  const pathname = usePathname();

  const { data: user, isLoading, isError } = useUserQuery();

  const memberMenu = [
    {
      href: "/events",
      icon: Calendar,
      label: "Events",
      disabled: false,
    },
    {
      href: "/member-network",
      icon: Network,
      label: "Member Network",
      disabled: false,
    },
  ];

  const adminMenu = [
    {
      href: "/manage-members",
      icon: Users,
      label: "Manage Members",
      disabled: false,
    },
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      disabled: false,
    },
    {
      href: "/create-event",
      icon: PlusCircle,
      label: "Create New Event",
      disabled: true,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2 pt-4">
        <Link href="/events" className="flex items-center">
          <img
            src={`${
              state === "collapsed"
                ? "/logos/logo_red.svg"
                : "/logos/portal_logo_red.svg"
            }`}
            alt="UBCMA Logo"
            className={`${state === "collapsed" ? "h-8" : "h-[64px]"}`}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* User Profile */}
        <SidebarGroup>
          <Link
            href="/profile"
            className={`flex items-center gap-4 transition-all duration-300 ease-in-out hover:opacity-70 ${
              state === "collapsed" ? "p-0" : "p-2"
            }`}
          >
            <Avatar
              className={`rounded-md ${
                state === "collapsed" ? "h-8 w-8" : "h-12 w-12"
              }`}
            >
              {user?.profile_image ? (
                <AvatarImage src={user?.profile_image} alt="Profile Image" className="object-cover w-full h-full rounded-md"/>
              ) : (
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-sm text-muted-foreground text-nowrap">
                Year {user?.year_level} // {user?.specialization}
              </p>
            </div>
          </Link>
        </SidebarGroup>

        {/* Explore Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Explore</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {memberMenu.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link
                      href={item.href}
                      aria-disabled={item.disabled}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
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

        {/* Logout */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <LogoutButton/>
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
