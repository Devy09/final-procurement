import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user's ID from User model
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const ppmpItems = await prisma.officeHeadPPMP.findMany({
            where: {
                userId: user.id
            },
            select: {
                id: true,
                ppmp_item: true,
                unit_cost: true,
                quantity: true
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
