import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch procurement metrics for purchase orders
    const totalSpend = await prisma.purchaseOrder.aggregate({
      _sum: { totalAmount: true },
    });

    const purchaseOrderCount = await prisma.purchaseOrder.count();

    // Get count of pending purchase orders
    const pendingCount = await prisma.purchaseOrder.count({
      where: { status: "pending" },
    });

    // Get count of approved purchase orders
    const approvedCount = await prisma.purchaseOrder.count({
      where: { status: "approved" },
    });

    const spendingData = await prisma.purchaseOrder.groupBy({
      by: ["date"],
      _sum: { totalAmount: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      totalSpend: totalSpend._sum.totalAmount || 0,
      purchaseOrderCount,
      pendingCount,
      approvedCount,
      spendingData: spendingData.map((entry) => ({
        month: new Date(entry.date).toLocaleString("en-US", { month: "short" }),
        totalExpenses: entry._sum.totalAmount || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching procurement metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}