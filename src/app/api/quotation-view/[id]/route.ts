import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: {
        id: params.id,
      },
      include: {
        quotations: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!purchaseRequest) {
      return NextResponse.json(
        { error: 'Purchase request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...purchaseRequest,
      hasQuotation: purchaseRequest.quotations.length > 0,
    })

  } catch (error) {
    console.error('Error fetching purchase request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase request' },
      { status: 500 }
    )
  }
}