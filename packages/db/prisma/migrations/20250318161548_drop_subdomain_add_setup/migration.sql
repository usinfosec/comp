/*
  Warnings:

  - You are about to drop the column `subdomain` on the `Organization` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Organization_subdomain_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "subdomain",
ADD COLUMN     "setup" BOOLEAN NOT NULL DEFAULT false;
