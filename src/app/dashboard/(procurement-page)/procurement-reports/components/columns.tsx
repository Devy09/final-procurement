"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ReportViewDialog } from "./report-view-dialog";
import { format } from "date-fns";

export interface SavedReport {
  id: string;
  title: string;
  period: string;
  data: any;
  createdAt: string;
  createdBy: string;
}

export const columns: ColumnDef<SavedReport>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "period",
    header: "Period",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMMM d, yyyy HH:mm"),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ReportViewDialog report={row.original} />,
  },
];