/*
  Warnings:

  - You are about to drop the column `end_date` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Phase" DROP COLUMN "end_date",
DROP COLUMN "start_date";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "end_date",
DROP COLUMN "start_date";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "end_date",
DROP COLUMN "start_date";
