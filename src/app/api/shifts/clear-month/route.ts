import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/shifts/clear-month - Clear assignments for a month/quarter/year
export async function POST(req: NextRequest) {
  try {
    const { year, month, mode = 'month' } = await req.json();
    
    if (!year || !month) {
      return NextResponse.json({ 
        success: false,
        error: 'Year and month are required' 
      }, { status: 400 });
    }

    let rangeStart: Date;
    let rangeEnd: Date;

    if (mode === 'month') {
      // Clear single month
      rangeStart = new Date(year, month - 1, 1);
      rangeEnd = new Date(year, month, 1);
    } else if (mode === 'quarter') {
      // Clear entire quarter
      const startMonth = Math.floor((month - 1) / 3) * 3 + 1;
      rangeStart = new Date(year, startMonth - 1, 1);
      rangeEnd = new Date(year, startMonth + 2, 1);
    } else if (mode === 'year') {
      // Clear entire year
      rangeStart = new Date(year, 0, 1);
      rangeEnd = new Date(year + 1, 0, 1);
    } else {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid mode. Must be month, quarter, or year' 
      }, { status: 400 });
    }

    // Delete all assignments in the range
    const result = await prisma.employeeShiftAssignment.deleteMany({
      where: {
        date: {
          gte: rangeStart,
          lt: rangeEnd
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `Cleared ${result.count} assignments`,
      mode,
      year,
      month,
      deletedCount: result.count
    });

  } catch (error) {
    console.error('Error clearing assignments:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to clear assignments' 
    }, { status: 500 });
  }
} 