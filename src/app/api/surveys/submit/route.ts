import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple input sanitization
function sanitize(str: string) {
  return str.replace(/[<>"'\\]/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const body: {
      token?: string;
      invite_id?: number | string;
      name?: string;
      department?: string;
      responder_name?: string;
      responder_department?: string;
      answers: Array<{
        question_id: number | string;
        answer: string;
        question_label?: string;
      }>;
    } = raw;

    // Support both shapes from UI: token+name+department OR invite_id+responder_name+responder_department
    const token = body.token as string | undefined;
    const inviteIdInput = body.invite_id as number | string | undefined;
    const responder_name = (body.responder_name ?? body.name ?? "").toString();
    const responder_department = (body.responder_department ?? body.department ?? "").toString();
    const answersInput = Array.isArray(body.answers) ? body.answers : [];
    
    if ((!token && !inviteIdInput) || !responder_name || !responder_department || answersInput.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required information." }, { status: 400 });
    }
    
    // Locate invite by token or by id
    let invite = null as any;
    if (token) {
      invite = await prisma.surveyInvite.findUnique({
        where: { token },
      include: { 
          survey: { include: { questions: true } }
      }
    });
    } else if (inviteIdInput) {
      const invite_id_num = typeof inviteIdInput === 'string' ? parseInt(inviteIdInput) : inviteIdInput;
      invite = await prisma.surveyInvite.findUnique({
        where: { id: invite_id_num as number },
        include: {
          survey: { include: { questions: true } }
        }
      });
    }
    
    if (!invite) {
      return NextResponse.json({ success: false, error: "Invalid or expired link." }, { status: 400 });
    }
    
    const now = new Date();
    if (invite.used || invite.expires_at < now) {
      return NextResponse.json({ success: false, error: "Link expired or already used." }, { status: 400 });
    }
    
    // Validate required answers and process answers
    const processedAnswers: Array<{ question_id: number; answer: string }> = [];
    const byId = new Map<string, any>(invite.survey.questions.map((q: any) => [q.id.toString(), q]));
    
    for (const q of invite.survey.questions) {
      const answer = answersInput.find((a: any) => a.question_id.toString() === q.id.toString());
      
      if (q.required) {
          if (!answer || (answer.answer === undefined || answer.answer === "")) {
            return NextResponse.json({ success: false, error: `Missing answer for: ${q.label_en}` }, { status: 400 });
        }
      }

      let processedAnswer = "";
      if (answer) {
        processedAnswer = String(answer.answer ?? "");
      }

      if (processedAnswer || answer) {
        processedAnswers.push({
          question_id: Number(q.id),
          answer: processedAnswer
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
            const question = byId.get(a.question_id.toString());
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