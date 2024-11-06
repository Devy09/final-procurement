/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `alobsNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `saiNo` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `section` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "alobsNo",
DROP COLUMN "department",
DROP COLUMN "role",
DROP COLUMN "saiNo",
DROP COLUMN "section",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
