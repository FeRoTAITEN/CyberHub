/*
  Warnings:

  - You are about to drop the column `cost` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `work` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `work` on the `TaskAssignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "cost",
DROP COLUMN "work";

-- AlterTable
ALTER TABLE "TaskAssignment" DROP COLUMN "work";
