import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// GET /api/standards - Get all standards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';
    const onlyVisible = searchParams.get('onlyVisible') !== 'false';

    const whereClause: {
      status?: { not: string };
      is_visible?: boolean;
    } = {};
    
    if (!includeArchived) {
      whereClause.status = { not: 'archived' };
    }
    
    if (onlyVisible) {
      whereClause.is_visible = true;
    }

    const standards = await prisma.standard.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        archived_versions: {
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    return NextResponse.json(standards);
  } catch (error) {
    console.error('Error fetching standards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standards' },
      { status: 500 }
    );
  }
}

// POST /api/standards - Create a new standard
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

    // Generate version - always start with 1.0 for new standards
    const standardVersion = 'v1.0';

    // Handle file upload
    let fileUrl = null;
    let fileSize = '0 KB';
    
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
        const filePath = `public/uploads/standards/${fileName}`;
        
        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads/standards');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(process.cwd(), filePath), buffer);
        
        fileUrl = `/uploads/standards/${fileName}`;
        fileSize = `${Math.round(file.size / 1024)} KB`;
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        );
      }
    }

    const standard = await prisma.standard.create({
      data: {
        title_en: titleEn,
        title_ar: titleAr,
        description_en: descriptionEn,
        description_ar: descriptionAr,
        version: standardVersion,
        file_size: fileSize,
        file_url: fileUrl,
        created_by: 1, // Default admin user
        updated_by: 1
      }
    });

    return NextResponse.json(standard);
  } catch (error) {
    console.error('Error creating standard:', error);
    return NextResponse.json(
      { error: 'Failed to create standard' },
      { status: 500 }
    );
  }
} 