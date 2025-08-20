import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding projects...');

  // Create sample projects
  const projects = [
    {
      name: 'Cybersecurity Infrastructure Upgrade',
      description: 'Upgrade and modernize the cybersecurity infrastructure to meet current standards',
      status: 'active',
      progress: 65,
      imported_from_xml: false,
    },
    {
      name: 'Employee Security Training Program',
      description: 'Comprehensive security awareness training for all employees',
      status: 'active',
      progress: 40,
      imported_from_xml: false,
    },
    {
      name: 'Incident Response System Implementation',
      description: 'Implement a comprehensive incident response system',
      status: 'on_hold',
      progress: 25,
      imported_from_xml: false,
    },
  ];

  for (const projectData of projects) {
    const project = await prisma.project.create({
      data: projectData,
    });

    console.log(`✅ Created project: ${project.name}`);

    // Create phases for each project
    const phases = [
      {
        name: 'Planning Phase',
        description: 'Initial planning and requirements gathering',
        status: 'completed',
        progress: 100,
        order: 1,
      },
      {
        name: 'Implementation Phase',
        description: 'Core implementation and development',
        status: 'active',
        progress: project.progress,
        order: 2,
      },
      {
        name: 'Testing & Deployment',
        description: 'Final testing and deployment',
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

      console.log(`  📋 Created phase: ${phase.name}`);

      // Create tasks for each phase
      const tasks = [
        {
          name: 'Requirements Analysis',
          description: 'Analyze and document project requirements',
          status: 'completed',
          progress: 100,
          order: 1,
        },
        {
          name: 'System Design',
          description: 'Design system architecture and components',
          status: 'completed',
          progress: 100,
          order: 2,
        },
        {
          name: 'Development',
          description: 'Develop and implement features',
          status: 'active',
          progress: 60,
          order: 3,
        },
        {
          name: 'Testing',
          description: 'Test and validate functionality',
          status: 'active',
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

        console.log(`    ✅ Created task: ${task.name}`);

        // Create subtasks for some tasks
        if (task.name === 'Development') {
          const subtasks = [
            {
              name: 'Frontend Development',
              description: 'Develop user interface components',
              status: 'completed',
              progress: 100,
              order: 1,
            },
            {
              name: 'Backend Development',
              description: 'Develop server-side functionality',
              status: 'active',
              progress: 70,
              order: 2,
            },
            {
              name: 'Database Integration',
              description: 'Integrate database and data models',
              status: 'active',
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

            console.log(`      🔹 Created subtask: ${subtask.name}`);
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