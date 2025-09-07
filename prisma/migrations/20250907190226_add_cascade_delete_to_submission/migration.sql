-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_documentId_fkey";

-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "description" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
