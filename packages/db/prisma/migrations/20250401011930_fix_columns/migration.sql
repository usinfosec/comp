/*
  Warnings:

  - You are about to drop the column `controlId` on the `Control` table. All the data in the column will be lost.
  - You are about to drop the column `policyId` on the `Policy` table. All the data in the column will be lost.
  - Added the required column `description` to the `Control` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Control` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Control_controlId_idx";

-- DropIndex
DROP INDEX "Policy_organizationId_policyId_key";

-- DropIndex
DROP INDEX "Policy_policyId_idx";

-- AlterTable
ALTER TABLE "Control" DROP COLUMN "controlId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Policy" DROP COLUMN "policyId";
