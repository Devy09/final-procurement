import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import zlib from "zlib";

const backupDataSchema = z.object({
  users: z.array(z.object({
    id: z.string(),
    clerkId: z.string(),
    email: z.string(),
    name: z.string(),
    image: z.string().nullable().optional(),
    role: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    section: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    designation: z.string().nullable().optional(),
    saino: z.string().nullable().optional(),
    alobsno: z.string().nullable().optional(),
    signatureUrl: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string().nullable().optional(),
    emailVerified: z.string().nullable().optional(),
  })),
  ppmp: z.array(z.any()),
  officeHeadPPMP: z.array(z.any()),
  purchaseRequests: z.array(z.any()),
  purchaseRequestItems: z.array(z.any()),
  purchaseRequestSequence: z.array(z.any()),
  quotations: z.array(z.any()),
  quotationItems: z.array(z.any()),
  supplierQuotations: z.array(z.any()),
  supplierQuotationItems: z.array(z.any()),
  purchaseOrders: z.array(z.any()),
  purchaseOrderItems: z.array(z.any()),
  abstracts: z.array(z.any()),
  abstractItems: z.array(z.any()),
  backupDate: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const action = formData.get('action') as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read and decompress the file
    const fileContent = await file.arrayBuffer();
    const backupData = await new Promise<any>((resolve, reject) => {
      // Try decompressing first
      zlib.gunzip(Buffer.from(fileContent), (err, result) => {
        if (err) {
          // If decompression fails, try parsing as JSON directly
          try {
            const text = Buffer.from(fileContent).toString();
            resolve(JSON.parse(text));
          } catch (parseError) {
            reject(new Error("Invalid backup file format"));
          }
        } else {
          try {
            resolve(JSON.parse(result.toString()));
          } catch (parseError) {
            reject(new Error("Invalid backup file format"));
          }
        }
      });
    });

    // Validate backup date
    const backupDateObj = new Date(backupData.backupDate);
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    if (Date.now() - backupDateObj.getTime() > maxAge) {
      return NextResponse.json(
        { error: "Backup file is too old (max 30 days)" },
        { status: 400 }
      );
    }

    // Validate backup data structure
    backupDataSchema.parse(backupData);

    if (action === "users") {
      return await restoreUsers(backupData);
    } else if (action === "all") {
      return await restoreAllData(backupData);
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be either 'users' or 'all'" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Restore error:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 
               typeof error === 'string' ? error : 
               'An unexpected error occurred during restore' 
      },
      { status: 500 }
    );
  }
}

async function restoreUsers(backupData: any) {
  try {
    // Delete existing users
    await prisma.user.deleteMany();

    // Create users with basic info
    const basicUsers = backupData.users.map((item: any) => ({
      clerkId: item.clerkId,
      email: item.email,
      name: item.name || item.email.split('@')[0],
      createdAt: new Date(item.createdAt),
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
      emailVerified: item.emailVerified ? new Date(item.emailVerified) : null,
    }));

    await prisma.user.createMany({
      data: basicUsers,
      skipDuplicates: true,
    });

    // Update user profiles
    const updatePromises = backupData.users.map(async (item: any) => {
      try {
        await prisma.user.update({
          where: { clerkId: item.clerkId },
          data: {
            department: item.department ?? undefined,
            section: item.section ?? undefined,
            title: item.title ?? undefined,
            designation: item.designation ?? undefined,
            saino: item.saino ?? undefined,
            alobsno: item.alobsno ?? undefined,
            signatureUrl: item.signatureUrl ?? undefined,
            updatedAt: new Date(item.updatedAt || item.createdAt)
          }
        });
      } catch (error: unknown) {
        console.error(`Error updating user ${item.clerkId}:`, error);
        throw error;
      }
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ 
      message: "Users restored successfully",
      usersRestored: backupData.users.length 
    });
  } catch (error: unknown) {
    console.error("Error in restoreUsers:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 
               typeof error === 'string' ? error : 
               'An unexpected error occurred during restore' 
      },
      { status: 500 }
    );
  }
}

async function restoreAllData(backupData: any) {
  try {
    console.log('Starting full data restoration...');
    
    // Delete all other data (except users)
    console.log('Deleting existing data...');
    await Promise.all([
      prisma.officeHeadPPMP.deleteMany(),
      prisma.purchaseRequest.deleteMany(),
      prisma.purchaseRequestItem.deleteMany(),
      prisma.purchaseRequestSequence.deleteMany(),
      prisma.pPMP.deleteMany(),
      prisma.quotation.deleteMany(),
      prisma.quotationItem.deleteMany(),
      prisma.supplierQuotation.deleteMany(),
      prisma.supplierQuotationItem.deleteMany(),
      prisma.purchaseOrder.deleteMany(),
      prisma.purchaseOrderItem.deleteMany(),
      prisma.abstract.deleteMany(),
      prisma.abstractItem.deleteMany(),
    ]);

    // Create a map of users by section for later reference
    const allUsers = await prisma.user.findMany({
      select: { 
        id: true, 
        section: true 
      }
    });
    // Create a map from section to database id
    const userMapBySection = new Map(allUsers.map(u => [u.section, u.id]));

    // Process tables in order of dependencies
    const tableOrder = [
      "users", // Process users first
      "pPMP", // No dependencies
      "officeHeadPPMP", // Depends on users
      "purchaseRequest", // Depends on users
      "purchaseRequestItem", // Depends on purchaseRequests
      "purchaseRequestSequence", // Depends on purchaseRequests
      "quotation", // Depends on purchaseRequests
      "quotationItem", // Depends on quotations
      "supplierQuotation", // Depends on purchaseRequests
      "supplierQuotationItem", // Depends on supplierQuotations
      "purchaseOrder", // Depends on purchaseRequests
      "purchaseOrderItem", // Depends on purchaseOrders
      "abstract", // Depends on purchaseRequests
      "abstractItem" // Depends on abstracts
    ];

    interface TableConfig {
      model: any;
      dataKey: keyof typeof backupData;
    }

    const tableMap: Record<string, TableConfig> = {
      users: { model: prisma.user, dataKey: "users" },
      pPMP: { model: prisma.pPMP, dataKey: "ppmp" },
      officeHeadPPMP: { model: prisma.officeHeadPPMP, dataKey: "officeHeadPPMP" },
      purchaseRequest: { model: prisma.purchaseRequest, dataKey: "purchaseRequests" },
      purchaseRequestItem: { model: prisma.purchaseRequestItem, dataKey: "purchaseRequestItems" },
      purchaseRequestSequence: { model: prisma.purchaseRequestSequence, dataKey: "purchaseRequestSequence" },
      quotation: { model: prisma.quotation, dataKey: "quotations" },
      quotationItem: { model: prisma.quotationItem, dataKey: "quotationItems" },
      supplierQuotation: { model: prisma.supplierQuotation, dataKey: "supplierQuotations" },
      supplierQuotationItem: { model: prisma.supplierQuotationItem, dataKey: "supplierQuotationItems" },
      purchaseOrder: { model: prisma.purchaseOrder, dataKey: "purchaseOrders" },
      purchaseOrderItem: { model: prisma.purchaseOrderItem, dataKey: "purchaseOrderItems" },
      abstract: { model: prisma.abstract, dataKey: "abstracts" },
      abstractItem: { model: prisma.abstractItem, dataKey: "abstractItems" },
    };

    let totalRecordsRestored = 0;

    for (const tableName of tableOrder) {
      const tableConfig = tableMap[tableName];
      if (!tableConfig) {
        console.error(`Invalid table name: ${tableName}`);
        continue;
      }

      const data = backupData[tableConfig.dataKey];
      
      if (!data || !Array.isArray(data)) {
        console.log(`Skipping ${tableName}: No data found`);
        continue;
      }

      console.log(`Processing ${tableName}: ${data.length} records`);
      
      // Process each record individually with proper error handling
      const createPromises = data.map((item: any, index: number) => {
        console.log(`Processing ${tableName} record ${index + 1}/${data.length}`);
        
        // For users, handle optional fields properly
        if (tableName === 'users') {
          // Clean up optional fields by converting null to undefined
          const cleanData = {
            ...item,
            // Convert null to undefined for optional fields
            department: item.department ?? undefined,
            section: item.section ?? undefined,
            title: item.title ?? undefined,
            designation: item.designation ?? undefined,
            saino: item.saino ?? undefined,
            alobsno: item.alobsno ?? undefined,
            signatureUrl: item.signatureUrl ?? undefined,
            // Convert dates
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
            emailVerified: item.emailVerified ? new Date(item.emailVerified) : undefined,
            // Remove any fields that might cause conflicts
            id: undefined,
            _id: undefined,
            __id: undefined
          };

          console.log('Creating user with data:', cleanData);

          return prisma.user.create({
            data: cleanData
          }).then((result) => {
            console.log(`Successfully created user record ${index + 1}`);
            return result;
          }).catch((error: unknown) => {
            console.error(`Error creating user record ${index + 1}:`, error);
            console.error('Failed record data:', item);
            console.error('Clean data:', cleanData);
            return null;
          });
        }

        // For OfficeHeadPPMP, handle user references by section
        if (tableName === 'officeHeadPPMP') {
          // Get the section from the backup data
          const section = item.user?.section; // Get section from user relation
          console.log(`Looking up user for section: ${section}`);
          const userId = userMapBySection.get(section);
          
          if (!userId) {
            console.error(`No user found for section: ${section}`);
            console.error('Available sections:', Array.from(userMapBySection.entries()));
            return null; // Skip this record
          }

          console.log(`Found user ID: ${userId} for section: ${section}`);

          // Create a clean data object with only the fields we need
          const cleanData = {
            ppmp_item: item.ppmp_item,
            unit_cost: item.unit_cost, // Keep as string, Prisma will handle conversion
            ppmp_category: item.ppmp_category,
            userId: userId, // Use the mapped user ID
            createdAt: new Date(item.createdAt),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined,
            id: undefined, // Don't use the backup ID
            _id: undefined,
            __id: undefined
          };

          console.log('Creating record with data:', cleanData);

          return prisma.officeHeadPPMP.create({
            data: cleanData
          }).then((result) => {
            console.log(`Successfully created OfficeHeadPPMP record ${index + 1}`);
            return result;
          }).catch((error: unknown) => {
            console.error(`Error creating OfficeHeadPPMP record ${index + 1}:`, error);
            console.error('Failed record data:', item);
            console.error('Clean data:', cleanData);
            return null;
          });
        }

        // For other tables, create a clean data object
        const cleanData = {
          ...item,
          // Convert dates
          createdAt: new Date(item.createdAt as string),
          ...(item.updatedAt ? { updatedAt: new Date(item.updatedAt as string) } : {}),
          // Handle numeric fields
          ...(item.unit_cost ? { unit_cost: item.unit_cost } : {}),
          ...(item.totalCost ? { totalCost: item.totalCost } : {}),
          ...(item.unitCost ? { unitCost: item.unitCost } : {}),
          ...(item.overallTotal ? { overallTotal: item.overallTotal } : {}),
          ...(item.year ? { year: item.year } : {}),
          ...(item.lastNumber ? { lastNumber: item.lastNumber } : {}),
          // Handle user references
          ...(item.userId && userMapBySection.get(item.user?.section) ? { userId: userMapBySection.get(item.user?.section) } : {}),
          ...(item.createdBy && userMapBySection.get(item.user?.section) ? { createdBy: userMapBySection.get(item.user?.section) } : {}),
          ...(item.updatedBy && userMapBySection.get(item.user?.section) ? { updatedBy: userMapBySection.get(item.user?.section) } : {}),
          // Remove any fields that might cause conflicts
          id: undefined,
          _id: undefined,
          __id: undefined
        };

        console.log(`Creating ${tableName} record ${index + 1} with data:`, cleanData);

        return tableConfig.model.create({
          data: cleanData,
          skipDuplicates: true
        }).catch((error: unknown) => {
          console.error(`Error creating ${tableName} record ${index + 1}:`, error);
          console.error('Failed record data:', item);
          console.error('Clean data:', cleanData);
          return null;
        });
      });

      // Filter out null values (failed records)
      const filteredPromises = createPromises.filter((p: any) => p !== null);
      
      try {
        const results = await Promise.all(filteredPromises);
        const successCount = results.filter((r: any) => r).length;
        totalRecordsRestored += successCount;
        console.log(`Successfully restored ${successCount} records out of ${data.length} for ${tableName}`);
        if (successCount < data.length) {
          console.warn(`Warning: ${data.length - successCount} records failed to restore for ${tableName}`);
        }
      } catch (error: unknown) {
        console.error(`Failed to restore records for ${tableName}:`, error);
        continue;
      }
    }

    console.log(`Total records restored: ${totalRecordsRestored}`);
    return NextResponse.json({ 
      message: "All data restored successfully",
      recordsRestored: totalRecordsRestored,
      success: totalRecordsRestored > 0
    });
  } catch (error: unknown) {
    console.error("Error in restoreAllData:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 
               typeof error === 'string' ? error : 
               'An unexpected error occurred during restore' 
      },
      { status: 500 }
    );
  }
}
