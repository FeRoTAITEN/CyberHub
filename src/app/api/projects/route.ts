import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/projects - Get all projects with their phases, tasks, and assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (priority && priority !== 'all') {
      where.priority = priority;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            name_ar: true,
            email: true,
          },
        },
        phases: {
          orderBy: {
            order: 'asc',
          },
          include: {
            tasks: {
              where: {
                parent_task_id: null, // Only root tasks in phases (not subtasks)
              },
              orderBy: {
                order: 'asc',
              },
              include: {
                subtasks: {
                  orderBy: {
                    order: 'asc',
                  },
                  include: {
                    assignments: {
                      include: {
                        employee: {
                          select: {
                            id: true,
                            name: true,
                            name_ar: true,
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
                assignments: {
                  include: {
                    employee: {
                      select: {
                        id: true,
                        name: true,
                        name_ar: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        tasks: {
          where: {
            phase_id: null, // Only tasks not assigned to any phase
            parent_task_id: null, // Only root tasks (not subtasks)
          },
          orderBy: {
            order: 'asc',
          },
          include: {
            subtasks: {
              orderBy: {
                order: 'asc',
              },
              include: {
                assignments: {
                  include: {
                    employee: {
                      select: {
                        id: true,
                        name: true,
                        name_ar: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
            assignments: {
              include: {
                employee: {
                  select: {
                    id: true,
                    name: true,
                    name_ar: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, description, start_date, end_date, manager_id, priority } = body;

    if (!name || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        manager_id: manager_id ? parseInt(manager_id) : null,
        priority: priority || 'medium',
        progress: 0,
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            name_ar: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
} 