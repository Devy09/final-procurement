"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, CheckCircle, Loader2, XCircle, FileClock } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  onDataUpdate?: (newData: TData[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
  onDataUpdate,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = React.useState<TData[]>(initialData || []);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/purchase-request");
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(
          result.map((item: any) => ({
            id: item.id,
            prno: item.prno,
            department: item.department,
            section: item.section,
            date_submitted: new Date(item.date).toLocaleDateString(),
            pr_status: item.status,
            accountant_status: item.accountantStatus,
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!initialData) fetchData();
  }, [initialData]);

  const table = useReactTable({
    data,
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
  });

  const addNewRequest = (newRequest: TData) => {
    const updatedData = [newRequest, ...data];
    setData(updatedData);
    onDataUpdate?.(updatedData);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-8 ml-10">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );

  return (
    <div className="w-full pr-6">
      <div className="flex items-center py-4 justify-between ml-6">
        <Input
          placeholder="Search..."
          value={(table.getColumn("prno")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("prno")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border ml-6">
        <Table className="min-w-full p-4">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "accountant_status" ? (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
                            cell.getValue() === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : cell.getValue() === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {cell.getValue() === "pending" && (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </>
                          )}
                          {cell.getValue() === "approved" && (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Approved
                            </>
                          )}
                          {cell.getValue() === "rejected" && (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              Rejected
                            </>
                          )}
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
  );
}