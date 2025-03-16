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
import { Loader2, PackagePlus, ChevronLeft, ChevronRight, FileDown } from "lucide-react";
import { generateColumns } from "./columns";
import { PPMPTableColumn } from "./types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataTableProps {
  data: PPMPTableColumn[];
  setData: React.Dispatch<React.SetStateAction<PPMPTableColumn[]>>;
}

const formatCurrency = (value: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  const fixedValue = parseFloat(value.toFixed(2));
  return fixedValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true
  });
};

export function DataTable({ data, setData }: DataTableProps) {
  const [itemDescription, setItemDescription] = React.useState("");
  const [unitCost, setUnitCost] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingTable, setLoadingTable] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<any[]>([]);
  const [uploadLoading, setUploadLoading] = React.useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setLoadingTable(true);
    try {
      const response = await fetch("/api/officehead-api/officehead-ppmp/ppmp");
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
      const response = await fetch("/api/officehead-api/officehead-ppmp/ppmp", {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await fetch('/api/officehead-api/officehead-ppmp/preview', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          const simplifiedData = data.map((item: any) => ({
            ppmp_item: item.ppmp_item,
            unit_cost: item.unit_cost
          }));
          setPreviewData(simplifiedData);
        } else {
          toast({ 
            title: "Error", 
            description: "Failed to preview file", 
            type: "background" 
          });
        }
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "Failed to preview file", 
          type: "background" 
        });
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const handleUpload = async () => {
    try {
      // Start loading
      setUploadLoading(true);

      // Map the preview data to match your schema
      const itemsToUpload = previewData.map(item => ({
        ppmp_item: item.ppmp_item,
        unit_cost: item.unit_cost,
        ppmp_category: 'Supplies' // Default category, adjust as needed
      }));

      // Upload each item using your existing POST endpoint
      const uploadPromises = itemsToUpload.map(item => 
        fetch("/api/officehead-api/officehead-ppmp/ppmp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(item),
        })
      );

      await Promise.all(uploadPromises);

      // Refresh the table data
      await refreshData();

      // Close dialog and clear preview
      setUploadDialogOpen(false);
      setPreviewData([]);

      toast({ 
        title: "Success", 
        description: "Items uploaded successfully!", 
        type: "background" 
      });

    } catch (error) {
      console.error("Upload error:", error);
      toast({ 
        title: "Error", 
        description: "Failed to upload items", 
        type: "background" 
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="m-6">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={(table.getColumn("ppmp_item")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("ppmp_item")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          autoComplete="off"
        />
        <div className="ml-auto flex gap-4">
          <Dialog 
            open={uploadDialogOpen} 
            onOpenChange={(open) => {
              setUploadDialogOpen(open);
              if (!open) {
                setPreviewData([]);
                const fileInput = document.getElementById('ppmp-file') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-red-950 text-white hover:bg-red-900">
                <FileDown className="mr-2 h-4 w-4" /> Upload PPMP
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px]">
              <DialogHeader className="bg-red-950 text-white p-6 rounded-lg">
                <DialogTitle className="text-2xl">
                  Project Procurement Management Plan
                </DialogTitle>
                <DialogDescription className="text-white">
                  Please upload only approved PPMP Excel file.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="ppmp-file">PPMP File</Label>
                  <Input 
                    id="ppmp-file" 
                    type="file" 
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </div>
                <ScrollArea className="h-[400px] border rounded-md">
                  {uploadLoading ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : previewData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Description</TableHead>
                          <TableHead>Unit Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.ppmp_item}</TableCell>
                            <TableCell>{formatCurrency(parseFloat(item.unit_cost))}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
                      Upload an Excel file to preview data
                    </div>
                  )}
                </ScrollArea>
              </div>
              <DialogFooter>
                <Button 
                  onClick={handleUpload}
                  disabled={uploadLoading || previewData.length === 0}
                >
                  {uploadLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-950 text-white hover:bg-red-900">
                <PackagePlus className="mr-2 h-4 w-4" /> Create PPMP
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="bg-red-950 text-white p-6 rounded-lg">
                <DialogTitle className="text-2xl">PPMP</DialogTitle>
                <DialogDescription className="text-white">
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
                    <SelectTrigger className="w-[276px]">
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
                <Button onClick={handleSubmit} disabled={loading} className="bg-red-950 text-white hover:bg-red-900">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding item...
                    </>
                  ) : (
                    "Add Item"
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
