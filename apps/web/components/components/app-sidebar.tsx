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

const BASE_PATH = "/dashboard";

export const data = {
  versions: ["1.0.0", "1.1.0-beta", "2.0.0"],
  navMain: [
    {
      title: "Dashboard",
      url: `${BASE_PATH}`,
      items: [
        {
          title: "Overview",
          url: `${BASE_PATH}/overview`,
          isActive: true,
        },
        {
          title: "Reports",
          url: `${BASE_PATH}/reports`,
        },
      ],
    },
    {
      title: "Employees",
      url: `${BASE_PATH}/employees`,
      items: [
        {
          title: "Active Employees",
          url: `${BASE_PATH}/employees/active`,
        },
        {
          title: "Former Employees",
          url: `${BASE_PATH}/employees/former`,
        },
        {
          title: "Teams & Departments",
          url: `${BASE_PATH}/employees/teams`,
        },
      ],
    },
    {
      title: "Equipment",
      url: `${BASE_PATH}/equipment`,
      items: [
        {
          title: "Assigned Equipment",
          url: `${BASE_PATH}/equipment/assigned`,
        },
        {
          title: "Archived Equipment",
          url: `${BASE_PATH}/equipment/archived`,
        },
        {
          title: "Add Equpiment",
          url: `${BASE_PATH}/equipment/add`
        }
      ],
    },
    {
      title: "Requests",
      url: `${BASE_PATH}/requests`,
      items: [
        {
          title: "Holiday Requests",
          url: `${BASE_PATH}/timeoff/requests`,
        },
        {
          title: "Work From Home",
          url: `${BASE_PATH}/requests/wfh`,
        },
        {
          title: "Sick Leave",
          url: `${BASE_PATH}/requests/sick-leave`,
        },
        {
          title: "Vacation Requests",
          url: `${BASE_PATH}/requests/vacation`,
        },
      ],
    },
    {
      title: "Administration",
      url: `${BASE_PATH}/admin`,
      items: [
        {
          title: "Settings",
          url: `${BASE_PATH}/admin/settings`,
        },
        {
          title: "Access Control",
          url: `${BASE_PATH}/admin/access`,
        },
        {
          title: "Check-in's",
          url: `${BASE_PATH}/admin/check-in`,
        },
        {
          title: "System Logs",
          url: `${BASE_PATH}/admin/logs`,
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
