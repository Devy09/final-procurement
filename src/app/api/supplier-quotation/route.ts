import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { supplierName, prno, items } = body

    // Get the purchase request to get department and section
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: { prno },
      select: {
        department: true,
        section: true,
        date: true,
        overallTotal: true
      }
    })

    if (!purchaseRequest) {
      return NextResponse.json(
        { error: "Purchase request not found" },
        { status: 404 }
      )
    }
    
    const supplierQuotation = await prisma.supplierQuotation.create({
      data: {
        supplierName,
        prno,
        department: purchaseRequest.department,
        section: purchaseRequest.section,
        date: new Date(),
        requestDate: purchaseRequest.date,
        overallTotal: purchaseRequest.overallTotal,
        items: {
          create: items.map((item: any) => ({
            itemNumber: item.itemNo.toString(),
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitCost: parseFloat(String(item.unitCost || 0)),
            totalCost: parseFloat(String(item.unitCost || 0)) * item.quantity,
          })),
        },
      },
      include: {
        items: true,
        purchaseRequest: true,
      },
    })

    return new NextResponse(JSON.stringify({
      message: "Supplier quotation created successfully",
      data: supplierQuotation,
    }), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error("Error creating supplier quotation:", error)
    return NextResponse.json(
      { error: "Failed to create supplier quotation" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const prno = searchParams.get("prno")

    const quotations = await prisma.supplierQuotation.findMany({
      where: prno ? { prno } : undefined,
      include: {
        items: true,
        purchaseRequest: {
          select: {
            date: true,
            overallTotal: true,
            section: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return new NextResponse(JSON.stringify(quotations), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error("Error fetching supplier quotations:", error)
    return NextResponse.json(
      { error: "Failed to fetch supplier quotations" },
      { status: 500 }
    )
  }
}