import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// GET /api/policies/[id] - Get a specific policy
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid policy ID' },
        { status: 400 }
      );
    }

    const policy = await prisma.policy.findUnique({
      where: { id }
    });

    if (!policy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Error fetching policy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policy' },
      { status: 500 }
    );
  }
}

// PUT /api/policies/[id] - Update a policy
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid policy ID' },
        { status: 400 }
      );
    }

    // Check if it's a form data request (file upload) or JSON request
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload update
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

      // Get current policy to check if we need to update version
      const currentPolicy = await prisma.policy.findUnique({
        where: { id }
      });

      if (!currentPolicy) {
        return NextResponse.json(
          { error: 'Policy not found' },
          { status: 404 }
        );
      }

      // Handle file upload if provided
      let fileUrl = currentPolicy.file_url;
      let fileSize = currentPolicy.file_size;
      let version = currentPolicy.version;
      
            // Always archive the current version when updating (whether file or data)
      await prisma.policy.create({
        data: {
          title_en: currentPolicy.title_en,
          title_ar: currentPolicy.title_ar,
          description_en: currentPolicy.description_en,
          description_ar: currentPolicy.description_ar,
          category_en: currentPolicy.category_en,
          category_ar: currentPolicy.category_ar,
          version: currentPolicy.version,
          file_size: currentPolicy.file_size,
          file_url: currentPolicy.file_url,
          downloads: currentPolicy.downloads,
          views: currentPolicy.views,
          status: 'archived',
          is_visible: false,
          parent_id: currentPolicy.id,
          created_by: currentPolicy.created_by,
        }
      });
      
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
          
          // Increment version if file is updated
          const versionMatch = version.match(/v(\d+)\.(\d+)/);
          if (versionMatch) {
            const major = parseInt(versionMatch[1]);
            const minor = parseInt(versionMatch[2]) + 1;
            version = `v${major}.${minor}`;
          }
        } catch (fileError) {
          console.error('Error saving file:', fileError);
          return NextResponse.json(
            { error: 'Failed to save file' },
            { status: 500 }
          );
        }
      }

      const policy = await prisma.policy.update({
        where: { id },
        data: {
          title_en: titleEn,
          title_ar: titleAr,
          description_en: descriptionEn,
          description_ar: descriptionAr,
          category_en: categoryEn,
          category_ar: categoryAr,
          file_size: fileSize,
          file_url: fileUrl,
          version,
          updated_by: 1, // TODO: Get from auth
        }
      });

      return NextResponse.json(policy);
    } else {
      // Handle JSON update (no file upload)
      const body = await request.json();
      
      const { titleEn, titleAr, descriptionEn, descriptionAr, categoryEn, categoryAr } = body;

      if (!titleEn || !titleAr || !descriptionEn || !descriptionAr || !categoryEn || !categoryAr) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const policy = await prisma.policy.update({
        where: { id },
        data: {
          title_en: titleEn,
          title_ar: titleAr,
          description_en: descriptionEn,
          description_ar: descriptionAr,
          category_en: categoryEn,
          category_ar: categoryAr,
          updated_by: 1, // TODO: Get from auth
        }
      });

      return NextResponse.json(policy);
    }
  } catch (error) {
    console.error('Error updating policy:', error);
    return NextResponse.json(
      { error: 'Failed to update policy' },
      { status: 500 }
    );
  }
}

// DELETE /api/policies/[id] - Delete a policy
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid policy ID' },
        { status: 400 }
      );
    }

    await prisma.policy.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Policy deleted successfully' });
  } catch (error) {
    console.error('Error deleting policy:', error);
    return NextResponse.json(
      { error: 'Failed to delete policy' },
      { status: 500 }
    );
  }
} 