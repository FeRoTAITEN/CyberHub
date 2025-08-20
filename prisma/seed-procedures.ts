import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding procedures...');

  const procedures = [
    {
      title_en: 'Incident Response Procedure',
      title_ar: 'إجراء الاستجابة للحوادث',
      description: 'Step-by-step procedure for handling security incidents and breaches',
      version: 'v2.1',
      file_path: '/uploads/procedures/incident-response.pdf',
      downloads: 67,
      views: 145,
      is_visible: true
    },
    {
      title_en: 'Access Control Procedure',
      title_ar: 'إجراء التحكم في الوصول',
      description: 'Procedures for managing user access to systems and data',
      version: 'v1.8',
      file_path: '/uploads/procedures/access-control.pdf',
      downloads: 89,
      views: 234,
      is_visible: true
    },
    {
      title_en: 'Data Backup and Recovery',
      title_ar: 'النسخ الاحتياطي واستعادة البيانات',
      description: 'Procedures for backing up critical data and disaster recovery',
      version: 'v1.5',
      file_path: '/uploads/procedures/backup-recovery.pdf',
      downloads: 45,
      views: 112,
      is_visible: true
    },
    {
      title_en: 'Vulnerability Assessment',
      title_ar: 'تقييم نقاط الضعف',
      description: 'Procedures for conducting security vulnerability assessments',
      version: 'v1.3',
      file_path: '/uploads/procedures/vulnerability-assessment.pdf',
      downloads: 34,
      views: 78,
      is_visible: true
    },
    {
      title_en: 'Change Management Procedure',
      title_ar: 'إجراء إدارة التغيير',
      description: 'Procedures for managing changes to IT systems and infrastructure',
      version: 'v1.9',
      file_path: '/uploads/procedures/change-management.pdf',
      downloads: 56,
      views: 134,
      is_visible: true
    },
    {
      title_en: 'Security Awareness Training',
      title_ar: 'تدريب التوعية الأمنية',
      description: 'Procedures for conducting security awareness training programs',
      version: 'v1.2',
      file_path: '/uploads/procedures/security-training.pdf',
      downloads: 78,
      views: 189,
      is_visible: true
    }
  ];

  for (const procedure of procedures) {
    await prisma.procedure.create({
      data: procedure
    });
  }

  console.log('Procedures seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 