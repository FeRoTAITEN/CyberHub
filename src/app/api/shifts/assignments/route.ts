import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts/assignments?year=YYYY&month=MM -> List assignments for a month
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get('year'));
    const month = Number(searchParams.get('month'));
    const staffId = searchParams.get('staffId');

    if (!year || !month) {
      return NextResponse.json({ 
        success: false,
        error: 'Year and month parameters required' 
      }, { status: 400 });
    }

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 1);

    const assignments = await prisma.employeeShiftAssignment.findMany({
      where: { 
        date: { gte: monthStart, lt: monthEnd },
        ...(staffId ? { employee_id: parseInt(staffId) } : {})
      },
      include: {
        shift: true,
        employee: true
      },
      orderBy: [{ date: 'asc' }, { shift_id: 'asc' }]
    });

    console.log(`Found ${assignments.length} assignments for ${staffId ? `staff ${staffId}` : 'all staff'} in ${year}-${month}`);

    // Transform data to match frontend expectations
    const transformedAssignments = assignments.map(a => ({
      id: a.id,
      date: a.date,
      shift: {
        id: a.shift.id,
        name: a.shift.name,
        name_ar: a.shift.name_ar
      },
      employee: {
        id: a.employee.id,
        name: a.employee.name,
        name_ar: a.employee.name_ar
      },
      shift_id: a.shift_id,
      employee_id: a.employee_id,
      status: a.status
    }));

    return NextResponse.json({ 
      success: true,
      assignments: transformedAssignments 
    });

  } catch (error) {
    console.error('Error listing assignments:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to list assignments' 
    }, { status: 500 });
  }
}

// DELETE /api/shifts/assignments?id=X -> Delete a specific assignment
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get('id'));
    
    if (!id) {
      return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 });
    }

    await prisma.employeeShiftAssignment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete assignment' }, { status: 500 });
  }
} 