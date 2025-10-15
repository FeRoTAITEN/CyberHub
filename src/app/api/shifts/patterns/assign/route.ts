import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/shifts/patterns/assign -> Assign pattern to employees
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pattern_code, employee_ids, clear_all } = body;

    // Handle clear all request
    if (clear_all) {
      await prisma.employee.updateMany({
        where: { pattern_code: { not: null } },
        data: { pattern_code: null }
      });

      return NextResponse.json({ 
        success: true,
        message: 'All pattern assignments cleared' 
      });
    }

    // Validate inputs
    if (!pattern_code || !Array.isArray(employee_ids)) {
      return NextResponse.json({ 
        success: false,
        error: 'Pattern code and employee IDs array are required' 
      }, { status: 400 });
    }

    // First, clear pattern for all employees that were previously assigned to this pattern
    await prisma.employee.updateMany({
      where: { pattern_code },
      data: { pattern_code: null }
    });

    // Then, assign the pattern to selected employees
    await prisma.employee.updateMany({
      where: { id: { in: employee_ids } },
      data: { pattern_code }
    });

    // Get updated employee list
    const updatedEmployees = await prisma.employee.findMany({
      where: { id: { in: employee_ids } },
      select: {
        id: true,
        name: true,
        name_ar: true,
        pattern_code: true
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `Pattern ${pattern_code} assigned to ${employee_ids.length} employees`,
      data: updatedEmployees
    });

  } catch (error) {
    console.error('Error assigning pattern:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to assign pattern' 
    }, { status: 500 });
  }
}

// GET /api/shifts/patterns/assign -> Get pattern assignments
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      where: { pattern_code: { not: null } },
      select: {
        id: true,
        name: true,
        name_ar: true,
        pattern_code: true
      }
    });

    return NextResponse.json({ 
      success: true,
      data: employees 
    });

  } catch (error) {
    console.error('Error fetching pattern assignments:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch pattern assignments' 
    }, { status: 500 });
  }
} 