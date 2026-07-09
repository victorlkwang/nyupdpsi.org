-- CreateEnum
CREATE TYPE "MessageKind" AS ENUM ('THANK_YOU', 'GOOD_KID');

-- AlterTable
ALTER TABLE "RushApplication" ADD COLUMN     "goodKidSentAt" TIMESTAMP(3),
ADD COLUMN     "isGoodKid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "thankYouSentAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MessageTemplate" (
    "id" TEXT NOT NULL,
    "kind" "MessageKind" NOT NULL,
    "emailSubject" TEXT NOT NULL,
    "emailBody" TEXT NOT NULL,
    "smsBody" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MessageTemplate_kind_key" ON "MessageTemplate"("kind");
