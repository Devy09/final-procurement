-- CreateTable
CREATE TABLE "OfficeHeadPPMP" (
    "id" TEXT NOT NULL,
    "ppmp_item" TEXT NOT NULL,
    "unit_cost" DECIMAL(10,2) NOT NULL,
    "ppmp_category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfficeHeadPPMP_pkey" PRIMARY KEY ("id")
);
