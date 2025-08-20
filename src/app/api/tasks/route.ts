import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body: {
      name: string;
      description?: string;
      project_id: string;
      phase_id?: string;
      parent_task_id?: string;
      status?: string;
      priority?: string;
      progress?: number;
      duration?: string;
      xml_uid?: string;
      baseline_start?: string;
      baseline_finish?: string;
      actual_start?: string;
      actual_finish?: string;
    } = await request.json();
    
    const {
      name,
      description,
      status,
      duration,
      project_id,
      phase_id,
      parent_task_id,
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

    // Validate numeric fields
    const durationValue = duration ? parseFloat(duration) : 0;

    if (isNaN(durationValue)) {
      return NextResponse.json(
        { error: 'Invalid numeric values for duration' },
        { status: 400 }
      );
    }

    // Create the task
    const taskData: any = {
      name: name,
      description,
      status,
      progress: 0,
      duration: durationValue,
      order: 0,
      outline_level: parent_task_id ? 1 : 0,
      baseline_start: baseline_start ? new Date(baseline_start) : null,
      baseline_finish: baseline_finish ? new Date(baseline_finish) : null,
      actual_start: actual_start ? new Date(actual_start) : null,
      actual_finish: actual_finish ? new Date(actual_finish) : null,
    };

    // Validate and set foreign key references
    if (project_id) {
      const projectId = parseInt(project_id);
      if (isNaN(projectId)) {
        return NextResponse.json(
          { error: 'Invalid project ID' },
          { status: 400 }
        );
      }
      taskData.project_id = projectId;
    } else if (!parent_task_id) {
      // If no project_id and no parent_task_id, this is an invalid task
      return NextResponse.json(
        { error: 'Task must be associated with either a project or a parent task' },
        { status: 400 }
      );
    }
    
    if (phase_id) {
      const phaseId = parseInt(phase_id);
      if (isNaN(phaseId)) {
        return NextResponse.json(
          { error: 'Invalid phase ID' },
          { status: 400 }
        );
      }
      taskData.phase_id = phaseId;
      
      // If phase_id is provided, project_id should also be provided
      if (!project_id) {
        return NextResponse.json(
          { error: 'Phase must be associated with a project' },
          { status: 400 }
        );
      }
      
      // If parent_task_id is provided, phase_id should not be provided
      if (parent_task_id) {
        return NextResponse.json(
          { error: 'Subtask cannot be directly associated with a phase' },
          { status: 400 }
        );
      }
    }
    
    if (parent_task_id) {
      const parentTaskId = parseInt(parent_task_id);
      if (isNaN(parentTaskId)) {
        return NextResponse.json(
          { error: 'Invalid parent task ID' },
          { status: 400 }
        );
      }
      taskData.parent_task_id = parentTaskId;
      
      // If parent_task_id is provided, project_id should also be provided
      if (!project_id) {
        return NextResponse.json(
          { error: 'Subtask must be associated with a project' },
          { status: 400 }
        );
      }
      
      // If phase_id is provided, parent_task_id should not be provided
      if (phase_id) {
        return NextResponse.json(
          { error: 'Task cannot be associated with both phase and parent task' },
          { status: 400 }
        );
      }
    }

    const task = await prisma.task.create({
      data: taskData,
      include: {
        project: true,
        phase: true,
        parent_task: true,
        subtasks: true,
        assignments: {
          include: {
            employee: true,
          },
        },
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Task with this name already exists' },
          { status: 400 }
        );
      }
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid project, phase, or parent task reference' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create task. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/tasks - Get all tasks (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');
    const phaseId = searchParams.get('phase_id');
    const parentTaskId = searchParams.get('parent_task_id');

    const where: any = {};
    
    if (projectId) where.project_id = parseInt(projectId);
    if (phaseId) where.phase_id = parseInt(phaseId);
    if (parentTaskId) where.parent_task_id = parseInt(parentTaskId);

    const tasks = await prisma.task.findMany({
      where,
      include: {
        project: true,
        phase: true,
        parent_task: true,
        subtasks: true,
        assignments: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
} 