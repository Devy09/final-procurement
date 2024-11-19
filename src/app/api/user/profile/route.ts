import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received body:", body);

        const { clerkId, name, email, role, department, section, designation, saino, alobsno } = body;

        if (!clerkId || !email) {
            console.warn("Missing required fields: clerkId or email");
            return NextResponse.json({ error: "Missing required fields: clerkId and email." }, { status: 400 });
        }

        const user = await prisma.user.upsert({
            where: { clerkId },
            update: { name, email, role, department, section, designation, saino, alobsno },
            create: { clerkId, name, email, role, department, section, designation, saino, alobsno },
        });
        return NextResponse.json(user, { status: 201 });
    } catch (error: any) {
        console.error("Error saving user profile:", error);
        return NextResponse.json({ error: error.message || "Failed to save user profile." }, { status: 500 });
    }
}


