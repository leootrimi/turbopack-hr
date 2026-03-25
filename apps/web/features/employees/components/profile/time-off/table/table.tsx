"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/components/ui/card";
import { Clock } from "lucide-react";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import { columns } from "./columns";
import { sampleData, TimeOffRequestRow } from "@repo/types";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/components/ui/table";
import { Button } from "@/components/components/ui/button";
import { ButtonGroup } from "@/components/components/ui/button-group";

export function TimeOffRequestsTable({ requests }: { requests: any[] }) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Map backend requests to TimeOffRequestRow format
  const mappedRequests: TimeOffRequestRow[] = requests.map(req => ({
    id: req.id,
    type: req.type,
    request_type: req.type, // Map to request_type as well if used in columns
    date_from: req.startDate,
    date_to: req.endDate,
    days: Number(req.days),
    amount_of_days: Number(req.days),
    reason: req.reason,
    status: req.status,
    created_at: req.createdAt || new Date().toISOString(),
  }));

  const upcomingRequests = mappedRequests.filter((request) => {
    const dateFrom = new Date(request.date_from);
    return dateFrom >= today;
  });

  const pastRequests = mappedRequests.filter((request) => {
    const dateFrom = new Date(request.date_from);
    return dateFrom < today;
  });

  const displayedRequests: TimeOffRequestRow[] =
    activeTab === "upcoming" ? upcomingRequests : pastRequests;

  const table = useReactTable({
    data: displayedRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <CardHeader>
        <div className="flex items-center justify-end">
          <ButtonGroup>
            <Button variant="outline">Upcoming</Button>
            <Button variant="outline">Past</Button>
          </ButtonGroup>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {displayedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg font-medium">
              No {activeTab} requests found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {activeTab === "upcoming"
                ? "You have no upcoming time-off requests"
                : "You have no past time-off requests"}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="font-semibold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </div>
  );
}
