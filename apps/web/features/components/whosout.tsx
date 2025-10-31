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
import { UserX } from "lucide-react";
import React, { useState } from "react";
import { AbsentUser } from "../types";
const ITEMS_PER_PAGE = 4;
const WhosOut = ({ absentUsers }: { absentUsers: AbsentUser[] }) => {
  const [absentPage, setAbsentPage] = useState(1);

  const paginateData = <T,>(data: T[], page: number) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return data.slice(start, end);
  };

  const totalPages = (dataLength: number) =>
    Math.ceil(dataLength / ITEMS_PER_PAGE);

  const paginatedAbsent = paginateData(absentUsers, absentPage);
  return (
    <Card className="rounded-2xl shadow-sm gap-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <UserX className="h-5 w-5 text-warning" />
          Who's Out Today
        </CardTitle>
      </CardHeader>
      <hr />
      <CardContent className="space-y-4">
        {paginatedAbsent.map((user, index) => (
          <div key={user.id}>
            {index > 0 && <Separator className="my-4" />}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {user.department}
                </p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {user.reason}
              </span>
            </div>
          </div>
        ))}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setAbsentPage((p) => Math.max(1, p - 1))}
                className={
                  absentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from(
              { length: totalPages(absentUsers.length) },
              (_, i) => i + 1
            ).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setAbsentPage(page)}
                  isActive={page === absentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setAbsentPage((p) =>
                    Math.min(totalPages(absentUsers.length), p + 1)
                  )
                }
                className={
                  absentPage === totalPages(absentUsers.length)
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

export default WhosOut;
