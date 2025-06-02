-- AlterTable
ALTER TABLE "Context" ALTER COLUMN "id" SET DEFAULT generate_prefixed_cuid('ctx'::text);
