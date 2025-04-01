-- CreateIndex
CREATE INDEX "Task_relatedId_idx" ON "Task"("relatedId");

-- CreateIndex
CREATE INDEX "Task_relatedId_organizationId_idx" ON "Task"("relatedId", "organizationId");
