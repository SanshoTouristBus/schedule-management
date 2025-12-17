-- 材料マスターテーブルの作成
CREATE TABLE
 "sbm_ingredients" (
  "id" SERIAL NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "unit" VARCHAR(50) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sbm_ingredients_pkey" PRIMARY KEY ("id")
 );

-- 商品と材料の関連テーブルの作成
CREATE TABLE
 "sbm_product_ingredients" (
  "id" SERIAL NOT NULL,
  "sbmProductId" INTEGER NOT NULL,
  "sbmIngredientId" INTEGER NOT NULL,
  "quantity" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sbm_product_ingredients_pkey" PRIMARY KEY ("id")
 );

-- ユニーク制約の追加
CREATE UNIQUE INDEX "sbm_product_ingredients_sbmProductId_sbmIngredientId_key" ON "sbm_product_ingredients" ("sbmProductId", "sbmIngredientId");

-- 外部キー制約の追加
ALTER TABLE "sbm_product_ingredients" ADD CONSTRAINT "sbm_product_ingredients_sbmProductId_fkey" FOREIGN KEY ("sbmProductId") REFERENCES "SbmProduct" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sbm_product_ingredients" ADD CONSTRAINT "sbm_product_ingredients_sbmIngredientId_fkey" FOREIGN KEY ("sbmIngredientId") REFERENCES "sbm_ingredients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

