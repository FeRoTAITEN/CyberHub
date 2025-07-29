const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'IT Infrastructure',
        description: 'Network and system administration'
      }
    }),
    prisma.department.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Software Development',
        description: 'Application development and maintenance'
      }
    }),
    prisma.department.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'Security Operations',
        description: 'Cybersecurity and threat management'
      }
    }),
    prisma.department.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        name: 'Quality Assurance',
        description: 'Testing and quality control'
      }
    }),
    prisma.department.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        name: 'Data Analytics',
        description: 'Business intelligence and data analysis'
      }
    }),
    prisma.department.upsert({
      where: { id: 6 },
      update: {},
      create: {
        id: 6,
        name: 'Customer Support',
        description: 'Technical support and customer service'
      }
    })
  ]);

  console.log('✅ Departments created:', departments.length);

  // Create employees with gender and is_active fields
  const employees = await Promise.all([
    prisma.employee.upsert({
      where: { email: 'ahmed.alrashid@salam.sa' },
      update: {},
      create: {
        name: 'Ahmed Al-Rashid',
        name_ar: 'أحمد الراشد',
        email: 'ahmed.alrashid@salam.sa',
        phone: '+966501111111',
        job_title: 'Senior Network Engineer',
        job_title_ar: 'مهندس شبكات أول',
        department_id: 1,
        avatar: 'avatar1.png',
        location: 'Riyadh',
        hire_date: new Date('2020-03-15'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'sarah.almansour@salam.sa' },
      update: {},
      create: {
        name: 'Sarah Al-Mansour',
        name_ar: 'سارة المنصور',
        email: 'sarah.almansour@salam.sa',
        phone: '+966501111112',
        job_title: 'Full Stack Developer',
        job_title_ar: 'مطور ويب شامل',
        department_id: 2,
        avatar: 'avatar2.png',
        location: 'Jeddah',
        hire_date: new Date('2021-06-20'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'omar.alshehri@salam.sa' },
      update: {},
      create: {
        name: 'Omar Al-Shehri',
        name_ar: 'عمر الشهري',
        email: 'omar.alshehri@salam.sa',
        phone: '+966501111113',
        job_title: 'Security Analyst',
        job_title_ar: 'محلل أمني',
        department_id: 3,
        avatar: 'avatar3.png',
        location: 'Dammam',
        hire_date: new Date('2019-11-10'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'fatima.alzahrani@salam.sa' },
      update: {},
      create: {
        name: 'Fatima Al-Zahrani',
        name_ar: 'فاطمة الزهراني',
        email: 'fatima.alzahrani@salam.sa',
        phone: '+966501111114',
        job_title: 'QA Engineer',
        job_title_ar: 'مهندسة ضمان الجودة',
        department_id: 4,
        avatar: 'avatar4.png',
        location: 'Riyadh',
        hire_date: new Date('2021-02-08'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'khalid.almutairi@salam.sa' },
      update: {},
      create: {
        name: 'Khalid Al-Mutairi',
        name_ar: 'خالد المطيري',
        email: 'khalid.almutairi@salam.sa',
        phone: '+966501111115',
        job_title: 'Data Scientist',
        job_title_ar: 'عالم بيانات',
        department_id: 5,
        avatar: 'avatar5.png',
        location: 'Jeddah',
        hire_date: new Date('2020-09-12'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'noor.aldossary@salam.sa' },
      update: {},
      create: {
        name: 'Noor Al-Dossary',
        name_ar: 'نور الدوسري',
        email: 'noor.aldossary@salam.sa',
        phone: '+966501111116',
        job_title: 'Support Specialist',
        job_title_ar: 'أخصائية دعم فني',
        department_id: 6,
        avatar: 'avatar6.png',
        location: 'Dammam',
        hire_date: new Date('2021-04-25'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'yousef.alqahtani@salam.sa' },
      update: {},
      create: {
        name: 'Yousef Al-Qahtani',
        name_ar: 'يوسف القحطاني',
        email: 'yousef.alqahtani@salam.sa',
        phone: '+966501111117',
        job_title: 'DevOps Engineer',
        job_title_ar: 'مهندس عمليات التطوير',
        department_id: 1,
        avatar: 'avatar7.png',
        location: 'Riyadh',
        hire_date: new Date('2020-12-03'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'layla.alsubaie@salam.sa' },
      update: {},
      create: {
        name: 'Layla Al-Subaie',
        name_ar: 'ليلى السبيعي',
        email: 'layla.alsubaie@salam.sa',
        phone: '+966501111118',
        job_title: 'Frontend Developer',
        job_title_ar: 'مطورة واجهة أمامية',
        department_id: 2,
        avatar: 'avatar8.png',
        location: 'Jeddah',
        hire_date: new Date('2021-08-14'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'abdullah.alharbi@salam.sa' },
      update: {},
      create: {
        name: 'Abdullah Al-Harbi',
        name_ar: 'عبدالله الحربي',
        email: 'abdullah.alharbi@salam.sa',
        phone: '+966501111119',
        job_title: 'Penetration Tester',
        job_title_ar: 'مختبر اختراق',
        department_id: 3,
        avatar: 'avatar9.png',
        location: 'Dammam',
        hire_date: new Date('2019-07-22'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'aisha.alshamrani@salam.sa' },
      update: {},
      create: {
        name: 'Aisha Al-Shamrani',
        name_ar: 'عائشة الشمراني',
        email: 'aisha.alshamrani@salam.sa',
        phone: '+966501111120',
        job_title: 'Test Automation Engineer',
        job_title_ar: 'مهندسة اختبار آلي',
        department_id: 4,
        avatar: 'avatar10.png',
        location: 'Riyadh',
        hire_date: new Date('2021-01-30'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'mohammed.alotaibi@salam.sa' },
      update: {},
      create: {
        name: 'Mohammed Al-Otaibi',
        name_ar: 'محمد العتيبي',
        email: 'mohammed.alotaibi@salam.sa',
        phone: '+966501111121',
        job_title: 'Business Intelligence Analyst',
        job_title_ar: 'محلل ذكاء الأعمال',
        department_id: 5,
        avatar: 'avatar11.png',
        location: 'Jeddah',
        hire_date: new Date('2020-05-18'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'raghad.alsuwailem@salam.sa' },
      update: {},
      create: {
        name: 'Raghad Al-Suwailem',
        name_ar: 'رغد السويلم',
        email: 'raghad.alsuwailem@salam.sa',
        phone: '+966501111122',
        job_title: 'Customer Success Manager',
        job_title_ar: 'مديرة نجاح العملاء',
        department_id: 6,
        avatar: 'avatar12.png',
        location: 'Dammam',
        hire_date: new Date('2021-03-11'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'tariq.almutlaq@salam.sa' },
      update: {},
      create: {
        name: 'Tariq Al-Mutlaq',
        name_ar: 'طارق المطلق',
        email: 'tariq.almutlaq@salam.sa',
        phone: '+966501111123',
        job_title: 'System Administrator',
        job_title_ar: 'مدير أنظمة',
        department_id: 1,
        avatar: 'avatar13.png',
        location: 'Riyadh',
        hire_date: new Date('2020-08-07'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'dana.aljohani@salam.sa' },
      update: {},
      create: {
        name: 'Dana Al-Johani',
        name_ar: 'دانا الجهني',
        email: 'dana.aljohani@salam.sa',
        phone: '+966501111124',
        job_title: 'Backend Developer',
        job_title_ar: 'مطورة خلفية',
        department_id: 2,
        avatar: 'avatar14.png',
        location: 'Jeddah',
        hire_date: new Date('2021-10-05'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'zaid.alshammari@salam.sa' },
      update: {},
      create: {
        name: 'Zaid Al-Shammari',
        name_ar: 'زيد الشمري',
        email: 'zaid.alshammari@salam.sa',
        phone: '+966501111125',
        job_title: 'Security Engineer',
        job_title_ar: 'مهندس أمني',
        department_id: 3,
        avatar: 'avatar15.png',
        location: 'Dammam',
        hire_date: new Date('2019-12-16'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'mariam.aldossary@salam.sa' },
      update: {},
      create: {
        name: 'Mariam Al-Dossary',
        name_ar: 'مريم الدوسري',
        email: 'mariam.aldossary@salam.sa',
        phone: '+966501111126',
        job_title: 'Quality Assurance Lead',
        job_title_ar: 'قائدة ضمان الجودة',
        department_id: 4,
        avatar: 'avatar16.png',
        location: 'Riyadh',
        hire_date: new Date('2020-11-28'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'fahad.alrashid@salam.sa' },
      update: {},
      create: {
        name: 'Fahad Al-Rashid',
        name_ar: 'فهد الراشد',
        email: 'fahad.alrashid@salam.sa',
        phone: '+966501111127',
        job_title: 'Data Engineer',
        job_title_ar: 'مهندس بيانات',
        department_id: 5,
        avatar: 'avatar17.png',
        location: 'Jeddah',
        hire_date: new Date('2021-05-09'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'nada.alshehri@salam.sa' },
      update: {},
      create: {
        name: 'Nada Al-Shehri',
        name_ar: 'ندى الشهري',
        email: 'nada.alshehri@salam.sa',
        phone: '+966501111128',
        job_title: 'Technical Support Specialist',
        job_title_ar: 'أخصائية دعم تقني',
        department_id: 6,
        avatar: 'avatar18.png',
        location: 'Dammam',
        hire_date: new Date('2021-07-13'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'khalil.alotaibi@salam.sa' },
      update: {},
      create: {
        name: 'Khalil Al-Otaibi',
        name_ar: 'خليل العتيبي',
        email: 'khalil.alotaibi@salam.sa',
        phone: '+966501111129',
        job_title: 'Network Security Specialist',
        job_title_ar: 'أخصائي أمن الشبكات',
        department_id: 1,
        avatar: 'avatar19.png',
        location: 'Riyadh',
        hire_date: new Date('2020-04-21'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    })
  ]);

  console.log('✅ Employees created:', employees.length);

  // Create sample surveys
  const surveys = await Promise.all([
    prisma.survey.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        title_en: 'Employee Satisfaction Survey',
        title_ar: 'استطلاع رضا الموظفين',
        created_by: 1
      }
    }),
    prisma.survey.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        title_en: 'Work Environment Assessment',
        title_ar: 'تقييم بيئة العمل',
        created_by: 1
      }
    })
  ]);

  console.log('✅ Surveys created:', surveys.length);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 