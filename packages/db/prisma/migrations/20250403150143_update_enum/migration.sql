/*
  Warnings:

  - The values [notRelevant] on the enum `EvidenceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EvidenceStatus_new" AS ENUM ('draft', 'published', 'not_relevant');
ALTER TABLE "Evidence" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Evidence" ALTER COLUMN "status" TYPE "EvidenceStatus_new" USING ("status"::text::"EvidenceStatus_new");
ALTER TYPE "EvidenceStatus" RENAME TO "EvidenceStatus_old";
ALTER TYPE "EvidenceStatus_new" RENAME TO "EvidenceStatus";
DROP TYPE "EvidenceStatus_old";
ALTER TABLE "Evidence" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;
