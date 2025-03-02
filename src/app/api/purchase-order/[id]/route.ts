import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        prno: true,
        supplierName: true,
        totalAmount: true,
        date: true,
        status: true,
        items: {
          select: {
            id: true,
            itemNumber: true,
            quantity: true,
            unit: true,
            description: true,
            unitCost: true,
            totalCost: true,
          }
        },
        approvedByAccountant: true,
        accountantName: true,
        accountantTitle: true,
        accountantSignatureUrl: true,
        accountantDesignation: true,
        presidentName: true,
        presidentTitle: true,
        presidentSignatureUrl: true,
        presidentDesignation: true,
      },
    })

    if (!purchaseOrder) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(purchaseOrder)
  } catch (error) {
    console.error("API Error:", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 