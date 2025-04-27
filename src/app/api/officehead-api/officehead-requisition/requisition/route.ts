import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

async function generatePrNumber(year: number): Promise<string> {
  return await prisma.$transaction(async (transaction) => {
    try {
      let sequence = await transaction.purchaseRequestSequence.findUnique({
        where: { year },
      });

      if (!sequence) {
        sequence = await transaction.purchaseRequestSequence.create({
          data: { year, lastNumber: 1 },
        });
      } else {
        sequence = await transaction.purchaseRequestSequence.update({
          where: { id: sequence.id },
          data: { lastNumber: { increment: 1 } },
        });
      }

      const nextNumber = sequence.lastNumber;
      return `${nextNumber.toString().padStart(3, '0')}-${year.toString().slice(-2)}`;
    } catch (error) {
      console.error('Error generating PR number:', error);
      throw new Error('Failed to generate PR number');
    }
  });
}


// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Function to upload file to S3
async function uploadToS3(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    console.log("Request received");

    // Parse form data
    const formData = await req.formData();
    console.log("Form Data Parsed");

    // Extract files
    const certification = formData.get("certification") as File | null;
    const letter = formData.get("letter") as File;
    const proposal = formData.get("proposal") as File | null;

    // Validate required files
    if (!(letter instanceof File)) {
      console.log("Missing required letter file");
      return NextResponse.json(
        { error: "Approved letter file is required" },
        { status: 400 }
      );
    }

    // Upload files to S3
    const [letterUrl, certificationUrl, proposalUrl] = await Promise.all([
      uploadToS3(letter),
      certification instanceof File ? uploadToS3(certification) : Promise.resolve(""),
      proposal instanceof File ? uploadToS3(proposal) : Promise.resolve(""),
    ]);
    console.log("Files uploaded to S3:", { certificationUrl, letterUrl, proposalUrl });

    // Extract form fields
    const purpose = formData.get("purpose") as string;
    let items;
    try {
      items = JSON.parse(formData.get("items") as string);
    } catch (error) {
      console.log("Invalid items format");
      return NextResponse.json(
        { error: "Invalid items format" },
        { status: 400 }
      );
    }
    const procurementMode = formData.get("procurementMode") as string;

    // Validate required fields
    if (!purpose || !items?.length || !procurementMode) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields (purpose, items, procurementMode)" },
        { status: 400 }
      );
    }

    // Authentication and user validation
    const authData = await auth();
    const userId = authData.userId;
    if (!userId) {
      console.log("User authentication failed");
      return NextResponse.json(
        { error: "User authentication failed" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      console.log("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate PR number
    const year = new Date().getFullYear();
    const prno = await generatePrNumber(year);
    console.log("PR number generated:", prno);

    // Calculate total
    const overallTotal = items.reduce((total: number, item: any) => {
      return total + (item.quantity || 0) * (item.unitCost || 0);
    }, 0);
    console.log("Overall total calculated:", overallTotal);

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create purchase request in database
      const purchaseRequest = await tx.purchaseRequest.create({
        data: {
          prno,
          department: user.department || "",
          section: user.section || "",
          saino: user.saino || "",
          alobsno: user.alobsno || "",
          purpose,
          overallTotal,
          procurementMode,
          certificationFile: certificationUrl || "", // Store S3 URL or empty string
          letterFile: letterUrl, // Store S3 URL
          proposalFile: proposalUrl || "", // Store S3 URL or empty string
          createdById: user.id,
          items: {
            create: items.map((item: any, index: number) => ({
              itemNo: index + 1,
              quantity: item.quantity,
              unit: item.unit,
              description: item.description,
              stockNo: item.stockNo,
              unitCost: item.unitCost,
              totalCost: (item.quantity || 0) * (item.unitCost || 0),
            })),
          },
        },
        include: { items: true },
      });

      // Update PPMP quantities
      for (const item of items) {
        // Find the corresponding PPMP item
        const ppmpItem = await tx.officeHeadPPMP.findFirst({
          where: {
            ppmp_item: item.description,
            userId: user.id,
          },
        });

        if (ppmpItem) {
          // Reduce the quantity
          await tx.officeHeadPPMP.update({
            where: {
              id: ppmpItem.id,
            },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      return purchaseRequest;
    });

    return NextResponse.json({
      message: "Purchase request created successfully",
      purchaseRequest: result,
    });
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      return NextResponse.json({ error: "User authentication failed" }, { status: 401 });
    }

    const purchaseRequests = await prisma.purchaseRequest.findMany({
      select: {
        id: true,
        prno: true,
        department: true,
        section: true,
        date: true,
        procurementMode: true,
        status: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(purchaseRequests);
  } catch (error) {
    console.error("Error fetching purchase requests:", error);
    return NextResponse.json({ error: "Failed to fetch purchase requests" }, { status: 500 });
  }
}