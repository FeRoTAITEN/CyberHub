import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const surveyId = parseInt(id);
    
    if (isNaN(surveyId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid survey ID' 
      }, { status: 400 });
    }

    // Get survey with questions
    const surveyData = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            answers: {
              include: {
                response: true
              }
            }
          }
        }
      }
    });

    if (!surveyData) {
      return NextResponse.json({ 
        success: false, 
        error: 'Survey not found' 
      }, { status: 404 });
    }

    // Get all responses for this survey
    const responses = await prisma.surveyResponse.findMany({
      where: { survey_id: surveyId },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      },
      orderBy: {
        submitted_at: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      responses: responses.map(response => ({
        id: response.id,
        name: response.responder_name,
        department: response.responder_department,
        created_at: response.submitted_at,
        answers: response.answers.map((answer: any) => ({
          id: answer.id,
          question_id: answer.question_id,
          answer: answer.answer,
          question: {
            id: answer.question.id,
            label_en: answer.question.label_en,
            label_ar: answer.question.label_ar,
            type: answer.question.type
          }
        }))
      }))
    });

  } catch (error) {
    console.error('Error fetching survey responses:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 