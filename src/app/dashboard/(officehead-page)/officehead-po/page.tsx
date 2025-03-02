import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import prisma from "@/lib/prisma"
import { FileBadge } from "lucide-react"

export default async function OfficeHeadPOPage() {
  const purchaseOrders = await prisma.purchaseOrder.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  const formattedPOs = purchaseOrders.map(po => ({
    ...po,
    date: po.date.toISOString(),
    approvedAtAccountant: po.approvedAtAccountant?.toISOString(),
    approvedAtPresident: po.approvedAtPresident?.toISOString(),
    accountantName: po.accountantName || undefined,
    accountantRole: po.accountantRole || undefined,
    accountantTitle: po.accountantTitle || undefined,
    accountantSignatureUrl: po.accountantSignatureUrl || undefined,
    accountantDesignation: po.accountantDesignation || undefined,
    presidentName: po.presidentName || undefined,
    presidentRole: po.presidentRole || undefined,
    presidentTitle: po.presidentTitle || undefined,
    presidentSignatureUrl: po.presidentSignatureUrl || undefined,
    presidentDesignation: po.presidentDesignation || undefined,
    rejectedReason: po.rejectedReason || undefined
  }))

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl bg-red-950 text-white m-6 p-6 rounded-md w-full">
        <div className="flex items-center gap-2">
          <FileBadge className="w-6 h-6" />
          <span className="font-bold">Purchase Orders</span>
        </div>
        <p className="text-sm text-white mt-2">
          This is the list of Purchase Orders that have been submitted and are awaiting approval from the Accountant and President
        </p>
      </h1>
      <DataTable columns={columns} data={formattedPOs} />
    </div>
  )
}