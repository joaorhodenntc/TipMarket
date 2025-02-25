/*
  Warnings:

  - You are about to drop the column `description` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `odd` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `tips` table. All the data in the column will be lost.
  - Added the required column `imageTip` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageTipBlur` to the `tips` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tips" DROP COLUMN "description",
DROP COLUMN "odd",
DROP COLUMN "title",
ADD COLUMN     "imageTip" TEXT NOT NULL,
ADD COLUMN     "imageTipBlur" TEXT NOT NULL;
