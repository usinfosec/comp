/*
  Warnings:

  - You are about to drop the column `access_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token_expires_in` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `FrameworkCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationControl` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationControlRequirement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationEvidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationFramework` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationIntegrationResults` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationIntegrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationPolicy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntegrationLastRun" DROP CONSTRAINT "IntegrationLastRun_integrationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationCategory" DROP CONSTRAINT "OrganizationCategory_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationControl" DROP CONSTRAINT "OrganizationControl_organizationCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationControl" DROP CONSTRAINT "OrganizationControl_organizationFrameworkId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationControl" DROP CONSTRAINT "OrganizationControl_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationControlRequirement" DROP CONSTRAINT "OrganizationControlRequirement_organizationControlId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationControlRequirement" DROP CONSTRAINT "OrganizationControlRequirement_organizationEvidenceId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationControlRequirement" DROP CONSTRAINT "OrganizationControlRequirement_organizationPolicyId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationEvidence" DROP CONSTRAINT "OrganizationEvidence_assigneeId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationEvidence" DROP CONSTRAINT "OrganizationEvidence_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationFramework" DROP CONSTRAINT "OrganizationFramework_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationIntegrationResults" DROP CONSTRAINT "OrganizationIntegrationResults_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationIntegrationResults" DROP CONSTRAINT "OrganizationIntegrationResults_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationIntegrationResults" DROP CONSTRAINT "OrganizationIntegrationResults_organizationIntegrationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationIntegrations" DROP CONSTRAINT "OrganizationIntegrations_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationPolicy" DROP CONSTRAINT "OrganizationPolicy_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationPolicy" DROP CONSTRAINT "OrganizationPolicy_ownerId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "access_token",
DROP COLUMN "expires_at",
DROP COLUMN "id_token",
DROP COLUMN "refresh_token",
DROP COLUMN "refresh_token_expires_in",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "expiresAt" INTEGER,
ADD COLUMN     "idToken" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "refreshTokenExpiresIn" INTEGER,
ADD COLUMN     "sessionState" TEXT,
ADD COLUMN     "tokenType" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "full_name",
ADD COLUMN     "fullName" TEXT;

-- DropTable
DROP TABLE "FrameworkCategory";

-- DropTable
DROP TABLE "OrganizationCategory";

-- DropTable
DROP TABLE "OrganizationControl";

-- DropTable
DROP TABLE "OrganizationControlRequirement";

-- DropTable
DROP TABLE "OrganizationEvidence";

-- DropTable
DROP TABLE "OrganizationFramework";

-- DropTable
DROP TABLE "OrganizationIntegrationResults";

-- DropTable
DROP TABLE "OrganizationIntegrations";

-- DropTable
DROP TABLE "OrganizationPolicy";

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "fileUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "type" "RequirementType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "controlId" TEXT NOT NULL,
    "policyId" TEXT,
    "evidenceId" TEXT,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationResult" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "remediation" TEXT,
    "status" TEXT,
    "severity" TEXT,
    "resultDetails" JSONB,
    "completedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "integrationId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assignedUserId" TEXT,

    CONSTRAINT "IntegrationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FrameworkInstance" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "status" "FrameworkStatus" NOT NULL DEFAULT 'not_started',
    "adoptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAssessed" TIMESTAMP(3),
    "nextAssessment" TIMESTAMP(3),

    CONSTRAINT "FrameworkInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Control" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'not_started',
    "lastReviewDate" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "frameworkInstanceId" TEXT,

    CONSTRAINT "Control_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT NOT NULL,
    "additionalUrls" TEXT[],
    "evidenceId" TEXT NOT NULL,
    "fileUrls" TEXT[],
    "frequency" "Frequency",
    "lastPublishedAt" TIMESTAMP(3),
    "assigneeId" TEXT,
    "department" "Departments" DEFAULT 'none',
    "isNotRelevant" BOOLEAN NOT NULL DEFAULT false,
    "frameworkId" TEXT NOT NULL,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" TEXT NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "policyId" TEXT NOT NULL,
    "content" JSONB[],
    "frequency" "Frequency",
    "lastPublishedAt" TIMESTAMP(3),
    "isRequiredToSign" BOOLEAN NOT NULL DEFAULT false,
    "signedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ownerId" TEXT,
    "department" "Departments",
    "reviewDate" TIMESTAMP(3),

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "settings" JSONB NOT NULL,
    "userSettings" JSONB NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Artifact_controlId_key" ON "Artifact"("controlId");

-- CreateIndex
CREATE INDEX "IntegrationResult_assignedUserId_idx" ON "IntegrationResult"("assignedUserId");

-- CreateIndex
CREATE INDEX "IntegrationResult_integrationId_idx" ON "IntegrationResult"("integrationId");

-- CreateIndex
CREATE INDEX "IntegrationResult_organizationId_idx" ON "IntegrationResult"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "FrameworkInstance_organizationId_frameworkId_key" ON "FrameworkInstance"("organizationId", "frameworkId");

-- CreateIndex
CREATE INDEX "Control_organizationId_idx" ON "Control"("organizationId");

-- CreateIndex
CREATE INDEX "Control_frameworkInstanceId_idx" ON "Control"("frameworkInstanceId");

-- CreateIndex
CREATE INDEX "Control_controlId_idx" ON "Control"("controlId");

-- CreateIndex
CREATE UNIQUE INDEX "Evidence_id_key" ON "Evidence"("id");

-- CreateIndex
CREATE INDEX "Evidence_organizationId_idx" ON "Evidence"("organizationId");

-- CreateIndex
CREATE INDEX "Evidence_assigneeId_idx" ON "Evidence"("assigneeId");

-- CreateIndex
CREATE INDEX "Policy_organizationId_idx" ON "Policy"("organizationId");

-- CreateIndex
CREATE INDEX "Policy_policyId_idx" ON "Policy"("policyId");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_organizationId_policyId_key" ON "Policy"("organizationId", "policyId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_name_key" ON "Integration"("name");

-- CreateIndex
CREATE INDEX "Integration_organizationId_idx" ON "Integration"("organizationId");

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationResult" ADD CONSTRAINT "IntegrationResult_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationResult" ADD CONSTRAINT "IntegrationResult_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationResult" ADD CONSTRAINT "IntegrationResult_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrameworkInstance" ADD CONSTRAINT "FrameworkInstance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Control" ADD CONSTRAINT "Control_frameworkInstanceId_fkey" FOREIGN KEY ("frameworkInstanceId") REFERENCES "FrameworkInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Control" ADD CONSTRAINT "Control_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationLastRun" ADD CONSTRAINT "IntegrationLastRun_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
