import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function PUT(
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
        name: true,
        title: true,
        signatureUrl: true,
        designation: true
      }
    })

    if (!user || user.role !== 'PRESIDENT') {
      return NextResponse.json(
        { error: 'Unauthorized: Only president can approve' },
        { status: 403 }
      )
    }

    const id = params.id

    // Check if accountant has approved first
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id }
    })

    if (!purchaseOrder?.approvedByAccountant) {
      return NextResponse.json(
        { error: 'Accountant must approve first' },
        { status: 400 }
      )
    }

    const updatedPO = await prisma.purchaseOrder.update({
      where: {
        id: id,
      },
      data: {
        approvedByPresident: true,
        presidentName: user.name,
        presidentRole: user.role,
        presidentTitle: user.title,
        presidentSignatureUrl: user.signatureUrl,
        presidentDesignation: user.designation,
        approvedAtPresident: new Date(),
        status: 'approved', // Finally approved after president signs
      }
    })

    return NextResponse.json(updatedPO)
  } catch (error) {
    console.error('Error approving purchase order:', error)
    return NextResponse.json(
      { error: 'Failed to approve purchase order' },
      { status: 500 }
    )
  }
} 