/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Control` table. All the data in the column will be lost.
  - You are about to drop the column `requiredArtifactTypes` on the `Control` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Control" DROP CONSTRAINT "Control_categoryId_fkey";

-- DropIndex
DROP INDEX "Control_categoryId_idx";

-- AlterTable
ALTER TABLE "Control" DROP COLUMN "categoryId",
DROP COLUMN "requiredArtifactTypes";
