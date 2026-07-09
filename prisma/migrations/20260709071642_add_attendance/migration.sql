/*
  Warnings:

  - You are about to drop the column `goodKidSentAt` on the `RushApplication` table. All the data in the column will be lost.
  - You are about to drop the column `isGoodKid` on the `RushApplication` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RushEvent" AS ENUM ('SCAVENGER_HUNT', 'ACTIVITY_NIGHT_KAPPAS', 'ACTIVITY_NIGHT_SIGMAS', 'GAME_NIGHT', 'GENERAL_INTEREST_MEETING', 'ACTIVITY_NIGHT_AKDPHIS');

-- AlterTable
ALTER TABLE "RushApplication" DROP COLUMN "goodKidSentAt",
DROP COLUMN "isGoodKid",
ADD COLUMN     "messageSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FormSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "activeEvent" "RushEvent",
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendance" (
    "id" TEXT NOT NULL,
    "event" "RushEvent" NOT NULL,
    "name" TEXT NOT NULL,
    "nyuEmail" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "instagramHandle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventAttendance_nyuEmail_phoneNumber_idx" ON "EventAttendance"("nyuEmail", "phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_event_nyuEmail_phoneNumber_key" ON "EventAttendance"("event", "nyuEmail", "phoneNumber");
