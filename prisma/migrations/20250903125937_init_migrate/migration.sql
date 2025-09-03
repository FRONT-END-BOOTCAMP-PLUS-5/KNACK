-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "marketing" BOOLEAN NOT NULL DEFAULT false,
    "sns" BOOLEAN NOT NULL DEFAULT false,
    "profile_image" VARCHAR,
    "point" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "nickname" VARCHAR NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_auths" (
    "id" SERIAL NOT NULL,
    "provider" VARCHAR NOT NULL,
    "provider_id" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_auths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admins" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "role" VARCHAR DEFAULT '관리자',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ads" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "img_url" VARCHAR NOT NULL,
    "redirect_url" VARCHAR DEFAULT '/',
    "primary" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "activate_time" TIMESTAMPTZ(6),
    "price" INTEGER DEFAULT 0,

    CONSTRAINT "ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."related_products" (
    "product_id" INTEGER NOT NULL,
    "related_product_id" INTEGER NOT NULL,

    CONSTRAINT "related_products_pkey" PRIMARY KEY ("product_id","related_product_id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" SERIAL NOT NULL,
    "description_text" VARCHAR,
    "thumbnail_image" VARCHAR NOT NULL,
    "sub_images" VARCHAR,
    "price" INTEGER DEFAULT 0,
    "discount_percent" INTEGER DEFAULT 0,
    "brand_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "is_recommended" BOOLEAN NOT NULL DEFAULT false,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "gender" VARCHAR DEFAULT 'all',
    "hit" INTEGER DEFAULT 0,
    "eng_name" VARCHAR NOT NULL,
    "kor_name" VARCHAR NOT NULL,
    "sub_category_id" INTEGER NOT NULL,
    "color_eng_name" VARCHAR NOT NULL,
    "color_kor_name" VARCHAR NOT NULL,
    "model_number" TEXT,
    "release_date" VARCHAR,
    "detail_images" VARCHAR,
    "top_images" VARCHAR,
    "keyword_color_id" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_stock_mappings" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "option_type_id" INTEGER NOT NULL,
    "option_value_id" INTEGER NOT NULL,

    CONSTRAINT "product_stock_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."coupons" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "sale_percent" INTEGER DEFAULT 0,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "expriation_at" TIMESTAMPTZ(6),

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."coupon_mappings" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupon_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."answers" (
    "inquiry_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "contents" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("inquiry_id","admin_id")
);

-- CreateTable
CREATE TABLE "public"."inquires" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "contents" VARCHAR NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "user_id" UUID NOT NULL,
    "product_id" INTEGER NOT NULL,
    "contents" VARCHAR NOT NULL,
    "rating" INTEGER DEFAULT 0,
    "review_images" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "order_id" INTEGER NOT NULL,
    "id" SERIAL NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."option_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "option_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."option_values" (
    "id" SERIAL NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR NOT NULL,
    "type_id" INTEGER NOT NULL,

    CONSTRAINT "option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_option_mappings" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "option_type_id" INTEGER NOT NULL,

    CONSTRAINT "product_option_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."brands" (
    "id" SERIAL NOT NULL,
    "logo_image" VARCHAR NOT NULL,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "eng_name" VARCHAR NOT NULL,
    "kor_name" VARCHAR NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "eng_name" VARCHAR NOT NULL,
    "kor_name" VARCHAR NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sub_categories" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_private" BOOLEAN NOT NULL DEFAULT true,
    "eng_name" VARCHAR NOT NULL,
    "kor_name" VARCHAR NOT NULL,
    "image" VARCHAR,

    CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_likes" (
    "user_id" UUID NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_likes_pkey" PRIMARY KEY ("user_id","product_id")
);

-- CreateTable
CREATE TABLE "public"."brand_likes" (
    "user_id" UUID NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brand_likes_pkey" PRIMARY KEY ("user_id","brand_id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" INTEGER NOT NULL,
    "price" INTEGER DEFAULT 0,
    "sale_price" INTEGER DEFAULT 0,
    "tracking" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "delivery_status" INTEGER,
    "count" INTEGER DEFAULT 0,
    "payment_id" INTEGER,
    "option_value_id" INTEGER NOT NULL,
    "coupon_price" INTEGER NOT NULL DEFAULT 0,
    "point" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payments" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "price" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "payment_number" BIGINT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "approved_at" TIMESTAMPTZ(6),
    "method" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "toss_payment_key" VARCHAR,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "zip_code" VARCHAR NOT NULL,
    "detail" VARCHAR,
    "main" VARCHAR NOT NULL,
    "message" VARCHAR,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carts" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER DEFAULT 1,
    "option_value_id" INTEGER NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_auths_provider_id_key" ON "public"."user_auths"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_toss_payment_key_key" ON "public"."payments"("toss_payment_key");

-- AddForeignKey
ALTER TABLE "public"."user_auths" ADD CONSTRAINT "user_auths_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ads" ADD CONSTRAINT "ads_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."related_products" ADD CONSTRAINT "related_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."related_products" ADD CONSTRAINT "related_products_related_product_id_fkey" FOREIGN KEY ("related_product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_keyword_color_id_fkey" FOREIGN KEY ("keyword_color_id") REFERENCES "public"."option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_sub_category_id_fkey" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_stock_mappings" ADD CONSTRAINT "product_stock_mappings_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "public"."option_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_stock_mappings" ADD CONSTRAINT "product_stock_mappings_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "public"."option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_stock_mappings" ADD CONSTRAINT "product_stock_mappings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."coupons" ADD CONSTRAINT "coupons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."coupon_mappings" ADD CONSTRAINT "coupon_mappings_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."coupon_mappings" ADD CONSTRAINT "coupon_mappings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."inquires" ADD CONSTRAINT "inquires_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."option_values" ADD CONSTRAINT "option_values_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "public"."option_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_option_mappings" ADD CONSTRAINT "product_option_mappings_option_type_id_fkey" FOREIGN KEY ("option_type_id") REFERENCES "public"."option_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_option_mappings" ADD CONSTRAINT "product_option_mappings_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sub_categories" ADD CONSTRAINT "sub_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_likes" ADD CONSTRAINT "product_likes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_likes" ADD CONSTRAINT "product_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."brand_likes" ADD CONSTRAINT "brand_likes_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."brand_likes" ADD CONSTRAINT "brand_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "public"."option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_option_value_id_fkey" FOREIGN KEY ("option_value_id") REFERENCES "public"."option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
