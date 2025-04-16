"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PackagePlus, ChevronLeft, ChevronRight, Users, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { generateColumns } from "./columns";
import { CommitteesTableColumn } from "./types";

interface DataTableProps {
  data: CommitteesTableColumn[];
  setData: React.Dispatch<React.SetStateAction<CommitteesTableColumn[]>>;
}

export function DataTable({ data, setData }: DataTableProps) {
  const [committeeName, setCommitteeName] = React.useState("");
  const [committeeTitle, setCommitteeTitle] = React.useState("");
  const [committeeDesignation, setCommitteeDesignation] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setLoadingTable(true);
    try {
      const response = await fetch("/api/committees", {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch committees");
      }

      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const columns: ColumnDef<CommitteesTableColumn>[] = generateColumns(refreshData);

  const handleSubmit = async () => {
    if (!committeeName || !committeeTitle || !committeeDesignation) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const newItem = {
      committee_name: committeeName,
      committee_title: committeeTitle,
      committee_designation: committeeDesignation,
    };

    try {
      const response = await fetch("/api/committees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) {
        throw new Error("Failed to add committee");
      }

      const savedItem = await response.json();
      setData((prevData) => [...prevData, savedItem]);
      setCommitteeName("");
      setCommitteeTitle("");
      setCommitteeDesignation("");
      setDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Committee added successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Add error:", error);
      toast({
        title: "Error",
        description: "Failed to add committee",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="m-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn("committee_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("committee_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          autoComplete="off"
        />
        <div className="ml-auto flex gap-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto bg-red-950 text-white">
                <UserPlus /> Add Committee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="bg-red-950 text-white p-4 rounded-lg">
                <DialogTitle >Committee</DialogTitle>
                <DialogDescription className="text-white">
                  Add committee details here.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="committee_name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="committee_name"
                    className="col-span-3"
                    value={committeeName}
                    onChange={(e) => setCommitteeName(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="committee_title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="committee_title"
                    className="col-span-3"
                    value={committeeTitle}
                    onChange={(e) => setCommitteeTitle(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="committee_designation" className="text-right">
                    Designation
                  </Label>
                  <Input
                    id="committee_designation"
                    className="col-span-3"
                    value={committeeDesignation}
                    onChange={(e) => setCommitteeDesignation(e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} disabled={loading} className="bg-red-950 text-white">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding committee...
                    </>
                  ) : (
                    "Add Committee"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* PPMP TABLE */}
      <div className="rounded-md border">
        <Table className="w-full">
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
            {loadingTable ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
              )
            )}
          </TableBody>
        </Table>
      </div>
      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
         <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Toaster /> 
    </div>
  );
}