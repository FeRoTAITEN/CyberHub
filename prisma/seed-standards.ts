import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding standards...');

  const standards = [
    {
      title_en: 'ISO 27001 Information Security Management',
      title_ar: 'إدارة أمن المعلومات ISO 27001',
      description_en: 'International standard for information security management systems (ISMS)',
      description_ar: 'المعيار الدولي لأنظمة إدارة أمن المعلومات',
      category_en: 'Information Security',
      category_ar: 'أمن المعلومات',
      version: 'v1.0',
      file_size: '2.5 MB',
      file_url: '/uploads/standards/iso27001.pdf',
      downloads: 45,
      views: 120,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'NIST Cybersecurity Framework',
      title_ar: 'إطار عمل الأمن السيبراني NIST',
      description_en: 'Framework for improving critical infrastructure cybersecurity',
      description_ar: 'إطار عمل لتحسين الأمن السيبراني للبنية التحتية الحرجة',
      category_en: 'Cybersecurity',
      category_ar: 'الأمن السيبراني',
      version: 'v2.0',
      file_size: '1.8 MB',
      file_url: '/uploads/standards/nist-framework.pdf',
      downloads: 32,
      views: 89,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'PCI DSS Payment Card Security',
      title_ar: 'أمن بطاقات الدفع PCI DSS',
      description_en: 'Security standards for organizations that handle credit card information',
      description_ar: 'معايير الأمان للمؤسسات التي تتعامل مع معلومات بطاقات الائتمان',
      category_en: 'Payment Security',
      category_ar: 'أمن المدفوعات',
      version: 'v4.0',
      file_size: '3.2 MB',
      file_url: '/uploads/standards/pci-dss.pdf',
      downloads: 28,
      views: 67,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'SOC 2 Type II Compliance',
      title_ar: 'الامتثال SOC 2 النوع الثاني',
      description_en: 'Service Organization Control 2 compliance standards',
      description_ar: 'معايير الامتثال لضوابط منظمة الخدمة 2',
      category_en: 'Compliance',
      category_ar: 'الامتثال',
      version: 'v1.5',
      file_size: '2.1 MB',
      file_url: '/uploads/standards/soc2.pdf',
      downloads: 19,
      views: 54,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    },
    {
      title_en: 'GDPR Data Protection Standards',
      title_ar: 'معايير حماية البيانات GDPR',
      description_en: 'General Data Protection Regulation compliance standards',
      description_ar: 'معايير الامتثال للائحة حماية البيانات العامة',
      category_en: 'Data Protection',
      category_ar: 'حماية البيانات',
      version: 'v1.0',
      file_size: '1.9 MB',
      file_url: '/uploads/standards/gdpr.pdf',
      downloads: 41,
      views: 98,
      status: 'active',
      is_visible: true,
      created_by: 1,
      updated_by: 1
    }
  ];

  for (const standard of standards) {
    await prisma.standard.create({
      data: standard
    });
  }

  console.log('Standards seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 