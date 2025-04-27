import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userProfile = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, section: true }
        });

        if (!userProfile?.section) {
            return NextResponse.json({ error: "User section not found" }, { status: 400 });
        }

        // Get PPMP items for the user's section
        const ppmpItems = await prisma.officeHeadPPMP.findMany({
            where: {
                user: {
                    section: userProfile.section
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        section: true
                    }
                }
            }
        });
        
        return NextResponse.json(ppmpItems, { status: 200 });
    } catch (error) {
        console.error("Error fetching PPMP items:", error);
        return NextResponse.json({ error: "Failed to fetch PPMP items." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { ppmp_item, unit_cost, ppmp_category, quantity } = body;

        const userProfile = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, section: true }
        });

        if (!userProfile?.section) {
            return NextResponse.json({ error: "User section not found" }, { status: 400 });
        }

        const createdItem = await prisma.officeHeadPPMP.create({
            data: {
                ppmp_item,
                unit_cost: parseFloat(unit_cost),
                ppmp_category,
                quantity: parseFloat(quantity),
                userId: userProfile.id
            }
        });

        return NextResponse.json(createdItem, { status: 201 });
    } catch (error) {
        console.error("Error creating PPMP item:", error);
        return NextResponse.json({ error: "Failed to create PPMP item." }, { status: 500 });
    }
}
