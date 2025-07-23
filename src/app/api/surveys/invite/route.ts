import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { survey_id, invited_by } = await req.json();
    if (!survey_id || !invited_by) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }
    const token = uuidv4();
    const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 hours from now
    const invite = await prisma.surveyInvite.create({
      data: {
        survey_id,
        token,
        expires_at,
        invited_by
      }
    });
    return NextResponse.json({ success: true, invite });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to create invite." }, { status: 500 });
  }
} 

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing invite id." }, { status: 400 });
    }
    await prisma.surveyInvite.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Failed to delete invite." }, { status: 500 });
  }
} 