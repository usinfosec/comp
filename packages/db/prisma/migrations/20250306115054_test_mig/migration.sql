/*
  Warnings:

  - You are about to drop the `VendorComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorContact` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorMitigationTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorRiskAssessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorTaskAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorTaskAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorTaskComments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VendorComment" DROP CONSTRAINT "VendorComment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorComment" DROP CONSTRAINT "VendorComment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorComment" DROP CONSTRAINT "VendorComment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorContact" DROP CONSTRAINT "VendorContact_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorContact" DROP CONSTRAINT "VendorContact_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorMitigationTask" DROP CONSTRAINT "VendorMitigationTask_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorMitigationTask" DROP CONSTRAINT "VendorMitigationTask_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorMitigationTask" DROP CONSTRAINT "VendorMitigationTask_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorRiskAssessment" DROP CONSTRAINT "VendorRiskAssessment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorRiskAssessment" DROP CONSTRAINT "VendorRiskAssessment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorRiskAssessment" DROP CONSTRAINT "VendorRiskAssessment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_vendorMitigationTaskId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskComments" DROP CONSTRAINT "VendorTaskComments_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskComments" DROP CONSTRAINT "VendorTaskComments_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskComments" DROP CONSTRAINT "VendorTaskComments_vendorMitigationTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Vendors" DROP CONSTRAINT "Vendors_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Vendors" DROP CONSTRAINT "Vendors_ownerId_fkey";

-- DropTable
DROP TABLE "VendorComment";

-- DropTable
DROP TABLE "VendorContact";

-- DropTable
DROP TABLE "VendorMitigationTask";

-- DropTable
DROP TABLE "VendorRiskAssessment";

-- DropTable
DROP TABLE "VendorTaskAssignment";

-- DropTable
DROP TABLE "VendorTaskAttachment";

-- DropTable
DROP TABLE "VendorTaskComments";

-- DropTable
DROP TABLE "Vendors";
