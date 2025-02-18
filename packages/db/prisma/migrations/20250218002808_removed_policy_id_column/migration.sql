/*
  Warnings:

  - You are about to drop the column `policyId` on the `OrganizationControlRequirement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationControlRequirement" DROP CONSTRAINT "OrganizationControlRequirement_policyId_fkey";

-- AlterTable
ALTER TABLE "OrganizationControlRequirement" DROP COLUMN "policyId";
