/*
  Warnings:

  - Changed the type of `gender` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_expiry" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT,
DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;
