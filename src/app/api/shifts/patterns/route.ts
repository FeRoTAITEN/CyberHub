import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/shifts/patterns -> list patterns (bootstrap Alpha/Beta if missing)
export async function GET() {
  try {
    // Ensure default patterns exist
    const defaults = [
      { code: 'alpha', name: 'Alpha Rotation', name_ar: 'نمط ألفا' },
      { code: 'beta', name: 'Beta Rotation', name_ar: 'نمط بيتا' },
      { code: 'delta', name: 'Delta Rotation', name_ar: 'نمط دلتا' },
      { code: 'late_morning', name: 'Late Morning', name_ar: 'صباح متأخر' },
    ];
    for (const p of defaults) {
      await prisma.shiftPattern.upsert({
        where: { code: p.code },
        update: { name: p.name, name_ar: p.name_ar },
        create: p,
      });
    }

    const patterns = await prisma.shiftPattern.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json({ patterns });
  } catch (error) {
    console.error('Error listing patterns', error);
    return NextResponse.json({ patterns: [] }, { status: 200 });
  }
}

// POST /api/shifts/patterns -> create pattern
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const created = await prisma.shiftPattern.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating pattern', error);
    return NextResponse.json({ error: 'Failed to create pattern' }, { status: 500 });
  }
} 