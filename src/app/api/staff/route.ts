import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/staff -> list employees
export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { id: 'asc' },
      include: {
        department: true
      }
    });

    // Transform data to match frontend expectations
    const transformedEmployees = employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      name_ar: employee.name_ar,
      email: employee.email,
      phone: employee.phone,
      job_title: employee.job_title,
      job_title_ar: employee.job_title_ar,
      department: employee.department ? {
        id: employee.department.id,
        name: employee.department.name,
        description: employee.department.description
      } : undefined,
      is_active: employee.is_active
    }));

    return NextResponse.json({ success: true, data: transformedEmployees });
  } catch (error) {
    console.error('Error listing employees', error);
    return NextResponse.json({ success: false, error: 'Failed to list employees' }, { status: 500 });
  }
}

// POST /api/staff -> create/update employee
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    if (data.id) {
      const updated = await prisma.employee.update({ where: { id: Number(data.id) }, data });
      return NextResponse.json({ success: true, data: updated });
    }
    const created = await prisma.employee.create({ data });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating employee', error);
    return NextResponse.json({ success: false, error: 'Failed to save employee' }, { status: 500 });
  }
} 