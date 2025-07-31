import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/standards/[id]/versions - Get archived versions of a standard
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid standard ID' },
        { status: 400 }
      );
    }

    const standard = await prisma.standard.findUnique({
      where: { id },
      include: {
        archived_versions: {
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!standard) {
      return NextResponse.json(
        { error: 'Standard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(standard.archived_versions);
  } catch (error) {
    console.error('Error fetching standard versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standard versions' },
      { status: 500 }
    );
  }
} 