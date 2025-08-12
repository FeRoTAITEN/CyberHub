import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/staff - Get staff members with search and filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: any = {};
    
    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { name_ar: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { job_title: { contains: search, mode: 'insensitive' } },
        { job_title_ar: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Department filter
    if (department) {
      if (department === 'all') {
        // Don't add department filter
      } else if (!isNaN(Number(department))) {
        where.department_id = parseInt(department);
      } else {
        // Search by department name
        where.department = {
          name: { contains: department, mode: 'insensitive' }
        };
      }
    }
    
    // Status filter
    if (status) {
      if (status === 'active') {
        where.is_active = true;
      } else if (status === 'inactive') {
        where.is_active = false;
      }
      // 'all' doesn't add any filter
    }

    // Build query options
    const queryOptions: any = {
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: [
        { is_active: 'desc' }, // Active employees first
        { name: 'asc' },       // Then by name
      ],
    };

    // Apply limit if specified
    if (limit && !isNaN(Number(limit))) {
      queryOptions.take = parseInt(limit);
    }

    const staff = await prisma.employee.findMany(queryOptions);

    // Get additional statistics
    const stats = await prisma.employee.aggregate({
      where: status ? (status === 'active' ? { is_active: true } : status === 'inactive' ? { is_active: false } : {}) : {},
      _count: {
        id: true,
      },
    });

    const activePloy = await prisma.employee.count({
      where: { is_active: true },
    });

    const inactivePloy = await prisma.employee.count({
      where: { is_active: false },
    });

    // Get departments for filtering
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            employees: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: staff,
      meta: {
        total: stats._count.id,
        active: activePloy,
        inactive: inactivePloy,
        filtered: staff.length,
      },
      departments,
      filters: {
        search: search || null,
        department: department || null,
        status: status || null,
        limit: limit ? parseInt(limit) : null,
      },
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch staff members',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// POST /api/staff - Add a new staff member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      name, 
      name_ar, 
      email, 
      phone, 
      job_title, 
      job_title_ar, 
      department_id, 
      location, 
      hire_date, 
      gender, 
      is_active 
    } = body;

    // Validation
    if (!name || !email || !department_id || !job_title) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          required: ['name', 'email', 'job_title', 'department_id']
        }, 
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email }
    });

    if (existingEmployee) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Employee with this email already exists' 
        }, 
        { status: 400 }
      );
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: parseInt(department_id) }
    });

    if (!department) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Department not found' 
        }, 
        { status: 400 }
      );
    }

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        name_ar: name_ar || name,
        email,
        phone,
        job_title,
        job_title_ar: job_title_ar || job_title,
        department_id: parseInt(department_id),
        location,
        hire_date: hire_date ? new Date(hire_date) : null,
        gender: gender || 'male',
        is_active: is_active !== undefined ? is_active : true,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: newEmployee,
      message: 'Staff member created successfully'
    });
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create staff member',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 