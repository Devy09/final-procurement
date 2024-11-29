import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotation = await prisma.supplierQuotation.findUnique({
      where: { id: params.id },
      include: {
        items: true,
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { error: "Supplier quotation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(quotation);
  } catch (error) {
    console.error("Error fetching supplier quotation:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier quotation" },
      { status: 500 }
    );
  }
} 