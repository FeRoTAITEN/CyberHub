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
      start_date,
      end_date,
      status,
      project_id
    } = body;

    // Validate required fields
    if (!name || !start_date || !end_date || !project_id) {
      return NextResponse.json(
        { error: 'Missing required fields: Name, Start Date, End Date, and Project ID are required' },
        { status: 400 }
      );
    }

    // Validate date format
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Please use YYYY-MM-DD format' },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date cannot be before start date' },
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
    const phase = await prisma.phase.create({
      data: {
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        status: status || 'active',
        progress: 0,
        order: nextOrder,
        project_id: projectId,
      },
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