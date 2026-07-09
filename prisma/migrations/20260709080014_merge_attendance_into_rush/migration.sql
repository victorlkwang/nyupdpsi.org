/*
  Warnings:

  - You are about to drop the `EventAttendance` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "RushApplication" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "attendedEvents" "RushEvent"[] DEFAULT ARRAY[]::"RushEvent"[],
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "school" DROP NOT NULL;

-- DropTable
DROP TABLE "EventAttendance";
