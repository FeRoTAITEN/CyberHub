import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Simple input sanitization
function sanitize(str: string) {
  return str.replace(/[<>"'\\]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { token, name, department, answers } = body;
    
    if (!token || !name || !department || !Array.isArray(answers)) {
      return NextResponse.json({ success: false, error: "Missing required information." }, { status: 400 });
    }
    
    // Find survey by permanent token
    const survey = await prisma.survey.findUnique({
      where: { permanent_token: token },
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
        if (q.question_type === "comments") {
          // For comments questions, check if either yesno or comment is provided
          const yesNoAnswer = answers.find((a: any) => a.question_id === `${q.id}_yesno`);
          const commentAnswer = answers.find((a: any) => a.question_id === `${q.id}_comment`);
          if (!yesNoAnswer && !commentAnswer) {
            return NextResponse.json({ success: false, error: `Missing answer for: ${q.label_en}` }, { status: 400 });
          }
        } else {
          if (!answer || (answer.answer === undefined || answer.answer === "")) {
            return NextResponse.json({ success: false, error: `Missing answer for: ${q.label_en}` }, { status: 400 });
          }
        }
      }

      // Process different question types
      let processedAnswer = "";
      if (q.question_type === "comments") {
        // For comments, combine yes/no with comment
        const yesNoAnswer = answers.find((a: any) => a.question_id === `${q.id}_yesno`);
        const commentAnswer = answers.find((a: any) => a.question_id === `${q.id}_comment`);
        
        const yesNo = yesNoAnswer?.answer || "";
        const comment = commentAnswer?.answer || "";
        
        if (yesNo && comment) {
          processedAnswer = `${yesNo}, ${comment}`;
        } else if (yesNo) {
          processedAnswer = yesNo;
        } else if (comment) {
          processedAnswer = comment;
        } else {
          processedAnswer = "";
        }
      } else if (answer) {
        processedAnswer = answer.answer;
      }

      // Always add the answer, even if empty, to ensure all questions are represented
      if (q.question_type === "comments" || processedAnswer || answer) {
        processedAnswers.push({
          question_id: q.id,
          answer: processedAnswer || "" // Use empty string instead of undefined
        });
      }
    }

    // Sanitize inputs
    const safeName = sanitize(name);
    const safeDepartment = sanitize(department);
    
    // Save response and answers
    const response = await prisma.surveyResponse.create({
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
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid request." }, { status: 400 });
  }
} 