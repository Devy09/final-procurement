-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "rejectedReason" TEXT,
ADD COLUMN     "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'pending';
