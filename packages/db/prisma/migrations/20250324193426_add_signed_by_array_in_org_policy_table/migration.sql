-- AlterTable
ALTER TABLE "OrganizationPolicy" ADD COLUMN     "signedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
