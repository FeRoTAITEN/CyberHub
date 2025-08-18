-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "actual_finish" TIMESTAMP(3),
ADD COLUMN     "actual_start" TIMESTAMP(3),
ADD COLUMN     "baseline_finish" TIMESTAMP(3),
ADD COLUMN     "baseline_start" TIMESTAMP(3);
