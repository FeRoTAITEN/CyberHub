/*
  Warnings:

  - A unique constraint covering the columns `[permanent_token]` on the table `Survey` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "permanent_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Survey_permanent_token_key" ON "Survey"("permanent_token");
