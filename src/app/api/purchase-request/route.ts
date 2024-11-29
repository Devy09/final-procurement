import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

async function generatePrNumber(year: number): Promise<string> {
  return await prisma.$transaction(async (transaction) => {
    try {
      let sequence = await transaction.purchaseRequestSequence.findUnique({
        where: { year },
      });

      if (!sequence) {
        sequence = await transaction.purchaseRequestSequence.create({
          data: { year, lastNumber: 1 },
        });
      } else {
        sequence = await transaction.purchaseRequestSequence.update({
          where: { id: sequence.id },
          data: { lastNumber: { increment: 1 } },
        });
      }

      const nextNumber = sequence.lastNumber;
      return `${nextNumber.toString().padStart(3, '0')}-${year.toString().slice(-2)}`;
    } catch (error) {
      console.error('Error generating PR number:', error);
      throw new Error('Failed to generate PR number');
    }
  });
}

// SUBMITTING FORM

export async function POST(req: NextRequest) {
  let requestData;

  try {
    requestData = await req.json();
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { purpose, items, procurementMode } = requestData;
  const year = new Date().getFullYear();

  if (!purpose || !items) {
    console.error('Missing required fields:', { purpose, items });
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const authData = await auth();
  const userId = authData.userId;
  console.log('Authenticated User ID:', userId);

  if (!userId) {
    console.error('User authentication failed');
    return NextResponse.json({ error: 'User authentication failed' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    console.error(`User with Clerk ID ${userId} not found in the database`);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  console.log('Fetched user:', user);

  let prno;
  try {
    prno = await generatePrNumber(year);
  } catch (error) {
    console.error('Error generating purchase request number:', error);
    return NextResponse.json({ error: 'Failed to generate purchase request number' }, { status: 500 });
  }

  const overallTotal = items.reduce((total: number, item: any) => {
    if (!item.quantity || !item.unitCost) {
      console.error('Invalid item data:', item);
      throw new Error('Invalid item data');
    }
    return total + item.quantity * item.unitCost;
  }, 0);

  try {
    const purchaseRequest = await prisma.purchaseRequest.create({
      data: {
        prno,
        department: user.department || '',
        section: user.section || '',
        saino: user.saino || '',
        alobsno: user.alobsno || '',
        purpose,
        overallTotal,
        procurementMode,
        createdById: user.id,
        items: {
          create: items.map((item: any, index: number) => ({
            itemNo: index + 1,
            quantity: item.quantity,
            unit: item.unit,
            description: item.description,
            stockNo: item.stockNo,
            unitCost: item.unitCost,
            totalCost: item.quantity * item.unitCost,
          })),
        },
      },
      include: { items: true },
    });

    console.log('Purchase request created successfully:', purchaseRequest);
    return NextResponse.json({
      message: 'Purchase request created successfully',
      purchaseRequest,
    });
  } catch (error) {
    console.error('Error creating purchase request:', error);
    return NextResponse.json({ error: 'Failed to create purchase request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      return NextResponse.json({ error: "User authentication failed" }, { status: 401 });
    }

    const purchaseRequests = await prisma.purchaseRequest.findMany({
      select: {
        id: true,
        prno: true,
        department: true,
        section: true,
        date: true,
        procurementMode: true,
        status: true,
      },
      orderBy: {
        date: "asc",
      },
    });
    return NextResponse.json(purchaseRequests);
  } catch (error) {
    console.error("Error fetching purchase requests:", error);
    return NextResponse.json({ error: "Failed to fetch purchase requests" }, { status: 500 });
  }
}