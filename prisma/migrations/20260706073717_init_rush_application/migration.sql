-- CreateEnum
CREATE TYPE "Year" AS ENUM ('FRESHMAN', 'SOPHOMORE', 'JUNIOR', 'SENIOR');

-- CreateEnum
CREATE TYPE "School" AS ENUM ('STERN', 'STEINHARDT', 'CAS', 'GALLATIN', 'TANDON', 'TISCH', 'OTHER');

-- CreateTable
CREATE TABLE "RushApplication" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nyuEmail" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "year" "Year" NOT NULL,
    "school" "School" NOT NULL,
    "instagramHandle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RushApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RushApplication_nyuEmail_term_key" ON "RushApplication"("nyuEmail", "term");
