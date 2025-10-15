import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts/availability?staffId=X&year=YYYY&month=MM -> Get employee unavailability
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get('staffId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!staffId || !year || !month) {
      return NextResponse.json({ 
        success: false,
        error: 'staffId, year, and month are required' 
      }, { status: 400 });
    }

    const monthStart = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthEnd = new Date(parseInt(year), parseInt(month), 1);

    const availability = await prisma.memberAvailability.findMany({
      where: {
        employee_id: parseInt(staffId),
        date: {
          gte: monthStart,
          lt: monthEnd
        }
      },
      include: {
        employee: true
      },
      orderBy: { date: 'asc' }
    });

    return NextResponse.json({ 
      success: true,
      availability 
    });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch availability' 
    }, { status: 500 });
  }
}

// POST /api/shifts/availability -> Create unavailability record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, staff_id, reason, reason_ar } = body;

    if (!date || !staff_id || !reason) {
      return NextResponse.json({ 
        success: false,
        error: 'date, staff_id, and reason are required' 
      }, { status: 400 });
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: staff_id }
    });

    if (!employee) {
      return NextResponse.json({ 
        success: false,
        error: 'Employee not found' 
      }, { status: 404 });
    }

    // Create unavailability record
    const availability = await prisma.memberAvailability.create({
      data: {
        date: new Date(date),
        employee_id: staff_id,
        reason,
        reason_ar: reason_ar || reason,
        created_by: 1, // Default admin user
        notes: ''
      },
      include: {
        employee: true
      }
    });

    return NextResponse.json({ 
      success: true,
      data: availability 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating availability:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create availability' 
    }, { status: 500 });
  }
}

// DELETE /api/shifts/availability?id=X -> Delete unavailability record
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false,
        error: 'Availability ID is required' 
      }, { status: 400 });
    }

    await prisma.memberAvailability.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Availability record deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting availability:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete availability' 
    }, { status: 500 });
  }
} 