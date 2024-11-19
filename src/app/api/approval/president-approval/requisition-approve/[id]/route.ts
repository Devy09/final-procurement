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

    if (!user || user.role !== 'PRESIDENT') {
      return NextResponse.json(
        { error: 'Unauthorized: Only president can approve' },
        { status: 403 }
      )
    }

    const id = params.id

    // First, get the current request to check other approvals
    const currentRequest = await prisma.purchaseRequest.findUnique({
      where: { id },
    })

    const updatedRequest = await prisma.purchaseRequest.update({
      where: {
        id: id,
      },
      data: {
        approvedByPresident: true,
        approvedAtPresident: new Date(),
        presidentName: user.name,
        presidentRole: user.role,
        // Update status to approved only if accountant has also approved
        ...(currentRequest?.approvedByAccountant && {
          status: 'approved'
        }),
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