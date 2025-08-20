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
    const body: {
      name: string;
      description?: string;
      status?: string;
      priority?: string;
      baseline_start?: string;
      baseline_finish?: string;
      actual_start?: string;
      actual_finish?: string;
      progress?: number;
      budget?: number;
      manager_id?: string;
    } = await request.json();

    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const { 
      name, 
      description, 
      status, 
      manager_id,
      baseline_start,
      baseline_finish,
      actual_start,
      actual_finish
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Missing required fields: Name is required' },
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
    const updateData: {
      name: string;
      description?: string;
      status?: string;
      baseline_start?: Date;
      baseline_finish?: Date;
      actual_start?: Date;
      actual_finish?: Date;
      manager_id?: number | null;
    } = {
      name,
      description,
      status,
    };

    // Add optional date fields
    if (baseline_start) {
      updateData.baseline_start = new Date(baseline_start);
    }
    if (baseline_finish) {
      updateData.baseline_finish = new Date(baseline_finish);
    }
    if (actual_start) {
      updateData.actual_start = new Date(actual_start);
    }
    if (actual_finish) {
      updateData.actual_finish = new Date(actual_finish);
    }

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