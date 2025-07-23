const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();

  // Insert departments
  await prisma.department.createMany({
    data: [
      { name: 'CYB-Cyber Technology', description: 'Cyber Technology Department' },
      { name: 'Cyber Excellence', description: 'Cyber Excellence Department' },
      { name: 'CYB-GRC', description: 'Governance, Risk, and Compliance' },
      { name: 'Architecture & Design', description: 'Architecture and Design Department' },
      { name: 'Protection & Defence', description: 'Protection and Defence Department' },
      { name: 'Cybersecurity', description: 'General Cybersecurity Department' },
      { name: 'CYB-IT', description: 'Cyber IT Department' },
      { name: 'Other', description: 'Other/Unassigned Department' },
    ]
  });

  // Get department IDs
  const allDepartments = await prisma.department.findMany();

  // Insert employees
  await prisma.employee.createMany({
    data: [
      { name: 'Sarah Al-Qahtani', email: 'sarah.q@salam.sa', phone: '+966501111111', job_title: 'Survey Admin', department_id: 1, avatar: 'avatar1.png', location: 'Riyadh', hire_date: new Date('2022-01-10'), status: 'active' },
      { name: 'Mohammed Al-Salem', email: 'mohammed.s@salam.sa', phone: '+966501111112', job_title: 'Data Analyst', department_id: 2, avatar: 'avatar2.png', location: 'Jeddah', hire_date: new Date('2021-03-15'), status: 'active' },
      { name: 'Aisha Al-Fahad', email: 'aisha.f@salam.sa', phone: '+966501111113', job_title: 'HR Specialist', department_id: 3, avatar: 'avatar3.png', location: 'Dammam', hire_date: new Date('2020-07-20'), status: 'active' },
      { name: 'Fahad Al-Mutairi', email: 'fahad.m@salam.sa', phone: '+966501111114', job_title: 'IT Support', department_id: 7, avatar: 'avatar4.png', location: 'Riyadh', hire_date: new Date('2019-11-05'), status: 'inactive' },
      { name: 'Noura Al-Harbi', email: 'noura.h@salam.sa', phone: '+966501111115', job_title: 'Project Manager', department_id: 4, avatar: 'avatar5.png', location: 'Jeddah', hire_date: new Date('2022-05-12'), status: 'active' },
      { name: 'Khalid Al-Otaibi', email: 'khalid.o@salam.sa', phone: '+966501111116', job_title: 'Security Engineer', department_id: 5, avatar: 'avatar6.png', location: 'Riyadh', hire_date: new Date('2021-09-01'), status: 'active' },
      { name: 'Mona Al-Shehri', email: 'mona.s@salam.sa', phone: '+966501111117', job_title: 'QA Tester', department_id: 6, avatar: 'avatar7.png', location: 'Dammam', hire_date: new Date('2020-12-18'), status: 'active' },
      { name: 'Abdullah Al-Dosari', email: 'abdullah.d@salam.sa', phone: '+966501111118', job_title: 'Network Admin', department_id: 7, avatar: 'avatar8.png', location: 'Jeddah', hire_date: new Date('2018-04-23'), status: 'inactive' },
      { name: 'Reem Al-Suwailem', email: 'reem.s@salam.sa', phone: '+966501111119', job_title: 'UI Designer', department_id: 4, avatar: 'avatar9.png', location: 'Riyadh', hire_date: new Date('2022-02-14'), status: 'active' },
      { name: 'Sultan Al-Qahtani', email: 'sultan.q@salam.sa', phone: '+966501111120', job_title: 'Backend Developer', department_id: 1, avatar: 'avatar10.png', location: 'Dammam', hire_date: new Date('2021-06-30'), status: 'active' },
      { name: 'Huda Al-Shammari', email: 'huda.s@salam.sa', phone: '+966501111121', job_title: 'Frontend Developer', department_id: 1, avatar: 'avatar11.png', location: 'Jeddah', hire_date: new Date('2020-10-10'), status: 'active' },
      { name: 'Majed Al-Rashid', email: 'majed.r@salam.sa', phone: '+966501111122', job_title: 'DevOps Engineer', department_id: 5, avatar: 'avatar12.png', location: 'Riyadh', hire_date: new Date('2019-08-25'), status: 'inactive' },
      { name: 'Laila Al-Mutlaq', email: 'laila.m@salam.sa', phone: '+966501111123', job_title: 'Business Analyst', department_id: 3, avatar: 'avatar13.png', location: 'Dammam', hire_date: new Date('2022-03-19'), status: 'active' },
      { name: 'Omar Al-Saadi', email: 'omar.s@salam.sa', phone: '+966501111124', job_title: 'Product Owner', department_id: 2, avatar: 'avatar14.png', location: 'Jeddah', hire_date: new Date('2021-12-01'), status: 'active' },
      { name: 'Amani Al-Johani', email: 'amani.j@salam.sa', phone: '+966501111125', job_title: 'Scrum Master', department_id: 4, avatar: 'avatar15.png', location: 'Riyadh', hire_date: new Date('2020-01-15'), status: 'active' },
      { name: 'Yousef Al-Ghamdi', email: 'yousef.g@salam.sa', phone: '+966501111126', job_title: 'Mobile Developer', department_id: 8, avatar: 'avatar16.png', location: 'Dammam', hire_date: new Date('2019-05-27'), status: 'inactive' },
      { name: 'Rania Al-Tamimi', email: 'rania.t@salam.sa', phone: '+966501111127', job_title: 'Content Writer', department_id: 8, avatar: 'avatar17.png', location: 'Jeddah', hire_date: new Date('2022-06-10'), status: 'active' },
      { name: 'Saad Al-Mansour', email: 'saad.m@salam.sa', phone: '+966501111128', job_title: 'System Analyst', department_id: 6, avatar: 'avatar18.png', location: 'Riyadh', hire_date: new Date('2021-04-08'), status: 'active' },
      { name: 'Hessa Al-Qahtani', email: 'hessa.q@salam.sa', phone: '+966501111129', job_title: 'Marketing Lead', department_id: 8, avatar: 'avatar19.png', location: 'Dammam', hire_date: new Date('2020-09-22'), status: 'active' },
      { name: 'Talal Al-Faraj', email: 'talal.f@salam.sa', phone: '+966501111130', job_title: 'Support Engineer', department_id: 7, avatar: 'avatar20.png', location: 'Jeddah', hire_date: new Date('2018-11-11'), status: 'inactive' },
    ]
  });
}

main()
  .then(() => {
    console.log('Seeding completed.');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  }); 