-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "category" "VendorCategory" NOT NULL DEFAULT 'other',
ADD COLUMN     "inherentRisk" "VendorInherentRisk" NOT NULL DEFAULT 'unknown',
ADD COLUMN     "residualRisk" "VendorResidualRisk" NOT NULL DEFAULT 'unknown',
ADD COLUMN     "status" "VendorStatus" NOT NULL DEFAULT 'not_assessed';

-- CreateIndex
CREATE INDEX "Vendor_organizationId_idx" ON "Vendor"("organizationId");

-- CreateIndex
CREATE INDEX "Vendor_category_idx" ON "Vendor"("category");

-- CreateIndex
CREATE INDEX "Vendor_status_idx" ON "Vendor"("status");

-- CreateIndex
CREATE INDEX "Vendor_inherentRisk_idx" ON "Vendor"("inherentRisk");

-- CreateIndex
CREATE INDEX "Vendor_residualRisk_idx" ON "Vendor"("residualRisk");
