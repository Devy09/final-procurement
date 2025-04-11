/*
  Warnings:

  - Added the required column `department` to the `SupplierQuotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `SupplierQuotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupplierQuotation" ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "section" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SupplierQuotation" ADD CONSTRAINT "SupplierQuotation_prno_fkey" FOREIGN KEY ("prno") REFERENCES "PurchaseRequest"("prno") ON DELETE RESTRICT ON UPDATE CASCADE;
