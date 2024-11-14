/*
  Warnings:

  - You are about to alter the column `overallTotal` on the `PurchaseRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "PurchaseRequest" ALTER COLUMN "overallTotal" SET DATA TYPE DECIMAL(10,2);
