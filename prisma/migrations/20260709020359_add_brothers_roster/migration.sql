-- CreateEnum
CREATE TYPE "BrotherStatus" AS ENUM ('ACTIVE', 'ALUMNI');

-- CreateTable
CREATE TABLE "PledgeClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "term" TEXT,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PledgeClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brother" (
    "id" TEXT NOT NULL,
    "crossingNumber" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "pledgeName" TEXT NOT NULL,
    "status" "BrotherStatus" NOT NULL DEFAULT 'ALUMNI',
    "major" TEXT,
    "gradYear" INTEGER,
    "instagram" TEXT,
    "photoUrl" TEXT,
    "classId" TEXT NOT NULL,
    "bigId" TEXT,
    "bigNameFallback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brother_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrotherPhoto" (
    "id" TEXT NOT NULL,
    "brotherId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'image/webp',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrotherPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PledgeClass_name_key" ON "PledgeClass"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PledgeClass_sortOrder_key" ON "PledgeClass"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Brother_crossingNumber_key" ON "Brother"("crossingNumber");

-- CreateIndex
CREATE INDEX "Brother_classId_idx" ON "Brother"("classId");

-- CreateIndex
CREATE INDEX "Brother_status_idx" ON "Brother"("status");

-- CreateIndex
CREATE INDEX "Brother_bigId_idx" ON "Brother"("bigId");

-- CreateIndex
CREATE UNIQUE INDEX "BrotherPhoto_brotherId_key" ON "BrotherPhoto"("brotherId");

-- AddForeignKey
ALTER TABLE "Brother" ADD CONSTRAINT "Brother_classId_fkey" FOREIGN KEY ("classId") REFERENCES "PledgeClass"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brother" ADD CONSTRAINT "Brother_bigId_fkey" FOREIGN KEY ("bigId") REFERENCES "Brother"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrotherPhoto" ADD CONSTRAINT "BrotherPhoto_brotherId_fkey" FOREIGN KEY ("brotherId") REFERENCES "Brother"("id") ON DELETE CASCADE ON UPDATE CASCADE;
