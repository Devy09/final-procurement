import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const backupDataSchema = z
  .object({
    ppmp: z
      .array(
        z.object({
          id: z.string(),
          ppmp_item: z.string(),
          unit_cost: z.union([z.string(), z.number()]),
          ppmp_category: z.string(),
          createdAt: z.string(),
        })
      )
      .optional(),
    officeHeadPPMP: z
      .array(
        z.object({
          id: z.string(),
          ppmp_item: z.string(),
          unit_cost: z.union([z.string(), z.number()]),
          ppmp_category: z.string(),
          createdAt: z.string(),
          updatedAt: z.string().optional(),
          userId: z.string(),
        })
      )
      .optional(),
    purchaseRequests: z
      .array(
        z.object({
          id: z.string(),
          prno: z.string(),
          department: z.string(),
          section: z.string(),
          purpose: z.string(),
          overallTotal: z.union([z.string(), z.number()]),
          procurementMode: z.string(),
          status: z.string(),
          createdById: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    purchaseRequestItems: z
      .array(
        z.object({
          id: z.string(),
          itemNo: z.number(),
          quantity: z.number(),
          unit: z.string(),
          description: z.string(),
          unitCost: z.union([z.string(), z.number()]),
          totalCost: z.union([z.string(), z.number()]),
          purchaseRequestId: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    purchaseRequestSequence: z
      .array(
        z.object({
          id: z.string(),
          year: z.number(),
          lastNumber: z.number(),
          createdAt: z.string().optional(),
          updatedAt: z.string().optional(),
        })
      )
      .optional(),
    quotations: z
      .array(
        z.object({
          id: z.string(),
          prno: z.string(),
          department: z.string(),
          section: z.string(),
          date: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    quotationItems: z
      .array(
        z.object({
          id: z.string(),
          itemNo: z.number(),
          quantity: z.number(),
          unit: z.string(),
          description: z.string(),
          unitCost: z.union([z.string(), z.number()]),
          totalCost: z.union([z.string(), z.number()]),
          quotationId: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    supplierQuotations: z
      .array(
        z.object({
          id: z.string(),
          supplierName: z.string(),
          prno: z.string(),
          department: z.string(),
          section: z.string(),
          date: z.string(),
          requestDate: z.string(),
          overallTotal: z.union([z.string(), z.number()]),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    supplierQuotationItems: z
      .array(
        z.object({
          id: z.string(),
          supplierQuotationId: z.string(),
          itemNumber: z.string(),
          description: z.string(),
          quantity: z.number(),
          unit: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    purchaseOrders: z
      .array(
        z.object({
          id: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    purchaseOrderItems: z
      .array(
        z.object({
          id: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    abstracts: z
      .array(
        z.object({
          id: z.string(),
          prno: z.string(),
          requestDate: z.string(),
          overallTotal: z.union([z.string(), z.number()]),
          date: z.string(),
          winningBidder: z.string().optional(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    abstractItems: z
      .array(
        z.object({
          id: z.string(),
          abstractId: z.string(),
          itemNo: z.number(),
          description: z.string(),
          qty: z.number(),
          unit: z.string(),
          bids: z.any(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    notifications: z
      .array(
        z.object({
          id: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
      .optional(),
    backupDate: z.string(),
  })
  .passthrough();

type TableName = 
  | "pPMP" 
  | "officeHeadPPMP" 
  | "purchaseRequest" 
  | "purchaseRequestItem"
  | "purchaseRequestSequence"
  | "quotation"
  | "quotationItem"
  | "supplierQuotation"
  | "supplierQuotationItem"
  | "purchaseOrder"
  | "purchaseOrderItem"
  | "abstract"
  | "abstractItem"

type BackupDataItem = Record<string, unknown>;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("Received backup data:", data);

    // Validate backup data structure
    try {
      backupDataSchema.parse(data);
    } catch (validationError) {
      console.error("Validation error details:", JSON.stringify(validationError, null, 2));
      return new NextResponse(
        JSON.stringify({ error: "Invalid backup file format", details: validationError }),
        { status: 400 }
      );
    }

    // Validate backup date
    const backupDate = new Date(data.backupDate);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (Date.now() - backupDate.getTime() > maxAge) {
      return new NextResponse("Backup file is too old (max 30 days)", { status: 400 });
    }

    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete existing data in all tables
      await Promise.all([
        tx.purchaseOrderItem.deleteMany({}),
        tx.purchaseOrder.deleteMany({}),
        tx.supplierQuotationItem.deleteMany({}),
        tx.supplierQuotation.deleteMany({}),
        tx.quotationItem.deleteMany({}),
        tx.quotation.deleteMany({}),
        tx.purchaseRequestItem.deleteMany({}),
        tx.purchaseRequest.deleteMany({}),
        tx.officeHeadPPMP.deleteMany({}),
        tx.pPMP.deleteMany({}),
        tx.user.deleteMany({}),
        tx.abstractItem.deleteMany({}),
        tx.abstract.deleteMany({}),
        tx.notification.deleteMany({}),
        tx.purchaseRequestSequence.deleteMany({}),
      ]);

      if (data.users?.length) {
        await tx.user.createMany({
          data: data.users.map((item: BackupDataItem) => ({
            ...item,
            createdAt: new Date(item.createdAt as string),
            updatedAt: item.updatedAt ? new Date(item.updatedAt as string) : undefined,
            emailVerified: item.emailVerified ? new Date(item.emailVerified as string) : null,
          })),
        });
      }

      const tableMap: Record<TableName, { model: any; dataKey: keyof typeof data }> = {
        pPMP: { model: tx.pPMP, dataKey: "ppmp" },
        officeHeadPPMP: { model: tx.officeHeadPPMP, dataKey: "officeHeadPPMP" },
        purchaseRequest: { model: tx.purchaseRequest, dataKey: "purchaseRequests" },
        purchaseRequestItem: { model: tx.purchaseRequestItem, dataKey: "purchaseRequestItems" },
        purchaseRequestSequence: { model: tx.purchaseRequestSequence, dataKey: "purchaseRequestSequence" },
        quotation: { model: tx.quotation, dataKey: "quotations" },
        quotationItem: { model: tx.quotationItem, dataKey: "quotationItems" },
        supplierQuotation: { model: tx.supplierQuotation, dataKey: "supplierQuotations" },
        supplierQuotationItem: { model: tx.supplierQuotationItem, dataKey: "supplierQuotationItems" },
        purchaseOrder: { model: tx.purchaseOrder, dataKey: "purchaseOrders" },
        purchaseOrderItem: { model: tx.purchaseOrderItem, dataKey: "purchaseOrderItems" },
        abstract: { model: tx.abstract, dataKey: "abstracts" },
        abstractItem: { model: tx.abstractItem, dataKey: "abstractItems" },
      };

      // Process each table in order
      const tableOrder = [
        "user", // Process users first since they're referenced by other tables
        "pPMP",
        "officeHeadPPMP",
        "purchaseRequestSequence",
        "purchaseRequest",
        "purchaseRequestItem",
        "quotation",
        "quotationItem",
        "supplierQuotation",
        "supplierQuotationItem",
        "purchaseOrder",
        "purchaseOrderItem",
        "abstract",
        "abstractItem",
      ];

      for (const tableName of tableOrder) {
        const table = tableName as TableName;
        const { model, dataKey } = tableMap[table];
        if (data[dataKey]?.length) {
          const cleanData = data[dataKey].filter(
            (item: BackupDataItem) =>
              item && typeof item === "object" && Object.values(item).every((v) => v !== undefined)
          );

          if (cleanData.length > 0) {
            await model.createMany({
              data: cleanData.map((item: BackupDataItem) => ({
                ...item,
                createdAt: new Date(item.createdAt as string),
                ...(item.updatedAt ? { updatedAt: new Date(item.updatedAt as string) } : {}),
                ...(item.unit_cost ? { unit_cost: Number(item.unit_cost) } : {}),
                ...(item.totalCost ? { totalCost: Number(item.totalCost) } : {}),
                ...(item.unitCost ? { unitCost: Number(item.unitCost) } : {}),
                ...(item.overallTotal ? { overallTotal: Number(item.overallTotal) } : {}),
                ...(item.year ? { year: Number(item.year) } : {}),
                ...(item.lastNumber ? { lastNumber: Number(item.lastNumber) } : {}),
              })),
            });
          }
        }
      }
    });

    return NextResponse.json({ message: "Restore completed successfully" });
  } catch (error) {
    console.error("Restore error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error", { status: 500 }
    );
  }
}
