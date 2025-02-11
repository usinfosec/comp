-- AlterTable
ALTER TABLE "Control" ADD COLUMN     "frameworkCategoryId" TEXT;

-- CreateIndex
CREATE INDEX "Control_frameworkCategoryId_idx" ON "Control"("frameworkCategoryId");

-- AddForeignKey
ALTER TABLE "Control" ADD CONSTRAINT "Control_frameworkCategoryId_fkey" FOREIGN KEY ("frameworkCategoryId") REFERENCES "FrameworkCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
