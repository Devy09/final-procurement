/*
  Warnings:

  - Added the required column `procurementMode` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "procurementMode" TEXT NOT NULL;
