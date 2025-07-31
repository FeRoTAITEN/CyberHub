import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/procedures/[id]/versions - Get archived versions of a procedure
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

    return NextResponse.json(procedure.archived_versions);
  } catch (error) {
    console.error('Error fetching procedure versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch procedure versions' },
      { status: 500 }
    );
  }
} 