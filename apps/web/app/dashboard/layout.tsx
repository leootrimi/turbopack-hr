'use client'

import { AppSidebar } from "@/components/components/app-sidebar";
import { BreadcrumbLayout } from "@/components/components/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Geist } from "next/font/google";
import ThemeToggle from "@/components/components/themeTogle";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={geist.className}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-background">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <BreadcrumbLayout />
              <ThemeToggle />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
