/*
  Warnings:

  - You are about to drop the column `dateGame` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `hourGame` on the `tips` table. All the data in the column will be lost.
  - Added the required column `gameDate` to the `tips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tips" DROP COLUMN "dateGame",
DROP COLUMN "hourGame",
ADD COLUMN     "gameDate" TIMESTAMP(3) NOT NULL;
