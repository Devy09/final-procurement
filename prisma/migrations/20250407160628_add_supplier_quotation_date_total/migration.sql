/*
  Warnings:

  - Added the required column `overallTotal` to the `SupplierQuotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestDate` to the `SupplierQuotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupplierQuotation" ADD COLUMN     "overallTotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "requestDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "SupplierQuotation_prno_idx" ON "SupplierQuotation"("prno");
