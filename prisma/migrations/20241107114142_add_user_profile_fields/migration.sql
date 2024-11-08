/*
  Warnings:

  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "status",
ADD COLUMN     "alobsno" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "saino" TEXT,
ADD COLUMN     "section" TEXT;

-- DropEnum
DROP TYPE "UserStatus";
