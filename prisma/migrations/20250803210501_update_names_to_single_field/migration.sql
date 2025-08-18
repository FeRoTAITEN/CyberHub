/*
  Warnings:

  - You are about to drop the column `name_ar` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `Phase` table. All the data in the column will be lost.
  - You are about to drop the column `name_ar` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `name_ar` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `name_en` on the `Task` table. All the data in the column will be lost.
  - Added the required column `name` to the `Phase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Phase" DROP COLUMN "name_ar",
DROP COLUMN "name_en",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "name_ar",
DROP COLUMN "name_en",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "name_ar",
DROP COLUMN "name_en",
ADD COLUMN     "name" TEXT NOT NULL;
