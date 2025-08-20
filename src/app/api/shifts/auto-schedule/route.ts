import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/shifts/auto-schedule - Auto-schedule shifts for a month
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, assigned_by = 1 } = body;

    if (!year || !month) {
      return NextResponse.json(
        { error: 'Year and month are required' },
        { status: 400 }
      );
    }


    
    // Get all employees
    const employees = await prisma.employee.findMany({
      where: { is_active: true },
      include: {
        department: true,
        shiftAssignments: {
          where: {
            date: {
              gte: new Date(year, month - 1, 1),
              lt: new Date(year, month, 1)
            }
          },
        },
      },
    });

    if (employees.length === 0) {
      return NextResponse.json(
        { error: 'No employees found' },
        { status: 400 }
      );
    }

    // Get all shifts
    const shifts = await prisma.shift.findMany({
      orderBy: { start_time: 'asc' }
    });

    if (shifts.length === 0) {
      return NextResponse.json(
        { error: 'No shifts configured' },
        { status: 400 }
      );
    }

    // Separate employees by gender
    const maleEmployees = employees.filter(emp => emp.gender === 'male');
    const femaleEmployees = employees.filter(emp => emp.gender === 'female');

    // Get shift types
    const morningShift = shifts.find(s => s.name === 'morning' || s.name_ar === 'صباح');
    const eveningShift = shifts.find(s => s.name === 'evening' || s.name_ar === 'مساء');
    const nightShift = shifts.find(s => s.name === 'night' || s.name_ar === 'ليل');

    if (!morningShift || !eveningShift || !nightShift) {
      return NextResponse.json(
        { error: 'Required shifts (morning, evening, night) not configured' },
        { status: 400 }
      );
    }

    // Calculate days in month
    const daysInMonth = new Date(year, month, 0).getDate();

    // Clear existing assignments for the month
    await prisma.shiftAssignment.deleteMany({
      where: {
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1)
        }
      }
    });

    const assignments: Array<{
      date: Date;
      shift_id: number;
      employee_id: number;
      assigned_by: number;
    }> = [];
    const allEmployees = [...maleEmployees, ...femaleEmployees];

    // Create employee groups for rotation
    const employeeGroups = createEmployeeGroups(allEmployees, maleEmployees, femaleEmployees);

    // Schedule for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayOfWeek = currentDate.getDay();

      // Skip weekends (Saturday = 6, Sunday = 0) - adjust as needed
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }

      // Get week number (0-based)
      const weekNumber = Math.floor((day - 1) / 7);

      // Assign employees to shifts based on rotation
      const dayAssignments = await assignEmployeesToShifts(
        currentDate,
        employeeGroups,
        weekNumber,
        morningShift,
        eveningShift,
        nightShift,
        assigned_by
      );

      assignments.push(...dayAssignments);
    }

    return NextResponse.json({
      message: 'Auto-scheduling completed successfully',
      assignments: assignments.length,
      month: month,
      year: year
    });

  } catch (error) {
    console.error('Error in auto-scheduling:', error);
    return NextResponse.json(
      { error: 'Failed to perform auto-scheduling' },
      { status: 500 }
    );
  }
}

// Helper function to create employee groups
function createEmployeeGroups(allEmployees: Array<{id: number; gender: string | null}>, maleEmployees: Array<{id: number; gender: string | null}>, femaleEmployees: Array<{id: number; gender: string | null}>) {
  const groups = [];
  
  // Group 1: Male employees for night shift rotation
  const maleGroup1 = maleEmployees.slice(0, Math.ceil(maleEmployees.length / 2));
  const maleGroup2 = maleEmployees.slice(Math.ceil(maleEmployees.length / 2));
  
  // Group 2: Female employees for morning/evening rotation
  const femaleGroup1 = femaleEmployees.slice(0, Math.ceil(femaleEmployees.length / 2));
  const femaleGroup2 = femaleEmployees.slice(Math.ceil(femaleEmployees.length / 2));
  
  groups.push({
    name: 'Group 1',
    employees: [...maleGroup1, ...femaleGroup1],
    maleEmployees: maleGroup1,
    femaleEmployees: femaleGroup1
  });
  
  groups.push({
    name: 'Group 2', 
    employees: [...maleGroup2, ...femaleGroup2],
    maleEmployees: maleGroup2,
    femaleEmployees: femaleGroup2
  });
  
  return groups;
}

// Helper function to assign employees to shifts for a specific day
async function assignEmployeesToShifts(
  date: Date,
  employeeGroups: Array<{
    name: string;
    employees: Array<{
      id: number;
      gender: string | null;
    }>;
    maleEmployees: Array<{
      id: number;
      gender: string | null;
    }>;
    femaleEmployees: Array<{
      id: number;
      gender: string | null;
    }>;
  }>,
  weekNumber: number,
  morningShift: {
    id: number;
    min_members: number;
  },
  eveningShift: {
    id: number;
    min_members: number;
  },
  nightShift: {
    id: number;
    min_members: number;
  },
  assigned_by: number
) {
  const assignments: Array<{
    id: number;
    date: Date;
    shift_id: number;
    employee_id: number;
    assigned_by: number;
    status: string;
  }> = [];
  
  // Determine which group is active this week
  const activeGroup = employeeGroups[weekNumber % employeeGroups.length];
  
  // Get available employees (not marked as unavailable)
  const unavailableEmployees = await prisma.memberAvailability.findMany({
    where: { date: date },
    select: { employee_id: true }
  });
  
  const unavailableIds = unavailableEmployees.map(u => u.employee_id);
  const availableEmployees = activeGroup.employees.filter(
    (emp: {id: number; gender: string | null}) => !unavailableIds.includes(emp.id)
  );
  
  // Assign to night shift (males only)
  const availableMales = availableEmployees.filter((emp: {id: number; gender: string | null}) => emp.gender === 'male');
  const nightAssignments = Math.min(nightShift.min_members, availableMales.length);
  
  for (let i = 0; i < nightAssignments; i++) {
    const employee = availableMales[i];
    const assignment = await prisma.shiftAssignment.create({
      data: {
        date: date,
        shift_id: nightShift.id,
        employee_id: employee.id,
        assigned_by: assigned_by,
        status: 'assigned'
      }
    });
    assignments.push(assignment);
  }
  
  // Assign remaining employees to morning and evening shifts
  const remainingEmployees = availableEmployees.filter(
    (emp: {id: number; gender: string | null}) => !assignments.some(a => a.employee_id === emp.id)
  );
  
  // Distribute remaining employees between morning and evening
  const morningAssignments = Math.min(morningShift.min_members, Math.ceil(remainingEmployees.length / 2));
  const eveningAssignments = Math.min(eveningShift.min_members, remainingEmployees.length - morningAssignments);
  
  // Assign to morning shift
  for (let i = 0; i < morningAssignments; i++) {
    const employee = remainingEmployees[i];
    const assignment = await prisma.shiftAssignment.create({
      data: {
        date: date,
        shift_id: morningShift.id,
        employee_id: employee.id,
        assigned_by: assigned_by,
        status: 'assigned'
      }
    });
    assignments.push(assignment);
  }
  
  // Assign to evening shift
  for (let i = morningAssignments; i < morningAssignments + eveningAssignments; i++) {
    const employee = remainingEmployees[i];
    const assignment = await prisma.shiftAssignment.create({
      data: {
        date: date,
        shift_id: eveningShift.id,
        employee_id: employee.id,
        assigned_by: assigned_by,
        status: 'assigned'
      }
    });
    assignments.push(assignment);
  }
  
  return assignments;
} 