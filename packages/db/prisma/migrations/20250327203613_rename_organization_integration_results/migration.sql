/*
  Warnings:

  - You are about to drop the `Organization_integration_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationIntegrationResultsComments" DROP CONSTRAINT "OrganizationIntegrationResultsComments_OrganizationIntegra_fkey";

-- DropForeignKey
ALTER TABLE "Organization_integration_results" DROP CONSTRAINT "Organization_integration_results_assignedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Organization_integration_results" DROP CONSTRAINT "Organization_integration_results_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Organization_integration_results" DROP CONSTRAINT "Organization_integration_results_organizationIntegrationId_fkey";

-- DropTable
DROP TABLE "Organization_integration_results";

-- CreateTable
CREATE TABLE "OrganizationIntegrationResults" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "remediation" TEXT,
    "status" TEXT,
    "severity" TEXT,
    "resultDetails" JSONB,
    "completedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationIntegrationId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assignedUserId" TEXT,

    CONSTRAINT "OrganizationIntegrationResults_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationIntegrationResults_assignedUserId_idx" ON "OrganizationIntegrationResults"("assignedUserId");

-- CreateIndex
CREATE INDEX "OrganizationIntegrationResults_organizationIntegrationId_idx" ON "OrganizationIntegrationResults"("organizationIntegrationId");

-- CreateIndex
CREATE INDEX "OrganizationIntegrationResults_organizationId_idx" ON "OrganizationIntegrationResults"("organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationIntegrationResults" ADD CONSTRAINT "OrganizationIntegrationResults_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationIntegrationResults" ADD CONSTRAINT "OrganizationIntegrationResults_organizationIntegrationId_fkey" FOREIGN KEY ("organizationIntegrationId") REFERENCES "OrganizationIntegrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationIntegrationResults" ADD CONSTRAINT "OrganizationIntegrationResults_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationIntegrationResultsComments" ADD CONSTRAINT "OrganizationIntegrationResultsComments_OrganizationIntegra_fkey" FOREIGN KEY ("OrganizationIntegrationResultsId") REFERENCES "OrganizationIntegrationResults"("id") ON DELETE CASCADE ON UPDATE CASCADE;
