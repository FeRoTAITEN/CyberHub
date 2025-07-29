import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/employees - Get all employees
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const departmentId = searchParams.get('department_id');
    const status = searchParams.get('status');
    const gender = searchParams.get('gender');
    const isActive = searchParams.get('is_active');
    const search = searchParams.get('search');

    let whereClause: any = {};

    // Filter by department
    if (departmentId) {
      whereClause.department_id = parseInt(departmentId);
    }

    // Filter by status
    if (status) {
      whereClause.status = status;
    }

    // Filter by gender
    if (gender) {
      whereClause.gender = gender;
    }

    // Filter by active status
    if (isActive !== null) {
      whereClause.is_active = isActive === 'true';
    }

    // Search functionality
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { name_ar: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { job_title: { contains: search, mode: 'insensitive' } },
        { job_title_ar: { contains: search, mode: 'insensitive' } }
      ];
    }

    const employees = await prisma.employee.findMany({
      where: whereClause,
      include: {
        department: true
      },
      orderBy: [
        { is_active: 'desc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/employees - Create a new employee
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      name_ar,
      email,
      phone,
      job_title,
      job_title_ar,
      department_id,
      avatar,
      location,
      hire_date,
      status,
      gender,
      is_active
    } = body;

    // Validate required fields
    if (!name || !email || !department_id) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, department_id' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email }
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 400 }
      );
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: department_id }
    });

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      );
    }

    const employee = await prisma.employee.create({
      data: {
        name,
        name_ar: name_ar || name,
        email,
        phone,
        job_title,
        job_title_ar: job_title_ar || job_title,
        department_id: parseInt(department_id),
        avatar,
        location,
        hire_date: hire_date ? new Date(hire_date) : null,
        status: status || 'active',
        gender: gender || 'male',
        is_active: is_active !== undefined ? is_active : true
      },
      include: {
        department: true
      }
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

// PUT /api/employees - Update an employee
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      name_ar,
      email,
      phone,
      job_title,
      job_title_ar,
      department_id,
      avatar,
      location,
      hire_date,
      status,
      gender,
      is_active
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingEmployee.email) {
      const emailExists = await prisma.employee.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Employee with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Check if department exists if being updated
    if (department_id) {
      const department = await prisma.department.findUnique({
        where: { id: parseInt(department_id) }
      });

      if (!department) {
        return NextResponse.json(
          { error: 'Department not found' },
          { status: 404 }
        );
      }
    }

    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: {
        name,
        name_ar,
        email,
        phone,
        job_title,
        job_title_ar,
        department_id: department_id ? parseInt(department_id) : undefined,
        avatar,
        location,
        hire_date: hire_date ? new Date(hire_date) : undefined,
        status,
        gender,
        is_active
      },
      include: {
        department: true
      }
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees - Delete an employee
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Check if employee has shift assignments
    const assignments = await prisma.shiftAssignment.findMany({
      where: { employee_id: parseInt(id) }
    });

    if (assignments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete employee with existing shift assignments' },
        { status: 400 }
      );
    }

    // Check if employee has availability records
    const availability = await prisma.memberAvailability.findMany({
      where: { employee_id: parseInt(id) }
    });

    if (availability.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete employee with existing availability records' },
        { status: 400 }
      );
    }

    await prisma.employee.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
} 