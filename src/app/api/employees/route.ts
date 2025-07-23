import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Return all employees with department info
export async function GET(req: NextRequest) {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        department: true
      }
    });
    // Map to include name_ar and job_title_ar if available (for demo, fallback to name/job_title)
    const mapped = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      job_title: emp.job_title,
      email: emp.email,
      phone: emp.phone,
      avatar: emp.avatar,
      location: emp.location,
      hire_date: emp.hire_date,
      status: emp.status,
      department: emp.department ? {
        id: emp.department.id,
        name: emp.department.name,
        description: emp.department.description
      } : null
    }));
    return NextResponse.json({ employees: mapped });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch employees.' }, { status: 500 });
  }
} 