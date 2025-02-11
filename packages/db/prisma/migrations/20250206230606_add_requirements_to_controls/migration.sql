-- CreateEnum
CREATE TYPE "RequirementType" AS ENUM ('policy', 'file', 'link');

-- AlterTable
ALTER TABLE "Control" ADD COLUMN     "domain" TEXT;

-- CreateTable
CREATE TABLE "PolicyControl" (
    "id" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,

    CONSTRAINT "PolicyControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlRequirement" (
    "id" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "type" "RequirementType" NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "fileType" TEXT,
    "policyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ControlRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PolicyControl_policyId_controlId_key" ON "PolicyControl"("policyId", "controlId");

-- CreateIndex
CREATE INDEX "ControlRequirement_controlId_idx" ON "ControlRequirement"("controlId");

-- AddForeignKey
ALTER TABLE "PolicyControl" ADD CONSTRAINT "PolicyControl_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PolicyControl" ADD CONSTRAINT "PolicyControl_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlRequirement" ADD CONSTRAINT "ControlRequirement_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlRequirement" ADD CONSTRAINT "ControlRequirement_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
