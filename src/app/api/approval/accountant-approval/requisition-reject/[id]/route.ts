import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { reason } = await request.json();
    if (!reason) {
      return new NextResponse("Reason is required", { status: 400 });
    }

    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: { id: params.id },
      select: {
        approvedByAccountant: true,
        status: true
      }
    });

    if (!purchaseRequest) {
      return new NextResponse("Purchase request not found", { status: 404 });
    }

    if (purchaseRequest.approvedByAccountant) {
      return new NextResponse("Request has already been approved", { status: 400 });
    }

    if (purchaseRequest.status === "rejected") {
      return new NextResponse("Request has already been rejected", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        name: true,
        title: true,
        designation: true,
        signatureUrl: true
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await prisma.purchaseRequest.update({
      where: { id: params.id },
      data: {
        status: "rejected",
        rejectedReason: reason,
        approvedByAccountant: false,
        accountantName: user.name,
        accountantTitle: user.title,
        accountantDesignation: user.designation,
        accountantSignatureUrl: user.signatureUrl,
        approvedAtAccountant: new Date()
      }
    });

    return new NextResponse(JSON.stringify({ message: "Request rejected successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error rejecting purchase request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}