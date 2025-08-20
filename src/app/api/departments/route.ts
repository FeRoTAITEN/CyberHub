import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/departments - Get all departments
export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            name_ar: true,
            email: true
          }
        },
        employees: {
          where: {
            is_active: true
          },
          select: {
            id: true,
            name: true,
            name_ar: true,
            email: true,
            job_title: true,
            job_title_ar: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    );
  }
}

// POST /api/departments - Create a new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      name,
      description,
      manager_id
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Department name is required' },
        { status: 400 }
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
        description,
        manager_id: manager_id ? parseInt(manager_id) : null
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            name_ar: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ department }, { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
} 