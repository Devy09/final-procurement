import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { format } from 'date-fns';
import { auth } from "@clerk/nextjs/server";

interface ReportData {
  prno: string;
  requestDate: Date;
  overallTotal: number;
  date: Date;
  winningBidder: string;
  winningTotal: number | null;
  section: string;
  createdAt: Date;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        name: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { period } = body;

    if (!period) {
      return NextResponse.json({ error: "Period is required" }, { status: 400 });
    }

    // Get the date range based on period
    const endDate = new Date();
    let startDate: Date;
    let periodName: string;

    switch (period) {
      case "thisMonth":
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        periodName = format(endDate, "MMMM yyyy"); // Format as "April 2025"
        break;
      case "thisYear":
        startDate = new Date(endDate.getFullYear(), 0, 1);
        periodName = format(endDate, "yyyy"); // Format as "2025"
        break;
      default:
        return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    // Fetch abstract data with section
    const abstracts = await prisma.abstract.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        prno: true,
        requestDate: true,
        overallTotal: true,
        date: true,
        winningBidder: true,
        winningTotal: true,
        section: true,
        createdAt: true // Include createdAt field
      },
    });

    // Transform the data for the response
    const formattedAbstracts = abstracts.map(abstract => ({
      prno: abstract.prno,
      requestDate: format(abstract.requestDate, "PPP"),
      overallTotal: `₱${parseFloat(abstract.overallTotal.toString()).toLocaleString('en-PH')}`,
      date: format(abstract.date, "PPP"),
      winningBidder: abstract.winningBidder || "Not selected",
      winningTotal: abstract.winningTotal ? 
        `₱${parseFloat(abstract.winningTotal.toString()).toLocaleString('en-PH')}` : 
        "Not selected",
      section: abstract.section,
      createdAt: format(abstract.createdAt, "PPP")
    }));

    await prisma.savedReport.create({
      data: {
        title: `Procurement Report: ${periodName}`,
        period: periodName,
        data: formattedAbstracts,
        createdBy: user.name || "Anonymous User"
      }
    });

    return NextResponse.json({ data: formattedAbstracts }, { status: 200 });
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    )
  }
}
