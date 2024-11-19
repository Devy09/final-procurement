import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const ppmpItems = await prisma.officeHeadPPMP.findMany({
            select: {
                id: true,
                ppmp_item: true,
                unit_cost: true,
            },
            orderBy: {
                ppmp_item: 'asc'
            }
        });
        
        return NextResponse.json(ppmpItems, { status: 200 });
    } catch (error) {
        console.error("Error fetching PPMP items for dropdown:", error);
        return NextResponse.json({ error: "Failed to fetch PPMP items." }, { status: 500 });
    }
} 