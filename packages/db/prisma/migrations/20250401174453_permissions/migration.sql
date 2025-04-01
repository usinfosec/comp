/*
  Warnings:

  - You are about to drop the column `frameworkId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `policiesCreated` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `setup` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `tier` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the `OrganizationMember` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationMember" DROP CONSTRAINT "OrganizationMember_userId_fkey";

-- DropIndex
DROP INDEX "Organization_stripeCustomerId_idx";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "frameworkId",
DROP COLUMN "policiesCreated",
DROP COLUMN "setup",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "tier";

-- DropTable
DROP TABLE "OrganizationMember";

-- CreateTable
CREATE TABLE "OrganizationPermission" (
    "id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'member',
    "invitedEmail" TEXT,
    "inviteCode" TEXT,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3),
    "department" "Departments" NOT NULL DEFAULT 'none',
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationPermission_organizationId_idx" ON "OrganizationPermission"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationPermission_userId_idx" ON "OrganizationPermission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationPermission_userId_organizationId_key" ON "OrganizationPermission"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "OrganizationPermission" ADD CONSTRAINT "OrganizationPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPermission" ADD CONSTRAINT "OrganizationPermission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
