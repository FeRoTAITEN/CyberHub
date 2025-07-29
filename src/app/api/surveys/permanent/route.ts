import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// POST: Generate permanent link for a survey
export async function POST(req: NextRequest) {
  try {
    // Simple test to ensure API is working
    console.log('=== PERMANENT LINK API CALLED ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request headers:', Object.fromEntries(req.headers.entries()));
    
    const body = await req.json();
    console.log('Received request body:', body);
    
    const { survey_id } = body;
    if (!survey_id) {
      console.log('Missing survey_id in request');
      return NextResponse.json({ success: false, error: "Missing survey id." }, { status: 400 });
    }

    // Convert survey_id to number
    const surveyId = parseInt(survey_id);
    if (isNaN(surveyId)) {
      console.log('Invalid survey_id:', survey_id);
      return NextResponse.json({ success: false, error: "Invalid survey id." }, { status: 400 });
    }

    console.log('Looking for survey with ID:', surveyId);

    // Check if survey exists
    const existingSurvey = await prisma.survey.findUnique({
      where: { id: surveyId }
    });

    if (!existingSurvey) {
      console.log('Survey not found with ID:', surveyId);
      return NextResponse.json({ success: false, error: "Survey not found." }, { status: 404 });
    }

    console.log('Found survey:', existingSurvey.title_en);

    // Generate a unique permanent token
    const permanent_token = uuidv4();
    console.log('Generated permanent token:', permanent_token);

    // Update the survey with the permanent token
    const updatedSurvey = await prisma.survey.update({
      where: { id: surveyId },
      data: { permanent_token }
    });

    console.log('Updated survey successfully');
    console.log('=== PERMANENT LINK API COMPLETED ===');

    return NextResponse.json({ 
      success: true, 
      permanent_token,
      permanent_link: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/surveys/permanent/${permanent_token}`
    });
  } catch (e) {
    console.error('Error generating permanent link:', e);
    if (e instanceof Error) {
      console.error('Error stack:', e.stack);
    }
    return NextResponse.json({ success: false, error: "Failed to generate permanent link." }, { status: 500 });
  }
}

// DELETE: Remove permanent link from a survey
export async function DELETE(req: NextRequest) {
  try {
    const { survey_id } = await req.json();
    if (!survey_id) {
      return NextResponse.json({ success: false, error: "Missing survey id." }, { status: 400 });
    }

    // Convert survey_id to number
    const surveyId = parseInt(survey_id);
    if (isNaN(surveyId)) {
      return NextResponse.json({ success: false, error: "Invalid survey id." }, { status: 400 });
    }

    // Check if survey exists
    const existingSurvey = await prisma.survey.findUnique({
      where: { id: surveyId }
    });

    if (!existingSurvey) {
      return NextResponse.json({ success: false, error: "Survey not found." }, { status: 404 });
    }

    // Remove the permanent token
    const updatedSurvey = await prisma.survey.update({
      where: { id: surveyId },
      data: { permanent_token: null }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Error removing permanent link:', e);
    if (e instanceof Error) {
      console.error('Error stack:', e.stack);
    }
    return NextResponse.json({ success: false, error: "Failed to remove permanent link." }, { status: 500 });
  }
} 