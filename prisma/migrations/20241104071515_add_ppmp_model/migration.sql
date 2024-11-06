/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "PPMP" (
    "id" TEXT NOT NULL,
    "ppmp_item" TEXT NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "ppmp_category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PPMP_pkey" PRIMARY KEY ("id")
);
