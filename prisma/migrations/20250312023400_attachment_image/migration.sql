/*
  Warnings:

  - Changed the type of `certificationFile` on the `PurchaseRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `letterFile` on the `PurchaseRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `proposalFile` on the `PurchaseRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PurchaseRequest" DROP COLUMN "certificationFile",
ADD COLUMN     "certificationFile" BYTEA NOT NULL,
DROP COLUMN "letterFile",
ADD COLUMN     "letterFile" BYTEA NOT NULL,
DROP COLUMN "proposalFile",
ADD COLUMN     "proposalFile" BYTEA NOT NULL;
