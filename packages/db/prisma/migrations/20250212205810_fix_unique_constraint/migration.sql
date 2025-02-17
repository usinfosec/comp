/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `OrganizationCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OrganizationCategory_organizationId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationCategory_id_key" ON "OrganizationCategory"("id");
