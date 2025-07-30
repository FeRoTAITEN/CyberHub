import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/policies/[id]/visibility - Toggle policy visibility
export async function POST(
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

    const body = await request.json();
    const { isVisible } = body;

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json(
        { error: 'isVisible must be a boolean' },
        { status: 400 }
      );
    }

    const policy = await prisma.policy.update({
      where: { id },
      data: {
        is_visible: isVisible,
      }
    });

    return NextResponse.json(policy);
  } catch (error) {
    console.error('Error updating policy visibility:', error);
    return NextResponse.json(
      { error: 'Failed to update policy visibility' },
      { status: 500 }
    );
  }
} 