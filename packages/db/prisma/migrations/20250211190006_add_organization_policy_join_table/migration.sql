-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "OrganizationPolicy" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "policyId" TEXT NOT NULL,

    CONSTRAINT "OrganizationPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationPolicy_organizationId_idx" ON "OrganizationPolicy"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationPolicy_policyId_idx" ON "OrganizationPolicy"("policyId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationPolicy_organizationId_policyId_key" ON "OrganizationPolicy"("organizationId", "policyId");

-- AddForeignKey
ALTER TABLE "OrganizationPolicy" ADD CONSTRAINT "OrganizationPolicy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPolicy" ADD CONSTRAINT "OrganizationPolicy_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
