"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox"
import { SupplierQuotationDetails } from "./supplier-quotation-details";


export interface SupplierQuotation {
  id: string;
  supplierName: string;
  prno: string;
  date: Date;
}

export const columns: ColumnDef<SupplierQuotation>[] = [
  {
    accessorKey: "prno",
    header: "PR No.",
  },
  {
    accessorKey: "supplierName",
    header: "Supplier Name",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("date")), "MMM d, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const quotation = row.original;
      const [showDetails, setShowDetails] = useState(false);

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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDetails(true)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Print Preview</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <SupplierQuotationDetails
            open={showDetails}
            onOpenChange={setShowDetails}
            quotationId={quotation.id}
          />
        </>
      );
    },
  },
];
