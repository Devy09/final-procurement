"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, SquarePen } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CommitteesTableColumn } from "./types";

export const generateColumns = (
  refreshData: () => void
): ColumnDef<CommitteesTableColumn>[] => [
  {
    accessorKey: "committee_name",
    header: "Name",
  },
  {
    accessorKey: "committee_title",
    header: "Title",
  },
  {
    accessorKey: "committee_designation",
    header: "Designation",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const committee = row.original;
      const [openUpdate, setOpenUpdate] = useState(false);
      const [loading, setLoading] = useState(false);
      const [openRemoveConfirm, setOpenRemoveConfirm] = useState(false);
      const [formData, setFormData] = useState({
        committee_name: committee.committee_name,
        committee_title: committee.committee_title,
        committee_designation: committee.committee_designation,
      });

      const handleUpdate = async () => {
        setLoading(true);
        const updatedData = {
          ...committee,
          ...formData,
        };

        try {
          const response = await fetch(`/api/committees/${committee.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });

          if (!response.ok) {
            throw new Error("Failed to update committee");
          }

          refreshData();
          setOpenUpdate(false);
        } catch (error) {
          console.error("Update error:", error);
          throw error;
        } finally {
          setLoading(false);
        }
      };

      const handleRemove = async () => {
        try {
          const response = await fetch(`/api/committees/${committee.id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            throw new Error("Failed to remove committee");
          }

          refreshData();
          setOpenRemoveConfirm(false);
        } catch (error) {
          console.error("Remove error:", error);
          throw error;
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
                <DialogTitle>Update Committee</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="committee_name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="committee_name"
                    className="col-span-3"
                    value={formData.committee_name}
                    onChange={(e) => 
                      setFormData({ ...formData, committee_name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="committee_title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="committee_title"
                    className="col-span-3"
                    value={formData.committee_title}
                    onChange={(e) => 
                      setFormData({ ...formData, committee_title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="committee_designation" className="text-right">
                    Designation
                  </Label>
                  <Input
                    id="committee_designation"
                    className="col-span-3"
                    value={formData.committee_designation}
                    onChange={(e) => 
                      setFormData({ ...formData, committee_designation: e.target.value })
                    }
                  />
                </div>
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
                Are you sure you want to remove this committee? This action cannot be undone.
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
