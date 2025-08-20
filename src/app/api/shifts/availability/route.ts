import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts/availability - Get all availability records
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

    if (month) {
      whereClause.month = parseInt(month);
    }

    if (year) {
      whereClause.year = parseInt(year);
    }

    const availability = await prisma.memberAvailability.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            department: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { employee: { name: 'asc' } }
      ]
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability records' },
      { status: 500 }
    );
  }
}

// POST /api/shifts/availability - Create a new availability record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { employee_id, date, reason, reason_ar, notes, created_by = 1 } = body;

    // Validate required fields
    if (!employee_id || !date || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields: employee_id, date, reason' },
        { status: 400 }
      );
    }

    // Check if employee exists
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

    // Check if availability record already exists for this employee and date
    const existingAvailability = await prisma.memberAvailability.findFirst({
      where: {
        employee_id: employee_id,
        date: new Date(date)
      }
    });

    if (existingAvailability) {
      return NextResponse.json(
        { error: 'Availability record already exists for this employee and date' },
        { status: 400 }
      );
    }

    // Check if employee has shift assignments on this date
    const existingAssignment = await prisma.shiftAssignment.findFirst({
      where: {
        employee_id: employee_id,
        date: new Date(date)
      }
    });

    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Employee has existing shift assignment on this date. Please remove assignment first.' },
        { status: 400 }
      );
    }

    // Create the availability record
    const availability = await prisma.memberAvailability.create({
      data: {
        employee_id: parseInt(employee_id),
        date: new Date(date),
        reason: reason,
        reason_ar: reason_ar || reason,
        notes: notes || null,
        created_by: parseInt(created_by)
      },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    console.error('Error creating availability record:', error);
    return NextResponse.json(
      { error: 'Failed to create availability record' },
      { status: 500 }
    );
  }
}

// PUT /api/shifts/availability - Update an availability record
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, reason, reason_ar, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Availability record ID is required' },
        { status: 400 }
      );
    }

    const availability = await prisma.memberAvailability.update({
      where: { id: parseInt(id) },
      data: {
        reason,
        reason_ar: reason_ar || reason,
        notes
      },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error updating availability record:', error);
    return NextResponse.json(
      { error: 'Failed to update availability record' },
      { status: 500 }
    );
  }
}

// DELETE /api/shifts/availability - Delete an availability record
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Availability record ID is required' },
        { status: 400 }
      );
    }

    await prisma.memberAvailability.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Availability record deleted successfully' });
  } catch (error) {
    console.error('Error deleting availability record:', error);
    return NextResponse.json(
      { error: 'Failed to delete availability record' },
      { status: 500 }
    );
  }
} 