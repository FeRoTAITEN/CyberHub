import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/tasks/[id] - Delete a task and all its related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }

    console.log(`Deleting task with ID: ${taskId}`);

    // First, get the task to check if it exists and get its subtasks
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignments: true,
        subtasks: {
          include: {
            assignments: true
          }
        }
      }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Delete in the correct order to handle foreign key constraints
    // 1. Delete task dependencies where this task is involved
    console.log('Deleting task dependencies...');
    await prisma.taskDependency.deleteMany({
      where: {
        OR: [
          { predecessor_task_id: taskId },
          { successor_task_id: taskId }
        ]
      }
    });

    // 2. Delete assignments for all subtasks first
    console.log(`Deleting assignments for ${task.subtasks.length} subtasks...`);
    for (const subtask of task.subtasks) {
      await prisma.taskAssignment.deleteMany({
        where: {
          task_id: subtask.id
        }
      });
    }

    // 3. Delete assignments for the main task
    console.log('Deleting main task assignments...');
    await prisma.taskAssignment.deleteMany({
      where: {
        task_id: taskId
      }
    });

    // 4. Delete all subtasks (this will cascade to their assignments)
    console.log('Deleting subtasks...');
    await prisma.task.deleteMany({
      where: {
        parent_task_id: taskId
      }
    });

    // 5. Finally delete the main task
    console.log('Deleting main task...');
    await prisma.task.delete({
      where: {
        id: taskId
      }
    });

    console.log(`Task ${taskId} deleted successfully`);

    return NextResponse.json({
      message: 'Task deleted successfully',
      task_id: taskId
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task. Please try again.' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update task progress and cascade updates
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = parseInt(params.id);
    const body = await request.json();
    
    const { 
      progress, 
      end_date, 
      assigned_employee_id,
      name,
      description,
      start_date,
      priority,
      status,
      duration,
      work,
      cost
    } = body;

    // Update the task
    const updateData: any = {};
    if (progress !== undefined) updateData.progress = progress;
    if (end_date) updateData.end_date = new Date(end_date);
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (start_date) updateData.start_date = new Date(start_date);
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;
    if (duration !== undefined) updateData.duration = duration;
    if (work !== undefined) updateData.work = work;
    if (cost !== undefined) updateData.cost = cost;

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
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

    // Update assignment if employee is provided
    if (assigned_employee_id) {
      // Remove existing assignments for this task
      await prisma.taskAssignment.deleteMany({
        where: { task_id: taskId },
      });

      // Create new assignment
      await prisma.taskAssignment.create({
        data: {
          task_id: taskId,
          employee_id: parseInt(assigned_employee_id),
          role: 'member',
        },
      });
    }

    // Cascade progress updates
    await cascadeProgressUpdates(taskId);

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// Helper function to cascade progress updates
async function cascadeProgressUpdates(taskId: number) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      subtasks: true,
      parent_task: true,
      phase: true,
      project: true,
    },
  });

  if (!task) return;

  // Update parent task progress based on subtasks
  if (task.parent_task) {
    const parentTask = await prisma.task.findUnique({
      where: { id: task.parent_task.id },
      include: { subtasks: true },
    });

    if (parentTask && parentTask.subtasks.length > 0) {
      const totalProgress = parentTask.subtasks.reduce((sum, subtask) => sum + subtask.progress, 0);
      const averageProgress = totalProgress / parentTask.subtasks.length;

      await prisma.task.update({
        where: { id: parentTask.id },
        data: { progress: averageProgress },
      });

      // Recursively update parent's parent
      await cascadeProgressUpdates(parentTask.id);
    }
  }

  // Update phase progress based on tasks
  if (task.phase) {
    const phase = await prisma.phase.findUnique({
      where: { id: task.phase.id },
      include: { tasks: true },
    });

    if (phase && phase.tasks.length > 0) {
      const totalProgress = phase.tasks.reduce((sum, phaseTask) => sum + phaseTask.progress, 0);
      const averageProgress = totalProgress / phase.tasks.length;

      await prisma.phase.update({
        where: { id: phase.id },
        data: { progress: averageProgress },
      });
    }
  }

  // Update project progress based on phases
  if (task.project) {
    const project = await prisma.project.findUnique({
      where: { id: task.project.id },
      include: { phases: true },
    });

    if (project && project.phases.length > 0) {
      const totalProgress = project.phases.reduce((sum, phase) => sum + phase.progress, 0);
      const averageProgress = totalProgress / project.phases.length;

      await prisma.project.update({
        where: { id: project.id },
        data: { progress: averageProgress },
      });
    }
  }
} 