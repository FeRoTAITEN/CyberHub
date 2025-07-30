-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "is_visible" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parent_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
