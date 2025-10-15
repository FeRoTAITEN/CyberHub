import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/employees/batch -> create multiple employees
export async function POST(req: NextRequest) {
  try {
    await req.json();

    // Add 7 new employees
    const newEmployees = [
      {
        name: 'Rayan Al-Harbi',
        name_ar: 'ريان الحربي',
        email: 'rayan.alharbi@salam.com',
        phone: '+966501234567',
        job_title: 'Security Analyst',
        job_title_ar: 'محلل أمني',
        department_id: 2, // Cybersecurity
        is_active: true,
        gender: 'male'
      },
      {
        name: 'Noura Al-Saud',
        name_ar: 'نورة آل سعود',
        email: 'noura.alsaud@salam.com',
        phone: '+966501234568',
        job_title: 'Risk Manager',
        job_title_ar: 'مدير المخاطر',
        department_id: 3, // GRC
        is_active: true,
        gender: 'female'
      },
      {
        name: 'Fahad Al-Otaibi',
        name_ar: 'فهد العتيبي',
        email: 'fahad.alotaibi@salam.com',
        phone: '+966501234569',
        job_title: 'Network Engineer',
        job_title_ar: 'مهندس شبكات',
        department_id: 1, // Cyber Technology
        is_active: true,
        gender: 'male'
      },
      {
        name: 'Amal Al-Dossari',
        name_ar: 'أمل الدوسري',
        email: 'amal.aldossari@salam.com',
        phone: '+966501234570',
        job_title: 'Compliance Officer',
        job_title_ar: 'مسؤول الامتثال',
        department_id: 3, // GRC
        is_active: true,
        gender: 'female'
      },
      {
        name: 'Omar Al-Ghamdi',
        name_ar: 'عمر الغامدي',
        email: 'omar.alghamdi@salam.com',
        phone: '+966501234571',
        job_title: 'Systems Architect',
        job_title_ar: 'مهندس نظم',
        department_id: 4, // Architecture & Design
        is_active: true,
        gender: 'male'
      },
      {
        name: 'Layla Al-Shamrani',
        name_ar: 'ليلى الشمراني',
        email: 'layla.alshamrani@salam.com',
        phone: '+966501234572',
        job_title: 'Security Operations Lead',
        job_title_ar: 'قائد عمليات الأمن',
        department_id: 5, // Protection & Defence
        is_active: true,
        gender: 'female'
      },
      {
        name: 'Abdullah Al-Zahrani',
        name_ar: 'عبدالله الزهراني',
        email: 'abdullah.alzahrani@salam.com',
        phone: '+966501234573',
        job_title: 'IT Security Specialist',
        job_title_ar: 'أخصائي أمن تقنية المعلومات',
        department_id: 7, // CYB-IT
        is_active: true,
        gender: 'male'
      }
    ];

    // Create all employees
    const createdEmployees = await prisma.$transaction(
      newEmployees.map(employee => 
        prisma.employee.create({ data: employee })
      )
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully added 7 new employees',
      data: createdEmployees 
    });

  } catch (error) {
    console.error('Error adding employees:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add employees' 
    }, { status: 500 });
  }
} 