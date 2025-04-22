import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Define backup data types
interface BackupData {
  users?: Array<{
    id: string;
    clerkId?: string;
    email: string;
    name: string;
    image: string;
    role: string;
    department: string;
    section: string;
    title: string;
    designation: string;
    saino: string;
    alobsno: string;
    signatureUrl: string;
    createdAt: string;
    updatedAt: string | null;
    emailVerified: string | null;
  }>;
  ppmp?: Array<any>;
  officeHeadPPMP?: Array<any>;
  purchaseRequests?: Array<any>;
  purchaseRequestItems?: Array<any>;
  purchaseRequestSequence?: Array<any>;
  quotations?: Array<any>;
  quotationItems?: Array<any>;
  supplierQuotations?: Array<any>;
  supplierQuotationItems?: Array<any>;
  purchaseOrders?: Array<any>;
  purchaseOrderItems?: Array<any>;
  abstracts?: Array<any>;
  abstractItems?: Array<any>;
  backupDate: string;
}

// Mark this route as dynamic to avoid static rendering
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Authenticate the user using Clerk
    const { userId } = await auth();

    // If the user is not authenticated, return a 401 Unauthorized response
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch all necessary data with proper includes
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        image: true,
        role: true,
        department: true,
        section: true,
        title: true,
        designation: true,
        saino: true,
        alobsno: true,
        signatureUrl: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    const ppmp = await prisma.pPMP.findMany();
    const officeHeadPPMP = await prisma.officeHeadPPMP.findMany({
      include: {
        user: {
          select: {
            section: true
          }
        }
      }
    });
    const purchaseRequests = await prisma.purchaseRequest.findMany();
    const purchaseRequestItems = await prisma.purchaseRequestItem.findMany();
    const purchaseRequestSequence = await prisma.purchaseRequestSequence.findMany();
    const quotations = await prisma.quotation.findMany();
    const quotationItems = await prisma.quotationItem.findMany();
    const supplierQuotations = await prisma.supplierQuotation.findMany();
    const supplierQuotationItems = await prisma.supplierQuotationItem.findMany();
    const purchaseOrders = await prisma.purchaseOrder.findMany();
    const purchaseOrderItems = await prisma.purchaseOrderItem.findMany();
    const abstracts = await prisma.abstract.findMany();
    const abstractItems = await prisma.abstractItem.findMany();

    // Create backup data object
    const backupData = {
      users,
      ppmp,
      officeHeadPPMP,
      purchaseRequests,
      purchaseRequestItems,
      purchaseRequestSequence,
      quotations,
      quotationItems,
      supplierQuotations,
      supplierQuotationItems,
      purchaseOrders,
      purchaseOrderItems,
      abstracts,
      abstractItems,
      backupDate: new Date().toISOString(),
    };

    // Convert to JSON string
    const jsonData = JSON.stringify(backupData);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Return the blob as a response
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename=backup.json'
      }
    });
  } catch (error) {
    console.error("Backup error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create backup" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}