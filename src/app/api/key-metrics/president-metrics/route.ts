import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      select: { section: true },
    });

    if (!user || !user.section) {
      return NextResponse.json({ error: "User section not found" }, { status: 404 });
    }

    // Fetch purchase order count filtered by section
    const purchaseOrderCount = await prisma.purchaseOrder.count();

    const purchaseRequestCount = await prisma.purchaseRequest.count();
    // Count pending and approved purchase requests
    const pendingPurchaseRequestCount = await prisma.purchaseRequest.count({
      where: { status: "pending" }
    });
    const approvedPurchaseRequestCount = await prisma.purchaseRequest.count({
      where: { status: "approved" }
    });

    // Count pending and approved purchase orders
    const pendingPurchaseOrderCount = await prisma.purchaseOrder.count({
      where: { status: "pending" }
    });
    const approvedPurchaseOrderCount = await prisma.purchaseOrder.count({
      where: { status: "approved" }
    });

    // Get count of office quotations
    const officeQuotationsCount = await prisma.quotation.count();

    // Get count of rejected purchase requests
    const rejectedPurchaseRequestCount = await prisma.purchaseRequest.count({
      where: { status: "rejected" }
    });

    // Get spending data for purchase requests
    const spendingData = await prisma.purchaseRequest.groupBy({
      by: ["date"],
      _sum: { overallTotal: true },
      orderBy: { date: "asc" },
    });

    // Format the data to ensure it's properly structured
    const formattedData = spendingData.map((entry) => ({
      month: entry.date ? new Date(entry.date).toLocaleString("en-US", { month: "short" }) : "N/A",
      totalExpenses: entry._sum.overallTotal || 0,
      date: entry.date
    }));

    return NextResponse.json({
      purchaseOrderCount,
      purchaseRequestCount,
      officeQuotationsCount,
      rejectedPurchaseRequestCount,
      spendingData: formattedData,
      pendingPurchaseRequestCount,
      approvedPurchaseRequestCount,
      pendingPurchaseOrderCount,
      approvedPurchaseOrderCount
    });
  } catch (error) {
    console.error("Error fetching officer metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}