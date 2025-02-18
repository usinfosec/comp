/*
  Warnings:

  - Added the required column `type` to the `OrganizationControlRequirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrganizationControlRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationControlRequirement" ADD COLUMN     "content" JSONB,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "policyId" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "RequirementType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "OrganizationControlRequirement" ADD CONSTRAINT "OrganizationControlRequirement_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
