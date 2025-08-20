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
      invite_id: number;
      responder_name: string;
      responder_department: string;
      answers: Array<{
        question_id: number;
        answer: string;
        question_label: string;
      }>;
    } = await request.json();
    
    const { invite_id, responder_name, responder_department, answers } = body;
    
    if (!invite_id || !responder_name || !responder_department || !Array.isArray(answers)) {
      return NextResponse.json({ success: false, error: "Missing required information." }, { status: 400 });
    }
    
    // Find survey invite by token
    const invite = await prisma.surveyInvite.findUnique({
      where: { id: invite_id },
      include: { 
        survey: {
          include: { questions: true }
        }
      }
    });
    
    if (!invite) {
      return NextResponse.json({ success: false, error: "Invalid or expired link." }, { status: 400 });
    }
    
    const now = new Date();
    if (invite.used || invite.expires_at < now) {
      return NextResponse.json({ success: false, error: "Link expired or already used." }, { status: 400 });
    }
    
    // Validate required answers and process answers
    const processedAnswers = [];
    
    for (const q of invite.survey.questions) {
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
        invite_id: invite.id,
        survey_id: invite.survey_id,
        responder_name: safeName,
        responder_department: safeDepartment,
        answers: {
          create: processedAnswers.map((a: any) => {
            const question = invite.survey.questions.find((q: any) => q.id.toString() === a.question_id.toString());
            return {
              question_id: a.question_id,
              answer: a.answer,
              question_label: question ? question.label_en : 'Unknown Question'
            };
          })
        }
      }
    });
    
    // Mark invite as used
    await prisma.surveyInvite.update({
      where: { id: invite.id },
      data: { used: true, used_at: new Date() }
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }
} 