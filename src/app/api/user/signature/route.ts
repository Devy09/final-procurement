import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const signature = formData.get('signature') as File;
    const userId = formData.get('userId') as string;
    const base64String = formData.get('processedImage') as string; // Get the processed image from client

    if (!signature || !userId || !base64String) {
      return NextResponse.json(
        { error: 'Signature, userId, and processed image are required' },
        { status: 400 }
      );
    }

    // Save the base64 string to database
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        signatureUrl: base64String,
      },
    });

    return NextResponse.json({
      signatureUrl: base64String,
      message: 'Signature uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading signature:', error);
    return NextResponse.json(
      { error: 'Failed to upload signature' },
      { status: 500 }
    );
  }
} 