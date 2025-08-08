/*
  Warnings:

  - You are about to drop the column `priority` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "priority";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priority";
