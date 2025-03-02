/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `PurchaseOrder` table. All the data in the column will be lost.
  - You are about to drop the column `approvedBy` on the `PurchaseOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PurchaseOrder" DROP COLUMN "approvedAt",
DROP COLUMN "approvedBy",
ADD COLUMN     "accountantDesignation" TEXT,
ADD COLUMN     "accountantName" TEXT,
ADD COLUMN     "accountantRole" TEXT,
ADD COLUMN     "accountantSignatureUrl" TEXT,
ADD COLUMN     "accountantTitle" TEXT,
ADD COLUMN     "approvedAtAccountant" TIMESTAMP(3),
ADD COLUMN     "approvedAtPresident" TIMESTAMP(3),
ADD COLUMN     "approvedByAccountant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "approvedByPresident" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "presidentDesignation" TEXT,
ADD COLUMN     "presidentName" TEXT,
ADD COLUMN     "presidentRole" TEXT,
ADD COLUMN     "presidentSignatureUrl" TEXT,
ADD COLUMN     "presidentTitle" TEXT;
