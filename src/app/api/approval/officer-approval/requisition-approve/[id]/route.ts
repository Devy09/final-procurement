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
      }
    })

    if (!user || user.role !== 'PROCUREMENT_OFFICER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only procurement officers can approve' },
        { status: 403 }
      )
    }

    const id = params.id

    const updatedRequest = await prisma.purchaseRequest.update({
      where: {
        id: id,
      },
      data: {
        approvedByProcurementOfficer: true,
        approvedAtProcurementOfficer: new Date(),
        procurementOfficerName: user.name,
        procurementOfficerRole: user.role,
        status: 'reviewing',
      },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error approving purchase request:', error)
    return NextResponse.json(
      { error: 'Failed to approve purchase request' },
      { status: 500 }
    )
  }
}
