import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts - Get all shifts
export async function GET(req: NextRequest) {
  try {
    const shifts = await prisma.shift.findMany({
      orderBy: {
        start_time: 'asc'
      }
    });

    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}

// POST /api/shifts - Create a new shift
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, name_ar, start_time, end_time, min_members, max_members } = body;

    // Validate required fields
    if (!name || !name_ar || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return NextResponse.json(
        { error: 'Invalid time format. Use HH:MM format' },
        { status: 400 }
      );
    }

    // Validate member limits
    if (min_members < 1 || max_members < min_members) {
      return NextResponse.json(
        { error: 'Invalid member limits' },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.create({
      data: {
        name,
        name_ar,
        start_time,
        end_time,
        min_members: min_members || 3,
        max_members: max_members || 5
      }
    });

    return NextResponse.json(shift, { status: 201 });
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json(
      { error: 'Failed to create shift' },
      { status: 500 }
    );
  }
}

// PUT /api/shifts - Update a shift
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, name_ar, start_time, end_time, min_members, max_members } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Shift ID is required' },
        { status: 400 }
      );
    }

    const shift = await prisma.shift.update({
      where: { id: parseInt(id) },
      data: {
        name,
        name_ar,
        start_time,
        end_time,
        min_members,
        max_members
      }
    });

    return NextResponse.json(shift);
  } catch (error) {
    console.error('Error updating shift:', error);
    return NextResponse.json(
      { error: 'Failed to update shift' },
      { status: 500 }
    );
  }
}

// DELETE /api/shifts - Delete a shift
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Shift ID is required' },
        { status: 400 }
      );
    }

    // Check if shift has assignments
    const assignments = await prisma.shiftAssignment.findMany({
      where: { shift_id: parseInt(id) }
    });

    if (assignments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete shift with existing assignments' },
        { status: 400 }
      );
    }

    await prisma.shift.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json(
      { error: 'Failed to delete shift' },
      { status: 500 }
    );
  }
} 