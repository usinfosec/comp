/*
  Warnings:

  - The values [archived] on the enum `PolicyStatus` will be removed. If these variants are still used in the database, this will fail.

*/

/*
  This migration moves 'archived' from PolicyStatus enum to a dedicated isArchived field
*/

-- First update any records with 'archived' status to set isArchived=true and change status to 'draft'
ALTER TABLE "OrganizationPolicy" ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "OrganizationPolicy" ADD COLUMN IF NOT EXISTS "archivedAt" TIMESTAMP(3);

-- Set isArchived=true for any policies with 'archived' status
UPDATE "OrganizationPolicy" 
SET "isArchived" = true, 
    "archivedAt" = CURRENT_TIMESTAMP,
    "status" = 'draft'::text::"PolicyStatus"
WHERE "status" = 'archived'::text::"PolicyStatus";

-- Now remove the 'archived' value from the enum
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
    WHERE pg_type.typname = 'PolicyStatus'
    AND pg_enum.enumlabel = 'archived'
  ) THEN
    -- AlterEnum to remove 'archived' value
    CREATE TYPE "PolicyStatus_new" AS ENUM ('draft', 'published', 'needs_review');
    ALTER TABLE "OrganizationPolicy" ALTER COLUMN "status" DROP DEFAULT;
    
    -- This is safe now because we've moved all 'archived' values to 'draft'
    ALTER TABLE "OrganizationPolicy" ALTER COLUMN "status" TYPE "PolicyStatus_new" USING (
      CASE WHEN "status"::text = 'archived' THEN 'draft'::text 
      ELSE "status"::text END
    )::"PolicyStatus_new";
    
    ALTER TYPE "PolicyStatus" RENAME TO "PolicyStatus_old";
    ALTER TYPE "PolicyStatus_new" RENAME TO "PolicyStatus";
    DROP TYPE "PolicyStatus_old";
    ALTER TABLE "OrganizationPolicy" ALTER COLUMN "status" SET DEFAULT 'draft';
  END IF;
END$$;
