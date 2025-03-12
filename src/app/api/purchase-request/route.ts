import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { promises as fs } from 'fs';
import path from 'path';

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
  try {
    // Parse form data
    const formData = await req.formData();

    // Extract files
    const certification = formData.get('certification') as File;
    const letter = formData.get('letter') as File;
    const proposal = formData.get('proposal') as File;

    // Validate required files
    if (!certification || !letter || !proposal) {
      return NextResponse.json(
        { error: 'All files (certification, letter, proposal) are required' },
        { status: 400 }
      );
    }

    // Extract form fields
    const purpose = formData.get('purpose') as string;
    const items = JSON.parse(formData.get('items') as string);
    const procurementMode = formData.get('procurementMode') as string;

    // Validate required fields
    if (!purpose || !items?.length || !procurementMode) {
      return NextResponse.json(
        { error: 'Missing required fields (purpose, items, procurementMode)' },
        { status: 400 }
      );
    }

    // Authentication and user validation
    const authData = await auth();
    const userId = authData.userId;
    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication failed' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate PR number
    const year = new Date().getFullYear();
    const prno = await generatePrNumber(year);

    // Calculate total
    const overallTotal = items.reduce((total: number, item: any) => {
      return total + (item.quantity || 0) * (item.unitCost || 0);
    }, 0);

    // Save files to disk
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const saveFile = async (file: File) => {
      const buffer = await file.arrayBuffer();
      const filename = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, Buffer.from(buffer));
      return filename;
    };

    const certificationFile = await saveFile(certification);
    const letterFile = await saveFile(letter);
    const proposalFile = await saveFile(proposal);

    // Create purchase request
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
        certificationFile,
        letterFile,
        proposalFile,
        createdById: user.id,
        items: {
          create: items.map((item: any, index: number) => ({
            itemNo: index + 1,
            quantity: item.quantity,
            unit: item.unit,
            description: item.description,
            stockNo: item.stockNo,
            unitCost: item.unitCost,
            totalCost: (item.quantity || 0) * (item.unitCost || 0),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      message: 'Purchase request created successfully',
      purchaseRequest,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
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
        date: "desc",
      },
    });
    return NextResponse.json(purchaseRequests);
  } catch (error) {
    console.error("Error fetching purchase requests:", error);
    return NextResponse.json({ error: "Failed to fetch purchase requests" }, { status: 500 });
  }
}