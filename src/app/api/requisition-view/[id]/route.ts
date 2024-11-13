import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: true,
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    if (!purchaseRequest) {
      return new NextResponse("Not found", { status: 404 })
    }
    return NextResponse.json(purchaseRequest)
  } catch (error) {
    console.error('API Error:', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}