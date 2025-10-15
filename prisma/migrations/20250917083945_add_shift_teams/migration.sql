-- CreateEnum
CREATE TYPE "ShiftTeamCode" AS ENUM ('A', 'B', 'C');

-- AlterTable
ALTER TABLE "ShiftStaff" ADD COLUMN     "team_code" "ShiftTeamCode" NOT NULL DEFAULT 'A';
