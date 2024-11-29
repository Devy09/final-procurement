import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        id: true,
        role: true,
      }
    })

    if (!user || user.role !== 'PROCUREMENT_OFFICER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only procurement officers can create quotation requests' },
        { status: 403 }
      )
    }

    // Get the purchase request with its items
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: { 
        id: params.id 
      },
      include: {
        items: {
          select: {
            itemNo: true,
            quantity: true,
            unit: true,
            description: true,
          }
        }
      }
    })

    if (!purchaseRequest) {
      return NextResponse.json(
        { error: 'Purchase request not found' },
        { status: 404 }
      )
    }

    if (purchaseRequest.status !== 'approved') {
      return NextResponse.json(
        { error: 'Purchase request must be approved before creating quotation' },
        { status: 400 }
      )
    }

    // Create new quotation with selected fields only
    const newQuotation = await prisma.quotation.create({
      data: {
        prno: purchaseRequest.prno,
        department: purchaseRequest.department,
        section: purchaseRequest.section,
        items: {
          create: purchaseRequest.items.map(item => ({
            itemNo: item.itemNo,
            quantity: item.quantity,
            unit: item.unit,
            description: item.description,
          }))
        }
      },
      include: {
        items: true
      }
    })

    return NextResponse.json({ 
      message: 'Quotation request created successfully',
      quotation: newQuotation 
    })
  } catch (error) {
    console.error('Error creating quotation request:', error)
    return NextResponse.json(
      { error: 'Failed to create quotation request' },
      { status: 500 }
    )
  }
} 