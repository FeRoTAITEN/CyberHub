import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts/assignments - Get all shift assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const whereClause: {
      employee_id?: number;
      date?: Date;
      month?: number;
      year?: number;
    } = {};

    if (date) {
      whereClause.date = new Date(date);
    }

    if (employeeId) {
      whereClause.employee_id = parseInt(employeeId);
    }

    if (month && year) {
      whereClause.month = parseInt(month);
      whereClause.year = parseInt(year);
    }

    const assignments = await prisma.shiftAssignment.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            department: true
          }
        },
        shift: true
      },
      orderBy: [
        { date: 'asc' },
        { shift: { start_time: 'asc' } }
      ]
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching shift assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shift assignments' },
      { status: 500 }
    );
  }
}

// POST /api/shifts/assignments - Create a new shift assignment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, shift_id, employee_id, assigned_by = 1 } = body;

    // Validate required fields
    if (!date || !shift_id || !employee_id) {
      return NextResponse.json(
        { error: 'Missing required fields: date, shift_id, employee_id' },
        { status: 400 }
      );
    }

    // Check if employee exists and is active
    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
      include: { department: true }
    });

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if shift exists
    const shift = await prisma.shift.findUnique({
      where: { id: shift_id }
    });

    if (!shift) {
      return NextResponse.json(
        { error: 'Shift not found' },
        { status: 404 }
      );
    }

    // Check if employee is already assigned to this shift on this date
    const existingAssignment = await prisma.shiftAssignment.findFirst({
      where: {
        date: new Date(date),
        employee_id: employee_id
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Employee is already assigned to a shift on this date' },
        { status: 400 }
      );
    }

    // Check if employee is marked as unavailable on this date
    const unavailability = await prisma.memberAvailability.findFirst({
      where: {
        employee_id: employee_id,
        date: new Date(date)
      }
    });

    if (unavailability) {
      return NextResponse.json(
        { error: 'Employee is marked as unavailable on this date' },
        { status: 400 }
      );
    }

    // Check shift capacity
    const currentAssignments = await prisma.shiftAssignment.count({
      where: {
        date: new Date(date),
        shift_id: shift_id
      }
    });

    if (currentAssignments >= shift.max_members) {
      return NextResponse.json(
        { error: `Shift is at maximum capacity (${shift.max_members} members)` },
        { status: 400 }
      );
    }

    // Create the assignment
    const assignment = await prisma.shiftAssignment.create({
      data: {
        date: new Date(date),
        shift_id: parseInt(shift_id),
        employee_id: parseInt(employee_id),
        assigned_by: parseInt(assigned_by),
        status: 'assigned'
      },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        shift: true
      }
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Error creating shift assignment:', error);
    return NextResponse.json(
      { error: 'Failed to create shift assignment' },
      { status: 500 }
    );
  }
}

// PUT /api/shifts/assignments - Update a shift assignment
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, assigned_by } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    const assignment = await prisma.shiftAssignment.update({
      where: { id: parseInt(id) },
      data: {
        status,
        assigned_by: assigned_by ? parseInt(assigned_by) : undefined
      },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        shift: true
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error updating shift assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update shift assignment' },
      { status: 500 }
    );
  }
}

// DELETE /api/shifts/assignments - Delete a shift assignment
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    await prisma.shiftAssignment.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete shift assignment' },
      { status: 500 }
    );
  }
} 