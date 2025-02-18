-- CreateTable
CREATE TABLE "OrganizationControlRequirement" (
    "id" TEXT NOT NULL,
    "organizationControlId" TEXT NOT NULL,
    "controlRequirementId" TEXT NOT NULL,

    CONSTRAINT "OrganizationControlRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationControlRequirement_organizationControlId_contro_key" ON "OrganizationControlRequirement"("organizationControlId", "controlRequirementId");

-- AddForeignKey
ALTER TABLE "OrganizationControlRequirement" ADD CONSTRAINT "OrganizationControlRequirement_organizationControlId_fkey" FOREIGN KEY ("organizationControlId") REFERENCES "OrganizationControl"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationControlRequirement" ADD CONSTRAINT "OrganizationControlRequirement_controlRequirementId_fkey" FOREIGN KEY ("controlRequirementId") REFERENCES "ControlRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
