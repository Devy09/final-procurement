import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Validation schemas
const baseItemSchema = z.object({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
})

const backupDataSchema = z.object({
  ppmp: z.array(z.object({
    id: z.string(),
    ppmp_item: z.string(),
    unit_cost: z.union([z.string(), z.number()]), // Handle both string and number
    ppmp_category: z.string(),
    createdAt: z.string(),
  })).optional(),
  
  officeHeadPPMP: z.array(z.object({
    id: z.string(),
    ppmp_item: z.string(),
    unit_cost: z.union([z.string(), z.number()]), // Allow both string and number
    ppmp_category: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(), // Make updatedAt optional
  })).optional(),
  
  purchaseRequests: z.array(z.object({
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
  })).optional(),
  
  purchaseRequestItems: z.array(z.object({
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
  })).optional(),

  backupDate: z.string(),
}).passthrough() // Allow additional fields in the backup data

// At the top of the file, add this type
type TableName = 'pPMP' | 'officeHeadPPMP' | 'purchaseRequest' | 'purchaseRequestItem'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log('Received backup data:', data)

    // Validate backup data structure
    try {
      backupDataSchema.parse(data)
    } catch (validationError) {
      console.error("Validation error details:", JSON.stringify(validationError, null, 2))
      if (validationError instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ 
            error: "Invalid backup file format", 
            details: validationError.errors 
          }), 
          { status: 400 }
        )
      }
      return new NextResponse("Invalid backup file format", { status: 400 })
    }

    // Validate backup date
    const backupDate = new Date(data.backupDate)
    const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    if (Date.now() - backupDate.getTime() > maxAge) {
      return new NextResponse("Backup file is too old (max 30 days)", { status: 400 })
    }

    // Start a transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Clear existing data in reverse dependency order
      await tx.purchaseOrderItem.deleteMany({})
      await tx.purchaseOrder.deleteMany({})
      await tx.supplierQuotationItem.deleteMany({})
      await tx.supplierQuotation.deleteMany({})
      await tx.quotationItem.deleteMany({})
      await tx.quotation.deleteMany({})
      await tx.purchaseRequestItem.deleteMany({})
      await tx.purchaseRequest.deleteMany({})
      await tx.officeHeadPPMP.deleteMany({})
      await tx.pPMP.deleteMany({})
      await tx.user.deleteMany({})

      // Restore data in correct dependency order
      if (data.users?.length) {
        await tx.user.createMany({
          data: data.users.map((item: Record<string, unknown>) => ({
            ...item,
            createdAt: new Date(item.createdAt as string),
            updatedAt: item.updatedAt ? new Date(item.updatedAt as string) : undefined,
            emailVerified: item.emailVerified ? new Date(item.emailVerified as string) : null,
          }))
        })
      }

      // Then restore other data
      const tableMap = {
        'pPMP': { model: tx.pPMP, dataKey: 'ppmp' as const },
        'officeHeadPPMP': { model: tx.officeHeadPPMP, dataKey: 'officeHeadPPMP' as const },
        'purchaseRequest': { model: tx.purchaseRequest, dataKey: 'purchaseRequests' as const },
        'purchaseRequestItem': { model: tx.purchaseRequestItem, dataKey: 'purchaseRequestItems' as const },
      } as const satisfies Record<TableName, { 
        model: any,
        dataKey: keyof typeof data 
      }>

      // Process tables in sequence
      for (const table of Object.keys(tableMap) as TableName[]) {
        const { model, dataKey } = tableMap[table]
        if (data[dataKey]?.length) {
          const cleanData = data[dataKey].filter((item: Record<string, unknown>) => 
            item && typeof item === 'object' && Object.values(item).every(v => v !== undefined)
          )
          
          if (cleanData.length > 0) {
            await (model.createMany as any)({ 
              data: cleanData.map((item: Record<string, unknown>) => ({
                ...item,
                createdAt: new Date(item.createdAt as string),
                ...(item.updatedAt ? { updatedAt: new Date(item.updatedAt as string) } : {}),
                // Convert string numbers to actual numbers for specific fields
                ...(item.unit_cost ? { unit_cost: Number(item.unit_cost) } : {}),
                ...(item.totalCost ? { totalCost: Number(item.totalCost) } : {}),
                ...(item.unitCost ? { unitCost: Number(item.unitCost) } : {}),
                ...(item.overallTotal ? { overallTotal: Number(item.overallTotal) } : {})
              }))
            })
          }
        }
      }
    })

    return NextResponse.json({ message: "Restore completed successfully" })
  } catch (error) {
    console.error("Restore error:", error)
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Server Error", 
      { status: 500 }
    )
  }
} 