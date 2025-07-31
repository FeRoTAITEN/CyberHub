import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/employees/[id] - Get a specific employee
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// PUT /api/employees/[id] - Update an employee
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

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
      status,
      gender,
      is_active
    } = body;

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
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
          { status: 409 }
        );
      }
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        name: name || existingEmployee.name,
        name_ar: name_ar !== undefined ? name_ar : existingEmployee.name_ar,
        email: email || existingEmployee.email,
        phone: phone !== undefined ? phone : existingEmployee.phone,
        job_title: job_title !== undefined ? job_title : existingEmployee.job_title,
        job_title_ar: job_title_ar !== undefined ? job_title_ar : existingEmployee.job_title_ar,
        department_id: department_id ? parseInt(department_id) : existingEmployee.department_id,
        location: location !== undefined ? location : existingEmployee.location,
        hire_date: hire_date ? new Date(hire_date) : existingEmployee.hire_date,
        status: status !== undefined ? status : existingEmployee.status,
        gender: gender !== undefined ? gender : existingEmployee.gender,
        is_active: is_active !== undefined ? is_active : existingEmployee.is_active
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    return NextResponse.json({ employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// DELETE /api/employees/[id] - Delete an employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id }
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting is_active to false
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        is_active: false
      }
    });

    return NextResponse.json({ 
      message: 'Employee deactivated successfully',
      employee 
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    );
  }
} 