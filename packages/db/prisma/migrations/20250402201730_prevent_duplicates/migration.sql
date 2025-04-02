/*
  Warnings:

  - A unique constraint covering the columns `[userId,videoId]` on the table `EmployeeTrainingVideoCompletion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EmployeeTrainingVideoCompletion_userId_videoId_key" ON "EmployeeTrainingVideoCompletion"("userId", "videoId");
