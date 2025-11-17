'use client'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { equipment_columns } from './columns'
import { ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'

interface Equipment {
  id: string
  type: string
  model: string
  serial: string
  assignedTo: { name: string; avatar: string }
  department: string
  status: string
  purchaseDate: string
  price: number
  warrantyExpiration: string
}

interface EquipmentTableProps {
  data: Equipment[]
}

export function EquipmentTable({ data }: EquipmentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns: equipment_columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border/50 bg-secondary/30">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-semibold text-foreground h-12 sticky top-0 bg-secondary/30 z-10"
                  style={{
                    width: header.getSize(),
                  }}
                >
                  <div
                    className={
                      header.column.getCanSort()
                        ? 'flex items-center gap-2 cursor-pointer select-none'
                        : 'flex items-center gap-2'
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <div className="ml-1 text-muted-foreground">
                        {header.column.getIsSorted() === 'desc' ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : header.column.getIsSorted() === 'asc' ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4 opacity-40" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={equipment_columns.length}
                className="px-6 py-12 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="h-12 w-12 text-border" />
                  <p className="text-sm font-medium">No equipment found</p>
                  <p className="text-xs">Try adjusting your search or filters</p>
                </div>
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-border/30 hover:bg-secondary/20 transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 text-sm text-foreground"
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
