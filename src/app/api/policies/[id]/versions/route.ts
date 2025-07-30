import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/policies/[id]/versions - Get archived versions of a policy
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
      where: { id },
      include: {
        archived_versions: {
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!policy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(policy.archived_versions);
  } catch (error) {
    console.error('Error fetching policy versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policy versions' },
      { status: 500 }
    );
  }
} 