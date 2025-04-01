-- CreateTable
CREATE TABLE "EmployeeTrainingVideos" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "completedBy" TEXT[],
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "EmployeeTrainingVideos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EmployeeTrainingVideos" ADD CONSTRAINT "EmployeeTrainingVideos_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
