/*
  Warnings:

  - You are about to drop the column `product_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `payment_product_snapshots` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `brand_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_eng_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `color_kor_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eng_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kor_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `option_value` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sub_category_name` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail_image` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_option_value_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."payment_product_snapshots" DROP CONSTRAINT "payment_product_snapshots_payment_id_fkey";

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "product_id",
ADD COLUMN     "brand_name" VARCHAR NOT NULL,
ADD COLUMN     "category_name" VARCHAR NOT NULL,
ADD COLUMN     "color_eng_name" VARCHAR NOT NULL,
ADD COLUMN     "color_kor_name" VARCHAR NOT NULL,
ADD COLUMN     "discount_percent" INTEGER DEFAULT 0,
ADD COLUMN     "eng_name" VARCHAR NOT NULL,
ADD COLUMN     "gender" VARCHAR NOT NULL DEFAULT 'all',
ADD COLUMN     "kor_name" VARCHAR NOT NULL,
ADD COLUMN     "model_number" VARCHAR,
ADD COLUMN     "option_name" VARCHAR NOT NULL,
ADD COLUMN     "option_value" VARCHAR NOT NULL,
ADD COLUMN     "release_date" VARCHAR,
ADD COLUMN     "sub_category_name" VARCHAR NOT NULL,
ADD COLUMN     "thumbnail_image" VARCHAR NOT NULL;

-- DropTable
DROP TABLE "public"."payment_product_snapshots";
