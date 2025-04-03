/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Policy` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Policy" DROP CONSTRAINT "Policy_ownerId_fkey";

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "ownerId",
ADD COLUMN     "assigneeId" TEXT;

-- AddForeignKey
ALTER TABLE "Policy" ADD CONSTRAINT "Policy_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
