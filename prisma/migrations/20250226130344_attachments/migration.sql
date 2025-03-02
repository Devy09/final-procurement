/*
  Warnings:

  - Added the required column `certificationFile` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `letterFile` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proposalFile` to the `PurchaseRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "certificationFile" TEXT NOT NULL,
ADD COLUMN     "letterFile" TEXT NOT NULL,
ADD COLUMN     "proposalFile" TEXT NOT NULL;
