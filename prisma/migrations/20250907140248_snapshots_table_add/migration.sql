/*
  Warnings:

  - You are about to drop the column `address_id` on the `payments` table. All the data in the column will be lost.
  - Added the required column `main_address` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."payments" DROP CONSTRAINT "payments_address_id_fkey";

-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "address_id",
ADD COLUMN     "delivery_message" VARCHAR,
ADD COLUMN     "detail_address" VARCHAR,
ADD COLUMN     "main_address" VARCHAR NOT NULL,
ADD COLUMN     "name" VARCHAR NOT NULL,
ADD COLUMN     "username" VARCHAR NOT NULL,
ADD COLUMN     "zip_code" VARCHAR NOT NULL;

-- CreateTable
CREATE TABLE "public"."payment_product_snapshots" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "discount_percent" INTEGER DEFAULT 0,
    "brand_name" VARCHAR NOT NULL,
    "category_name" VARCHAR NOT NULL,
    "sub_category_name" VARCHAR NOT NULL,
    "gender" VARCHAR NOT NULL DEFAULT 'all',
    "eng_name" VARCHAR NOT NULL,
    "kor_name" VARCHAR NOT NULL,
    "color_eng_name" VARCHAR NOT NULL,
    "color_kor_name" VARCHAR NOT NULL,
    "model_number" VARCHAR,
    "release_date" VARCHAR,
    "thumbnail_image" VARCHAR NOT NULL,
    "payment_id" INTEGER NOT NULL,

    CONSTRAINT "payment_product_snapshots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."payment_product_snapshots" ADD CONSTRAINT "payment_product_snapshots_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
