import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding procedures...');

  const procedures = [
    {
      title_en: 'Incident Response Procedure',
      title_ar: 'إجراء الاستجابة للحوادث',
      description_en: 'Step-by-step procedure for handling security incidents and breaches',
      description_ar: 'إجراء خطوة بخطوة للتعامل مع الحوادث والاختراقات الأمنية',
      version: 'v2.1',
      file_size: '1.6 MB',
      file_url: '/uploads/procedures/incident-response.pdf',
      downloads: 67,
      views: 145,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'Access Control Procedure',
      title_ar: 'إجراء التحكم في الوصول',
      description_en: 'Procedures for managing user access to systems and data',
      description_ar: 'إجراءات إدارة وصول المستخدمين للأنظمة والبيانات',
      version: 'v1.8',
      file_size: '1.2 MB',
      file_url: '/uploads/procedures/access-control.pdf',
      downloads: 89,
      views: 234,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'Data Backup and Recovery',
      title_ar: 'النسخ الاحتياطي واستعادة البيانات',
      description_en: 'Procedures for backing up critical data and disaster recovery',
      description_ar: 'إجراءات النسخ الاحتياطي للبيانات الحرجة والتعافي من الكوارث',
      version: 'v1.5',
      file_size: '2.3 MB',
      file_url: '/uploads/procedures/backup-recovery.pdf',
      downloads: 45,
      views: 112,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'Vulnerability Assessment',
      title_ar: 'تقييم نقاط الضعف',
      description_en: 'Procedures for conducting security vulnerability assessments',
      description_ar: 'إجراءات إجراء تقييمات نقاط الضعف الأمنية',
      version: 'v1.3',
      file_size: '1.7 MB',
      file_url: '/uploads/procedures/vulnerability-assessment.pdf',
      downloads: 34,
      views: 78,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'Change Management Procedure',
      title_ar: 'إجراء إدارة التغيير',
      description_en: 'Procedures for managing changes to IT systems and infrastructure',
      description_ar: 'إجراءات إدارة التغييرات في أنظمة وتقنية المعلومات',
      version: 'v1.9',
      file_size: '1.4 MB',
      file_url: '/uploads/procedures/change-management.pdf',
      downloads: 56,
      views: 134,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'Security Awareness Training',
      title_ar: 'تدريب التوعية الأمنية',
      description_en: 'Procedures for conducting security awareness training programs',
      description_ar: 'إجراءات إجراء برامج تدريب التوعية الأمنية',
      version: 'v1.2',
      file_size: '1.1 MB',
      file_url: '/uploads/procedures/security-training.pdf',
      downloads: 78,
      views: 189,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
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