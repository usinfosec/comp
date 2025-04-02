/*
  Warnings:

  - You are about to drop the column `userId` on the `EmployeeTrainingVideoCompletion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[memberId,videoId]` on the table `EmployeeTrainingVideoCompletion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `EmployeeTrainingVideoCompletion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmployeeTrainingVideoCompletion" DROP CONSTRAINT "EmployeeTrainingVideoCompletion_userId_fkey";

-- DropIndex
DROP INDEX "EmployeeTrainingVideoCompletion_userId_idx";

-- DropIndex
DROP INDEX "EmployeeTrainingVideoCompletion_userId_videoId_key";

-- AlterTable
ALTER TABLE "EmployeeTrainingVideoCompletion" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "EmployeeTrainingVideoCompletion_memberId_idx" ON "EmployeeTrainingVideoCompletion"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeTrainingVideoCompletion_memberId_videoId_key" ON "EmployeeTrainingVideoCompletion"("memberId", "videoId");

-- AddForeignKey
ALTER TABLE "EmployeeTrainingVideoCompletion" ADD CONSTRAINT "EmployeeTrainingVideoCompletion_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
