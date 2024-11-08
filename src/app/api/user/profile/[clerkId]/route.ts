import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { clerkId: string } }) {
    const { clerkId } = params;
    try {
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return NextResponse.json({
                clerkId,
                name: null,
                email: null,
                department: "",
                section: "",
                designation: "",
                saino: "",
                alobsno: "",
            });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Failed to fetch user profile." }, { status: 500 });
    }
}
