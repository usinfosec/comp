-- CreateTable
CREATE TABLE "PortalTrainingVideos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortalTrainingVideos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationTrainingVideos" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "trainingVideoId" TEXT NOT NULL,
    "completedBy" TEXT[],

    CONSTRAINT "OrganizationTrainingVideos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationTrainingVideos" ADD CONSTRAINT "OrganizationTrainingVideos_trainingVideoId_fkey" FOREIGN KEY ("trainingVideoId") REFERENCES "PortalTrainingVideos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationTrainingVideos" ADD CONSTRAINT "OrganizationTrainingVideos_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
