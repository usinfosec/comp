/*
  Warnings:

  - You are about to drop the column `template` on the `Policy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subdomain]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "subdomain" TEXT NOT NULL DEFAULT 'example.com';

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "template",
ADD COLUMN     "content" JSONB[];

-- AlterTable
ALTER TABLE "RiskMitigationTask" ADD COLUMN     "notifiedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_subdomain_key" ON "Organization"("subdomain");
