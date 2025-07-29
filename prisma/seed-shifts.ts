import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌅 Seeding shifts...');

  // Clear existing shifts
  await prisma.shift.deleteMany();

  // Create shifts based on requirements
  const shifts = [
    {
      name: 'morning',
      name_ar: 'صباح',
      start_time: '06:00',
      end_time: '14:00',
      min_members: 3,
      max_members: 5
    },
    {
      name: 'evening',
      name_ar: 'مساء',
      start_time: '14:00',
      end_time: '22:00',
      min_members: 3,
      max_members: 5
    },
    {
      name: 'night',
      name_ar: 'ليل',
      start_time: '22:00',
      end_time: '06:00',
      min_members: 3,
      max_members: 5
    }
  ];

  for (const shift of shifts) {
    await prisma.shift.create({
      data: shift
    });
    console.log(`✅ Created shift: ${shift.name} (${shift.name_ar})`);
  }

  console.log('🎉 Shifts seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding shifts:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 