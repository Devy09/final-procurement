import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supplierName, prno, items } = body

    // Create the supplier quotation with items
    const supplierQuotation = await prisma.supplierQuotation.create({
      data: {
        supplierName,
        prno,
        date: new Date(),
        items: {
          create: items.map((item: any) => ({
            itemNumber: item.itemNo.toString(),
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitCost: item.unitCost || 0,
            totalCost: (item.unitCost || 0) * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({
      message: "Supplier quotation created successfully",
      data: supplierQuotation,
    })
  } catch (error) {
    console.error("Error creating supplier quotation:", error)
    return NextResponse.json(
      { error: "Failed to create supplier quotation" },
      { status: 500 }
    )
  }
}

// Optional: Add GET endpoint to fetch supplier quotations
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const prno = searchParams.get("prno")

    const query = {
      include: {
        items: {
          select: {
            itemNumber: true,
            description: true,
            quantity: true,
            unit: true,
            unitCost: true,
            totalCost: true,
          }
        }
      },
      ...(prno && { where: { prno } })
    }
    console.log(query);
    const quotations = await prisma.supplierQuotation.findMany(query)
    return NextResponse.json(quotations)
  } catch (error) {
    console.error("Error fetching supplier quotations:", error)
    return NextResponse.json(
      { error: "Failed to fetch supplier quotations" },
      { status: 500 }
    )
  }
}