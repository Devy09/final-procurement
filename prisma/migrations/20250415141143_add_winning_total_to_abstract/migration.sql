/*
  Warnings:

  - Added the required column `winningTotal` to the `Abstract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Abstract" ADD COLUMN     "winningTotal" DECIMAL(10,2) NOT NULL;
