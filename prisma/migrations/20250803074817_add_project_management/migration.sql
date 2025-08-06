/*
  Warnings:

  - You are about to drop the column `created_by` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `description_ar` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `description_en` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `file_url` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Procedure` table. All the data in the column will be lost.
  - Added the required column `file_path` to the `Procedure` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Procedure" DROP CONSTRAINT "Procedure_parent_id_fkey";

-- AlterTable
ALTER TABLE "Procedure" DROP COLUMN "created_by",
DROP COLUMN "description_ar",
DROP COLUMN "description_en",
DROP COLUMN "file_size",
DROP COLUMN "file_url",
DROP COLUMN "parent_id",
DROP COLUMN "status",
DROP COLUMN "updated_by",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "file_path" TEXT NOT NULL,
ADD COLUMN     "is_archived" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "version" SET DEFAULT '1.0';

-- CreateTable
CREATE TABLE "ProcedureVersion" (
    "id" SERIAL NOT NULL,
    "procedure_id" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcedureVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "manager_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "imported_from_xml" BOOLEAN NOT NULL DEFAULT false,
    "xml_file_path" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Phase" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ar" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "project_id" INTEGER NOT NULL,
    "phase_id" INTEGER,
    "parent_task_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskAssignment" (
    "id" SERIAL NOT NULL,
    "task_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskAssignment_task_id_employee_id_key" ON "TaskAssignment"("task_id", "employee_id");

-- AddForeignKey
ALTER TABLE "ProcedureVersion" ADD CONSTRAINT "ProcedureVersion_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phase" ADD CONSTRAINT "Phase_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_phase_id_fkey" FOREIGN KEY ("phase_id") REFERENCES "Phase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_parent_task_id_fkey" FOREIGN KEY ("parent_task_id") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAssignment" ADD CONSTRAINT "TaskAssignment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
