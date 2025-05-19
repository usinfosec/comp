-- AddForeignKey
ALTER TABLE "RequirementMap" ADD CONSTRAINT "RequirementMap_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "FrameworkEditorRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
