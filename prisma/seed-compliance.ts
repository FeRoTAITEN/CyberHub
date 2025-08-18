import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding compliance data...');

  // Create default department if it doesn't exist
  let defaultDepartment = await prisma.department.findFirst({
    where: { name: 'IT Department' }
  });

  if (!defaultDepartment) {
    defaultDepartment = await prisma.department.create({
      data: {
        name: 'IT Department',
        description: 'Information Technology Department',
      },
    });
    console.log('✅ Created default department');
  }

  // Create default employees if they don't exist
  const defaultEmployees = [
    {
      name: 'Ahmed Ali',
      name_ar: 'أحمد علي',
      email: 'ahmed.ali@salam.com',
      job_title: 'IT Manager',
      job_title_ar: 'مدير تقنية المعلومات',
      department_id: defaultDepartment.id,
    },
    {
      name: 'Sara Mohammed',
      name_ar: 'سارة محمد',
      email: 'sara.mohammed@salam.com',
      job_title: 'Senior Developer',
      job_title_ar: 'مطور أول',
      department_id: defaultDepartment.id,
    },
    {
      name: 'Omar Hassan',
      name_ar: 'عمر حسن',
      email: 'omar.hassan@salam.com',
      job_title: 'System Administrator',
      job_title_ar: 'مدير النظام',
      department_id: defaultDepartment.id,
    },
    {
      name: 'Fatima Khalil',
      name_ar: 'فاطمة خليل',
      email: 'fatima.khalil@salam.com',
      job_title: 'Security Specialist',
      job_title_ar: 'أخصائي أمن',
      department_id: defaultDepartment.id,
    },
  ];

  for (const employeeData of defaultEmployees) {
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: employeeData.email }
    });

    if (!existingEmployee) {
      await prisma.employee.create({
        data: employeeData,
      });
      console.log(`✅ Created employee: ${employeeData.name}`);
    }
  }

  // Create a sample project if no projects exist
  const existingProjects = await prisma.project.count();
  
  if (existingProjects === 0) {
    const sampleProject = await prisma.project.create({
      data: {
        name_en: 'Sample Cybersecurity Project',
        name_ar: 'مشروع أمن سيبراني تجريبي',
        description: 'A sample project to demonstrate the system capabilities',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-12-31'),
        status: 'active',
        priority: 'high',
        progress: 25,
        imported_from_xml: false,
      },
    });

    // Create phases for the sample project
    const phase1 = await prisma.phase.create({
      data: {
        name_en: 'Planning Phase',
        name_ar: 'مرحلة التخطيط',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-03-31'),
        status: 'completed',
        progress: 100,
        order: 1,
        project_id: sampleProject.id,
      },
    });

    const phase2 = await prisma.phase.create({
      data: {
        name_en: 'Implementation Phase',
        name_ar: 'مرحلة التنفيذ',
        start_date: new Date('2024-04-01'),
        end_date: new Date('2024-09-30'),
        status: 'active',
        progress: 30,
        order: 2,
        project_id: sampleProject.id,
      },
    });

    const phase3 = await prisma.phase.create({
      data: {
        name_en: 'Testing Phase',
        name_ar: 'مرحلة الاختبار',
        start_date: new Date('2024-10-01'),
        end_date: new Date('2024-12-31'),
        status: 'on_hold',
        progress: 0,
        order: 3,
        project_id: sampleProject.id,
      },
    });

    // Create tasks for each phase
    const tasks = [
      {
        name_en: 'Requirements Analysis',
        name_ar: 'تحليل المتطلبات',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2024-01-31'),
        status: 'completed',
        progress: 100,
        order: 1,
        outline_level: 2,
        phase_id: phase1.id,
        project_id: sampleProject.id,
      },
      {
        name_en: 'System Design',
        name_ar: 'تصميم النظام',
        start_date: new Date('2024-02-01'),
        end_date: new Date('2024-02-28'),
        status: 'completed',
        progress: 100,
        order: 2,
        outline_level: 2,
        phase_id: phase1.id,
        project_id: sampleProject.id,
      },
      {
        name_en: 'Database Setup',
        name_ar: 'إعداد قاعدة البيانات',
        start_date: new Date('2024-04-01'),
        end_date: new Date('2024-04-30'),
        status: 'completed',
        progress: 100,
        order: 1,
        outline_level: 2,
        phase_id: phase2.id,
        project_id: sampleProject.id,
      },
      {
        name_en: 'Backend Development',
        name_ar: 'تطوير الخلفية',
        start_date: new Date('2024-05-01'),
        end_date: new Date('2024-07-31'),
        status: 'active',
        progress: 60,
        order: 2,
        outline_level: 2,
        phase_id: phase2.id,
        project_id: sampleProject.id,
      },
      {
        name_en: 'Frontend Development',
        name_ar: 'تطوير الواجهة',
        start_date: new Date('2024-06-01'),
        end_date: new Date('2024-08-31'),
        status: 'active',
        progress: 40,
        order: 3,
        outline_level: 2,
        phase_id: phase2.id,
        project_id: sampleProject.id,
      },
    ];

    for (const taskData of tasks) {
      await prisma.task.create({
        data: taskData,
      });
    }

    console.log('✅ Created sample project with phases and tasks');
  }

  console.log('🎉 Compliance seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding compliance data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 