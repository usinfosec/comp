-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT (generate_prefixed_cuid('user'));
