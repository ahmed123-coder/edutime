"use client";

import Link from "next/link";

import { Settings, CircleHelp, Search, Database, ClipboardList, File } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { IMAGES } from "@/lib/images";
import { getSidebarItems, getDefaultDashboardUrl } from "@/navigation/sidebar/get-sidebar-items";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  // Show loading state or default items while session is loading
  const roleBasedSidebarItems = status === "loading" || !userRole ? [] : getSidebarItems(userRole);
  const defaultDashboardUrl = status === "loading" || !userRole ? "/dashboard" : getDefaultDashboardUrl(userRole);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href={defaultDashboardUrl}>
                <img
                  src={IMAGES.LOGO_RECTANGLE}
                  alt="EduTime"
                  className="h-8 w-auto"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {status === "loading" || !userRole ? (
          <div className="flex items-center justify-center p-4">
            <div className="text-muted-foreground text-sm">Loading navigation...</div>
          </div>
        ) : (
          <NavMain items={roleBasedSidebarItems} />
        )}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
