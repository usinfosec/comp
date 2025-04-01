/*
  Warnings:

  - You are about to drop the column `riskId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `vendorId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `relatedId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relatedType` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RelatedType" AS ENUM ('vendor', 'risk');

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_riskId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "VendorContact" DROP CONSTRAINT "VendorContact_vendorId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "riskId",
DROP COLUMN "vendorId",
ADD COLUMN     "relatedId" TEXT NOT NULL,
ADD COLUMN     "relatedType" "RelatedType" NOT NULL;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
