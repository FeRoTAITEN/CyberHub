import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/shifts/availability/[id] - Delete a specific availability record
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Availability record ID is required' },
        { status: 400 }
      );
    }

    // Check if availability record exists
    const availability = await prisma.memberAvailability.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability record not found' },
        { status: 404 }
      );
    }

    // Delete the availability record
    await prisma.memberAvailability.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: 'Availability record deleted successfully',
      deletedRecord: availability
    });
  } catch (error) {
    console.error('Error deleting availability record:', error);
    return NextResponse.json(
      { error: 'Failed to delete availability record' },
      { status: 500 }
    );
  }
}

// GET /api/shifts/availability/[id] - Get a specific availability record
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Availability record ID is required' },
        { status: 400 }
      );
    }

    const availability = await prisma.memberAvailability.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability record:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability record' },
      { status: 500 }
    );
  }
}

// PUT /api/shifts/availability/[id] - Update a specific availability record
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { reason, reason_ar, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Availability record ID is required' },
        { status: 400 }
      );
    }

    // Check if availability record exists
    const existingAvailability = await prisma.memberAvailability.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAvailability) {
      return NextResponse.json(
        { error: 'Availability record not found' },
        { status: 404 }
      );
    }

    const availability = await prisma.memberAvailability.update({
      where: { id: parseInt(id) },
      data: {
        reason,
        reason_ar: reason_ar || reason,
        notes
      },
      include: {
        employee: {
          include: {
            department: true
          }
        }
      }
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error updating availability record:', error);
    return NextResponse.json(
      { error: 'Failed to update availability record' },
      { status: 500 }
    );
  }
} 