/*
  Warnings:

  - A unique constraint covering the columns `[taskId,employeeId]` on the table `VendorTaskAssignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileUrl` to the `VendorAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `VendorAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `VendorComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VendorComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VendorContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `VendorTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `VendorTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VendorTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `VendorTaskAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `VendorTaskAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `VendorTaskAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `VendorTaskAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `VendorTaskAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `VendorTaskComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `VendorTaskComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskId` to the `VendorTaskComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VendorTaskComment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RiskLikelihood" AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');

-- CreateEnum
CREATE TYPE "RiskImpact" AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');

-- CreateEnum
CREATE TYPE "VendorTaskStatus" AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "VendorAttachmentType" AS ENUM ('file', 'image', 'document', 'other');

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorAttachment" DROP CONSTRAINT "VendorAttachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorAttachment" DROP CONSTRAINT "VendorAttachment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorComment" DROP CONSTRAINT "VendorComment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorComment" DROP CONSTRAINT "VendorComment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorContact" DROP CONSTRAINT "VendorContact_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorContact" DROP CONSTRAINT "VendorContact_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTask" DROP CONSTRAINT "VendorTask_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTask" DROP CONSTRAINT "VendorTask_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskComment" DROP CONSTRAINT "VendorTaskComment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskComment" DROP CONSTRAINT "VendorTaskComment_vendorId_fkey";

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "VendorAttachment" ADD COLUMN     "fileKey" TEXT,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "type" "VendorAttachmentType" NOT NULL DEFAULT 'file',
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VendorComment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VendorContact" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VendorTask" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "notifiedAt" TIMESTAMP(3),
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "status" "VendorTaskStatus" NOT NULL DEFAULT 'open',
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VendorTaskAssignment" ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employeeId" TEXT NOT NULL,
ADD COLUMN     "taskId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "VendorTaskAttachment" ADD COLUMN     "fileKey" TEXT,
ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "taskId" TEXT NOT NULL,
ADD COLUMN     "type" "VendorAttachmentType" NOT NULL DEFAULT 'file',
ADD COLUMN     "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "VendorTaskComment" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "taskId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Vendor_ownerId_idx" ON "Vendor"("ownerId");

-- CreateIndex
CREATE INDEX "VendorAttachment_ownerId_idx" ON "VendorAttachment"("ownerId");

-- CreateIndex
CREATE INDEX "VendorComment_ownerId_idx" ON "VendorComment"("ownerId");

-- CreateIndex
CREATE INDEX "VendorTask_ownerId_idx" ON "VendorTask"("ownerId");

-- CreateIndex
CREATE INDEX "VendorTaskAssignment_taskId_idx" ON "VendorTaskAssignment"("taskId");

-- CreateIndex
CREATE INDEX "VendorTaskAssignment_employeeId_idx" ON "VendorTaskAssignment"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorTaskAssignment_taskId_employeeId_key" ON "VendorTaskAssignment"("taskId", "employeeId");

-- CreateIndex
CREATE INDEX "VendorTaskAttachment_taskId_idx" ON "VendorTaskAttachment"("taskId");

-- CreateIndex
CREATE INDEX "VendorTaskAttachment_ownerId_idx" ON "VendorTaskAttachment"("ownerId");

-- CreateIndex
CREATE INDEX "VendorTaskComment_taskId_idx" ON "VendorTaskComment"("taskId");

-- CreateIndex
CREATE INDEX "VendorTaskComment_ownerId_idx" ON "VendorTaskComment"("ownerId");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorComment" ADD CONSTRAINT "VendorComment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorComment" ADD CONSTRAINT "VendorComment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorComment" ADD CONSTRAINT "VendorComment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAttachment" ADD CONSTRAINT "VendorAttachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAttachment" ADD CONSTRAINT "VendorAttachment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAttachment" ADD CONSTRAINT "VendorAttachment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTask" ADD CONSTRAINT "VendorTask_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTask" ADD CONSTRAINT "VendorTask_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTask" ADD CONSTRAINT "VendorTask_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAttachment" ADD CONSTRAINT "VendorTaskAttachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAttachment" ADD CONSTRAINT "VendorTaskAttachment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAttachment" ADD CONSTRAINT "VendorTaskAttachment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "VendorTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAttachment" ADD CONSTRAINT "VendorTaskAttachment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskComment" ADD CONSTRAINT "VendorTaskComment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskComment" ADD CONSTRAINT "VendorTaskComment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskComment" ADD CONSTRAINT "VendorTaskComment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "VendorTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskComment" ADD CONSTRAINT "VendorTaskComment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAssignment" ADD CONSTRAINT "VendorTaskAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAssignment" ADD CONSTRAINT "VendorTaskAssignment_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAssignment" ADD CONSTRAINT "VendorTaskAssignment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "VendorTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAssignment" ADD CONSTRAINT "VendorTaskAssignment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Clear existing assignments to prevent unique constraint violations
DELETE FROM "VendorTaskAssignment";

-- CreateTable
CREATE TABLE "Vendor" (
  // ... existing code ...
);
