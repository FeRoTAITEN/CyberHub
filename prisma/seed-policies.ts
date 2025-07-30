import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding policies...');

  // Clear existing policies
  await prisma.policy.deleteMany();

  // Create sample policies
  const policies = [
    {
      title_en: "Password Policy",
      title_ar: "سياسة كلمات المرور",
      description_en: "Defines requirements for password complexity, rotation, and management.",
      description_ar: "تحدد متطلبات تعقيد كلمات المرور وتغييرها وإدارتها.",
      category_en: "Access Control",
      category_ar: "التحكم في الوصول",
      version: "v3.2",
      file_size: "245 KB",
      file_url: "/uploads/policies/sample_password_policy.pdf",
      downloads: 156,
      views: 234,
      status: "active",
      created_by: 1,
    },
    {
      title_en: "Acceptable Use Policy",
      title_ar: "سياسة الاستخدام المقبول",
      description_en: "Outlines acceptable and prohibited uses of company IT resources.",
      description_ar: "توضح الاستخدامات المقبولة والممنوعة لموارد تقنية المعلومات بالشركة.",
      category_en: "Resource Management",
      category_ar: "إدارة الموارد",
      version: "v4.0",
      file_size: "890 KB",
      file_url: "/uploads/policies/sample_acceptable_use_policy.pdf",
      downloads: 234,
      views: 345,
      status: "active",
      created_by: 1,
    },
    {
      title_en: "Incident Response Policy",
      title_ar: "سياسة الاستجابة للحوادث",
      description_en: "Describes procedures for responding to cybersecurity incidents.",
      description_ar: "تصف إجراءات الاستجابة للحوادث السيبرانية.",
      category_en: "Incident Management",
      category_ar: "إدارة الحوادث",
      version: "v2.1",
      file_size: "1.2 MB",
      file_url: "/uploads/policies/sample_incident_response_policy.pdf",
      downloads: 89,
      views: 156,
      status: "active",
      created_by: 1,
    },
    {
      title_en: "Data Protection Policy",
      title_ar: "سياسة حماية البيانات",
      description_en: "Guidelines for protecting sensitive company and customer data.",
      description_ar: "إرشادات لحماية البيانات الحساسة للشركة والعملاء.",
      category_en: "Data Security",
      category_ar: "أمان البيانات",
      version: "v1.8",
      file_size: "756 KB",
      file_url: "/uploads/policies/sample_data_protection_policy.pdf",
      downloads: 178,
      views: 267,
      status: "active",
      created_by: 1,
    },
    {
      title_en: "Network Security Policy",
      title_ar: "سياسة أمان الشبكات",
      description_en: "Standards and procedures for network security and infrastructure.",
      description_ar: "معايير وإجراءات أمان الشبكات والبنية التحتية.",
      category_en: "Network Security",
      category_ar: "أمان الشبكات",
      version: "v3.1",
      file_size: "1.5 MB",
      file_url: "/uploads/policies/sample_network_security_policy.pdf",
      downloads: 95,
      views: 189,
      status: "active",
      created_by: 1,
    },
  ];

  for (const policy of policies) {
    await prisma.policy.create({
      data: policy,
    });
  }

  console.log('Policies seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 