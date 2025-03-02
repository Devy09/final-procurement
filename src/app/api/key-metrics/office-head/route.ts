import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details from Prisma
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
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

    // Get count of pending purchase requests
    const pendingCount = await prisma.purchaseRequest.count({
      where: { section, status: "pending" },
    });

    // Get count of approved purchase requests
    const approvedCount = await prisma.purchaseRequest.count({
      where: { section, status: "approved" },
    });

    const spendingData = await prisma.purchaseRequest.groupBy({
      by: ["date"],
      _sum: { overallTotal: true },
      where: { section },
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
