/*
  Warnings:

  - You are about to drop the column `evidenceId` on the `Evidence` table. All the data in the column will be lost.
  - Made the column `description` on table `Evidence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `department` on table `Evidence` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Evidence" DROP COLUMN "evidenceId",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "department" SET NOT NULL;
