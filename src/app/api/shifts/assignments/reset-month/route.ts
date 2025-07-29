import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { year, month } = await req.json();
    if (!year || !month) {
      return NextResponse.json({ success: false, error: 'year and month are required' }, { status: 400 });
    }
    // month: 1-based (1=January)
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const deleted = await prisma.shiftAssignment.deleteMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });
    return NextResponse.json({ success: true, deletedCount: deleted.count });
  } catch (error) {
    console.error('Error resetting month assignments:', error);
    return NextResponse.json({ success: false, error: 'Failed to reset month assignments' }, { status: 500 });
  }
} 