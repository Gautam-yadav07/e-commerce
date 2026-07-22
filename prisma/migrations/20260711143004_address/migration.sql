-- AlterTable
ALTER TABLE "Addresses" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "seller_profiles" ALTER COLUMN "updated_at" DROP DEFAULT;
