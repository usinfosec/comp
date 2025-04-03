/*
  Warnings:

  - You are about to drop the column `isNotRelevant` on the `Evidence` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Evidence` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('draft', 'published', 'notRelevant');

-- AlterTable
ALTER TABLE "Evidence" DROP COLUMN "isNotRelevant",
DROP COLUMN "published",
ADD COLUMN     "status" "EvidenceStatus" DEFAULT 'draft';
