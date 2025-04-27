"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { PPMPTableColumn } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Trash2, SquarePen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const generateColumns = (
  refreshData: () => Promise<void>
): ColumnDef<PPMPTableColumn>[] => [
  {
    accessorKey: "ppmp_item",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("quantity"));
      return amount.toLocaleString();
    },
  },
  {
    accessorKey: "unit_cost",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit Cost
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("unit_cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "ppmp_category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submitted By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "user.section",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Section
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Added
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ppmp = row.original;
      const [openUpdate, setOpenUpdate] = useState(false);
      const [loading, setLoading] = useState(false);
      const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);
      const [formData, setFormData] = useState({
        ppmp_item: ppmp.ppmp_item,
        unit_cost: ppmp.unit_cost.toString(),
        ppmp_category: ppmp.ppmp_category,
        quantity: ppmp.quantity ? ppmp.quantity.toString() : '0',
      });

      const handleUpdate = async () => {
        setLoading(true);
        const updatedData = {
          ...ppmp,
          ...formData,
          unit_cost: parseFloat(formData.unit_cost),
          quantity: formData.quantity ? parseFloat(formData.quantity) : 0,
        };

        try {
          console.log("Updating item with data:", updatedData);
          const response = await fetch(`/api/officehead-api/officehead-ppmp/ppmp/${ppmp.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to update item:", response.status, errorText);
            throw new Error("Failed to update item");
          }

          console.log("Updated successfully");
          refreshData();
          setOpenUpdate(false);
        } catch (error) {
          console.error("Update error:", error);
        } finally {
          setLoading(false);
        }
      };

      const handleRemove = async () => {
        try {
          const response = await fetch(`/api/officehead-api/officehead-ppmp/ppmp/${ppmp.id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Failed to remove item");

          console.log("Removed successfully");
          refreshData();
          setOpenRemoveConfirm(false);
        } catch (error) {
          console.error("Remove error:", error);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-bold">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setOpenUpdate(true)}
                className="font-bold text-blue-500"
              >
                <SquarePen /> Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenRemoveConfirm(true)}
                className="text-red-500 font-bold"
              >
                <Trash2 /> Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Update Dialog */}
          <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update PPMP Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label className="block text-sm text-gray-700 dark:text-gray-300">
                  Item Description
                  <Input
                    value={formData.ppmp_item}
                    onChange={(e) =>
                      setFormData({ ...formData, ppmp_item: e.target.value })
                    }
                    className="mt-2"
                  />
                </Label>

                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity
                  <Input
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="mt-2"
                  />
                </Label>

                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Unit Cost
                  <Input
                    value={formData.unit_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_cost: e.target.value })
                    }
                    className="mt-2"
                  />
                </Label>

                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                  <Input
                    value={formData.ppmp_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ppmp_category: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </Label>
              </div>
              <DialogFooter>
                <Button onClick={handleUpdate} disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Remove Confirmation Dialog */}
          <Dialog open={openRemoveConfirm} onOpenChange={setOpenRemoveConfirm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Removal</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                Are you sure you want to remove this item? This action cannot be
                undone.
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpenRemoveConfirm(false)}
                >
                  Cancel
                </Button>
                <Button className="bg-red-500" onClick={handleRemove}>
                  Confirm Remove
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
