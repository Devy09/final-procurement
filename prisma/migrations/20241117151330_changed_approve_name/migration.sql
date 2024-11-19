/*
  Warnings:

  - You are about to drop the column `approvedAtRequisitioner` on the `PurchaseRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requisitionerApproved` on the `PurchaseRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseRequest" DROP COLUMN "approvedAtRequisitioner",
DROP COLUMN "requisitionerApproved",
ADD COLUMN     "approvedAtProcurementOfficer" TIMESTAMP(3),
ADD COLUMN     "approvedByProcurementOfficer" BOOLEAN NOT NULL DEFAULT false;
