-- CreateTable
CREATE TABLE "IntegrationLastRun" (
    "id" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntegrationLastRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntegrationLastRun_integrationId_idx" ON "IntegrationLastRun"("integrationId");

-- CreateIndex
CREATE INDEX "IntegrationLastRun_organizationId_idx" ON "IntegrationLastRun"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationLastRun_integrationId_organizationId_key" ON "IntegrationLastRun"("integrationId", "organizationId");

-- AddForeignKey
ALTER TABLE "IntegrationLastRun" ADD CONSTRAINT "IntegrationLastRun_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "OrganizationIntegrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationLastRun" ADD CONSTRAINT "IntegrationLastRun_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
