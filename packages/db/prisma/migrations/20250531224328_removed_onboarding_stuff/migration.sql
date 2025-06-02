/*
  Warnings:

  - You are about to drop the column `callBooked` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `companyBookingDetails` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `companyDetails` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `employees` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `integrations` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `policies` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `risk` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `tasks` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `team` on the `Onboarding` table. All the data in the column will be lost.
  - You are about to drop the column `vendors` on the `Onboarding` table. All the data in the column will be lost.

*/
INSERT INTO "Context" (
    id,
    "organizationId",
    question,
    answer,
    tags,
    "createdAt",
    "updatedAt"
)
SELECT
    concat('ctx_', gen_random_uuid()),
    "organizationId",
    key,
    value::text,
    ARRAY[key],
    NOW(),
    NOW()
FROM (
    SELECT
        "organizationId",
        jsonb_each(companyDetails::jsonb->'data') as kv
    FROM "Onboarding"
    WHERE companyDetails IS NOT NULL
) t,
LATERAL (
    SELECT kv.key, kv.value
) s;

-- AlterTable
ALTER TABLE "Onboarding" DROP COLUMN "callBooked",
DROP COLUMN "companyBookingDetails",
DROP COLUMN "companyDetails",
DROP COLUMN "employees",
DROP COLUMN "integrations",
DROP COLUMN "policies",
DROP COLUMN "risk",
DROP COLUMN "tasks",
DROP COLUMN "team",
DROP COLUMN "vendors";

