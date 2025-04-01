/*
  Warnings:

  - You are about to drop the column `frameworkInstanceId` on the `Control` table. All the data in the column will be lost.
  - Changed the type of `frameworkId` on the `FrameworkInstance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FrameworkId" AS ENUM ('soc2');

-- DropForeignKey
ALTER TABLE "Control" DROP CONSTRAINT "Control_frameworkInstanceId_fkey";

-- DropIndex
DROP INDEX "Control_frameworkInstanceId_idx";

-- AlterTable
ALTER TABLE "Control" DROP COLUMN "frameworkInstanceId";

-- AlterTable
ALTER TABLE "FrameworkInstance" DROP COLUMN "frameworkId",
ADD COLUMN     "frameworkId" "FrameworkId" NOT NULL;

-- CreateTable
CREATE TABLE "_ControlToFrameworkInstance" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ControlToFrameworkInstance_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ControlToFrameworkInstance_B_index" ON "_ControlToFrameworkInstance"("B");

-- CreateIndex
CREATE UNIQUE INDEX "FrameworkInstance_organizationId_frameworkId_key" ON "FrameworkInstance"("organizationId", "frameworkId");

-- AddForeignKey
ALTER TABLE "_ControlToFrameworkInstance" ADD CONSTRAINT "_ControlToFrameworkInstance_A_fkey" FOREIGN KEY ("A") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ControlToFrameworkInstance" ADD CONSTRAINT "_ControlToFrameworkInstance_B_fkey" FOREIGN KEY ("B") REFERENCES "FrameworkInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
