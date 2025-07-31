import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/standards/[id]/visibility - Toggle standard visibility
export async function POST(
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

    const body = await request.json();
    const { isVisible } = body;

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'isVisible must be a boolean' },
        { status: 400 }
      );
    }

    const standard = await prisma.standard.update({
      where: { id },
      data: {
        is_visible: isVisible,
      }
    });

    return NextResponse.json(standard);
  } catch (error) {
    console.error('Error updating standard visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update standard visibility' },
      { status: 500 }
    );
  }
} 