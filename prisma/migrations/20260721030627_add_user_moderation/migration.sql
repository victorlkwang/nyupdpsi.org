-- AlterTable
ALTER TABLE "User" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isSpam" BOOLEAN NOT NULL DEFAULT false;
