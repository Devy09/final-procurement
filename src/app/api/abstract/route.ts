import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    const abstract = await prisma.abstract.create({
      data: {
        prno: data.prno,
        requestDate: new Date(data.requestDate),
        overallTotal: data.overallTotal,
        date: new Date(data.date),
        winningBidder: data.winningBidder,
        suppliers: data.suppliers,
        items: {
          create: data.items.map((item: any) => ({
            itemNo: item.itemNo,
            description: item.description,
            qty: item.qty,
            unit: item.unit,
            bids: item.bids
          }))
        }
      }
    });

    return NextResponse.json({ 
      message: "Abstract created successfully",
      data: abstract 
    });
  } catch (error) {
    console.error("Error creating abstract:", error);
    return NextResponse.json(
      { error: "Failed to create abstract" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const abstracts = await prisma.abstract.findMany({
      include: {
        items: true,
        purchaseRequest: {
          select: {
            department: true,
            section: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Convert Decimal to string for JSON serialization
    const formattedAbstracts = abstracts.map(abstract => ({
      ...abstract,
      overallTotal: abstract.overallTotal.toString(),
      items: abstract.items.map(item => ({
        ...item,
        bids: typeof item.bids === 'string' ? JSON.parse(item.bids) : item.bids
      }))
    }))

    return NextResponse.json(formattedAbstracts, {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error("Error fetching abstracts:", error)
    return NextResponse.json(
      { error: "Failed to fetch abstracts" },
      { status: 500 }
    )
  }
}