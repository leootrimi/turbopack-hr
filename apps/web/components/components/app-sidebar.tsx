"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Monitor,
  CalendarClock,
  ShieldCheck,
  ChevronRight,
  GalleryVerticalEnd,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/components/ui/sidebar";
import { cn } from "@/components/lib/utils";

const BASE_PATH = "/dashboard";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Overview", url: `${BASE_PATH}/overview` },
      { title: "Reports",  url: `${BASE_PATH}/reports`  },
    ],
  },
  {
    title: "Employees",
    icon: Users,
    items: [
      { title: "Active Employees",    url: `${BASE_PATH}/employees/active` },
      { title: "Former Employees",    url: `${BASE_PATH}/employees/former` },
      { title: "Teams & Departments", url: `${BASE_PATH}/employees/teams`  },
    ],
  },
  {
    title: "Equipment",
    icon: Monitor,
    items: [
      { title: "Assigned Equipment", url: `${BASE_PATH}/equipment/assigned` },
      { title: "Archived Equipment", url: `${BASE_PATH}/equipment/archived` },
      { title: "Add Equipment",      url: `${BASE_PATH}/equipment/add`      },
    ],
  },
  {
    title: "Requests",
    icon: CalendarClock,
    items: [
      { title: "Holiday Requests",   url: `${BASE_PATH}/timeoff/requests`   },
      { title: "Work From Home",     url: `${BASE_PATH}/requests/wfh`       },
      { title: "Sick Leave",         url: `${BASE_PATH}/requests/sick-leave` },
      { title: "Vacation Requests",  url: `${BASE_PATH}/requests/vacation`  },
    ],
  },
  {
    title: "Administration",
    icon: ShieldCheck,
    items: [
      { title: "Settings",       url: `${BASE_PATH}/admin/settings` },
      { title: "Access Control", url: `${BASE_PATH}/admin/access`   },
      { title: "Check-ins",      url: `${BASE_PATH}/admin/check-in` },
      { title: "System Logs",    url: `${BASE_PATH}/admin/logs`     },
    ],
  },
];

function NavGroup({
  group,
  pathname,
}: {
  group: (typeof navItems)[number];
  pathname: string;
}) {
  const Icon = group.icon;
  const isAnyChildActive = group.items.some((i) => pathname === i.url);
  const [open, setOpen] = useState(isAnyChildActive);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
          isAnyChildActive
            ? "text-slate-900"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
        )}
      >
        <span
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
            isAnyChildActive
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
          )}
        >
          <Icon size={14} />
        </span>

        <span className="flex-1 text-left">{group.title}</span>

        <ChevronRight
          size={14}
          className={cn(
            "transition-transform duration-200 text-slate-400",
            open && "rotate-90"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-3 pl-4 border-l border-slate-100 mt-1 mb-1 space-y-0.5">
          {group.items.map((item) => {
            const active = pathname === item.url;
            return (
              <a
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-150",
                  active
                    ? "bg-slate-900 text-white font-medium"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                )}
              >
                {active && (
                  <span className="w-1 h-1 rounded-full bg-white shrink-0" />
                )}
                {item.title}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      {...props}
      className="border-r border-slate-100 bg-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <SidebarHeader className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
            <GalleryVerticalEnd size={15} className="text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            Bamboo
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 flex flex-col gap-0.5 overflow-y-auto bg-white">
        {navItems.map((group) => (
          <NavGroup key={group.title} group={group} pathname={pathname} />
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}