import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const ppmpItems = await prisma.pPMP.findMany();
        
        return NextResponse.json(ppmpItems, { status: 200 });
    } catch (error) {
        console.error("Error fetching PPMP items:", error);
        return NextResponse.json({ error: "Failed to fetch PPMP items." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { ppmp_item, unit_cost, ppmp_category } = body;

    if (!ppmp_item || !unit_cost || !ppmp_category) {
        return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    try {
        const newItem = await prisma.pPMP.create({
            data: { ppmp_item, unit_cost, ppmp_category },
        });
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        console.error("Error creating PPMP item:", error);
        return NextResponse.json({ error: "Failed to create PPMP item." }, { status: 500 });
    }
}
