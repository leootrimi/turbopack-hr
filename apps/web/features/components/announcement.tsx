import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/components/ui/pagination";
import { Separator } from "@radix-ui/react-separator";
import { Bell, Calendar } from "lucide-react";
import React, { useState } from "react";
import { Announcement } from "../types";

const ITEMS_PER_PAGE = 4;

const AnnouncementComponent = ({ announcements }: { announcements: Announcement[] }) => {
  const [announcementPage, setAnnouncementPage] = useState(1);
  const paginateData = <T,>(data: T[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return data.slice(start, end);
  };

  const totalPages = (dataLength: number) =>
    Math.ceil(dataLength / ITEMS_PER_PAGE);

  const paginatedAnnouncements = paginateData(announcements, announcementPage);

  return (
    <Card className="rounded-2xl shadow-sm py-4 gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bell className="h-5 w-5 text-primary" />
          New Announcements
        </CardTitle>
      </CardHeader>
      <hr />
      <CardContent className="space-y-4">
        {paginatedAnnouncements.map((announcement, index) => (
          <div key={announcement.id}>
            {index > 0 && <Separator className="my-4" />}
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sidebar-accent">
                  {announcement.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-sidebar-accent-foreground whitespace-nowrap">
                  <Calendar className="h-3 w-3" />
                  {new Date(announcement.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <p className="text-sm text-foreground">
                {announcement.description}
              </p>
            </div>
          </div>
        ))}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setAnnouncementPage((p) => Math.max(1, p - 1))}
                className={
                  announcementPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from(
              { length: totalPages(announcements.length) },
              (_, i) => i + 1
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setAnnouncementPage(page)}
                  isActive={page === announcementPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setAnnouncementPage((p) =>
                    Math.min(totalPages(announcements.length), p + 1)
                  )
                }
                className={
                  announcementPage === totalPages(announcements.length)
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
};

export default AnnouncementComponent;
