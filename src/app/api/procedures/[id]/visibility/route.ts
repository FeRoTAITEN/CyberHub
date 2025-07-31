import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/procedures/[id]/visibility - Toggle procedure visibility
export async function POST(
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

    const body = await request.json();
    const { isVisible } = body;

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'isVisible must be a boolean' },
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.update({
      where: { id },
      data: {
        is_visible: isVisible,
      }
    });

    return NextResponse.json(procedure);
  } catch (error) {
    console.error('Error updating procedure visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update procedure visibility' },
      { status: 500 }
    );
  }
} 