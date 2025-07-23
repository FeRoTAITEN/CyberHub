import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ valid: false, expired: false, survey: null });
  }
  
  // Find survey by permanent token
  const survey = await prisma.survey.findUnique({
    where: { permanent_token: token },
    include: {
      questions: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });
  
  if (!survey) {
    return NextResponse.json({ valid: false, expired: false, survey: null });
  }
  
  // Prepare survey data for the client
  const surveyData = {
    id: survey.id,
    title: {
      en: survey.title_en,
      ar: survey.title_ar
    },
    questions: survey.questions.map(q => ({
      id: q.id,
      question_type: q.question_type,
      label_en: q.label_en,
      label_ar: q.label_ar,
      required: q.required,
      rating_scale: q.rating_scale,
      rating_options: q.rating_options
    }))
  };
  
  return NextResponse.json({ valid: true, expired: false, survey: surveyData });
} 