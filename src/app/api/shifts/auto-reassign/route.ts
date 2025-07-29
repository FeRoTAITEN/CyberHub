import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { employeeId, date, reason, selectedEmployees } = await req.json();

    if (!employeeId || !date || !reason || !selectedEmployees || !Array.isArray(selectedEmployees)) {
      return NextResponse.json(
        { success: false, error: "Employee ID, date, reason, and selected employees are required" },
        { status: 400 }
      );
    }

    console.log(`Auto-reassigning employee ${employeeId} on ${date} with reason: ${reason}`);

    // Get the employee's current assignment for this date
    const currentAssignment = await prisma.shiftAssignment.findFirst({
      where: {
        employee_id: employeeId,
        date: new Date(date),
        status: 'assigned'
      },
      include: {
        shift: true,
        employee: true
      }
    });

    if (!currentAssignment) {
      return NextResponse.json(
        { success: false, error: "No assignment found for this employee on this date" },
        { status: 404 }
      );
    }

    // Set the employee as unavailable
    const unavailability = await prisma.memberAvailability.create({
      data: {
        employee_id: employeeId,
        date: new Date(date),
        reason: reason,
        reason_ar: reason, // You might want to translate this
        notes: `Auto-reassigned due to: ${reason}`,
        created_by: 1
      }
    });

    // Delete the current assignment
    await prisma.shiftAssignment.delete({
      where: {
        id: currentAssignment.id
      }
    });

    // Find a replacement from selected employees
    const replacement = await findReplacement(
      currentAssignment.shift_id,
      date,
      selectedEmployees,
      employeeId
    );

    if (replacement) {
      // Assign the replacement
      const newAssignment = await prisma.shiftAssignment.create({
        data: {
          date: new Date(date),
          shift_id: currentAssignment.shift_id,
          employee_id: replacement.id,
          status: 'assigned',
          assigned_by: 1 // Default admin user
        }
      });

      return NextResponse.json({
        success: true,
        message: `Employee ${currentAssignment.employee.name} was replaced by ${replacement.name}`,
        unavailability: unavailability,
        newAssignment: newAssignment,
        replacement: replacement
      });
    } else {
      return NextResponse.json({
        success: true,
        message: `Employee ${currentAssignment.employee.name} was marked as unavailable, but no replacement was found`,
        unavailability: unavailability,
        warning: "No replacement found"
      });
    }

  } catch (error) {
    console.error('Auto-reassign error:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function findReplacement(
  shiftId: number,
  date: string,
  selectedEmployees: number[],
  excludedEmployeeId: number
) {
  // Get unavailable employees for this date
  const unavailableEmployees = await prisma.memberAvailability.findMany({
    where: {
      date: new Date(date)
    }
  });
  const unavailableEmployeeIds = unavailableEmployees.map(avail => avail.employee_id);

  // Get employees already assigned to this date
  const existingAssignments = await prisma.shiftAssignment.findMany({
    where: {
      date: new Date(date),
      status: 'assigned'
    }
  });
  const alreadyAssignedEmployeeIds = existingAssignments.map(a => a.employee_id);

  // Find available employee from selected employees
  const availableEmployees = await prisma.employee.findMany({
    where: {
      id: {
        in: selectedEmployees.filter(id => 
          id !== excludedEmployeeId && 
          !unavailableEmployeeIds.includes(id) && 
          !alreadyAssignedEmployeeIds.includes(id)
        )
      }
    }
  });

  if (availableEmployees.length === 0) {
    return null;
  }

  // Return the first available employee (you could implement more sophisticated selection logic here)
  return availableEmployees[0];
} 