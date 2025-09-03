import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/phases/[id] - Update a phase
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const phaseId = parseInt(id);
    const body: {
      name: string;
      description?: string;
      status?: string;
      baseline_start?: string;
      baseline_finish?: string;
      actual_start?: string;
      actual_finish?: string;
    } = await request.json();

    if (isNaN(phaseId)) {
      return NextResponse.json({ error: 'Invalid phase ID' }, { status: 400 });
    }

    // Load existing phase to enforce lock rules
    const existingPhase = await prisma.phase.findUnique({ where: { id: phaseId } });
    if (!existingPhase) {
      return NextResponse.json({ error: 'Phase not found' }, { status: 404 });
    }
    const lockedStatuses = new Set(['completed', 'on_hold', 'cancelled', 'canceled']);
    if (lockedStatuses.has((existingPhase.status || '').toLowerCase())) {
      return NextResponse.json({ error: 'Phase is locked and cannot be edited' }, { status: 403 });
    }

    const {
      name,
      description,
      status,
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

    // Update the phase
    const updateData: {
      name: string;
      description?: string;
      status: string;
      baseline_start?: Date;
      baseline_finish?: Date;
      actual_start?: Date;
      actual_finish?: Date;
    } = {
      name,
      description,
      status: status || 'active',
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

    const updatedPhase = await prisma.phase.update({
      where: { id: phaseId },
      data: updateData,
      include: {
        project: true,
        tasks: true,
      },
    });

    // Cascade status to tasks and subtasks if status is active/on_hold/cancelled
    if (status && ['active', 'on_hold', 'cancelled', 'canceled'].includes(status)) {
      const normalized = status === 'canceled' ? 'cancelled' : status;

      // Update tasks in this phase (excluding completed/cancelled)
      await prisma.task.updateMany({
        where: { phase_id: phaseId, NOT: { status: { in: ['completed', 'cancelled'] } } },
        data: { status: normalized },
      });

      // Update subtasks under tasks of this phase (excluding completed/cancelled)
      const tasksInPhase = await prisma.task.findMany({ where: { phase_id: phaseId }, select: { id: true } });
      const taskIds = tasksInPhase.map(t => t.id);
      if (taskIds.length > 0) {
        await prisma.task.updateMany({
          where: { parent_task_id: { in: taskIds }, NOT: { status: { in: ['completed', 'cancelled'] } } },
          data: { status: normalized },
        });
      }
    }

    return NextResponse.json(updatedPhase);
  } catch (error) {
    console.error('Update phase error:', error);
    return NextResponse.json({ error: 'Failed to update phase' }, { status: 500 });
  }
}

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

    // Load phase meta to decide next active after deletion
    const phaseMeta = await prisma.phase.findUnique({
      where: { id: phaseId },
      select: { id: true, project_id: true, order: true, status: true }
    });
    if (!phaseMeta) {
      return NextResponse.json(
        { error: 'Phase not found' },
        { status: 404 }
      );
    }

    // Collect all tasks in this phase and all descendant subtasks
    const rootTasks = await prisma.task.findMany({ where: { phase_id: phaseId }, select: { id: true } });
    const allIds = new Set<number>(rootTasks.map(t => t.id));
    let frontier: number[] = rootTasks.map(t => t.id);

    while (frontier.length > 0) {
      const children = await prisma.task.findMany({
        where: { parent_task_id: { in: frontier } },
        select: { id: true },
      });
      const newIds = children.map(c => c.id).filter(id => !allIds.has(id));
      newIds.forEach(id => allIds.add(id));
      frontier = newIds;
    }
    const idsArr = Array.from(allIds);

    // 1) Delete task dependencies involving any of these tasks
    await prisma.taskDependency.deleteMany({
      where: {
        OR: [
          { predecessor_task_id: { in: idsArr } },
          { successor_task_id: { in: idsArr } },
        ],
      },
    });

    // 2) Delete assignments for all tasks/subtasks
    await prisma.taskAssignment.deleteMany({ where: { task_id: { in: idsArr } } });

    // 3) Delete all collected tasks/subtasks
    if (idsArr.length > 0) {
      await prisma.task.deleteMany({ where: { id: { in: idsArr } } });
    }

    // 4) Delete the phase itself
    await prisma.phase.delete({ where: { id: phaseId } });

    console.log(`Phase ${phaseId} deleted successfully`);

    // 5) If deleted phase was active, activate the next phase by order
    if ((phaseMeta.status || '').toLowerCase() === 'active') {
      const nextPhase = await prisma.phase.findFirst({
        where: {
          project_id: phaseMeta.project_id,
          order: { gt: phaseMeta.order ?? 0 },
          NOT: { status: { in: ['completed', 'cancelled'] } },
        },
        orderBy: { order: 'asc' },
      });

      if (nextPhase) {
        // Set chosen next to active if it's not completed/cancelled; others (not completed/cancelled) to on_hold
        if (!['completed', 'cancelled', 'canceled'].includes((nextPhase.status || '').toLowerCase())) {
          await prisma.phase.update({ where: { id: nextPhase.id }, data: { status: 'active' } });
        }
        await prisma.phase.updateMany({
          where: {
            project_id: phaseMeta.project_id,
            id: { not: nextPhase.id },
            NOT: { status: { in: ['completed', 'cancelled'] } },
          },
          data: { status: 'on_hold' },
        });

        // Activate all tasks under the new active phase and descendants (excluding completed/cancelled)
        const directTasks = await prisma.task.findMany({ where: { phase_id: nextPhase.id }, select: { id: true } });
        let tf = directTasks.map(t => t.id);
        const allTIds = new Set<number>(tf);
        while (tf.length > 0) {
          const children = await prisma.task.findMany({ where: { parent_task_id: { in: tf } }, select: { id: true } });
          const newIds = children.map(c => c.id).filter(id => !allTIds.has(id));
          newIds.forEach(id => allTIds.add(id));
          tf = newIds;
        }
        const idsToActivate = Array.from(allTIds);
        if (idsToActivate.length > 0) {
          await prisma.task.updateMany({
            where: { id: { in: idsToActivate }, NOT: { status: { in: ['completed', 'cancelled'] } } },
            data: { status: 'active' },
          });
        }
      }
    }

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