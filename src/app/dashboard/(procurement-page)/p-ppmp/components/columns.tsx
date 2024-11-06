"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { PPMPTableColumn } from "./types";


export const generateColumns = (refreshData: () => void): ColumnDef<PPMPTableColumn>[] => [
  {
    accessorKey: "ppmp_item",
    header: "Item Description",
  },
  {
    accessorKey: "unit_cost",
    header: () => <div className="text-right">Unit Cost</div>,
    cell: ({ row }) => {
      const unitcost = parseFloat(row.getValue("unit_cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(unitcost);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "ppmp_category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
      });

      const handleUpdate = async () => {
        setLoading(true);
        const updatedData = {
          ...ppmp,
          ...formData,
          unit_cost: parseFloat(formData.unit_cost),
        };
        
        try {
          console.log("Updating item with data:", updatedData);
          const response = await fetch(`/api/ppmp/${ppmp.id}`, {
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
          const response = await fetch(`/api/ppmp/${ppmp.id}`, {
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
                className="font-bold">
                <SquarePen /> Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenRemoveConfirm(true)}
                className="text-red-500 font-bold">
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
                <label className="block text-sm font-medium text-gray-700">
                  Item Description
                  <Input
                    value={formData.ppmp_item}
                    onChange={(e) =>
                      setFormData({ ...formData, ppmp_item: e.target.value })
                    }
                    placeholder="Enter item description"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Unit Cost
                  <Input
                    value={formData.unit_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_cost: e.target.value })
                    }
                    placeholder="Enter unit cost"
                  />
                </label>

                <label className="block text-sm font-medium text-gray-700">
                  Category
                  <Input
                    value={formData.ppmp_category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ppmp_category: e.target.value,
                      })
                    }
                    placeholder="Enter category"
                  />
                </label>
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
                Are you sure you want to remove this item? This action cannot be undone.
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpenRemoveConfirm(false)}>
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
