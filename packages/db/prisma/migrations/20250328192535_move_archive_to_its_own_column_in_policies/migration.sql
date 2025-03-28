/*
  Warnings:

  - The values [archived] on the enum `PolicyStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PolicyStatus_new" AS ENUM ('draft', 'published', 'needs_review');
ALTER TABLE "OrganizationPolicy" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "OrganizationPolicy" ALTER COLUMN "status" TYPE "PolicyStatus_new" USING ("status"::text::"PolicyStatus_new");
ALTER TYPE "PolicyStatus" RENAME TO "PolicyStatus_old";
ALTER TYPE "PolicyStatus_new" RENAME TO "PolicyStatus";
DROP TYPE "PolicyStatus_old";
ALTER TABLE "OrganizationPolicy" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- AlterTable
ALTER TABLE "OrganizationPolicy" ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false;
