import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getClerkUser } from '@/lib/clerk';

export async function GET() {
  try {
    const clerkUser = await getClerkUser();

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clerkUser = await getClerkUser();
    const { department, section, alobsNo, saiNo, role } = await request.json();

    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: { department, section, alobsNo, saiNo, role },
      create: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        fullName: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
        department,
        section,
        alobsNo,
        saiNo,
        role,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
