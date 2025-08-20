import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to safely handle rating_options
function processRatingOptions(options: any) {
  if (!options || (Array.isArray(options) && options.length === 0)) {
    return null;
  }
  try {
    return JSON.parse(JSON.stringify(options));
  } catch (e) {
    console.error('Error processing rating options:', e);
    return null;
  }
}

// GET: Return all surveys with questions, invites, and responses
export async function GET() {
  try {
    const surveys = await prisma.survey.findMany({
      orderBy: { created_at: "desc" },
      include: {
        questions: { orderBy: { order: "asc" } },
        invites: true,
        responses: {
          include: {
            answers: {
              include: {
                question: true
              }
            }
          }
        }
      }
    });

    // Process responses to format rating answers
    const processedSurveys = surveys.map(survey => ({
      ...survey,
      responses: survey.responses.map(response => ({
        ...response,
        answers: response.answers.map(answer => {
          const question = answer.question;
          let processedAnswer = answer.answer || ""; // Ensure we always have a string
          
          // Format rating answers to show text instead of numbers
          if (question && question.question_type === 'rating' && question.rating_scale && question.rating_options && processedAnswer) {
            try {
              const ratingOptions = Array.isArray(question.rating_options) ? question.rating_options : JSON.parse(String(question.rating_options));
              const ratingValue = parseInt(String(processedAnswer));
              if (ratingValue && ratingOptions[ratingValue - 1]) {
                processedAnswer = ratingOptions[ratingValue - 1].label_en || processedAnswer;
              }
            } catch {
              // If parsing fails, keep original answer
            }
          }
          
          // Special formatting for comments questions
          if (question && question.question_type === 'comments' && processedAnswer) {
            // The answer is already formatted as "Yes, comment" from the submit API
            // Just ensure it's displayed properly
            if (processedAnswer.includes(',')) {
              // Already formatted correctly
            } else {
              // Fallback formatting
              processedAnswer = processedAnswer || "No response";
            }
          }
          
          return {
            ...answer,
            processed_answer: processedAnswer || "No answer"
          };
        })
      }))
    }));

    return NextResponse.json({ success: true, surveys: processedSurveys });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch surveys." }, { status: 500 });
  }
}

// POST: Create a new survey with questions
export async function POST(request: NextRequest) {
  try {
    const body: {
      title_en: string;
      title_ar: string;
      questions: Array<{
        question_type: string;
        label_en: string;
        label_ar: string;
        required: boolean;
        order: number;
        rating_options?: any;
        rating_scale?: string;
      }>;
    } = await request.json();
    if (!body.title_en || !body.title_ar || !body.questions || body.questions.length === 0) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }
    const survey = await prisma.survey.create({
      data: {
        title_en: body.title_en,
        title_ar: body.title_ar,
        created_by: 1, // Default admin user ID
        questions: {
          create: body.questions.map((q, idx) => ({
            question_type: q.question_type,
            label_en: q.label_en,
            label_ar: q.label_ar,
            required: !!q.required,
            order: idx,
            rating_scale: q.rating_scale || null,
            rating_options: processRatingOptions(q.rating_options)
          }))
        }
      },
      include: { questions: true }
    });
    
    return NextResponse.json({ success: true, survey });
  } catch {
    console.error('Error creating survey');
    return NextResponse.json({ success: false, error: 'Failed to create survey' }, { status: 500 });
  }
}

// PUT: Update a survey and its questions
export async function PUT(req: NextRequest) {
  try {
    const { id, title_en, title_ar, questions } = await req.json();
    if (!id || !title_en || !title_ar || !Array.isArray(questions)) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
    }
    // Update survey title
    await prisma.survey.update({
      where: { id },
      data: { title_en, title_ar }
    });
    // Update questions: delete removed, update existing, add new
    const existingQuestions = await prisma.surveyQuestion.findMany({ where: { survey_id: id } });
    const existingIds = existingQuestions.map(q => q.id);
    const incomingIds = questions.filter((q: any) => q.id).map((q: any) => q.id);
    // Delete removed questions
    await prisma.surveyQuestion.deleteMany({ where: { id: { in: existingIds.filter(id => !incomingIds.includes(id)) } } });
    // Update or create questions
    for (let idx = 0; idx < questions.length; idx++) {
      const q = questions[idx];
      if (q.id) {
        await prisma.surveyQuestion.update({
          where: { id: q.id },
          data: {
            question_type: q.type,
            label_en: q.label_en,
            label_ar: q.label_ar,
            required: !!q.required,
            order: idx,
            rating_scale: q.rating_scale || null,
            rating_options: processRatingOptions(q.rating_options)
          }
        });
      } else {
        await prisma.surveyQuestion.create({
          data: {
            survey_id: id,
            question_type: q.type,
            label_en: q.label_en,
            label_ar: q.label_ar,
            required: !!q.required,
            order: idx,
            rating_scale: q.rating_scale || null,
            rating_options: processRatingOptions(q.rating_options)
          }
        });
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update survey." }, { status: 500 });
  }
}

// DELETE: Remove a survey by id
export async function DELETE(req: NextRequest) {
  try {
    const { id, responseId } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing survey id." }, { status: 400 });
    }
    
    // If responseId is provided, delete specific response
    if (responseId) {
      await prisma.surveyResponse.delete({ where: { id: responseId } });
      return NextResponse.json({ success: true });
    }
    
    // Otherwise delete the entire survey
    await prisma.survey.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete." }, { status: 500 });
  }
} 