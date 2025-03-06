/*
  Warnings:

  - A unique constraint covering the columns `[payment_id]` on the table `purchases` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "purchases_payment_id_key" ON "purchases"("payment_id");
