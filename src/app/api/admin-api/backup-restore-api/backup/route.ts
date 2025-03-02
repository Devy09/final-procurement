import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Fetch all data from different tables
    const [
      users,
      ppmp,
      officeHeadPPMP,
      purchaseRequests,
      purchaseRequestItems,
      quotations,
      quotationItems,
      supplierQuotations,
      supplierQuotationItems,
      purchaseOrders,
      purchaseOrderItems
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.pPMP.findMany(),
      prisma.officeHeadPPMP.findMany(),
      prisma.purchaseRequest.findMany(),
      prisma.purchaseRequestItem.findMany(),
      prisma.quotation.findMany(),
      prisma.quotationItem.findMany(),
      prisma.supplierQuotation.findMany(),
      prisma.supplierQuotationItem.findMany(),
      prisma.purchaseOrder.findMany(),
      prisma.purchaseOrderItem.findMany(),
    ])

    const backupData = {
      users,
      ppmp,
      officeHeadPPMP,
      purchaseRequests,
      purchaseRequestItems,
      quotations,
      quotationItems,
      supplierQuotations,
      supplierQuotationItems,
      purchaseOrders,
      purchaseOrderItems,
      backupDate: new Date().toISOString(),
    }

    return NextResponse.json(backupData)
  } catch (error) {
    console.error("Backup error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}