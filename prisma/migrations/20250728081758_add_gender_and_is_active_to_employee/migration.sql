-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "gender" TEXT DEFAULT 'male',
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
