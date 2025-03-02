import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quotation = await prisma.quotation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        purchaseRequest: true,
        items: true,
      }
    });

    if (!quotation) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: quotation.id,
      prno: quotation.prno,
      department: quotation.department,
      section: quotation.section,
      date: quotation.date,
      items: quotation.items,
      presidentName: quotation.purchaseRequest.presidentName,
      presidentTitle: quotation.purchaseRequest.presidentTitle,
      presidentSignatureUrl: quotation.purchaseRequest.presidentSignatureUrl,
      presidentDesignation: quotation.purchaseRequest.presidentDesignation,
    });

  } catch (error) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotation' },
      { status: 500 }
    );
  }
} 