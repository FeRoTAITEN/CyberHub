import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { date } = await req.json();

    if (!date) {
      return NextResponse.json(
        { success: false, error: "Date is required" },
        { status: 400 }
      );
    }

    // Delete all assignments for the specific date
    const deletedAssignments = await prisma.shiftAssignment.deleteMany({
      where: {
        date: new Date(date),
        status: 'assigned'
      }
    });

    return NextResponse.json({
      success: true,
      message: `تم حذف جميع مناوبات اليوم بنجاح (${deletedAssignments.count} مناوبة)`,
      deletedCount: deletedAssignments.count
    });

  } catch (error) {
    console.error('Error deleting day assignments:', error);
    return NextResponse.json(
      { success: false, error: "Failed to delete day assignments" },
      { status: 500 }
    );
  }
} 