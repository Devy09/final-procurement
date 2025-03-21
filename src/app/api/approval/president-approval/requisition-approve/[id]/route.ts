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

    // Get the current request with creator info for notification
    const currentRequest = await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        createdBy: true
      }
    });

    if (!currentRequest) {
      return NextResponse.json(
        { error: 'Purchase request not found' },
        { status: 404 }
      );
    }

    // Check if accountant has approved
    if (!currentRequest.approvedByAccountant) {
      return NextResponse.json(
        { error: 'Purchase request needs accountant approval first' },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.$transaction([
      // Update the purchase request
      prisma.purchaseRequest.update({
        where: { id },
        data: {
          approvedByPresident: true,
          approvedAtPresident: new Date(),
          presidentName: user.name,
          presidentRole: user.role,
          presidentTitle: user.title,
          presidentSignatureUrl: user.signatureUrl,
          presidentDesignation: user.designation,
          status: 'approved'
        },
      }),
      // Create notification for the request creator
      prisma.notification.create({
        data: {
          message: `Your purchase request (PR#: ${currentRequest.prno}) has been fully approved! Both Accountant and President have approved your request.`,
          type: 'UPDATE',
          section: currentRequest.section,
          userId: currentRequest.createdById,
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