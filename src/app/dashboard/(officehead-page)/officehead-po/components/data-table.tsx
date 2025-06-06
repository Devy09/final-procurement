"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"
import { Clock } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "@clerk/nextjs"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const { toast } = useToast()
  const { user } = useUser()
  const [section, setSection] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchSection = async () => {
      try {
        const response = await fetch(`/api/user/profile/${user?.id}`)
        if (!response.ok) throw new Error("Failed to fetch user profile")
        const userData = await response.json()
        setSection(userData.section)
      } catch (error) {
        console.error("Error fetching user section:", error)
        toast({
          title: "Error",
          description: "Failed to fetch user section information",
          variant: "destructive",
        })
      }
    }

    if (user?.id) {
      fetchSection()
    }
  }, [user?.id, toast])

  // Filter data by section
  const filteredData = section ? data.filter((item: any) => item.section === section) : data

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="w-full pr-6">
      <Toaster />
      <div className="flex items-center py-4 ml-6">
        <Input
          placeholder="Search..."
          value={(table.getColumn("prno")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("prno")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <div className="rounded-md border ml-6">
        <Table className="min-w-full p-4">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.column.id === "status" ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
                              cell.getValue() === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : cell.getValue() === "approved"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {cell.getValue() === "pending" && <Clock className="mr-1 h-3 w-3" />}
                            {cell.getValue() === "approved" && <CheckCircle className="mr-1 h-3 w-3" />}
                            {cell.getValue() === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                            {cell.getValue() as string}
                          </span>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>  
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
