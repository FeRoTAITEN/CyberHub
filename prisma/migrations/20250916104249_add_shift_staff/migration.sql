/*
  Warnings:

  - You are about to drop the `ShiftAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShiftAssignment" DROP CONSTRAINT "ShiftAssignment_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "ShiftAssignment" DROP CONSTRAINT "ShiftAssignment_shift_id_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_employee_id_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_team_id_fkey";

-- AlterTable
ALTER TABLE "Shift" ALTER COLUMN "min_members" SET DEFAULT 2;

-- DropTable
DROP TABLE "ShiftAssignment";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamMember";

-- CreateTable
CREATE TABLE "ShiftStaff" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "job_title" TEXT,
    "job_title_ar" TEXT,
    "department_id" INTEGER,
    "avatar" TEXT,
    "location" TEXT,
    "hire_date" TIMESTAMP(3),
    "status" TEXT DEFAULT 'active',
    "gender" TEXT DEFAULT 'male',
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ShiftStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftStaffAssignment" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "shift_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "assigned_by" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'assigned',

    CONSTRAINT "ShiftStaffAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShiftStaffAvailability" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "reason_ar" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShiftStaffAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShiftStaff_email_key" ON "ShiftStaff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShiftStaffAssignment_date_shift_id_staff_id_key" ON "ShiftStaffAssignment"("date", "shift_id", "staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "ShiftStaffAvailability_staff_id_date_key" ON "ShiftStaffAvailability"("staff_id", "date");

-- AddForeignKey
ALTER TABLE "ShiftStaff" ADD CONSTRAINT "ShiftStaff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftStaffAssignment" ADD CONSTRAINT "ShiftStaffAssignment_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftStaffAssignment" ADD CONSTRAINT "ShiftStaffAssignment_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "ShiftStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShiftStaffAvailability" ADD CONSTRAINT "ShiftStaffAvailability_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "ShiftStaff"("id") ON DELETE CASCADE ON UPDATE CASCADE;
