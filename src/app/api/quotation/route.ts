import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  console.log('API Route Hit')

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
    console.log('Quotations:', quotations)

    // Add cache-control headers
    const response = NextResponse.json(quotations)
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    
    return response
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    )
  }
}