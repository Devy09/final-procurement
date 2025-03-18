import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const headersList = headers();
    await prisma.$connect(); // Ensure fresh connection

    const quotations = await prisma.quotation.findMany({
      select: {
        id: true,
        prno: true,
        department: true,
        section: true,
        date: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    await prisma.$disconnect(); // Close connection after use

    const response = NextResponse.json(quotations);
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  } catch (error) {
    console.error('Error fetching quotations:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}