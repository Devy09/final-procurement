import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // ✅ Use `params` as expected in Next.js 14
) {
  try {
    const { userId } = await auth();
    const id = params.id; // ✅ Access `id` directly from `params`

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        role: true,
        name: true,
        title: true,
        signatureUrl: true,
        designation: true,
      },
    });

    if (!user || user.role !== "ACCOUNTANT") {
      return NextResponse.json(
        { error: "Unauthorized: Only accountants can approve" },
        { status: 403 }
      );
    }

    const updatedPO = await prisma.purchaseOrder.update({
      where: { id }, // ✅ Use `id` directly
      data: {
        approvedByAccountant: true,
        approvedAtAccountant: new Date(),
        accountantName: user.name,
        accountantRole: user.role,
        accountantTitle: user.title,
        accountantSignatureUrl: user.signatureUrl,
        accountantDesignation: user.designation,
        status: "pending",
      },
    });

    return NextResponse.json(updatedPO);
  } catch (error) {
    console.error("Error approving purchase order:", error);
    return NextResponse.json(
      { error: "Failed to approve purchase order" },
      { status: 500 }
    );
  }
}