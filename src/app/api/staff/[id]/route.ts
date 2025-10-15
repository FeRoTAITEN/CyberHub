import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/staff/[id] -> Get employee details
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid employee ID' 
      }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        department: true
      }
    });

    if (!employee) {
      return NextResponse.json({ 
        success: false,
        error: 'Employee not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      data: employee 
    });

  } catch (error) {
    console.error('Error fetching employee details:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch employee details' 
    }, { status: 500 });
  }
}

// DELETE /api/staff/[id] -> Delete employee
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid employee ID' 
      }, { status: 400 });
    }

    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Employee deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete employee' 
    }, { status: 500 });
  }
} 