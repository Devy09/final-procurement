import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const base64String = formData.get('processedImage') as string; // Get the processed image from client

    if (!userId || !base64String) {
      return NextResponse.json(
        { error: 'User ID and processed image are required' },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!base64String.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid base64 image format' },
        { status: 400 }
      );
    }

    // Ensure user exists before updating
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user signature
    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: { signatureUrl: base64String },
    });

    return NextResponse.json({
      signatureUrl: updatedUser.signatureUrl,
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
