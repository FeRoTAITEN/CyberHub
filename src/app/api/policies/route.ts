import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// GET /api/policies - Get all policies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';
    const onlyVisible = searchParams.get('onlyVisible') !== 'false';

    const whereClause: any = {};
    
    if (!includeArchived) {
      whereClause.status = { not: 'archived' };
    }
    
    if (onlyVisible) {
      whereClause.is_visible = true;
    }

    const policies = await prisma.policy.findMany({
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

    return NextResponse.json(policies);
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policies' },
      { status: 500 }
    );
  }
}

// POST /api/policies - Create a new policy
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const titleEn = formData.get('titleEn') as string;
    const titleAr = formData.get('titleAr') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionAr = formData.get('descriptionAr') as string;
    const categoryEn = formData.get('categoryEn') as string;
    const categoryAr = formData.get('categoryAr') as string;
    const file = formData.get('file') as File;

    if (!titleEn || !titleAr || !descriptionEn || !descriptionAr || !categoryEn || !categoryAr) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate version based on category
    const existingPolicies = await prisma.policy.findMany({
      where: {
        category_en: categoryEn
      }
    });
    const version = `v${existingPolicies.length + 1}.0`;

    // Handle file upload
    let fileUrl = null;
    let fileSize = '0 KB';
    
    if (file && file.size > 0) {
      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `public/uploads/policies/${fileName}`;
        
        // Write file to disk
        
        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads/policies');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        fs.writeFileSync(path.join(process.cwd(), filePath), buffer);
        
        fileSize = `${Math.round(file.size / 1024)} KB`;
        fileUrl = `/uploads/policies/${fileName}`;
      } catch (fileError) {
        console.error('Error saving file:', fileError);
        return NextResponse.json(
          { error: 'Failed to save file' },
          { status: 500 }
        );
      }
    }

    const policy = await prisma.policy.create({
      data: {
        title_en: titleEn,
        title_ar: titleAr,
        description_en: descriptionEn,
        description_ar: descriptionAr,
        category_en: categoryEn,
        category_ar: categoryAr,
        version,
        file_size: fileSize,
        file_url: fileUrl,
        created_by: 1, // TODO: Get from auth
      }
    });

    return NextResponse.json(policy, { status: 201 });
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json(
      { error: 'Failed to create policy' },
      { status: 500 }
    );
  }
} 