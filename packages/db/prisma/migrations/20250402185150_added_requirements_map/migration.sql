-- CreateEnum
CREATE TYPE "RequirementId" AS ENUM ('soc2_CC1', 'soc2_CC2', 'soc2_CC3', 'soc2_CC4', 'soc2_CC5', 'soc2_CC6', 'soc2_CC7', 'soc2_CC8', 'soc2_CC9', 'soc2_A1', 'soc2_C1', 'soc2_PI1', 'soc2_P1');

-- CreateTable
CREATE TABLE "RequirementMap" (
    "id" TEXT NOT NULL,
    "requirementId" "RequirementId" NOT NULL,
    "controlId" TEXT NOT NULL,
    "frameworkInstanceId" TEXT NOT NULL,

    CONSTRAINT "RequirementMap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequirementMap_requirementId_frameworkInstanceId_idx" ON "RequirementMap"("requirementId", "frameworkInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "RequirementMap_controlId_frameworkInstanceId_requirementId_key" ON "RequirementMap"("controlId", "frameworkInstanceId", "requirementId");

-- AddForeignKey
ALTER TABLE "RequirementMap" ADD CONSTRAINT "RequirementMap_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementMap" ADD CONSTRAINT "RequirementMap_frameworkInstanceId_fkey" FOREIGN KEY ("frameworkInstanceId") REFERENCES "FrameworkInstance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
