import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    // Delete the project (this will cascade delete phases, tasks, and assignments)
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);
    const body = await request.json();

    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const { name, description, start_date, end_date, status, manager_id } = body;

    // Validate required fields
    if (!name || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Missing required fields: Name, Start Date, and End Date are required' },
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

    // Update the project
    const updateData: any = {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      status,
    };

    // Add manager if provided
    if (manager_id) {
      const managerId = parseInt(manager_id);
      if (isNaN(managerId)) {
        return NextResponse.json(
          { error: 'Invalid manager ID' },
          { status: 400 }
        );
      }
      updateData.manager_id = managerId;
    } else {
      updateData.manager_id = null;
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        manager: true,
        phases: true,
        tasks: true,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
} 