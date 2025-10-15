import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create basic shifts if they don't exist
  const shifts = [
    { name: 'Morning', name_ar: 'صباح', start_time: '06:00', end_time: '14:00' },
    { name: 'Day', name_ar: 'نهار', start_time: '14:00', end_time: '22:00' },
    { name: 'Night', name_ar: 'ليل', start_time: '22:00', end_time: '06:00' },
    { name: 'Late Morning', name_ar: 'صباح متأخر', start_time: '09:00', end_time: '17:00' }
  ];

  for (const shift of shifts) {
    const existing = await prisma.shift.findFirst({
      where: { OR: [{ name: shift.name }, { name_ar: shift.name_ar }] }
    });
    
    if (!existing) {
      await prisma.shift.create({ data: shift });
    }
  }

  console.log('✅ Basic shifts created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 