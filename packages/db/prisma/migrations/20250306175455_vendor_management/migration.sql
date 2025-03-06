-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorContact" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "VendorContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorComment" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "VendorComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorAttachment" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "VendorAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTask" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "VendorTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTaskAttachment" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "VendorTaskAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTaskComment" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "VendorTaskComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorTaskAssignment" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "VendorTaskAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VendorContact_organizationId_idx" ON "VendorContact"("organizationId");

-- CreateIndex
CREATE INDEX "VendorContact_vendorId_idx" ON "VendorContact"("vendorId");

-- CreateIndex
CREATE INDEX "VendorComment_organizationId_idx" ON "VendorComment"("organizationId");

-- CreateIndex
CREATE INDEX "VendorComment_vendorId_idx" ON "VendorComment"("vendorId");

-- CreateIndex
CREATE INDEX "VendorAttachment_organizationId_idx" ON "VendorAttachment"("organizationId");

-- CreateIndex
CREATE INDEX "VendorAttachment_vendorId_idx" ON "VendorAttachment"("vendorId");

-- CreateIndex
CREATE INDEX "VendorTask_organizationId_idx" ON "VendorTask"("organizationId");

-- CreateIndex
CREATE INDEX "VendorTask_vendorId_idx" ON "VendorTask"("vendorId");

-- CreateIndex
CREATE INDEX "VendorTaskAttachment_organizationId_idx" ON "VendorTaskAttachment"("organizationId");

-- CreateIndex
CREATE INDEX "VendorTaskAttachment_vendorId_idx" ON "VendorTaskAttachment"("vendorId");

-- CreateIndex
CREATE INDEX "VendorTaskComment_organizationId_idx" ON "VendorTaskComment"("organizationId");

-- CreateIndex
CREATE INDEX "VendorTaskComment_vendorId_idx" ON "VendorTaskComment"("vendorId");

-- CreateIndex
CREATE INDEX "VendorTaskAssignment_organizationId_idx" ON "VendorTaskAssignment"("organizationId");

-- CreateIndex
CREATE INDEX "VendorTaskAssignment_vendorId_idx" ON "VendorTaskAssignment"("vendorId");

-- CreateIndex
CREATE INDEX "Organization_id_idx" ON "Organization"("id");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorContact" ADD CONSTRAINT "VendorContact_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorComment" ADD CONSTRAINT "VendorComment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorComment" ADD CONSTRAINT "VendorComment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAttachment" ADD CONSTRAINT "VendorAttachment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorAttachment" ADD CONSTRAINT "VendorAttachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTask" ADD CONSTRAINT "VendorTask_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTask" ADD CONSTRAINT "VendorTask_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAttachment" ADD CONSTRAINT "VendorTaskAttachment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAttachment" ADD CONSTRAINT "VendorTaskAttachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskComment" ADD CONSTRAINT "VendorTaskComment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskComment" ADD CONSTRAINT "VendorTaskComment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAssignment" ADD CONSTRAINT "VendorTaskAssignment_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorTaskAssignment" ADD CONSTRAINT "VendorTaskAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
