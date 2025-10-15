import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/shifts/assign -> Create a new shift assignment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, shift_id, staff_id, assigned_by = 1 } = body;

    if (!date || !shift_id || !staff_id) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing required fields: date, shift_id, staff_id' 
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

    // Check if shift exists
    const shift = await prisma.shift.findUnique({ 
      where: { id: shift_id } 
    });
    if (!shift) {
      return NextResponse.json({ 
        success: false,
        error: 'Shift not found' 
      }, { status: 404 });
    }

    const dayStart = new Date(date);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    // Check if employee is already assigned on this date
    const existingAssignment = await prisma.employeeShiftAssignment.findFirst({
      where: { 
        employee_id: staff_id, 
        date: { gte: dayStart, lt: dayEnd } 
      }
    });
    if (existingAssignment) {
      return NextResponse.json({ 
        success: false,
        error: 'Employee already assigned on this date' 
      }, { status: 400 });
    }

    // Check if employee is unavailable
    const unavailability = await prisma.memberAvailability.findFirst({
      where: { 
        employee_id: staff_id, 
        date: { gte: dayStart, lt: dayEnd } 
      }
    });
    if (unavailability) {
      return NextResponse.json({ 
        success: false,
        error: 'Employee is unavailable on this date' 
      }, { status: 400 });
    }

    // Check shift capacity
    const countOnShift = await prisma.employeeShiftAssignment.count({
      where: { 
        date: { gte: dayStart, lt: dayEnd }, 
        shift_id 
      }
    });
    if (countOnShift >= (shift.max_members || 5)) {
      return NextResponse.json({ 
        success: false,
        error: `Shift is at maximum capacity (${shift.max_members})` 
      }, { status: 400 });
    }

    // Create assignment
    const assignment = await prisma.employeeShiftAssignment.create({
      data: { 
        date: dayStart, 
        shift_id, 
        employee_id: staff_id, 
        assigned_by, 
        status: 'assigned' 
      },
      include: { 
        employee: true, 
        shift: true 
      }
    });

    // Transform response to match frontend expectations
    const transformedAssignment = {
      id: assignment.id,
      date: assignment.date,
      shift: {
        id: assignment.shift.id,
        name: assignment.shift.name,
        name_ar: assignment.shift.name_ar
      },
      staff: {
        id: assignment.employee.id,
        name: assignment.employee.name,
        name_ar: assignment.employee.name_ar
      },
      shift_id: assignment.shift_id,
      staff_id: assignment.employee_id,
      status: assignment.status
    };

    return NextResponse.json({ 
      success: true,
      data: transformedAssignment 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create assignment' 
    }, { status: 500 });
  }
} 