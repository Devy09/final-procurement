/*
  Warnings:

  - You are about to drop the column `approvedAtProcurementOfficer` on the `PurchaseRequest` table. All the data in the column will be lost.
  - You are about to drop the column `approvedByProcurementOfficer` on the `PurchaseRequest` table. All the data in the column will be lost.
  - You are about to drop the column `procurementOfficerDesignation` on the `PurchaseRequest` table. All the data in the column will be lost.
  - You are about to drop the column `procurementOfficerName` on the `PurchaseRequest` table. All the data in the column will be lost.
  - You are about to drop the column `procurementOfficerRole` on the `PurchaseRequest` table. All the data in the column will be lost.
  - You are about to drop the column `procurementOfficerSignatureUrl` on the `PurchaseRequest` table. All the data in the column will be lost.
  - You are about to drop the column `procurementOfficerTitle` on the `PurchaseRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseRequest" DROP COLUMN "approvedAtProcurementOfficer",
DROP COLUMN "approvedByProcurementOfficer",
DROP COLUMN "procurementOfficerDesignation",
DROP COLUMN "procurementOfficerName",
DROP COLUMN "procurementOfficerRole",
DROP COLUMN "procurementOfficerSignatureUrl",
DROP COLUMN "procurementOfficerTitle";
