"use client"

import { ColumnDef } from "@tanstack/react-table"
import { QuotationActions } from "./quotation-actions"

export type QuotationColumn = {
  id: string
  prno: string
  department: string
  section: string
  date_submitted: string
}

export const columns: ColumnDef<QuotationColumn>[] = [
  {
    accessorKey: "prno",
    header: "PR No.",
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
    id: "actions",
    cell: ({ row }) => {
      return <QuotationActions requisition={row.original} />
    },
  },
]
