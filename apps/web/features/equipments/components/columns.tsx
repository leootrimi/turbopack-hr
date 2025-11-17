import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/components/ui/avatar";
import { Badge } from "@/components/components/ui/badge";
import { Button } from "@/components/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";

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

export const equipment_columns: ColumnDef<Equipment>[] = [
  {
    accessorKey: "id",
    header: "Equipment ID",
    cell: ({ row }) => (
      <div className="font-semibold text-primary">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => (
      <div className="text-foreground text-sm">
        {row.getValue("model")}
      </div>
    ),
  },
  {
    accessorKey: "serial",
    header: "Serial Number",
    cell: ({ row }) => (
      <div className="font-mono text-xs text-foreground">
        {row.getValue("serial")}
      </div>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as {
        name: string;
        avatar: string;
      };
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={assignedTo.avatar || "/placeholder.svg"}
              alt={assignedTo.name}
            />
            <AvatarFallback>{assignedTo.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{assignedTo.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.getValue("department")}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={getStatusColor(row.getValue("status") as string)}>
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    accessorKey: "purchaseDate",
    header: "Purchase Date",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue("purchaseDate") as string)}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="font-semibold">
        {formatPrice(row.getValue("price") as number)}
      </div>
    ),
  },
  {
    accessorKey: "warrantyExpiration",
    header: "Warranty Expiration",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue("warrantyExpiration") as string)}</div>
    ),
  },
  {
    id: "menu-actions",
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(employee.serial)}
              className="hover:bg-card!"
            >
              Copy Serial
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-card!">
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-card!">
              Edit Employee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
