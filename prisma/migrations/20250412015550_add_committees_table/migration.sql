-- CreateTable
CREATE TABLE "Abstract" (
    "id" TEXT NOT NULL,
    "prno" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "overallTotal" DECIMAL(10,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "winningBidder" TEXT,
    "suppliers" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abstract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbstractItem" (
    "id" TEXT NOT NULL,
    "abstractId" TEXT NOT NULL,
    "itemNo" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "bids" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbstractItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Committee" (
    "id" TEXT NOT NULL,
    "committee_name" TEXT NOT NULL,
    "committee_title" TEXT NOT NULL,
    "committee_designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Committee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Abstract_prno_key" ON "Abstract"("prno");

-- CreateIndex
CREATE INDEX "Abstract_prno_idx" ON "Abstract"("prno");

-- CreateIndex
CREATE INDEX "AbstractItem_abstractId_idx" ON "AbstractItem"("abstractId");

-- CreateIndex
CREATE INDEX "Committee_committee_name_idx" ON "Committee"("committee_name");

-- CreateIndex
CREATE INDEX "Committee_createdAt_idx" ON "Committee"("createdAt");

-- CreateIndex
CREATE INDEX "PurchaseRequest_prno_idx" ON "PurchaseRequest"("prno");

-- CreateIndex
CREATE INDEX "PurchaseRequest_department_idx" ON "PurchaseRequest"("department");

-- CreateIndex
CREATE INDEX "PurchaseRequest_section_idx" ON "PurchaseRequest"("section");

-- CreateIndex
CREATE INDEX "PurchaseRequest_createdAt_idx" ON "PurchaseRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "Abstract" ADD CONSTRAINT "Abstract_prno_fkey" FOREIGN KEY ("prno") REFERENCES "PurchaseRequest"("prno") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbstractItem" ADD CONSTRAINT "AbstractItem_abstractId_fkey" FOREIGN KEY ("abstractId") REFERENCES "Abstract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
