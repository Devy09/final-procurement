import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/committees - Fetch all committees
export async function GET() {
  try {
    const committees = await prisma.committee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(committees);
  } catch (error) {
    console.error("Error fetching committees:", error);
    return NextResponse.json(
      { error: "Failed to fetch committees" },
      { status: 500 }
    );
  }
}

// POST /api/committees - Create a new committee
export async function POST(request: Request) {
  try {
    const { committee_name, committee_title, committee_designation } = await request.json();

    if (!committee_name || !committee_title || !committee_designation) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const committee = await prisma.committee.create({
      data: {
        committee_name,
        committee_title,
        committee_designation,
      },
    });

    return NextResponse.json(committee);
  } catch (error) {
    console.error("Error creating committee:", error);
    return NextResponse.json(
      { error: "Failed to create committee" },
      { status: 500 }
    );
  }
}