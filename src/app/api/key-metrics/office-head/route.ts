import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { section: true }
    });

    if (!user || !user.section) {
      return NextResponse.json({ error: "User section not found" }, { status: 404 });
    }

    const { section } = user;

    // Purchase Order Total
    const purchaseOrderCount = await prisma.purchaseOrder.count({
      where: { section: section }
    });

    // Purchase Request Total
    const purchaseRequestCount = await prisma.purchaseRequest.count({
      where: {
        section: section
      }
    });

    // Purchase Request Status
    const pendingPurchaseRequestCount = await prisma.purchaseRequest.count({
      where: {
        section: section,
        status: "pending"
      }
    });
    const approvedPurchaseRequestCount = await prisma.purchaseRequest.count({
      where: {
        section: section,
        status: "approved"
      }
    });

    // Purchase Order Status
    const pendingPurchaseOrderCount = await prisma.purchaseOrder.count({
      where: { 
        section: section,
        status: "pending" 
      }
    });
    const approvedPurchaseOrderCount = await prisma.purchaseOrder.count({
      where: { 
        section: section,
        status: "approved" 
      }
    });

    // PPMP Items Total
    const ppmpItemsCount = await prisma.officeHeadPPMP.count({
      where: {
        user: {
          section: section
        }
      }
    });

    // Purchase Request Status
    const rejectedPurchaseRequestCount = await prisma.purchaseRequest.count({
      where: {
        section: section,
        status: "rejected"
      }
    });

    // Purchase Order Spending Data
    const spendingData = await prisma.purchaseOrder.groupBy({
      by: ["date"],
      _sum: { totalAmount: true },
      where: {
        section: section
      },
      orderBy: { date: "asc" },
    });

    // Format spending data
    const formattedData = spendingData.map((entry) => ({
      month: entry.date ? new Date(entry.date).toLocaleString("en-US", { month: "short" }) : "N/A",
      totalExpenses: entry._sum.totalAmount || 0,
      date: entry.date
    }));

    return NextResponse.json({
      purchaseOrderCount,
      purchaseRequestCount,
      ppmpItemsCount,
      rejectedPurchaseRequestCount,
      spendingData: formattedData,
      pendingPurchaseRequestCount,
      approvedPurchaseRequestCount,
      pendingPurchaseOrderCount,
      approvedPurchaseOrderCount
    });
  } catch (error) {
    console.error("Error fetching office head metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}