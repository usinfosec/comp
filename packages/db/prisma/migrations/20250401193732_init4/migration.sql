/*
  Warnings:

  - You are about to drop the column `adoptedAt` on the `FrameworkInstance` table. All the data in the column will be lost.
  - You are about to drop the column `lastAssessed` on the `FrameworkInstance` table. All the data in the column will be lost.
  - You are about to drop the column `nextAssessment` on the `FrameworkInstance` table. All the data in the column will be lost.
  - You are about to drop the column `probability` on the `Risk` table. All the data in the column will be lost.
  - You are about to drop the column `residual_impact` on the `Risk` table. All the data in the column will be lost.
  - You are about to drop the column `residual_probability` on the `Risk` table. All the data in the column will be lost.
  - The `impact` column on the `Risk` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `inherentRisk` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `residualRisk` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `PolicyFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Likelihood" AS ENUM ('very_unlikely', 'unlikely', 'possible', 'likely', 'very_likely');

-- CreateEnum
CREATE TYPE "Impact" AS ENUM ('insignificant', 'minor', 'moderate', 'major', 'severe');

-- DropIndex
DROP INDEX "Vendor_inherentRisk_idx";

-- DropIndex
DROP INDEX "Vendor_residualRisk_idx";

-- DropIndex
DROP INDEX "Vendor_status_idx";

-- AlterTable
ALTER TABLE "FrameworkInstance" DROP COLUMN "adoptedAt",
DROP COLUMN "lastAssessed",
DROP COLUMN "nextAssessment";

-- AlterTable
ALTER TABLE "Risk" DROP COLUMN "probability",
DROP COLUMN "residual_impact",
DROP COLUMN "residual_probability",
ADD COLUMN     "likelihood" "Likelihood" NOT NULL DEFAULT 'very_unlikely',
ADD COLUMN     "residualImpact" "Impact" NOT NULL DEFAULT 'insignificant',
ADD COLUMN     "residualLikelihood" "Likelihood" NOT NULL DEFAULT 'very_unlikely',
DROP COLUMN "impact",
ADD COLUMN     "impact" "Impact" NOT NULL DEFAULT 'insignificant';

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "inherentRisk",
DROP COLUMN "residualRisk",
ADD COLUMN     "inherentImpact" "Impact" NOT NULL DEFAULT 'insignificant',
ADD COLUMN     "inherentProbability" "Likelihood" NOT NULL DEFAULT 'very_unlikely',
ADD COLUMN     "residualImpact" "Impact" NOT NULL DEFAULT 'insignificant',
ADD COLUMN     "residualProbability" "Likelihood" NOT NULL DEFAULT 'very_unlikely';

-- DropTable
DROP TABLE "PolicyFile";

-- DropEnum
DROP TYPE "RiskAttachmentType";

-- DropEnum
DROP TYPE "RiskImpact";

-- DropEnum
DROP TYPE "RiskLevel";

-- DropEnum
DROP TYPE "RiskLikelihood";

-- DropEnum
DROP TYPE "RiskTaskStatus";

-- DropEnum
DROP TYPE "VendorAttachmentType";

-- DropEnum
DROP TYPE "VendorInherentRisk";

-- DropEnum
DROP TYPE "VendorResidualRisk";

-- DropEnum
DROP TYPE "VendorTaskStatus";
