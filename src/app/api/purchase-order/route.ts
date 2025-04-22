import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prno, supplierName, items, totalAmount, date, section } = body;

    // Validate required fields
    if (!prno || !supplierName || !items || items.length === 0 || !section) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create purchase order with its items
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        prno,
        supplierName,
        totalAmount,
        date,
        section,
        status: 'pending', // Set initial status
        items: {
          create: items.map((item: any) => ({
            itemNumber: item.itemNumber.toString(),
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            unitCost: item.unitCost,
            totalCost: item.totalCost
          }))
        }
      },
      include: {
        items: true
      }
    });

    // Update PR status
    await prisma.purchaseRequest.update({
      where: { prno },
      data: { status: 'approved' }
    });

    return NextResponse.json(purchaseOrder);

  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json(
      { error: "Failed to create purchase order" },
      { status: 500 }
    );
  }
}

// Add GET endpoint to fetch POs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prno = searchParams.get('prno');
    
    const where = prno ? { prno } : {};
    
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where,
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(purchaseOrders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json(
      { error: "Failed to fetch purchase orders" },
      { status: 500 }
    );
  }
}
