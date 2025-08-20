import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple input sanitization
function sanitize(str: string) {
  return str.replace(/[<>"'\\]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const body: {
      survey_id: number;
      responder_name: string;
      responder_department: string;
      answers: Array<{
        question_id: number;
        answer: string;
        question_label: string;
      }>;
    } = await request.json();
    
    const { survey_id, responder_name, responder_department, answers } = body;
    
    if (!survey_id || !responder_name || !responder_department || !Array.isArray(answers)) {
      return NextResponse.json({ success: false, error: "Missing required information." }, { status: 400 });
    }
    
    // Find survey by permanent token
    const survey = await prisma.survey.findUnique({
      where: { id: survey_id },
      include: { questions: true }
    });
    
    if (!survey) {
      return NextResponse.json({ success: false, error: "Invalid permanent link." }, { status: 400 });
    }
    
    // Validate required answers and process answers
    const processedAnswers = [];
    
    for (const q of survey.questions) {
      const answer = answers.find((a: any) => a.question_id.toString() === q.id.toString());
      
      if (q.required) {
          if (!answer || (answer.answer === undefined || answer.answer === "")) {
            return NextResponse.json({ success: false, error: `Missing answer for: ${q.label_en}` }, { status: 400 });
        }
      }

      // Process different question types
      let processedAnswer = "";
      if (answer) {
        processedAnswer = answer.answer;
      }

      // Always add the answer, even if empty, to ensure all questions are represented
      if (processedAnswer || answer) {
        processedAnswers.push({
          question_id: q.id,
          answer: processedAnswer || "" // Use empty string instead of undefined
        });
      }
    }

    // Sanitize inputs
    const safeName = sanitize(responder_name);
    const safeDepartment = sanitize(responder_department);
    
    // Save response and answers
    await prisma.surveyResponse.create({
      data: {
        survey_id: survey.id,
        responder_name: safeName,
        responder_department: safeDepartment,
        answers: {
          create: processedAnswers.map((a: any) => {
            const question = survey.questions.find((q: any) => q.id.toString() === a.question_id.toString());
            return {
              question_id: a.question_id,
              answer: a.answer,
              question_label: question ? question.label_en : 'Unknown Question'
            };
          })
        }
      }
    });
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }
} 