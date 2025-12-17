-- チーム関連のテーブルを作成
CREATE TABLE
 "sbm_delivery_groups" (
  "id" SERIAL NOT NULL,
  "name" TEXT NOT NULL,
  "deliveryDate" TIMESTAMP(3) NOT NULL,
  "userId" INTEGER NOT NULL,
  "userName" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'planning',
  "totalReservations" INTEGER NOT NULL DEFAULT 0,
  "completedReservations" INTEGER NOT NULL DEFAULT 0,
  "estimatedDuration" INTEGER,
  "actualDuration" INTEGER,
  "routeUrl" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sbm_delivery_groups_pkey" PRIMARY KEY ("id")
 );

CREATE TABLE
 "sbm_delivery_route_stops" (
  "id" TEXT NOT NULL,
  "deliveryGroupId" INTEGER NOT NULL,
  "reservationId" INTEGER NOT NULL,
  "customerName" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "lat" DOUBLE PRECISION,
  "lng" DOUBLE PRECISION,
  "estimatedArrival" TIMESTAMP(3),
  "actualArrival" TIMESTAMP(3),
  "deliveryOrder" INTEGER NOT NULL,
  "deliveryCompleted" BOOLEAN NOT NULL DEFAULT false,
  "recoveryCompleted" BOOLEAN NOT NULL DEFAULT false,
  "estimatedDuration" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "sbm_delivery_route_stops_pkey" PRIMARY KEY ("id")
 );

CREATE TABLE
 "sbm_delivery_group_reservations" (
  "id" SERIAL NOT NULL,
  "deliveryGroupId" INTEGER NOT NULL,
  "reservationId" INTEGER NOT NULL,
  "deliveryOrder" INTEGER,
  "isCompleted" BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sbm_delivery_group_reservations_pkey" PRIMARY KEY ("id")
 );

-- ユニーク制約
CREATE UNIQUE INDEX "sbm_delivery_group_reservations_groupId_reservationId_key" ON "sbm_delivery_group_reservations" ("deliveryGroupId", "reservationId");

-- 外部キー制約
ALTER TABLE "sbm_delivery_route_stops" ADD CONSTRAINT "sbm_delivery_route_stops_deliveryGroupId_fkey" FOREIGN KEY ("deliveryGroupId") REFERENCES "sbm_delivery_groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sbm_delivery_group_reservations" ADD CONSTRAINT "sbm_delivery_group_reservations_deliveryGroupId_fkey" FOREIGN KEY ("deliveryGroupId") REFERENCES "sbm_delivery_groups" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "sbm_delivery_group_reservations" ADD CONSTRAINT "sbm_delivery_group_reservations_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "sbm_reservations" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 既存のチームデータを新しい配達グループ形式に移行
INSERT INTO
 "sbm_delivery_groups" (
  "name",
  "deliveryDate",
  "userId",
  "userName",
  "status",
  "createdAt",
  "updatedAt"
 )
SELECT
 dt.name,
 CURRENT_DATE, -- 移行日を配達日として設定
 COALESCE(u.id, 1), -- ユーザーIDが見つからない場合は1を設定
 COALESCE(u.name, dt.driverName), -- ユーザー名が見つからない場合はドライバー名を使用
 CASE
  WHEN dt.isActive THEN 'planning'
  ELSE 'completed'
 END,
 dt.createdAt,
 dt.updatedAt
FROM
 "sbm_delivery_teams" dt
 LEFT JOIN "sbm_users" u ON u.name = dt.driverName;

-- 既存の配達割り当てを新しい形式に移行
INSERT INTO
 "sbm_delivery_group_reservations" (
  "deliveryGroupId",
  "reservationId",
  "deliveryOrder",
  "isCompleted",
  "createdAt"
 )
SELECT
 dg.id,
 da.sbmReservationId,
 ROW_NUMBER() OVER (
  PARTITION BY
   da.sbmDeliveryTeamId
  ORDER BY
   da.deliveryDate
 ),
 CASE
  WHEN da.status = 'completed' THEN true
  ELSE false
 END,
 da.createdAt
FROM
 "sbm_delivery_assignments" da
 JOIN "sbm_delivery_teams" dt ON da.sbmDeliveryTeamId = dt.id
 JOIN "sbm_delivery_groups" dg ON dg.name = dt.name;

-- 古いテーブルを削除（オプション - 必要に応じてコメントアウト）
-- DROP TABLE "sbm_delivery_assignments";
-- DROP TABLE "sbm_delivery_teams";
