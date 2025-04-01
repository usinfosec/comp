/*
  Warnings:

  - Changed the type of `type` on the `Artifact` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `RiskTreatmentStrategy` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RiskTreatmentType" AS ENUM ('accept', 'avoid', 'mitigate', 'transfer');

-- AlterTable
ALTER TABLE "Artifact" DROP COLUMN "type",
ADD COLUMN     "type" "ArtifactType" NOT NULL;

-- AlterTable
ALTER TABLE "RiskTreatmentStrategy" DROP COLUMN "type",
ADD COLUMN     "type" "RiskTreatmentType" NOT NULL;

-- DropEnum
DROP TYPE "ComplianceStatus";

-- DropEnum
DROP TYPE "FrameworkStatus";

-- DropEnum
DROP TYPE "MembershipRole";

-- DropEnum
DROP TYPE "RequirementType";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "Tier";

-- DropEnum
DROP TYPE "TreatmentType";
