/*
  Warnings:

  - Changed the type of `usedBy` on the `Policy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "usedBy",
ADD COLUMN     "usedBy" JSONB NOT NULL;
