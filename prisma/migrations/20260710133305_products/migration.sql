-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'AVAILABLE');

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) DEFAULT 0,
    "stock" INTEGER NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
