/*
  Warnings:

  - Added the required column `game` to the `tips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tips" ADD COLUMN     "game" TEXT NOT NULL;
