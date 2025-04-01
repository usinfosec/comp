/*
  Warnings:

  - You are about to drop the column `content` on the `Artifact` table. All the data in the column will be lost.
  - You are about to drop the column `controlId` on the `Artifact` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Artifact` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `Artifact` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Artifact` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Artifact" DROP CONSTRAINT "Artifact_controlId_fkey";

-- DropIndex
DROP INDEX "Artifact_controlId_key";

-- AlterTable
ALTER TABLE "Artifact" DROP COLUMN "content",
DROP COLUMN "controlId",
DROP COLUMN "description",
DROP COLUMN "fileUrl",
DROP COLUMN "published";

-- CreateTable
CREATE TABLE "_ArtifactToControl" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ArtifactToControl_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ArtifactToControl_B_index" ON "_ArtifactToControl"("B");

-- AddForeignKey
ALTER TABLE "_ArtifactToControl" ADD CONSTRAINT "_ArtifactToControl_A_fkey" FOREIGN KEY ("A") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtifactToControl" ADD CONSTRAINT "_ArtifactToControl_B_fkey" FOREIGN KEY ("B") REFERENCES "Control"("id") ON DELETE CASCADE ON UPDATE CASCADE;
