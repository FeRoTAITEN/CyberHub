/*
  Warnings:

  - You are about to drop the column `category_ar` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `category_en` on the `Policy` table. All the data in the column will be lost.
  - You are about to drop the column `category_ar` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `category_en` on the `Procedure` table. All the data in the column will be lost.
  - You are about to drop the column `category_ar` on the `Standard` table. All the data in the column will be lost.
  - You are about to drop the column `category_en` on the `Standard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "category_ar",
DROP COLUMN "category_en";

-- AlterTable
ALTER TABLE "Procedure" DROP COLUMN "category_ar",
DROP COLUMN "category_en";

-- AlterTable
ALTER TABLE "Standard" DROP COLUMN "category_ar",
DROP COLUMN "category_en";
