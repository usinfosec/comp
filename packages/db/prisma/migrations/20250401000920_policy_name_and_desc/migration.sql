/*
  Warnings:

  - Added the required column `name` to the `OrganizationPolicy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationPolicy" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
