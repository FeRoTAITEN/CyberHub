import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE /api/shifts/assignments/[id] - Delete a specific shift assignment
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const assignment = await prisma.shiftAssignment.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        shift: true
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Shift assignment not found' },
        { status: 404 }
      );
    }

    // Delete the assignment
    await prisma.shiftAssignment.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: 'Shift assignment deleted successfully',
      deletedAssignment: assignment
    });
  } catch (error) {
    console.error('Error deleting shift assignment:', error);
    return NextResponse.json(
      { error: 'Failed to delete shift assignment' },
      { status: 500 }
    );
  }
}

// GET /api/shifts/assignments/[id] - Get a specific shift assignment
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    const assignment = await prisma.shiftAssignment.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        shift: true
      }
    });

    if (!assignment) {
      return NextResponse.json(
        { error: 'Shift assignment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error fetching shift assignment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shift assignment' },
      { status: 500 }
    );
  }
}

// PUT /api/shifts/assignments/[id] - Update a specific shift assignment
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, assigned_by } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    // Check if assignment exists
    const existingAssignment = await prisma.shiftAssignment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingAssignment) {
      return NextResponse.json(
        { error: 'Shift assignment not found' },
        { status: 404 }
      );
    }

    const assignment = await prisma.shiftAssignment.update({
      where: { id: parseInt(id) },
      data: {
        status,
        assigned_by: assigned_by ? parseInt(assigned_by) : undefined
      },
      include: {
        employee: {
          include: {
            department: true
          }
        },
        shift: true
      }
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error updating shift assignment:', error);
    return NextResponse.json(
      { error: 'Failed to update shift assignment' },
      { status: 500 }
    );
  }
} 