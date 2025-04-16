"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { AbstractActions } from "./abstract-actions"

export interface AbstractColumn {
  id: string;
  prno: string;
  requestDate: string;
  date: string;
  overallTotal: string;
  winningBidder: string | null;
  winningTotal: string | null;
  suppliers: string[];
  items?: {
    itemNo: number;
    description: string;
    qty: number;
    unit: string;
    bids: Record<string, { unitCost: number; total: number }>;
  }[];
}

export const columns: ColumnDef<AbstractColumn>[] = [
  {
    accessorKey: "prno",
    header: "PR No.",
  },
  {
    accessorKey: "requestDate",
    header: "Request Date",
    cell: ({ row }) => {
      return format(new Date(row.original.requestDate), "PPP")
    }
  },
  {
    accessorKey: "overallTotal",
    header: "ABC",
    cell: ({ row }) => {
      return `₱${parseFloat(row.original.overallTotal).toLocaleString('en-PH')}`
    }
  },
  {
    accessorKey: "winningBidder",
    header: "Winning Bidder",
    cell: ({ row }) => {
      return row.original.winningBidder || "Not selected"
    }
  },
  {
    accessorKey: "winningTotal",
    header: "Bid Amount",
    cell: ({ row }) => {
      if (row.original.winningTotal === null) return "Not selected";
      return `₱${parseFloat(row.original.winningTotal).toLocaleString('en-PH')}`;
    }
  },
  {
    accessorKey: "date",
    header: "Date Created",
    cell: ({ row }) => {
      return format(new Date(row.original.date), "PPP")
    }
  },
  {
    accessorKey: "suppliers",
    header: "Suppliers",
    cell: ({ row }) => {
      return row.original.suppliers.length.toString()
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <AbstractActions abstract={row.original} />
    }
  },
]
