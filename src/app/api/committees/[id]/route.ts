import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/committees/:id - Update a committee
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { committee_name, committee_title, committee_designation } = await request.json();
    
    const committee = await prisma.committee.update({
      where: { id: params.id },
      data: {
        committee_name,
        committee_title,
        committee_designation,
      },
    });

    return NextResponse.json(committee);
  } catch (error) {
    console.error("Error updating committee:", error);
    return NextResponse.json(
      { error: "Failed to update committee" },
      { status: 500 }
    );
  }
}

// DELETE /api/committees/:id - Delete a committee
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.committee.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Committee deleted successfully" });
  } catch (error) {
    console.error("Error deleting committee:", error);
    return NextResponse.json(
      { error: "Failed to delete committee" },
      { status: 500 }
    );
  }
}