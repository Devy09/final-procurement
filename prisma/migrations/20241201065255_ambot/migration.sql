-- AlterTable
ALTER TABLE "PurchaseRequest" ADD COLUMN     "accountantSignatureUrl" TEXT,
ADD COLUMN     "accountantTitle" TEXT,
ADD COLUMN     "presidentSignatureUrl" TEXT,
ADD COLUMN     "presidentTitle" TEXT,
ADD COLUMN     "procurementOfficerSignatureUrl" TEXT,
ADD COLUMN     "procurementOfficerTitle" TEXT;
