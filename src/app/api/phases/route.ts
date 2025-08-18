import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/phases - Create a new phase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      status,
      project_id,
      baseline_start,
      baseline_finish,
      actual_start,
      actual_finish
    } = body;

    // Validate required fields
    if (!name || !project_id) {
      return NextResponse.json(
        { error: 'Missing required fields: Name and Project ID are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['active', 'completed', 'on_hold', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: active, completed, on_hold, cancelled' },
        { status: 400 }
      );
    }

    // Validate project exists
    const projectId = parseInt(project_id);
    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get the next order for this project
    const maxOrder = await prisma.phase.aggregate({
      where: { project_id: projectId },
      _max: { order: true }
    });

    const nextOrder = (maxOrder._max.order || 0) + 1;

    // Create the phase
    const phaseData: any = {
      name,
      description,
      status: status || 'active',
      progress: 0,
      order: nextOrder,
      project_id: projectId,
    };

    // Add optional date fields
    if (baseline_start) {
      phaseData.baseline_start = new Date(baseline_start);
    }
    if (baseline_finish) {
      phaseData.baseline_finish = new Date(baseline_finish);
    }
    if (actual_start) {
      phaseData.actual_start = new Date(actual_start);
    }
    if (actual_finish) {
      phaseData.actual_finish = new Date(actual_finish);
    }

    const phase = await prisma.phase.create({
      data: phaseData,
      include: {
        project: true,
        tasks: true,
      },
    });

    return NextResponse.json(phase);
  } catch (error) {
    console.error('Create phase error:', error);
    return NextResponse.json({ error: 'Failed to create phase' }, { status: 500 });
  }
} 