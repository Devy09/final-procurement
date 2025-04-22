-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_prno_section_fkey" FOREIGN KEY ("prno", "section") REFERENCES "PurchaseRequest"("prno", "section") ON DELETE RESTRICT ON UPDATE CASCADE;
