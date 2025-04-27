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

    if (!user || user.role !== 'ACCOUNTANT') {
      return NextResponse.json(
        { error: 'Unauthorized: Only accountants can approve' },
        { status: 403 }
      )
    }

    const id = params.id

    // Get the purchase request with creator info for notification
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        createdBy: true
      }
    });

    if (!purchaseRequest) {
      return NextResponse.json(
        { error: 'Purchase request not found' },
        { status: 404 }
      );
    }

    const updatedRequest = await prisma.$transaction([
      // Update the purchase request
      prisma.purchaseRequest.update({
        where: { id },
        data: {
          approvedByAccountant: true,
          accountantStatus: "approved", 
          status: "pending", 
          accountantName: user.name,
          accountantRole: user.role,
          accountantTitle: user.title,
          accountantSignatureUrl: user.signatureUrl,
          accountantDesignation: user.designation,
          approvedAtAccountant: new Date(),
        },
      }),
      // Create notification for the request creator
      prisma.notification.create({
        data: {
          message: `Your purchase request (PR#: ${purchaseRequest.prno}) has been approved by the Accountant.`,
          type: 'UPDATE',
          section: purchaseRequest.section,
          userId: purchaseRequest.createdById,
          createdById: user.id
        }
      })
    ]);

    return NextResponse.json(updatedRequest[0])
  } catch (error) {
    console.error('Error approving purchase request:', error)
    return NextResponse.json(
      { error: 'Failed to approve purchase request' },
      { status: 500 }
    )
  }
} 