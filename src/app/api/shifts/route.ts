import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts?year=YYYY&month=M
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get('year'));
    const month = Number(searchParams.get('month'));
    if (!year || !month) return NextResponse.json({ assignments: [] });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const assignments = await prisma.employeeShiftAssignment.findMany({
      where: { date: { gte: start, lt: end } },
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
      orderBy: [{ date: 'asc' }, { shift_id: 'asc' }, { employee_id: 'asc' }]
    });

    // Transform to include date as ISO string for client
    const data = assignments.map(a => ({
      ...a,
      date: a.date.toISOString(),
    }));
    return NextResponse.json({ assignments: data });
  } catch (error) {
    console.error('Error listing assignments', error);
    return NextResponse.json({ assignments: [] }, { status: 200 });
  }
} 