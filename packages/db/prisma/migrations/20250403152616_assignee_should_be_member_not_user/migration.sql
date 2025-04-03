-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_assigneeId_fkey";

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
