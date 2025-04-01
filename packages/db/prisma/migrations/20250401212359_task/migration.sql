/*
  Warnings:

  - Changed the type of `relatedType` on the `Task` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('vendor', 'risk');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "relatedType",
ADD COLUMN     "relatedType" "TaskType" NOT NULL;

-- DropEnum
DROP TYPE "RelatedType";
