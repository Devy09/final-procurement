"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PurchaseRequestActions } from "./purchase-request-actions"

export type PurchaseRequestColumn = {
  id: string
  prno: string
  department: string
  section: string
  date_submitted: string
  procurement_mode: string
  pr_status: string
}

export const columns: ColumnDef<PurchaseRequestColumn>[] = [
  {
    accessorKey: "prno",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PR No.
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "date_submitted",
    header: "Date Submitted",
  },
  {
    accessorKey: "procurement_mode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Procurement Mode
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "pr_status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <PurchaseRequestActions requisition={row.original} />
    },
  },
]
