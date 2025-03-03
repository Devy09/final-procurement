import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch procurement metrics for all sections (or a default section)
    const totalSpend = await prisma.purchaseRequest.aggregate({
      _sum: { overallTotal: true },
    });

    const purchaseRequestCount = await prisma.purchaseRequest.count();

    // Get count of pending purchase requests
    const pendingCount = await prisma.purchaseRequest.count({
      where: { status: "pending" },
    });

    // Get count of approved purchase requests
    const approvedCount = await prisma.purchaseRequest.count({
      where: { status: "approved" },
    });

    const spendingData = await prisma.purchaseRequest.groupBy({
      by: ["date"],
      _sum: { overallTotal: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      totalSpend: totalSpend._sum.overallTotal || 0,
      purchaseRequestCount,
      pendingCount,
      approvedCount,
      spendingData: spendingData.map((entry) => ({
        month: new Date(entry.date).toLocaleString("en-US", { month: "short" }),
        totalExpenses: entry._sum.overallTotal || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching procurement metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}