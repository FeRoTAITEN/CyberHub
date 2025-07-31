import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// GET /api/procedures/[id] - Get a specific procedure
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid procedure ID' },
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.findUnique({
      where: { id },
      include: {
        archived_versions: {
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!procedure) {
      return NextResponse.json(
        { error: 'Procedure not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(procedure);
  } catch (error) {
    console.error('Error fetching procedure:', error);
    return NextResponse.json(
      { error: 'Failed to fetch procedure' },
      { status: 500 }
    );
  }
}

// PUT /api/procedures/[id] - Update a procedure
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid procedure ID' },
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
      const file = formData.get('file') as File;

      if (!titleEn || !titleAr || !descriptionEn || !descriptionAr) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Get current procedure to check if we need to update version
      const currentProcedure = await prisma.procedure.findUnique({
        where: { id }
      });

      if (!currentProcedure) {
        return NextResponse.json(
          { error: 'Procedure not found' },
          { status: 404 }
        );
      }

      // Handle file upload if provided
      let fileUrl = currentProcedure.file_url;
      let fileSize = currentProcedure.file_size;
      let version = currentProcedure.version;
      
      // Always archive the current version when updating (whether file or data)
      await prisma.procedure.create({
        data: {
          title_en: currentProcedure.title_en,
          title_ar: currentProcedure.title_ar,
          description_en: currentProcedure.description_en,
          description_ar: currentProcedure.description_ar,
          version: currentProcedure.version,
          file_size: currentProcedure.file_size,
          file_url: currentProcedure.file_url,
          downloads: currentProcedure.downloads,
          views: currentProcedure.views,
          status: 'archived',
          is_visible: false,
          parent_id: currentProcedure.id,
          created_by: currentProcedure.created_by,
        }
      });
      
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
          
          fileSize = `${Math.round(file.size / 1024)} KB`;
          fileUrl = `/uploads/procedures/${fileName}`;
          
          // Increment version by 0.1 if file is updated
          const versionMatch = version.match(/v(\d+)\.(\d+)/);
          if (versionMatch) {
            const major = parseInt(versionMatch[1]);
            const minor = parseInt(versionMatch[2]) + 1;
            
            // Auto-transition to next major version when minor reaches 10
            if (minor >= 10) {
              version = `v${major + 1}.0`;
            } else {
              version = `v${major}.${minor}`;
            }
          }
        } catch (fileError) {
          console.error('Error saving file:', fileError);
          return NextResponse.json(
            { error: 'Failed to save file' },
            { status: 500 }
          );
        }
      }

      const procedure = await prisma.procedure.update({
        where: { id },
        data: {
          title_en: titleEn,
          title_ar: titleAr,
          description_en: descriptionEn,
          description_ar: descriptionAr,
          file_size: fileSize,
          file_url: fileUrl,
          version,
          updated_by: 1, // TODO: Get from auth
        }
      });

      return NextResponse.json(procedure);
    } else {
      // Handle JSON update (no file upload)
      const body = await request.json();
      
      const { titleEn, titleAr, descriptionEn, descriptionAr } = body;

      if (!titleEn || !titleAr || !descriptionEn || !descriptionAr) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const procedure = await prisma.procedure.update({
        where: { id },
        data: {
          title_en: titleEn,
          title_ar: titleAr,
          description_en: descriptionEn,
          description_ar: descriptionAr,
          updated_by: 1, // TODO: Get from auth
        }
      });

      return NextResponse.json(procedure);
    }
  } catch (error) {
    console.error('Error updating procedure:', error);
    return NextResponse.json(
      { error: 'Failed to update procedure' },
      { status: 500 }
    );
  }
}

// DELETE /api/procedures/[id] - Delete a procedure
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid procedure ID' },
        { status: 400 }
      );
    }

    await prisma.procedure.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Procedure deleted successfully' });
  } catch (error) {
    console.error('Error deleting procedure:', error);
    return NextResponse.json(
      { error: 'Failed to delete procedure' },
      { status: 500 }
    );
  }
} 