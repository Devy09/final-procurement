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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PackagePlus, ChevronLeft, ChevronRight } from "lucide-react";
import { generateColumns } from "./columns";
import { PPMPTableColumn } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface DataTableProps {
  data: PPMPTableColumn[];
  setData: React.Dispatch<React.SetStateAction<PPMPTableColumn[]>>;
}

export function DataTable({ data, setData }: DataTableProps) {
  const [itemDescription, setItemDescription] = React.useState("");
  const [unitCost, setUnitCost] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setLoadingTable(true);
    try {
      const response = await fetch("/api/ppmp");
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({ title: "Error", description: "Failed to refresh data", type: "background" });
    } finally {
      setLoadingTable(false);
    }
  };

  React.useEffect(() => {
    refreshData();
  }, []);

  const columns: ColumnDef<PPMPTableColumn>[] = generateColumns(refreshData);

  const handleSubmit = async () => {
    setLoading(true);
    const newItem = {
      ppmp_item: itemDescription,
      unit_cost: parseFloat(unitCost),
      ppmp_category: category,
    };

    try {
      const response = await fetch("/api/ppmp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const savedItem = await response.json();
        setData((prevData) => [...prevData, savedItem]);
        setItemDescription("");
        setUnitCost("");
        setCategory("");
        setDialogOpen(false);
        toast({ title: "Success", description: "Item added successfully!", type: "background" });
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to add item", type: "background" });
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
    <div className="flex flex-col flex-grow w-full p-4 bg-background">
      {/* Search and Dialog */}
      <div className="flex items-center flex-wrap gap-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn("ppmp_item")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("ppmp_item")?.setFilterValue(event.target.value)
          }
          className="max-w-sm flex-grow lg:w-1/4"
          autoComplete="off"
        />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <PackagePlus /> Create PPMP
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>PPMP</DialogTitle>
              <DialogDescription>
                This is alternative if importing excel is failed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="item_description" className="text-center">
                  Item
                </Label>
                <Input
                  id="item_description"
                  className="col-span-3"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit_cost" className="text-right">
                  Unit Cost
                </Label>
                <Input
                  id="unit_cost"
                  className="col-span-3"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit_cost" className="text-right">
                  Category
                </Label>
                <Select onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="--" />
                  </SelectTrigger>
                  <SelectContent className="text-left">
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Equipments">Equipments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Add Item"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* PPMP Table */}
      <div className="rounded-md border w-full overflow-x-auto mt-4 flex-grow">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-2 text-left">
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
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
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 text-left">
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
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
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