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

    const { section } = user;

    // Fetch procurement metrics filtered by section
    const totalSpend = await prisma.purchaseRequest.aggregate({
      _sum: { overallTotal: true },
      where: { section },
    });

    const purchaseRequestCount = await prisma.purchaseRequest.count({
      where: { section },
    });

    // Get count of office quotations
    const officeQuotationsCount = await prisma.quotation.count();

    // Get count of supplier quotations
    const supplierQuotationsCount = await prisma.supplierQuotation.count();

    const spendingData = await prisma.purchaseRequest.groupBy({
      by: ["date"],
      _sum: { overallTotal: true },
      where: { section },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      totalSpend: totalSpend._sum.overallTotal || 0,
      purchaseRequestCount,
      officeQuotationsCount,
      supplierQuotationsCount,
      spendingData: spendingData.map((entry) => ({
        month: new Date(entry.date).toLocaleString("en-US", { month: "short" }),
        totalExpenses: entry._sum.overallTotal || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching officer metrics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}