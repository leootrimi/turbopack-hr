import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/components/ui/avatar";
import { Badge } from "@/components/components/ui/badge";
import { Button } from "@/components/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";
import { EquipmentRow } from "@repo/types";

interface Equipment {
  id: string;
  type: string;
  model: string;
  serial: string;
  assignedTo: { name: string; avatar: string };
  department: string;
  status: string;
  purchaseDate: string;
  price: number;
  warrantyExpiration: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Working":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "In Repair":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "Returned":
      return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200";
    case "Missing":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const equipment_columns: ColumnDef<EquipmentRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-semibold text-primary">
        #{row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.getValue("category")}
      </Badge>
    ),
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("model")}
      </div>
    ),
  },
  {
    accessorKey: "assetTag",
    header: "Asset Tag",
    cell: ({ row }) => {
      const value = row.getValue("assetTag") as string | null;
      return (
        <div className="font-mono text-xs">
          {value ?? "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const value = row.getValue("assignedTo") as number | null;

      return (
        <div className="text-sm">
          {value ? `Employee #${value}` : "Unassigned"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as string | null;

      return (
        <Badge className={getStatusColor(value || "")}>
          {value ?? "—"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "condition",
    header: "Condition",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.getValue("condition") ?? "—"}
      </Badge>
    ),
  },
  {
    id: "menu-actions",
    enableHiding: false,
    cell: ({ row }) => {
      const equipment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(
                  equipment.assetTag ?? ""
                )
              }
            >
              Copy Asset Tag
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="hover:bg-card!">
              <Link href={`/dashboard/equipments/${equipment.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Edit Equipment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
