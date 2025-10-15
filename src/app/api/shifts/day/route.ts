import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

 // GET /api/shifts/day?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    if (!dateStr) return NextResponse.json({ assignments: [], apologies: [] });

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    // Get assignments for the day
    const assignments = await prisma.employeeShiftAssignment.findMany({
      where: { date: { gte: date, lt: nextDay } },
      include: { 
        shift: true,
        employee: {
          select: {
            id: true,
            name: true,
            name_ar: true,
            pattern_code: true
          }
        }
      },
      orderBy: [{ shift_id: 'asc' }, { employee_id: 'asc' }]
    });

    // Get apologies for the day
    const apologies = await prisma.memberAvailability.findMany({
      where: { date },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            name_ar: true
          }
        }
      }
    });

    return NextResponse.json({
      assignments: assignments.map(a => ({
        ...a,
        date: a.date.toISOString()
      })),
      apologies: apologies.map(a => ({
        ...a,
        date: a.date.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error getting day details:', error);
    return NextResponse.json({ assignments: [], apologies: [] }, { status: 200 });
  }
}

// DELETE /api/shifts/day?date=YYYY-MM-DD
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');
    if (!dateStr) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    await prisma.employeeShiftAssignment.deleteMany({
      where: { date: { gte: date, lt: nextDay } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting day assignments:', error);
    return NextResponse.json({ error: 'Failed to delete assignments' }, { status: 500 });
  }
} 