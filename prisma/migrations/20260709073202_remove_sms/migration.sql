/*
  Warnings:

  - You are about to drop the column `smsBody` on the `MessageTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MessageTemplate" DROP COLUMN "smsBody";
