'use client'

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/components/ui/breadcrumb";
import React from "react";

function capitalizeFirst(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).replace(/-/g, " ");
}

export function BreadcrumbLayout() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <span className="font-bold text-sidebar-primary">{capitalizeFirst(segment)}</span>
                ) : (
                  <BreadcrumbLink href={href} className="text-sidebar-accent">
                    {capitalizeFirst(segment)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
