import { Button } from "@/components/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/components/ui/dropdown-menu"
import { Employee } from "@repo/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('fullName')}</div>,
  },
  {
    accessorKey: 'jobTitle',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Position
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue('jobTitle')}</div>,
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('department')}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original

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
              onClick={() => navigator.clipboard.writeText(employee.name)}
              className="hover:bg-card!"
            >
              Copy Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem  className="hover:bg-card!">View Profile</DropdownMenuItem>
            <DropdownMenuItem  className="hover:bg-card!">Edit Employee</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]