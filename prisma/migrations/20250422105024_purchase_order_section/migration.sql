/*
  Warnings:

  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `section` to the `PurchaseOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "section" TEXT NOT NULL;

-- DropTable
DROP TABLE "Report";

-- CreateIndex
CREATE INDEX "PurchaseOrder_section_idx" ON "PurchaseOrder"("section");
