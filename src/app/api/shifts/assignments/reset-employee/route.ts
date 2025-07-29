import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { year, month, employeeId } = await req.json();
    if (!year || !month || !employeeId) {
      return NextResponse.json({ success: false, error: 'year, month, and employeeId are required' }, { status: 400 });
    }
    // month: 1-based (1=January)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const deleted = await prisma.shiftAssignment.deleteMany({
      where: {
        employee_id: parseInt(employeeId),
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    return NextResponse.json({ success: true, deletedCount: deleted.count });
  } catch (error) {
    console.error('Error resetting employee assignments:', error);
    return NextResponse.json({ success: false, error: 'Failed to reset employee assignments' }, { status: 500 });
  }
} 