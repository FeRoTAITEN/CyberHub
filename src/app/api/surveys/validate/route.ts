import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ valid: false, expired: false, survey: null });
  }
  // Find invite by token
  const invite = await prisma.surveyInvite.findUnique({
    where: { token },
    include: {
      survey: {
        include: {
          questions: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      }
    }
  });
  if (!invite) {
    return NextResponse.json({ valid: false, expired: false, survey: null });
  }
  const now = new Date();
  const isExpired = invite.used || invite.expires_at < now;
  if (isExpired) {
    return NextResponse.json({ valid: false, expired: true, survey: null });
  }
  // Prepare survey data for the client (flat title fields)
  const survey = {
    id: invite.survey.id,
    title_en: invite.survey.title_en,
    title_ar: invite.survey.title_ar,
    questions: invite.survey.questions.map(q => ({
      id: q.id,
      question_type: q.question_type,
      label_en: q.label_en,
      label_ar: q.label_ar,
      required: q.required,
      order: q.order,
      rating_scale: q.rating_scale,
      rating_options: q.rating_options
    }))
  };
  return NextResponse.json({ valid: true, expired: false, survey });
} 