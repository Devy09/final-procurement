import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { unitCost, totalCost } = body

    const updatedItem = await prisma.quotationItem.update({
      where: {
        id: params.id,
      },
      data: {
        unitCost,
        totalCost,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating quotation item:', error)
    return NextResponse.json(
      { error: 'Failed to update quotation item' },
      { status: 500 }
    )
  }
} 