import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const reports = await prisma.savedReport.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ data: reports });
}