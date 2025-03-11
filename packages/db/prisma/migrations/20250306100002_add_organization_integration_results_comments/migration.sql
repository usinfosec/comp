-- CreateTable
CREATE TABLE "OrganizationIntegrationResultsComments" (
    "id" TEXT NOT NULL,
    "OrganizationIntegrationResultsId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationIntegrationResultsComments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationIntegrationResultsComments_OrganizationIntegrat_idx" ON "OrganizationIntegrationResultsComments"("OrganizationIntegrationResultsId");

-- CreateIndex
CREATE INDEX "OrganizationIntegrationResultsComments_organizationId_idx" ON "OrganizationIntegrationResultsComments"("organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationIntegrationResultsComments" ADD CONSTRAINT "OrganizationIntegrationResultsComments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationIntegrationResultsComments" ADD CONSTRAINT "OrganizationIntegrationResultsComments_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationIntegrationResultsComments" ADD CONSTRAINT "OrganizationIntegrationResultsComments_OrganizationIntegra_fkey" FOREIGN KEY ("OrganizationIntegrationResultsId") REFERENCES "Organization_integration_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
