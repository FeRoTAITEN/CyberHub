import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/shifts/assignments/reset-all - Reset all shift assignments
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, endDate, reason } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    // Validate date format
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (start > end) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Delete all assignments within the date range
    const deletedAssignments = await prisma.shiftAssignment.deleteMany({
      where: {
        date: {
          gte: start,
          lte: end
        }
      }
    });

    return NextResponse.json({
      message: 'All shift assignments reset successfully',
      deletedCount: deletedAssignments.count,
      dateRange: {
        start: startDate,
        end: endDate
      },
      reason: reason || 'Manual reset'
    });
  } catch (error) {
    console.error('Error resetting shift assignments:', error);
    return NextResponse.json(
      { error: 'Failed to reset shift assignments' },
      { status: 500 }
    );
  }
}

// GET /api/shifts/assignments/reset-all - Get reset statistics
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Count assignments in the date range
    const assignmentCount = await prisma.shiftAssignment.count({
      where: {
        date: {
          gte: start,
          lte: end
        }
      }
    });

    // Get unique employees with assignments in the range
    const uniqueEmployees = await prisma.shiftAssignment.findMany({
      where: {
        date: {
          gte: start,
          lte: end
        }
      },
      select: {
        employee_id: true
      },
      distinct: ['employee_id']
    });

    // Get shift distribution
    const shiftDistribution = await prisma.shiftAssignment.groupBy({
      by: ['shift_id'],
      where: {
        date: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      dateRange: {
        start: startDate,
        end: endDate
      },
      statistics: {
        totalAssignments: assignmentCount,
        uniqueEmployees: uniqueEmployees.length,
        shiftDistribution: shiftDistribution
      }
    });
  } catch (error) {
    console.error('Error getting reset statistics:', error);
    return NextResponse.json(
      { error: 'Failed to get reset statistics' },
      { status: 500 }
    );
  }
} 