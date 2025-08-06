import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/phases/[id] - Delete a phase and all its related tasks
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const phaseId = parseInt(resolvedParams.id);

    if (isNaN(phaseId)) {
      return NextResponse.json(
        { error: 'Invalid phase ID' },
        { status: 400 }
      );
    }

    console.log(`Deleting phase with ID: ${phaseId}`);

    // First, get the phase to check if it exists
    const phase = await prisma.phase.findUnique({
      where: { id: phaseId },
      include: {
        tasks: {
          include: {
            assignments: true,
            subtasks: true
          }
        }
      }
    });

    if (!phase) {
      return NextResponse.json(
        { error: 'Phase not found' },
        { status: 404 }
      );
    }

    // Delete in the correct order to handle foreign key constraints
    // 1. Delete task assignments for all tasks in this phase
    console.log(`Deleting assignments for ${phase.tasks.length} tasks...`);
    for (const task of phase.tasks) {
      await prisma.taskAssignment.deleteMany({
        where: {
          task_id: task.id
        }
      });

      // Delete subtasks assignments
      for (const subtask of task.subtasks) {
        await prisma.taskAssignment.deleteMany({
          where: {
            task_id: subtask.id
          }
        });
      }
    }

    // 2. Delete task dependencies for all tasks in this phase
    console.log('Deleting task dependencies...');
    await prisma.taskDependency.deleteMany({
      where: {
        OR: [
          {
            predecessor_task: {
              phase_id: phaseId
            }
          },
          {
            successor_task: {
              phase_id: phaseId
            }
          }
        ]
      }
    });

    // 3. Delete all tasks in this phase (this will also delete subtasks due to cascade)
    console.log('Deleting tasks...');
    await prisma.task.deleteMany({
      where: {
        phase_id: phaseId
      }
    });

    // 4. Finally delete the phase
    console.log('Deleting phase...');
    await prisma.phase.delete({
      where: {
        id: phaseId
      }
    });

    console.log(`Phase ${phaseId} deleted successfully`);

    return NextResponse.json({
      message: 'Phase deleted successfully',
      phase_id: phaseId
    });

  } catch (error) {
    console.error('Error deleting phase:', error);
    return NextResponse.json(
      { error: 'Failed to delete phase. Please try again.' },
      { status: 500 }
    );
  }
} 