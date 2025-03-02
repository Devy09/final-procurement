import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust based on your setup

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const report = await prisma.report.create({
        data: {
          totalSpend: parseFloat(body.totalSpend),
          purchaseRequestCount: body.purchaseRequestCount,
          officeQuotationsCount: body.officeQuotationsCount,
          supplierQuotationsCount: body.supplierQuotationsCount,
          period: body.period || "thisMonth",
        },
      });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error saving report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
