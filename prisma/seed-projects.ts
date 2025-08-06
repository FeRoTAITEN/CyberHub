import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding projects...');

  // Create sample projects
  const projects = [
    {
      name_en: 'Cybersecurity Infrastructure Upgrade',
      name_ar: 'ترقية البنية التحتية للأمن السيبراني',
      description: 'Upgrade and modernize the cybersecurity infrastructure to meet current standards',
      start_date: new Date('2024-01-01'),
      end_date: new Date('2024-12-31'),
      status: 'active',
      priority: 'high',
      progress: 65,
      imported_from_xml: false,
    },
    {
      name_en: 'Employee Security Training Program',
      name_ar: 'برنامج تدريب الموظفين على الأمن',
      description: 'Comprehensive security awareness training for all employees',
      start_date: new Date('2024-03-01'),
      end_date: new Date('2024-08-31'),
      status: 'active',
      priority: 'medium',
      progress: 40,
      imported_from_xml: false,
    },
    {
      name_en: 'Incident Response System Implementation',
      name_ar: 'تنفيذ نظام الاستجابة للحوادث',
      description: 'Implement a comprehensive incident response system',
      start_date: new Date('2024-06-01'),
      end_date: new Date('2024-11-30'),
      status: 'on_hold',
      priority: 'critical',
      progress: 25,
      imported_from_xml: false,
    },
  ];

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: projectData,
    });

    console.log(`✅ Created project: ${project.name_en}`);

    // Create phases for each project
    const phases = [
      {
        name_en: 'Planning Phase',
        name_ar: 'مرحلة التخطيط',
        description: 'Initial planning and requirements gathering',
        start_date: project.start_date,
        end_date: new Date(project.start_date.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'completed',
        progress: 100,
        order: 1,
      },
      {
        name_en: 'Implementation Phase',
        name_ar: 'مرحلة التنفيذ',
        description: 'Core implementation and development',
        start_date: new Date(project.start_date.getTime() + 30 * 24 * 60 * 60 * 1000),
        end_date: new Date(project.end_date.getTime() - 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        progress: project.progress,
        order: 2,
      },
      {
        name_en: 'Testing & Deployment',
        name_ar: 'الاختبار والنشر',
        description: 'Final testing and deployment',
        start_date: new Date(project.end_date.getTime() - 30 * 24 * 60 * 60 * 1000),
        end_date: project.end_date,
        status: 'active',
        progress: 0,
        order: 3,
      },
    ];

    for (const phaseData of phases) {
      const phase = await prisma.phase.create({
        data: {
          ...phaseData,
          project_id: project.id,
        },
      });

      console.log(`  📋 Created phase: ${phase.name_en}`);

      // Create tasks for each phase
      const tasks = [
        {
          name_en: 'Requirements Analysis',
          name_ar: 'تحليل المتطلبات',
          description: 'Analyze and document project requirements',
          start_date: phase.start_date,
          end_date: new Date(phase.start_date.getTime() + 7 * 24 * 60 * 60 * 1000),
          status: 'completed',
          priority: 'high',
          progress: 100,
          order: 1,
        },
        {
          name_en: 'System Design',
          name_ar: 'تصميم النظام',
          description: 'Design system architecture and components',
          start_date: new Date(phase.start_date.getTime() + 7 * 24 * 60 * 60 * 1000),
          end_date: new Date(phase.start_date.getTime() + 14 * 24 * 60 * 60 * 1000),
          status: 'completed',
          priority: 'high',
          progress: 100,
          order: 2,
        },
        {
          name_en: 'Development',
          name_ar: 'التطوير',
          description: 'Develop and implement features',
          start_date: new Date(phase.start_date.getTime() + 14 * 24 * 60 * 60 * 1000),
          end_date: new Date(phase.end_date.getTime() - 7 * 24 * 60 * 60 * 1000),
          status: 'active',
          priority: 'medium',
          progress: 60,
          order: 3,
        },
        {
          name_en: 'Testing',
          name_ar: 'الاختبار',
          description: 'Test and validate functionality',
          start_date: new Date(phase.end_date.getTime() - 7 * 24 * 60 * 60 * 1000),
          end_date: phase.end_date,
          status: 'active',
          priority: 'medium',
          progress: 30,
          order: 4,
        },
      ];

      for (const taskData of tasks) {
        const task = await prisma.task.create({
          data: {
            ...taskData,
            project_id: project.id,
            phase_id: phase.id,
          },
        });

        console.log(`    ✅ Created task: ${task.name_en}`);

        // Create subtasks for some tasks
        if (task.name_en === 'Development') {
          const subtasks = [
            {
              name_en: 'Frontend Development',
              name_ar: 'تطوير الواجهة الأمامية',
              description: 'Develop user interface components',
              start_date: task.start_date,
              end_date: new Date(task.start_date.getTime() + 10 * 24 * 60 * 60 * 1000),
              status: 'completed',
              priority: 'medium',
              progress: 100,
              order: 1,
            },
            {
              name_en: 'Backend Development',
              name_ar: 'تطوير الخلفية',
              description: 'Develop server-side functionality',
              start_date: new Date(task.start_date.getTime() + 5 * 24 * 60 * 60 * 1000),
              end_date: new Date(task.end_date.getTime() - 5 * 24 * 60 * 60 * 1000),
              status: 'active',
              priority: 'medium',
              progress: 70,
              order: 2,
            },
            {
              name_en: 'Database Integration',
              name_ar: 'تكامل قاعدة البيانات',
              description: 'Integrate database and data models',
              start_date: new Date(task.start_date.getTime() + 10 * 24 * 60 * 60 * 1000),
              end_date: task.end_date,
              status: 'active',
              priority: 'high',
              progress: 40,
              order: 3,
            },
          ];

          for (const subtaskData of subtasks) {
            const subtask = await prisma.task.create({
              data: {
                ...subtaskData,
                project_id: project.id,
                phase_id: phase.id,
                parent_task_id: task.id,
              },
            });

            console.log(`      🔹 Created subtask: ${subtask.name_en}`);
          }
        }
      }
    }
  }

  console.log('✅ Projects seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding projects:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 