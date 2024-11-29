import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
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
    })

    return NextResponse.json(quotations)
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    )
  }
} 