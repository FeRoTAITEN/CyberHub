import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as xml2js from 'xml2js';

const prisma = new PrismaClient();

// Function to parse duration from XML format (PT1312H0M0S -> 1312 hours -> 164 days)
function parseDuration(durationStr: string): number {
  if (!durationStr) return 0;
  
  let hours = 0;
  
  // Handle PT format (Period Time)
  if (durationStr.startsWith('PT')) {
    const hoursMatch = durationStr.match(/(\d+)H/);
    const minutesMatch = durationStr.match(/(\d+)M/);
    const secondsMatch = durationStr.match(/(\d+)S/);
    
    const hoursFromMatch = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0;
    
    hours = hoursFromMatch + (minutes / 60) + (seconds / 3600);
  } else {
    // Handle simple number format
    const parsed = parseFloat(durationStr);
    hours = isNaN(parsed) ? 0 : parsed;
  }
  
  // Convert hours to days (8 working hours per day)
  return hours / 8;
}



export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No XML file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.xml')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload an XML file.' }, { status: 400 });
    }

    const xmlContent = await file.text();

    // Parse XML content
    const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });
    const result = await parser.parseStringPromise(xmlContent);
    
    const projectData = result.Project;

    if (!projectData) {
      return NextResponse.json({ error: 'Invalid XML structure. Project data not found.' }, { status: 400 });
    }

    // Extract project information
    const projectName = projectData.Name || projectData.Title || 'Imported Project';
    const completionPercent = projectData.PercentComplete ? parseFloat(projectData.PercentComplete) : 0;
    
    // Extract baseline and actual dates for project
    const projectBaselineStart = projectData.Baseline?.Start ? new Date(projectData.Baseline.Start) : null;
    const projectBaselineFinish = projectData.Baseline?.Finish ? new Date(projectData.Baseline.Finish) : null;
    const projectActualStart = projectData.ActualStart ? new Date(projectData.ActualStart) : null;
    const projectActualFinish = projectData.ActualFinish ? new Date(projectData.ActualFinish) : null;

    // Create project
    const project = await prisma.project.create({
      data: {
        name: projectName,
        description: `Imported from ${file.name}`,
        progress: completionPercent,
        imported_from_xml: true,
        xml_file_path: file.name,
        baseline_start: projectBaselineStart,
        baseline_finish: projectBaselineFinish,
        actual_start: projectActualStart,
        actual_finish: projectActualFinish,
      },
    });

    // Extract and process tasks
    const tasks = projectData.Tasks?.Task || [];
    const taskMap = new Map();
    const phaseMap = new Map();
    const taskMapByUID = new Map();

    // First pass: Create all tasks and phases
    for (const task of Array.isArray(tasks) ? tasks : [tasks]) {
      const taskUID = task.UID;
      const outlineLevel = parseInt(task.OutlineLevel || '1');
      const taskName = task.Name || 'Unnamed Task';
      const taskProgress = task.PercentComplete ? parseFloat(task.PercentComplete) : 0;
      const taskDuration = parseDuration(task.Duration);
      
      // Parse baseline and actual dates
      const baselineStart = task.Baseline?.Start ? new Date(task.Baseline.Start) : null;
      const baselineFinish = task.Baseline?.Finish ? new Date(task.Baseline.Finish) : null;
      const actualStart = task.ActualStart ? new Date(task.ActualStart) : null;
      const actualFinish = task.ActualFinish ? new Date(task.ActualFinish) : null;

      if (outlineLevel === 1) {
        // This is a phase
        const phase = await prisma.phase.create({
          data: {
            name: taskName,
            progress: taskProgress,
            order: parseInt(task.ID || '0'),
            project_id: project.id,
            baseline_start: baselineStart,
            baseline_finish: baselineFinish,
            actual_start: actualStart,
            actual_finish: actualFinish,
          },
        });
        phaseMap.set(taskUID, phase.id);
      } else if (outlineLevel === 2) {
        // This is a task
                const createdTask = await prisma.task.create({
          data: {
            name: taskName,
            progress: taskProgress,
            order: parseInt(task.ID || '0'),
            project: {
              connect: { id: project.id }
            },
            duration: taskDuration,
            xml_uid: taskUID,
            outline_level: outlineLevel,
            baseline_start: baselineStart,
            baseline_finish: baselineFinish,
            actual_start: actualStart,
            actual_finish: actualFinish,
          },
        });
        taskMap.set(taskUID, createdTask.id);
        taskMapByUID.set(taskUID, createdTask);
      } else if (outlineLevel >= 3) {
        // This is a subtask
        const createdTask = await prisma.task.create({
          data: {
            name: taskName,
            progress: taskProgress,
            order: parseInt(task.ID || '0'),
            project: {
              connect: { id: project.id }
            },
            duration: taskDuration,
            xml_uid: taskUID,
            outline_level: outlineLevel,
            baseline_start: baselineStart,
            baseline_finish: baselineFinish,
            actual_start: actualStart,
            actual_finish: actualFinish,
          },
        });
        taskMap.set(taskUID, createdTask.id);
        taskMapByUID.set(taskUID, createdTask);
    }
  }

    // Second pass: Link tasks to phases and establish parent-child relationships
    for (const task of Array.isArray(tasks) ? tasks : [tasks]) {
      const taskUID = task.UID;
      const outlineLevel = parseInt(task.OutlineLevel || '1');
      
      if (outlineLevel === 2) {
        // Find parent phase
        const parentPhaseUID = findParentPhaseUID(tasks, taskUID);
        if (parentPhaseUID && phaseMap.has(parentPhaseUID)) {
          await prisma.task.update({
            where: { id: taskMap.get(taskUID) },
            data: { phase_id: phaseMap.get(parentPhaseUID) },
        });
      }
      } else if (outlineLevel >= 3) {
        // Find parent task
        const parentTaskUID = findParentTaskUID(tasks, taskUID);
        if (parentTaskUID && taskMap.has(parentTaskUID)) {
          await prisma.task.update({
            where: { id: taskMap.get(taskUID) },
            data: { parent_task_id: taskMap.get(parentTaskUID) },
          });
      }
    }
  }

    // Extract and process resources (employees)
    const resources = projectData.Resources?.Resource || [];
    const resourceMap = new Map();

    for (const resource of Array.isArray(resources) ? resources : [resources]) {
      if (resource.Name && resource.UID !== '0') {
        const email = `${resource.Name.toLowerCase().replace(/\s+/g, '.')}@salam.com`;
        
        // Ensure default department exists
        const defaultDepartment = await prisma.department.upsert({
          where: { id: 1 },
          update: {},
          create: {
            id: 1,
            name: 'Information Technology',
            description: 'IT Department responsible for all technical infrastructure and systems'
          }
        });

        const employee = await prisma.employee.upsert({
          where: { email: email },
          update: {},
          create: {
            name: resource.Name,
            name_ar: resource.Name,
            email: email,
            job_title: 'Project Team Member',
            job_title_ar: 'عضو فريق المشروع',
            department: {
              connect: { id: defaultDepartment.id }
            },
          },
        });
        resourceMap.set(resource.UID, employee.id);
        }
    }

    // Extract and process assignments
    const assignments = projectData.Assignments?.Assignment || [];

    for (const assignment of Array.isArray(assignments) ? assignments : [assignments]) {
      const taskUID = assignment.TaskUID;
      const resourceUID = assignment.ResourceUID;
      
      if (taskMap.has(taskUID) && resourceMap.has(resourceUID)) {
        const units = isNaN(parseFloat(assignment.Units)) ? 100 : parseFloat(assignment.Units);

        await prisma.taskAssignment.create({
          data: {
            task: {
              connect: { id: taskMap.get(taskUID) }
            },
            employee: {
              connect: { id: resourceMap.get(resourceUID) }
            },
            units: units,
            role: 'member',
          },
        });
      }
    }

    // Update project progress based on phases
    await updateProjectProgress(project.id);

    return NextResponse.json({ 
      message: 'Project imported successfully',
      projectId: project.id,
      tasksCount: taskMap.size,
      resourcesCount: resourceMap.size,
      assignmentsCount: assignments.length
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import XML file' }, { status: 500 });
  }
}

// Helper function to find parent phase UID
function findParentPhaseUID(tasks: Array<{
  UID: string;
  OutlineLevel?: string;
}>, currentTaskUID: string): string | null {
  const currentTask = tasks.find(t => t.UID === currentTaskUID);
  if (!currentTask) return null;

  const currentIndex = tasks.findIndex(t => t.UID === currentTaskUID);
  
  // Look backwards to find the nearest phase
  for (let i = currentIndex - 1; i >= 0; i--) {
    const task = tasks[i];
    if (parseInt(task.OutlineLevel || '1') === 1) {
      return task.UID;
      }
  }
  
  return null;
}

// Helper function to find parent task UID
function findParentTaskUID(tasks: Array<{
  UID: string;
  OutlineLevel?: string;
}>, currentTaskUID: string): string | null {
  const currentTask = tasks.find(t => t.UID === currentTaskUID);
  if (!currentTask) return null;

  const currentIndex = tasks.findIndex(t => t.UID === currentTaskUID);
  const currentLevel = parseInt(currentTask.OutlineLevel || '1');
  
  // Look backwards to find the nearest task with lower outline level
  for (let i = currentIndex - 1; i >= 0; i--) {
    const task = tasks[i];
    const taskLevel = parseInt(task.OutlineLevel || '1');
    if (taskLevel < currentLevel) {
      return task.UID;
    }
  }
  
  return null;
}

// Helper function to update project progress
async function updateProjectProgress(projectId: number) {
  const phases = await prisma.phase.findMany({
    where: { project_id: projectId },
    include: {
      tasks: {
        include: {
          subtasks: true,
        },
      },
    },
  });

  let totalPhaseProgress = 0;
  let phaseCount = 0;

  for (const phase of phases) {
    let totalTaskProgress = 0;
    let taskCount = 0;

    for (const task of phase.tasks) {
      let totalSubtaskProgress = 0;
      let subtaskCount = 0;

      for (const subtask of task.subtasks) {
        totalSubtaskProgress += subtask.progress;
        subtaskCount++;
  }

      // Update task progress based on subtasks
      const taskProgress = subtaskCount > 0 ? totalSubtaskProgress / subtaskCount : task.progress;
      await prisma.task.update({
        where: { id: task.id },
        data: { progress: taskProgress },
      });

      totalTaskProgress += taskProgress;
      taskCount++;
  }

    // Update phase progress based on tasks
    const phaseProgress = taskCount > 0 ? totalTaskProgress / taskCount : phase.progress;
    await prisma.phase.update({
      where: { id: phase.id },
      data: { progress: phaseProgress },
    });

    totalPhaseProgress += phaseProgress;
    phaseCount++;
  }

  // Update project progress based on phases
  const projectProgress = phaseCount > 0 ? totalPhaseProgress / phaseCount : 0;
  await prisma.project.update({
    where: { id: projectId },
    data: { progress: projectProgress },
  });
} 