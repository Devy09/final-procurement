import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Mark this route as dynamic to avoid static rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Authenticate the user using Clerk
    const { userId } = await auth();

    // If the user is not authenticated, return a 401 Unauthorized response
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch all data from different tables concurrently using Promise.all
    const [
      users,
      ppmp,
      officeHeadPPMP,
      purchaseRequests,
      purchaseRequestItems,
      purchaseRequestSequence,
      quotations,
      quotationItems,
      supplierQuotations,
      supplierQuotationItems,
      purchaseOrders,
      purchaseOrderItems,
      abstracts,
      abstractItems
    ] = await Promise.all([
      prisma.user.findMany(),
      prisma.pPMP.findMany(),
      prisma.officeHeadPPMP.findMany(),
      prisma.purchaseRequest.findMany(),
      prisma.purchaseRequestItem.findMany(),
      prisma.purchaseRequestSequence.findMany(),
      prisma.quotation.findMany(),
      prisma.quotationItem.findMany(),
      prisma.supplierQuotation.findMany(),
      prisma.supplierQuotationItem.findMany(),
      prisma.purchaseOrder.findMany(),
      prisma.purchaseOrderItem.findMany(),
      prisma.abstract.findMany(),
      prisma.abstractItem.findMany()
    ]);

    // Prepare the backup data object
    const backupData = {
      users,
      ppmp,
      officeHeadPPMP,
      purchaseRequests,
      purchaseRequestItems,
      purchaseRequestSequence,
      quotations,
      quotationItems,
      supplierQuotations,
      supplierQuotationItems,
      purchaseOrders,
      purchaseOrderItems,
      abstracts,
      abstractItems,
      backupDate: new Date().toISOString(),
    };

    // Return the backup data as a JSON response
    return NextResponse.json(backupData);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.error("Backup error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}