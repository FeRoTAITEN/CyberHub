import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// GET /api/procedures - Get all procedures
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';
    const onlyVisible = searchParams.get('onlyVisible') !== 'false';

    const whereClause: {
      is_archived?: boolean;
      is_visible?: boolean;
    } = {};
    
    if (!includeArchived) {
      whereClause.is_archived = false;
    }
    
    if (onlyVisible) {
      whereClause.is_visible = true;
    }

    const procedures = await prisma.procedure.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        versions: {
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    return NextResponse.json(procedures);
  } catch (error) {
    console.error('Error fetching procedures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch procedures' },
      { status: 500 }
    );
  }
}

// POST /api/procedures - Create a new procedure
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const titleEn = formData.get('titleEn') as string;
    const titleAr = formData.get('titleAr') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const file = formData.get('file') as File;

    if (!titleEn || !titleAr || !descriptionEn || !descriptionAr) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate version - always start with 1.0 for new procedures
    const procedureVersion = 'v1.0';

    // Handle file upload
    let fileUrl = null;
    
    if (file && file.size > 0) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only PDF and Word documents are allowed.' },
          { status: 400 }
        );
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size too large. Maximum size is 10MB.' },
          { status: 400 }
        );
      }

      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `public/uploads/procedures/${fileName}`;
        
        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads/procedures');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(process.cwd(), filePath), buffer);
        
        fileUrl = `/uploads/procedures/${fileName}`;
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        );
      }
    }

    // Ensure fileUrl is not null
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.create({
      data: {
        title_en: titleEn,
        title_ar: titleAr,
        description: descriptionEn, // Using only one description field as per schema
        version: procedureVersion,
        file_path: fileUrl, // Using file_path as per schema
      }
    });

    return NextResponse.json(procedure);
  } catch (error) {
    console.error('Error creating procedure:', error);
    return NextResponse.json(
      { error: 'Failed to create procedure' },
      { status: 500 }
    );
  }
} 