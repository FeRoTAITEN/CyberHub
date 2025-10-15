import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { employeeId, patternCode } = await request.json();

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    // Update employee pattern
    const updatedEmployee = await prisma.employee.update({
      where: { id: parseInt(employeeId) },
      data: { pattern_code: patternCode },
      select: {
        id: true,
        name: true,
        name_ar: true,
        pattern_code: true,
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Pattern updated successfully',
      employee: updatedEmployee 
    });

  } catch (error) {
    console.error('Error updating employee pattern:', error);
    return NextResponse.json({ 
      error: 'Failed to update employee pattern' 
    }, { status: 500 });
  }
}
