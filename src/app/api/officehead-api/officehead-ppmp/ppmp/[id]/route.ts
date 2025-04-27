import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const item = await prisma.officeHeadPPMP.findUnique({
            where: { id },
        });

        if (!item) {
            return NextResponse.json({ error: "Item not found." }, { status: 404 });
        }

        return NextResponse.json(item, { status: 200 });
    } catch (error) {
        console.error("Error fetching PPMP item:", error);
        return NextResponse.json({ error: "Failed to fetch PPMP item." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await req.json();
    const { ppmp_item, unit_cost, ppmp_category, quantity } = body;

    try {
        const updatedItem = await prisma.officeHeadPPMP.update({
            where: { id },
            data: { 
                ppmp_item, 
                unit_cost: parseFloat(unit_cost),
                ppmp_category,
                quantity: parseFloat(quantity)
            },
        });
        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error) {
        console.error("Error updating PPMP item:", error);
        return NextResponse.json({ error: "Failed to update PPMP item." }, { status: 500 });
    }
}

// Handler for DELETE requests
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.officeHeadPPMP.delete({
            where: { id },
        });
        return NextResponse.json({ message: "PPMP item deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting PPMP item:", error);
        return NextResponse.json({ error: "Failed to delete PPMP item." }, { status: 500 });
    }
}
