import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const date = searchParams.get('date');

    let whereClause: any = {};

    if (employeeId) {
      whereClause.employee_id = parseInt(employeeId);
    }

    if (date) {
      whereClause.date = new Date(date);
    }

    const unavailability = await prisma.memberAvailability.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            name_ar: true,
            email: true,
            department: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { employee: { name: 'asc' } }
      ]
    });

    return NextResponse.json({
      success: true,
      data: unavailability
    });

  } catch (error) {
    console.error('Error fetching unavailability:', error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch unavailability" },
      { status: 500 }
    );
  }
} 