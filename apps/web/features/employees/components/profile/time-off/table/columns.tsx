"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { TimeOffRequestRow } from "@repo/types";

import { RequestStatus } from "@repo/types";

export const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    default:
      return "";
  }
};


export const columns: ColumnDef<TimeOffRequestRow>[] = [
  {
    accessorKey: "request_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.request_type}</span>
    ),
  },
  {
    accessorKey: "date_from",
    header: "Date From",
    cell: ({ row }) => formatDate(row.original.date_from),
  },
  {
    accessorKey: "date_to",
    header: "Date To",
    cell: ({ row }) => formatDate(row.original.date_to),
  },
  {
    accessorKey: "amount_of_days",
    header: () => <div className="text-center">Days</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.amount_of_days}</div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge className={getStatusColor(row.original.status)} variant="secondary">
          {row.original.status}
        </Badge>
      </div>
    ),
  },
];
