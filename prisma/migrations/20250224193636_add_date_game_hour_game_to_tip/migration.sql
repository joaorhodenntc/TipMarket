/*
  Warnings:

  - Added the required column `dateGame` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hourGame` to the `tips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tips" ADD COLUMN     "dateGame" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hourGame" TIMESTAMP(3) NOT NULL;
