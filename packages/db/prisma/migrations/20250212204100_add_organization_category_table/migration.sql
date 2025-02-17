-- AlterTable
ALTER TABLE "OrganizationControl" ADD COLUMN     "organizationCategoryId" TEXT;

-- CreateTable
CREATE TABLE "OrganizationCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationCategory_organizationId_idx" ON "OrganizationCategory"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationCategory_organizationId_name_key" ON "OrganizationCategory"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "OrganizationControl" ADD CONSTRAINT "OrganizationControl_organizationCategoryId_fkey" FOREIGN KEY ("organizationCategoryId") REFERENCES "OrganizationCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCategory" ADD CONSTRAINT "OrganizationCategory_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
