/*
  Warnings:

  - You are about to drop the column `controls` on the `Policy` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "controls",
ADD COLUMN     "usedBy" TEXT[];
