/*
  Warnings:

  - The values [CASHONDELEVERY] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[razorpay_order_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpay_payment_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('UPI', 'DEBITCARD', 'CREDITCARD', 'CASH_ON_DELEVERY', 'BANKTRANSFER');
ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "PaymentMethod_new" USING ("payment_method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "razorpay_order_id" TEXT,
ADD COLUMN     "razorpay_payment_id" TEXT,
ALTER COLUMN "paid_at" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpay_order_id_key" ON "payments"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_razorpay_payment_id_key" ON "payments"("razorpay_payment_id");
