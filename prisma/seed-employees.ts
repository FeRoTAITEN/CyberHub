import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding employees and departments...');

  // Create departments first
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Information Technology',
        description: 'IT Department responsible for all technical infrastructure and systems'
      }
    }),
    prisma.department.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Cybersecurity',
        description: 'Cybersecurity team responsible for protecting digital assets and infrastructure'
      }
    }),
    prisma.department.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'Human Resources',
        description: 'HR Department managing personnel and organizational development'
      }
    }),
    prisma.department.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        name: 'Finance',
        description: 'Finance Department handling all financial operations and reporting'
      }
    }),
    prisma.department.upsert({
      where: { id: 5 },
      update: {},
      create: {
        id: 5,
        name: 'Operations',
        description: 'Operations Department managing day-to-day business operations'
      }
    })
  ]);

  console.log('✅ Departments created');

  // Create employees
  const employees = await Promise.all([
    // IT Department
    prisma.employee.upsert({
      where: { email: 'ahmed.ali@cyberhub.com' },
      update: {},
      create: {
        name: 'Ahmed Ali',
        name_ar: 'أحمد علي',
        email: 'ahmed.ali@cyberhub.com',
        phone: '+966-50-123-4567',
        job_title: 'IT Manager',
        job_title_ar: 'مدير تقنية المعلومات',
        department_id: 1,
        location: 'Riyadh',
        hire_date: new Date('2022-01-15'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'sara.ahmed@cyberhub.com' },
      update: {},
      create: {
        name: 'Sara Ahmed',
        name_ar: 'سارة أحمد',
        email: 'sara.ahmed@cyberhub.com',
        phone: '+966-50-234-5678',
        job_title: 'Senior Software Engineer',
        job_title_ar: 'مهندس برمجيات أول',
        department_id: 1,
        location: 'Jeddah',
        hire_date: new Date('2021-06-20'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),

    // Cybersecurity Department
    prisma.employee.upsert({
      where: { email: 'omar.hassan@cyberhub.com' },
      update: {},
      create: {
        name: 'Omar Hassan',
        name_ar: 'عمر حسن',
        email: 'omar.hassan@cyberhub.com',
        phone: '+966-50-345-6789',
        job_title: 'Cybersecurity Director',
        job_title_ar: 'مدير الأمن السيبراني',
        department_id: 2,
        location: 'Riyadh',
        hire_date: new Date('2020-03-10'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'fatima.khalil@cyberhub.com' },
      update: {},
      create: {
        name: 'Fatima Khalil',
        name_ar: 'فاطمة خليل',
        email: 'fatima.khalil@cyberhub.com',
        phone: '+966-50-456-7890',
        job_title: 'Security Analyst',
        job_title_ar: 'محلل أمني',
        department_id: 2,
        location: 'Dammam',
        hire_date: new Date('2022-09-05'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),

    // HR Department
    prisma.employee.upsert({
      where: { email: 'layla.mohammed@cyberhub.com' },
      update: {},
      create: {
        name: 'Layla Mohammed',
        name_ar: 'ليلى محمد',
        email: 'layla.mohammed@cyberhub.com',
        phone: '+966-50-567-8901',
        job_title: 'HR Manager',
        job_title_ar: 'مدير الموارد البشرية',
        department_id: 3,
        location: 'Riyadh',
        hire_date: new Date('2021-11-12'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),

    // Finance Department
    prisma.employee.upsert({
      where: { email: 'khalid.abdullah@cyberhub.com' },
      update: {},
      create: {
        name: 'Khalid Abdullah',
        name_ar: 'خالد عبدالله',
        email: 'khalid.abdullah@cyberhub.com',
        phone: '+966-50-678-9012',
        job_title: 'Finance Director',
        job_title_ar: 'مدير المالية',
        department_id: 4,
        location: 'Riyadh',
        hire_date: new Date('2019-08-25'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    }),

    // Operations Department
    prisma.employee.upsert({
      where: { email: 'noor.saleh@cyberhub.com' },
      update: {},
      create: {
        name: 'Noor Saleh',
        name_ar: 'نور صالح',
        email: 'noor.saleh@cyberhub.com',
        phone: '+966-50-789-0123',
        job_title: 'Operations Manager',
        job_title_ar: 'مدير العمليات',
        department_id: 5,
        location: 'Jeddah',
        hire_date: new Date('2022-02-18'),
        status: 'active',
        gender: 'female',
        is_active: true
      }
    }),
    prisma.employee.upsert({
      where: { email: 'yousef.ibrahim@cyberhub.com' },
      update: {},
      create: {
        name: 'Yousef Ibrahim',
        name_ar: 'يوسف إبراهيم',
        email: 'yousef.ibrahim@cyberhub.com',
        phone: '+966-50-890-1234',
        job_title: 'Operations Coordinator',
        job_title_ar: 'منسق العمليات',
        department_id: 5,
        location: 'Dammam',
        hire_date: new Date('2023-01-30'),
        status: 'active',
        gender: 'male',
        is_active: true
      }
    })
  ]);

  console.log('✅ Employees created');

  // Update department managers - using the actual employee IDs from the created employees
  const createdEmployees = await prisma.employee.findMany({
    select: { id: true, email: true }
  });

  // Find employee IDs by email
  const ahmedAli = createdEmployees.find(e => e.email === 'ahmed.ali@cyberhub.com');
  const omarHassan = createdEmployees.find(e => e.email === 'omar.hassan@cyberhub.com');
  const laylaMohammed = createdEmployees.find(e => e.email === 'layla.mohammed@cyberhub.com');
  const khalidAbdullah = createdEmployees.find(e => e.email === 'khalid.abdullah@cyberhub.com');
  const noorSaleh = createdEmployees.find(e => e.email === 'noor.saleh@cyberhub.com');

  if (ahmedAli) {
    await prisma.department.update({
      where: { id: 1 },
      data: { manager_id: ahmedAli.id }
    });
  }

  if (omarHassan) {
    await prisma.department.update({
      where: { id: 2 },
      data: { manager_id: omarHassan.id }
    });
  }

  if (laylaMohammed) {
    await prisma.department.update({
      where: { id: 3 },
      data: { manager_id: laylaMohammed.id }
    });
  }

  if (khalidAbdullah) {
    await prisma.department.update({
      where: { id: 4 },
      data: { manager_id: khalidAbdullah.id }
    });
  }

  if (noorSaleh) {
    await prisma.department.update({
      where: { id: 5 },
      data: { manager_id: noorSaleh.id }
    });
  }

  console.log('✅ Department managers assigned');
  console.log('🎉 Employee seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding employees:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 