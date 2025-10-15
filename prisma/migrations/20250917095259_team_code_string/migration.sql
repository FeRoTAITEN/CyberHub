/*
  Warnings:

  - The `team_code` column on the `ShiftStaff` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ShiftStaff" DROP COLUMN "team_code",
ADD COLUMN     "team_code" TEXT NOT NULL DEFAULT 'A';

-- DropEnum
DROP TYPE "ShiftTeamCode";
