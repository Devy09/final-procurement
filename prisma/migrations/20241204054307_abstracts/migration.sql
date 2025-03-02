-- CreateTable
CREATE TABLE "Abstract" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abstract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbstractItem" (
    "id" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "prNo" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "abstractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbstractItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AbstractItem_abstractId_idx" ON "AbstractItem"("abstractId");

-- AddForeignKey
ALTER TABLE "AbstractItem" ADD CONSTRAINT "AbstractItem_abstractId_fkey" FOREIGN KEY ("abstractId") REFERENCES "Abstract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
