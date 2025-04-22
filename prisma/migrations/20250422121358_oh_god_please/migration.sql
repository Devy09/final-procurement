/*
  Warnings:

  - A unique constraint covering the columns `[prno,section]` on the table `Abstract` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prno,section]` on the table `PurchaseOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prno,section]` on the table `PurchaseRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Abstract" DROP CONSTRAINT "Abstract_prno_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_prno_fkey";

-- DropForeignKey
ALTER TABLE "SupplierQuotation" DROP CONSTRAINT "SupplierQuotation_prno_fkey";

-- DropIndex
DROP INDEX "Abstract_prno_key";

-- CreateIndex
CREATE UNIQUE INDEX "Abstract_prno_section_key" ON "Abstract"("prno", "section");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_prno_section_key" ON "PurchaseOrder"("prno", "section");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseRequest_prno_section_key" ON "PurchaseRequest"("prno", "section");

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_prno_section_fkey" FOREIGN KEY ("prno", "section") REFERENCES "PurchaseRequest"("prno", "section") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierQuotation" ADD CONSTRAINT "SupplierQuotation_prno_section_fkey" FOREIGN KEY ("prno", "section") REFERENCES "PurchaseRequest"("prno", "section") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abstract" ADD CONSTRAINT "Abstract_prno_section_fkey" FOREIGN KEY ("prno", "section") REFERENCES "PurchaseRequest"("prno", "section") ON DELETE CASCADE ON UPDATE CASCADE;
