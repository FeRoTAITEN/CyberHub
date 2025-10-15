import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create shifts if they don't exist
  const shifts = [
    { name: 'Morning', name_ar: 'صباح', start_time: '07:00', end_time: '15:00', max_members: 10 },
    { name: 'Day', name_ar: 'نهار', start_time: '15:00', end_time: '23:00', max_members: 10 },
    { name: 'Night', name_ar: 'ليل', start_time: '23:00', end_time: '07:00', max_members: 10 },
    { name: 'Late Morning', name_ar: 'صباح متأخر', start_time: '10:00', end_time: '18:00', max_members: 5 }
  ];

  // Clear existing data for clean seed
  await prisma.shiftStaffAssignment.deleteMany();
  await prisma.shiftStaffAvailability.deleteMany();
  await prisma.shiftStaff.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.shiftPattern.deleteMany();

  // Create shifts
  for (const shift of shifts) {
    await prisma.shift.create({
      data: shift
    });
  }

  // Create patterns
  const patterns = [
    { name: 'Alpha Rotation', name_ar: 'نمط ألفا', code: 'alpha-21' },
    { name: 'Beta Rotation', name_ar: 'نمط بيتا', code: 'beta-5' },
    { name: 'Delta Rotation', name_ar: 'نمط دلتا', code: 'delta-7' },
    { name: 'Late Morning', name_ar: 'صباح متأخر', code: 'late-5' }
  ];

  for (const pattern of patterns) {
    await prisma.shiftPattern.create({
      data: pattern
    });
  }

  // Create 27 staff members
  const staffMembers = Array.from({ length: 27 }, (_, i) => ({
    name: `Staff ${String(i + 1).padStart(2, '0')}`,
    name_ar: `موظف ${String(i + 1).padStart(2, '0')}`,
    email: `staff${String(i + 1).padStart(2, '0')}@example.com`,
    phone: `+966500${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
    is_active: true
  }));

  for (const staff of staffMembers) {
    await prisma.shiftStaff.create({
      data: staff
    });
  }

  console.log('✅ Seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 