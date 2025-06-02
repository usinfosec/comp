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

-- AlterTable
ALTER TABLE "Onboarding" DROP COLUMN "callBooked",
DROP COLUMN "companyDetails",
DROP COLUMN "companyBookingDetails",
DROP COLUMN "employees",
DROP COLUMN "integrations",
DROP COLUMN "policies",
DROP COLUMN "risk",
DROP COLUMN "tasks",
DROP COLUMN "team",
DROP COLUMN "vendors";

