-- AlterTable
ALTER TABLE "ShiftStaff" ADD COLUMN     "pattern_id" INTEGER;

-- CreateTable
CREATE TABLE "ShiftPattern" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,

    CONSTRAINT "ShiftPattern_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShiftPattern_code_key" ON "ShiftPattern"("code");

-- AddForeignKey
ALTER TABLE "ShiftStaff" ADD CONSTRAINT "ShiftStaff_pattern_id_fkey" FOREIGN KEY ("pattern_id") REFERENCES "ShiftPattern"("id") ON DELETE SET NULL ON UPDATE CASCADE;
