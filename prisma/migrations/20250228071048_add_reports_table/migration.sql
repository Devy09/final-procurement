-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "totalSpend" DOUBLE PRECISION NOT NULL,
    "purchaseRequestCount" INTEGER NOT NULL,
    "officeQuotationsCount" INTEGER NOT NULL,
    "supplierQuotationsCount" INTEGER NOT NULL,
    "spendingData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
