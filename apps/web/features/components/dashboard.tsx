"use client";

import { useState } from "react";
import { Bell, UserX, UserCheck, Calendar, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/components/ui/pagination";
import { Separator } from "@/components/components/ui/separator";
import { AbsentUser, Announcement, CheckIn } from "../types";
import AnnouncementComponent from "./announcement";
import WhosOut from "./whosout";

// Mock data
const announcements: Announcement[] = [
  {
    id: 1,
    title: "Company-Wide Town Hall Meeting",
    date: "2025-11-02",
    description:
      "Join us this Friday at 3 PM for our quarterly town hall to discuss company updates and Q4 goals.",
  },
  {
    id: 2,
    title: "New Health Benefits Package",
    date: "2025-10-28",
    description:
      "We're excited to announce enhanced health benefits starting next month. Check your email for details.",
  },
  {
    id: 3,
    title: "Holiday Schedule Updated",
    date: "2025-10-25",
    description:
      "The holiday schedule for November and December has been finalized. Please review on the intranet.",
  },
  {
    id: 4,
    title: "Team Building Event",
    date: "2025-10-20",
    description:
      "Save the date for our annual team building event on November 15th. More details coming soon!",
  },
  {
    id: 5,
    title: "Performance Review Cycle",
    date: "2025-10-18",
    description:
      "Q4 performance reviews will begin on November 1st. Please complete your self-assessments by October 28th.",
  },
  {
    id: 6,
    title: "Office Renovation Notice",
    date: "2025-10-15",
    description:
      "The 3rd floor will undergo renovations starting next week. Affected teams will work remotely.",
  },
];

const absentUsers: AbsentUser[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    reason: "Sick Leave",
    department: "Engineering",
  },
  { id: 2, name: "Michael Chen", reason: "Vacation", department: "Marketing" },
  { id: 3, name: "Emma Davis", reason: "Personal Day", department: "Design" },
  { id: 4, name: "James Wilson", reason: "Parental Leave", department: "HR" },
  {
    id: 5,
    name: "Olivia Martinez",
    reason: "Remote Work",
    department: "Sales",
  },
  { id: 6, name: "Lucas Brown", reason: "Conference", department: "Product" },
  { id: 7, name: "Sophia Taylor", reason: "Sick Leave", department: "Finance" },
];

const checkIns: CheckIn[] = [
  { id: 1, name: "Alex Thompson", time: "08:45 AM", department: "Engineering" },
  { id: 2, name: "Rachel Green", time: "08:52 AM", department: "Marketing" },
  { id: 3, name: "Daniel Park", time: "09:03 AM", department: "Design" },
  { id: 4, name: "Jessica Lee", time: "09:15 AM", department: "Product" },
  { id: 5, name: "Ryan Cooper", time: "09:28 AM", department: "Sales" },
  { id: 6, name: "Emily White", time: "09:35 AM", department: "HR" },
  { id: 7, name: "Nathan Kim", time: "09:42 AM", department: "Finance" },
  { id: 8, name: "Mia Anderson", time: "09:58 AM", department: "Engineering" },
];

const ITEMS_PER_PAGE = 4;

const Dashboard = () => {
  const [checkInPage, setCheckInPage] = useState(1);

  const paginateData = <T,>(data: T[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return data.slice(start, end);
  };

  const totalPages = (dataLength: number) =>
    Math.ceil(dataLength / ITEMS_PER_PAGE);

  const paginatedCheckIns = paginateData(checkIns, checkInPage);

  return (
    <div className="min-h-screen md:p-6">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex gap-4 items-center">
          <img
            className="w-30 aspect-square object-cover rounded-2xl"
            src="https://www.denverheadshotco.com/wp-content/uploads/2023/05/Denver-Headshot-Co-0013-SMALL.jpg"
            alt=""
          />
          <div className="">
            <h1 className="text-4xl font-bold text-sidebar-accent">Hi, Leotrim</h1>
            <h3 className="text-lg font-light text-gray-500">Glad to see you back here!</h3>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AnnouncementComponent announcements={announcements} />
            <WhosOut absentUsers={absentUsers} />
          </div>

          <div className="lg:col-span-1">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserCheck className="h-5 w-5 text-success" />
                  Check-in Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {paginatedCheckIns.map((checkIn, index) => (
                  <div key={checkIn.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          {checkIn.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {checkIn.time}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {checkIn.department}
                      </p>
                    </div>
                  </div>
                ))}
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCheckInPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          checkInPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from(
                      { length: totalPages(checkIns.length) },
                      (_, i) => i + 1
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCheckInPage(page)}
                          isActive={page === checkInPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCheckInPage((p) =>
                            Math.min(totalPages(checkIns.length), p + 1)
                          )
                        }
                        className={
                          checkInPage === totalPages(checkIns.length)
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
