/*
  Warnings:

  - You are about to drop the column `fileType` on the `ControlRequirement` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `ControlRequirement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ControlRequirement" DROP COLUMN "fileType",
DROP COLUMN "url";
