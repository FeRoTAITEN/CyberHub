import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility to round progress to two decimals safely
function roundProgress(value: number | null | undefined): number {
  if (value === null || value === undefined || isNaN(Number(value))) return 0;
  return Math.round(Number(value) * 100) / 100;
}

// Enforce phase statuses: only one active (first <100%), completed if 100%, others on_hold
async function updatePhaseStatuses(projectId: number) {
  const phases = await prisma.phase.findMany({
    where: { project_id: projectId },
    orderBy: { order: 'asc' },
  });

  let activeAssigned = false;
  const updates: any[] = [];
  let nextActivePhaseId: number | null = null;

  for (const phase of phases) {
    const progress = roundProgress(phase.progress);
    let desiredStatus: string;

    // Keep cancelled phases as-is
    if ((phase.status || '').toLowerCase() === 'cancelled') {
      continue;
    }

    if (progress >= 100) {
      desiredStatus = 'completed';
    } else if (!activeAssigned) {
      desiredStatus = 'active';
      activeAssigned = true;
      nextActivePhaseId = phase.id;
    } else {
      desiredStatus = 'on_hold';
    }

    if (phase.status !== desiredStatus) {
      updates.push(
        prisma.phase.update({
          where: { id: phase.id },
          data: { status: desiredStatus },
        })
      );
    }
  }

  if (updates.length > 0) {
    await prisma.$transaction(updates);
  }

  // Ensure all tasks under the (single) active phase are active (excluding completed/cancelled)
  if (nextActivePhaseId) {
    const directTasks = await prisma.task.findMany({ where: { phase_id: nextActivePhaseId }, select: { id: true } });
    let frontier = directTasks.map(t => t.id);
    const allIds = new Set<number>(frontier);

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
    if (idsArr.length > 0) {
      await prisma.task.updateMany({
        where: { id: { in: idsArr }, NOT: { status: { in: ['completed', 'cancelled'] } } },
        data: { status: 'active' },
      });
    }
  }
}

// Helpers: roll-up dates
async function rollupTaskDates(taskId: number): Promise<void> {
  const subtasks = await prisma.task.findMany({
    where: { parent_task_id: taskId, NOT: { status: { in: ['cancelled', 'canceled'] } } },
    select: { id: true, order: true, baseline_start: true, baseline_finish: true, actual_start: true, actual_finish: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });

  if (subtasks.length === 0) return;

  const firstWith = (key: 'baseline_start' | 'actual_start') => {
    for (const s of subtasks) {
      const v = s[key];
      if (v) return v;
    }
    return null;
  };
  const lastWith = (key: 'baseline_finish' | 'actual_finish') => {
    for (let i = subtasks.length - 1; i >= 0; i--) {
      const v = (subtasks[i] as any)[key] as Date | null;
      if (v) return v;
    }
    return null;
  };

  await prisma.task.update({
    where: { id: taskId },
    data: {
      baseline_start: firstWith('baseline_start'),
      baseline_finish: lastWith('baseline_finish'),
      actual_start: firstWith('actual_start'),
      actual_finish: lastWith('actual_finish'),
    },
  });
}

async function rollupPhaseDates(phaseId: number): Promise<void> {
  const tasks = await prisma.task.findMany({
    where: { phase_id: phaseId, NOT: { status: { in: ['cancelled', 'canceled'] } } },
    select: { id: true, order: true, baseline_start: true, baseline_finish: true, actual_start: true, actual_finish: true },
    orderBy: [{ order: 'asc' }, { id: 'asc' }],
  });

  const firstWith = (key: 'baseline_start' | 'actual_start') => {
    for (const s of tasks) {
      const v = s[key];
      if (v) return v;
    }
    return null;
  };
  const lastWith = (key: 'baseline_finish' | 'actual_finish') => {
    for (let i = tasks.length - 1; i >= 0; i--) {
      const v = (tasks[i] as any)[key] as Date | null;
      if (v) return v;
    }
    return null;
  };

  await prisma.phase.update({
    where: { id: phaseId },
    data: {
      baseline_start: firstWith('baseline_start'),
      baseline_finish: lastWith('baseline_finish'),
      actual_start: firstWith('actual_start'),
      actual_finish: lastWith('actual_finish'),
    },
  });
}

async function rollupProjectDates(projectId: number): Promise<void> {
  const [phases, topTasks] = await Promise.all([
    prisma.phase.findMany({
      where: { project_id: projectId, NOT: { status: { in: ['cancelled', 'canceled'] } } },
      select: { id: true, order: true, baseline_start: true, baseline_finish: true, actual_start: true, actual_finish: true },
    }),
    prisma.task.findMany({
      where: { project_id: projectId, phase_id: null, parent_task_id: null, NOT: { status: { in: ['cancelled', 'canceled'] } } },
      select: { id: true, order: true, baseline_start: true, baseline_finish: true, actual_start: true, actual_finish: true },
    }),
  ]);

  const combined = [
    ...phases.map(p => ({
      id: p.id,
      order: p.order ?? 0,
      baseline_start: p.baseline_start,
      baseline_finish: p.baseline_finish,
      actual_start: p.actual_start,
      actual_finish: p.actual_finish,
    })),
    ...topTasks.map(t => ({
      id: t.id,
      order: t.order ?? 0,
      baseline_start: t.baseline_start,
      baseline_finish: t.baseline_finish,
      actual_start: t.actual_start,
      actual_finish: t.actual_finish,
    })),
  ].sort((a, b) => (a.order - b.order) || (a.id - b.id));

  const firstWith = (key: 'baseline_start' | 'actual_start') => {
    for (const s of combined) {
      const v = s[key];
      if (v) return v;
    }
    return null;
  };
  const lastWith = (key: 'baseline_finish' | 'actual_finish') => {
    for (let i = combined.length - 1; i >= 0; i--) {
      const v = (combined[i] as any)[key] as Date | null;
      if (v) return v;
    }
    return null;
  };

  await prisma.project.update({
    where: { id: projectId },
    data: {
      baseline_start: firstWith('baseline_start'),
      baseline_finish: lastWith('baseline_finish'),
      actual_start: firstWith('actual_start'),
      actual_finish: lastWith('actual_finish'),
    },
  });
}

// DELETE /api/tasks/[id] - Delete a task and all its related data
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);

    if (isNaN(taskId)) {
      return NextResponse.json(
        { error: 'Invalid task ID' },
        { status: 400 }
      );
    }

    console.log(`Deleting task with ID: ${taskId}`);

    // Gather the task and all descendant subtasks (recursive)
    const allIds = new Set<number>([taskId]);
    let frontier: number[] = [taskId];
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

    // 1) Delete dependencies where any of these IDs are predecessor or successor
    await prisma.taskDependency.deleteMany({
      where: {
        OR: [
          { predecessor_task_id: { in: idsArr } },
          { successor_task_id: { in: idsArr } },
        ],
      },
    });

    // 2) Delete assignments for all tasks in the set
    await prisma.taskAssignment.deleteMany({ where: { task_id: { in: idsArr } } });

    // 3) Delete tasks themselves
    await prisma.task.deleteMany({ where: { id: { in: idsArr } } });

    console.log(`Task ${taskId} and its descendants deleted successfully`);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);
    const body: {
      name: string;
      description?: string;
      status?: string;
      priority?: string;
      progress?: number;
      phase_id?: number;
      parent_task_id?: number;
      assigned_employee_id?: string;
      duration?: number;
      baseline_start?: string;
      baseline_finish?: string;
      actual_start?: string;
      actual_finish?: string;
      xml_uid?: string;
    } = await request.json();

    const { 
      progress, 
      assigned_employee_id,
      name,
      description,
      status,
      duration,
      baseline_start,
      baseline_finish,
      actual_start,
      actual_finish
    } = body;

    // Update the task
    const updateData: any = {};
    if (progress !== undefined) {
      const rounded = roundProgress(progress);
      updateData.progress = rounded;
      if (rounded >= 100) {
        updateData.status = 'completed';
      }
    }
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (duration !== undefined) updateData.duration = duration;
    if (baseline_start !== undefined) updateData.baseline_start = baseline_start ? new Date(baseline_start) : null;
    if (baseline_finish !== undefined) updateData.baseline_finish = baseline_finish ? new Date(baseline_finish) : null;
    if (actual_start !== undefined) updateData.actual_start = actual_start ? new Date(actual_start) : null;
    if (actual_finish !== undefined) updateData.actual_finish = actual_finish ? new Date(actual_finish) : null;

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

    // Cascade status to subtasks if requested status is active/on_hold/cancelled
    if (status && ['active', 'on_hold', 'cancelled', 'canceled'].includes(status)) {
      const normalized = status === 'canceled' ? 'cancelled' : status;
      await prisma.task.updateMany({
        where: { parent_task_id: taskId, NOT: { status: { in: ['completed', 'cancelled'] } } },
        data: { status: normalized },
      });
    }

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

    // After cascade updates, enforce phase statuses on the project
    if (updatedTask.project) {
      await updatePhaseStatuses(updatedTask.project.id);
    }

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
      const averageProgress = roundProgress(totalProgress / parentTask.subtasks.length);

      await prisma.task.update({
        where: { id: parentTask.id },
        data: { progress: averageProgress, ...(averageProgress >= 100 ? { status: 'completed' } : {}) },
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
      const averageProgress = roundProgress(totalProgress / phase.tasks.length);

      await prisma.phase.update({
        where: { id: phase.id },
        data: { progress: averageProgress, ...(averageProgress >= 100 ? { status: 'completed' } : {}) },
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
      const averageProgress = roundProgress(totalProgress / project.phases.length);

      await prisma.project.update({
        where: { id: project.id },
        data: { progress: averageProgress, ...(averageProgress >= 100 ? { status: 'completed' } : {}) },
      });

      // After recompute, enforce single active phase
      await updatePhaseStatuses(project.id);

      // Roll up dates to project (phases + project-level tasks excluding cancelled)
      await rollupProjectDates(project.id);
    }
  }

  // Roll up dates upwards along task -> parent task -> phase
  if (task.parent_task) {
    await rollupTaskDates(task.parent_task.id);
  }
  if (task.phase) {
    await rollupPhaseDates(task.phase.id);
  }
} 