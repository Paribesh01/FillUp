/*
  Warnings:

  - You are about to drop the column `spreadsheetId` on the `GoogleIntegration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "spreadsheetId" TEXT;

-- AlterTable
ALTER TABLE "public"."GoogleIntegration" DROP COLUMN "spreadsheetId";
