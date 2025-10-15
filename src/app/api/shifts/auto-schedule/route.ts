import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type RotationState = {
  phaseIndex: number;
  workDaysCompleted: number;
  restDaysCompleted: number;
  onRest: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, month, assigned_by = 1, patterns, start_date, end_date, mode } = body as { 
      year?: number; 
      month?: number; 
      assigned_by?: number; 
      patterns?: (string | number)[]; 
      start_date?: string; 
      end_date?: string;
      mode?: 'month' | 'quarter' | 'year';
    };

    const usingCustomRange = Boolean(start_date && end_date);
    if (!usingCustomRange && (!year || !month)) {
      return NextResponse.json({ error: 'Provide either (year and month) or (start_date and end_date)' }, { status: 400 });
    }

    const parseYMD = (s: string) => {
      const [y, m, d] = String(s).split('-').map((n) => Number(n));
      return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
    };

    let rangeStart: Date;
    let rangeEndExclusive: Date;

    if (usingCustomRange) {
      rangeStart = parseYMD(start_date as string);
      rangeEndExclusive = new Date(parseYMD(end_date as string).getFullYear(), parseYMD(end_date as string).getMonth(), parseYMD(end_date as string).getDate() + 1, 0, 0, 0, 0);
    } else {
      const baseYear = year as number;
      const baseMonth = month as number;
      
      if (mode === 'quarter') {
        // Calculate quarter start month
        const quarterStartMonth = Math.floor((baseMonth - 1) / 3) * 3 + 1;
        rangeStart = new Date(baseYear, quarterStartMonth - 1, 1);
        rangeEndExclusive = new Date(baseYear, quarterStartMonth + 2, 1); // End of quarter (3 months)
      } else if (mode === 'year') {
        // Full year
        rangeStart = new Date(baseYear, 0, 1); // January 1st
        rangeEndExclusive = new Date(baseYear + 1, 0, 1); // January 1st next year
      } else {
        // Default to month
        rangeStart = new Date(baseYear, baseMonth - 1, 1);
        rangeEndExclusive = new Date(baseYear, baseMonth, 1);
      }
    }

    console.log('Received body:', { year, month, mode, patterns, start_date, end_date });
    console.log(`Auto-schedule mode: ${mode || 'month'}, Range: ${rangeStart.toISOString()} to ${rangeEndExclusive.toISOString()}`);

    // Get last assignments to ensure continuity
    const lastAssignments = await prisma.employeeShiftAssignment.findMany({
      where: {
        date: {
          lt: rangeStart
        }
      },
      include: {
        shift: true,
        employee: true
      },
      orderBy: {
        date: 'desc'
      },
      take: 1000 // Get last 1000 assignments for continuity check
    });

    console.log(`Found ${lastAssignments.length} previous assignments for continuity check`);

    if (rangeEndExclusive <= rangeStart) {
      return NextResponse.json({ error: 'Invalid date range' }, { status: 400 });
    }

    const shifts = await prisma.shift.findMany({ orderBy: { start_time: 'asc' } });
    if (shifts.length < 3) {
      return NextResponse.json({ error: 'Required shifts (morning, day, night) not configured' }, { status: 400 });
    }

    const morningShift = shifts.find(s => s.name.toLowerCase() === 'morning' || s.name_ar === 'صباح');
    const dayShift = shifts.find(s => s.name.toLowerCase() === 'day' || s.name_ar === 'نهار');
    const nightShift = shifts.find(s => s.name.toLowerCase() === 'night' || s.name_ar === 'ليل');
    const lateMorningShift = shifts.find(s => s.name.toLowerCase() === 'late morning' || s.name_ar === 'صباح متأخر');

    if (!morningShift || !dayShift || !nightShift || !lateMorningShift) {
      return NextResponse.json({ error: 'Required shifts not found' }, { status: 400 });
    }

    let staff: Array<{ id: number; pattern_code?: string | null }> = [];
    const includesLateMorning = patterns?.includes('late_morning') || patterns?.includes('late-morning');

    if (includesLateMorning) {
      staff = await prisma.employee.findMany({
        where: { 
          pattern_code: 'late_morning',
          is_active: true 
        },
        select: { 
          id: true,
          pattern_code: true
        }
      });
    } else if (patterns && patterns.length > 0) {
      const patternCodes = patterns.filter(p => typeof p === 'string') as string[];
      staff = await prisma.employee.findMany({
        where: { 
          pattern_code: { in: patternCodes },
          is_active: true 
        },
        select: { 
          id: true,
          pattern_code: true
        }
      });
    } else {
      staff = await prisma.employee.findMany({
        where: { 
          is_active: true,
          pattern_code: { not: null }
        },
        select: { 
          id: true,
          pattern_code: true
        }
      });
    }

    console.log('Found active staff:', staff.length);
    if (staff.length === 0) {
      return NextResponse.json({ error: 'No active staff found for selected patterns' }, { status: 400 });
    }

    await prisma.employeeShiftAssignment.deleteMany({
      where: {
        date: {
          gte: rangeStart,
          lt: rangeEndExclusive
        },
        employee_id: {
          in: staff.map(s => s.id)
        }
      }
    });

    const isWeekend = (d: Date) => d.getDay() === 5 || d.getDay() === 6;

    const getWeekNumber = (d: Date) => {
      const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
      const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    const assignments: Array<{
      date: Date;
      shift_id: number;
      employee_id: number;
      assigned_by: number;
    }> = [];

    const isEmployeeAssigned = (employeeId: number, date: Date) => {
      return assignments.some(a => 
        a.employee_id === employeeId && 
        a.date.getFullYear() === date.getFullYear() &&
        a.date.getMonth() === date.getMonth() &&
        a.date.getDate() === date.getDate()
      );
    };

    const alphaStaff = includesLateMorning ? [] : staff.filter(s => s.pattern_code === 'alpha');
    const betaStaff = includesLateMorning ? [] : staff.filter(s => s.pattern_code === 'beta');
    const deltaStaff = includesLateMorning ? [] : staff.filter(s => s.pattern_code === 'delta');

    const alphaPhases = [
      { name: 'morning', shiftId: morningShift.id, work: 5, rest: 2 },
      { name: 'day', shiftId: dayShift.id, work: 5, rest: 2 },
      { name: 'night', shiftId: nightShift.id, work: 4, rest: 3 },
    ];
    const alphaCycleLength = alphaPhases.reduce((sum, phase) => sum + phase.work + phase.rest, 0);

    const alphaStates = new Map<number, RotationState>();

    // Function to calculate employee state based on last assignments
    const calculateEmployeeState = (employeeId: number): RotationState => {
      // Get last assignments for this employee
      const employeeLastAssignments = lastAssignments
        .filter(a => a.employee_id === employeeId)
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 20); // Last 20 assignments

      if (employeeLastAssignments.length === 0) {
        // No previous assignments, start fresh
        return {
          phaseIndex: 0,
          workDaysCompleted: 0,
          restDaysCompleted: 0,
          onRest: false,
        };
      }

      // Calculate days since last assignment
      const lastAssignmentDate = employeeLastAssignments[0].date;
      const daysSinceLastAssignment = Math.floor((rangeStart.getTime() - lastAssignmentDate.getTime()) / (1000 * 60 * 60 * 24));

      // Find the last shift pattern
      const lastShift = employeeLastAssignments[0].shift;
      let lastPhaseIndex = 0;
      
      if (lastShift.name.toLowerCase() === 'morning' || lastShift.name_ar === 'صباح') {
        lastPhaseIndex = 0;
      } else if (lastShift.name.toLowerCase() === 'day' || lastShift.name_ar === 'نهار') {
        lastPhaseIndex = 1;
      } else if (lastShift.name.toLowerCase() === 'night' || lastShift.name_ar === 'ليل') {
        lastPhaseIndex = 2;
      }

      // Calculate work days completed in last phase
      let workDaysCompleted = 0;
      let consecutiveDays = 0;
      
      for (let i = 0; i < employeeLastAssignments.length; i++) {
        const assignment = employeeLastAssignments[i];
        const currentPhase = alphaPhases[lastPhaseIndex];
        
        if (assignment.shift_id === currentPhase.shiftId) {
          consecutiveDays++;
          if (consecutiveDays <= currentPhase.work) {
            workDaysCompleted++;
          }
        } else {
          break;
        }
      }

      // Calculate state based on days since last assignment
      const state: RotationState = {
        phaseIndex: lastPhaseIndex,
        workDaysCompleted: workDaysCompleted,
        restDaysCompleted: 0,
        onRest: false,
      };

      // Advance state by the days since last assignment
      advanceStateByDays(state, daysSinceLastAssignment);
      
      console.log(`Employee ${employeeId}: Last assignment was ${lastShift.name} on ${lastAssignmentDate.toISOString().split('T')[0]}, days since: ${daysSinceLastAssignment}, calculated state:`, state);
      
      return state;
    };

    const advanceStateByDays = (state: RotationState, days: number) => {
      for (let i = 0; i < days; i++) {
        const phase = alphaPhases[state.phaseIndex];
        if (state.onRest) {
          state.restDaysCompleted++;
          if (state.restDaysCompleted >= phase.rest) {
            state.onRest = false;
            state.restDaysCompleted = 0;
            state.phaseIndex = (state.phaseIndex + 1) % alphaPhases.length;
          }
        } else {
          state.workDaysCompleted++;
          if (state.workDaysCompleted >= phase.work) {
            state.workDaysCompleted = 0;
            if (phase.rest > 0) {
              state.onRest = true;
              state.restDaysCompleted = 0;
            } else {
              state.phaseIndex = (state.phaseIndex + 1) % alphaPhases.length;
            }
          }
        }
      }
    };

    alphaStaff.forEach((employee, index) => {
      // Calculate state based on last assignments for continuity
      const state = calculateEmployeeState(employee.id);
      
      // If no previous assignments, use offset for initial distribution
      if (lastAssignments.filter(a => a.employee_id === employee.id).length === 0) {
        const offset = alphaStaff.length > 0 ? Math.floor((index * alphaCycleLength) / alphaStaff.length) : 0;
        advanceStateByDays(state, offset);
      }
      
      alphaStates.set(employee.id, state);
      console.log(`Employee ${employee.id} (${employee.pattern_code}) initial state:`, state);
    });

    for (let d = new Date(rangeStart); d < rangeEndExclusive; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      if (includesLateMorning) {
        if (isWeekend(d)) continue;
        for (const s of staff) {
          if (isEmployeeAssigned(s.id, d)) continue;
          assignments.push({
            date: new Date(d),
            shift_id: lateMorningShift.id,
            employee_id: s.id,
            assigned_by
          });
        }
        continue;
      }

      for (const employee of alphaStaff) {
        const state = alphaStates.get(employee.id);
        if (!state) continue;
        const phase = alphaPhases[state.phaseIndex];

        if (state.onRest) {
          state.restDaysCompleted++;
          if (state.restDaysCompleted >= phase.rest) {
            state.onRest = false;
            state.restDaysCompleted = 0;
            state.phaseIndex = (state.phaseIndex + 1) % alphaPhases.length;
          }
          continue;
        }

        if (!isEmployeeAssigned(employee.id, d)) {
          assignments.push({
            date: new Date(d),
            shift_id: phase.shiftId,
            employee_id: employee.id,
            assigned_by
          });
        }

        state.workDaysCompleted++;
        if (state.workDaysCompleted >= phase.work) {
          state.workDaysCompleted = 0;
          if (phase.rest > 0) {
            state.onRest = true;
            state.restDaysCompleted = 0;
          } else {
            state.phaseIndex = (state.phaseIndex + 1) % alphaPhases.length;
          }
        }
      }

      const assignShift = (staffList: Array<{ id: number; pattern_code?: string | null }>, shiftId: number) => {
        const result: typeof assignments = [];
        for (const s of staffList) {
          if (isEmployeeAssigned(s.id, d)) continue;
          result.push({
            date: new Date(d),
            shift_id: shiftId,
            employee_id: s.id,
            assigned_by
          });
        }
        return result;
      };

      const weekNumber = getWeekNumber(d) % 2;

      if (betaStaff.length > 0) {
        if (weekNumber === 0) {
          assignments.push(...assignShift(betaStaff, morningShift.id));
        } else {
          assignments.push(...assignShift(betaStaff, dayShift.id));
        }
      }

      if (deltaStaff.length > 0) {
        if (weekNumber === 0) {
          assignments.push(...assignShift(deltaStaff, dayShift.id));
        } else {
          assignments.push(...assignShift(deltaStaff, morningShift.id));
        }
      }
    }

    if (assignments.length > 0) {
      const batchSize = 100;
      for (let i = 0; i < assignments.length; i += batchSize) {
        const batch = assignments.slice(i, i + batchSize);
        await prisma.employeeShiftAssignment.createMany({ data: batch });
      }
    }

    return NextResponse.json({ 
      success: true,
      message: `Created ${assignments.length} assignments for ${staff.length} staff members`
    });

  } catch (error) {
    console.error('Error in auto-scheduling:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to auto-schedule shifts' 
    }, { status: 500 });
  }
} 