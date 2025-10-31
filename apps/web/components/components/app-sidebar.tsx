"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";

export const data = {
  versions: ["1.0.0", "1.1.0-beta", "2.0.0"],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      items: [
        {
          title: "Overview",
          url: "/dashboard/overview",
          isActive: true,
        },
        {
          title: "Reports",
          url: "/dashboard/reports",
        },
      ],
    },
    {
      title: "Employees",
      url: "/employees",
      items: [
        {
          title: "Active Employees",
          url: "/employees/active",
        },
        {
          title: "Former Employees",
          url: "/employees/former",
        },
        {
          title: "Teams & Departments",
          url: "/employees/teams",
        },
      ],
    },
    {
      title: "Equipment",
      url: "/equipment",
      items: [
        {
          title: "Assigned Equipment",
          url: "/equipment/assigned",
        },
        {
          title: "New Equipment",
          url: "/equipment/new",
        },
        {
          title: "Archived Equipment",
          url: "/equipment/archived",
        },
      ],
    },
    {
      title: "Requests",
      url: "/requests",
      items: [
        {
          title: "Holiday Requests",
          url: "/requests/holiday",
        },
        {
          title: "Work From Home",
          url: "/requests/wfh",
        },
        {
          title: "Sick Leave",
          url: "/requests/sick-leave",
        },
        {
          title: "Vacation Requests",
          url: "/requests/vacation",
        },
      ],
    },
    {
      title: "Administration",
      url: "/admin",
      items: [
        {
          title: "Settings",
          url: "/admin/settings",
        },
        {
          title: "Access Control",
          url: "/admin/access",
        },
        {
          title: "System Logs",
          url: "/admin/logs",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      {...props}
      className="bg-white dark:bg-gray-900 shadow-lg overflow-hidden"
    >
      <SidebarHeader className="flex flex-row items-center gap-4 p-4 bg-linear-to-t from-[#004466] to-sidebar-accent">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <GalleryVerticalEnd className="size-4" />
        </div>
        <h1 className="text-sidebar-primary-foreground"> Bamboo </h1>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-2 bg-card">
        {data.navMain.map((group, index) => (
          <div key={group.title}>
            <SidebarGroup className="rounded-lg">
              <SidebarGroupLabel className="text-gray-700 dark:text-gray-200 font-semibold text-sm px-3 py-2">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <a
                        href={item.url}
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors
                                    ${
                                      pathname === item.url
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground "
                                        : "hover:bg-sidebar-primary hover:text-sidebar-primary-foreground "
                                    }`}
                      >
                        {item.title}
                      </a>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {index !== data.navMain.length - 1 && (
              <hr className="border-t border-sidebar-accent opacity-7 " />
            )}
          </div>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
