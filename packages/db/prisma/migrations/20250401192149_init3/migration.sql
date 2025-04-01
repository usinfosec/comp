/*
  Warnings:

  - You are about to drop the column `organizationId` on the `VendorContact` table. All the data in the column will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmployeeTrainingVideos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IntegrationLastRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PortalVerification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiskAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiskComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiskMitigationTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiskTaskAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RiskTreatmentStrategy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorAttachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorTaskAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorTaskAttachment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_userId_fkey";

-- DropForeignKey
ALTER TABLE "EmployeeTrainingVideos" DROP CONSTRAINT "EmployeeTrainingVideos_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationLastRun" DROP CONSTRAINT "IntegrationLastRun_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationLastRun" DROP CONSTRAINT "IntegrationLastRun_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "IntegrationResult" DROP CONSTRAINT "IntegrationResult_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "RiskAttachment" DROP CONSTRAINT "RiskAttachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "RiskAttachment" DROP CONSTRAINT "RiskAttachment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "RiskAttachment" DROP CONSTRAINT "RiskAttachment_riskId_fkey";

-- DropForeignKey
ALTER TABLE "RiskComment" DROP CONSTRAINT "RiskComment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "RiskComment" DROP CONSTRAINT "RiskComment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "RiskComment" DROP CONSTRAINT "RiskComment_riskId_fkey";

-- DropForeignKey
ALTER TABLE "RiskMitigationTask" DROP CONSTRAINT "RiskMitigationTask_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "RiskMitigationTask" DROP CONSTRAINT "RiskMitigationTask_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "RiskMitigationTask" DROP CONSTRAINT "RiskMitigationTask_riskId_fkey";

-- DropForeignKey
ALTER TABLE "RiskTaskAssignment" DROP CONSTRAINT "RiskTaskAssignment_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "RiskTaskAssignment" DROP CONSTRAINT "RiskTaskAssignment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "RiskTreatmentStrategy" DROP CONSTRAINT "RiskTreatmentStrategy_riskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAttachment" DROP CONSTRAINT "TaskAttachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAttachment" DROP CONSTRAINT "TaskAttachment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "TaskAttachment" DROP CONSTRAINT "TaskAttachment_riskMitigationTaskId_fkey";

-- DropForeignKey
ALTER TABLE "VendorAttachment" DROP CONSTRAINT "VendorAttachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorAttachment" DROP CONSTRAINT "VendorAttachment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorAttachment" DROP CONSTRAINT "VendorAttachment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorContact" DROP CONSTRAINT "VendorContact_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTask" DROP CONSTRAINT "VendorTask_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTask" DROP CONSTRAINT "VendorTask_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTask" DROP CONSTRAINT "VendorTask_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAssignment" DROP CONSTRAINT "VendorTaskAssignment_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_taskId_fkey";

-- DropForeignKey
ALTER TABLE "VendorTaskAttachment" DROP CONSTRAINT "VendorTaskAttachment_vendorId_fkey";

-- DropIndex
DROP INDEX "IntegrationResult_assignedUserId_idx";

-- DropIndex
DROP INDEX "IntegrationResult_organizationId_idx";

-- DropIndex
DROP INDEX "VendorContact_organizationId_idx";

-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "lastRunAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "department" "Departments" NOT NULL DEFAULT 'none',
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Risk" ADD COLUMN     "treatmentStrategy" "RiskTreatmentType" NOT NULL DEFAULT 'accept',
ADD COLUMN     "treatmentStrategyDescription" TEXT;

-- AlterTable
ALTER TABLE "VendorContact" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "EmployeeTrainingVideos";

-- DropTable
DROP TABLE "IntegrationLastRun";

-- DropTable
DROP TABLE "PortalSession";

-- DropTable
DROP TABLE "PortalVerification";

-- DropTable
DROP TABLE "RiskAttachment";

-- DropTable
DROP TABLE "RiskComment";

-- DropTable
DROP TABLE "RiskMitigationTask";

-- DropTable
DROP TABLE "RiskTaskAssignment";

-- DropTable
DROP TABLE "RiskTreatmentStrategy";

-- DropTable
DROP TABLE "TaskAttachment";

-- DropTable
DROP TABLE "VendorAttachment";

-- DropTable
DROP TABLE "VendorTask";

-- DropTable
DROP TABLE "VendorTaskAssignment";

-- DropTable
DROP TABLE "VendorTaskAttachment";

-- DropEnum
DROP TYPE "EmployeeTaskStatus";

-- CreateTable
CREATE TABLE "EmployeeTrainingVideoCompletion" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "EmployeeTrainingVideoCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeTrainingVideoCompletion_userId_idx" ON "EmployeeTrainingVideoCompletion"("userId");

-- AddForeignKey
ALTER TABLE "EmployeeTrainingVideoCompletion" ADD CONSTRAINT "EmployeeTrainingVideoCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
