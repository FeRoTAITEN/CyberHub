import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { employeeId } = await req.json();

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: "Employee ID is required" },
        { status: 400 }
      );
    }

    // Delete all assignments for the employee
    const deletedAssignments = await prisma.shiftAssignment.deleteMany({
      where: {
        employee_id: employeeId,
        status: 'assigned'
      }
    });

    return NextResponse.json({
      success: true,
      message: `تم حذف جميع مناوبات الموظف بنجاح (${deletedAssignments.count} مناوبة)`,
      deletedCount: deletedAssignments.count
    });

  } catch (error) {
    console.error('Error deleting all employee assignments:', error);
    return NextResponse.json(
      { success: false, error: "Failed to delete employee assignments" },
      { status: 500 }
    );
  }
} 