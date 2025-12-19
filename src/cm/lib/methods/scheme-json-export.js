
export const prismaSchemaString = `
// 観光バス予約管理システム (SanshoTourist)

// 車両マスタ
model StVehicle {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 plateNumber String  @unique // プレートNo. (例: 湘南230あ3409)
 type        String? // 車種 (例: 大型, 中型, マイクロ)
 seats       Int     @default(0) // 正席数
 subSeats    Int     @default(0) // 補助席数
 phone       String? // 車両携帯番号

 active Boolean @default(true) // 有効フラグ

 StSchedule StSchedule[]
}

// 会社マスタ
model StCustomer {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name String // 会社名

 active Boolean @default(true) // 有効フラグ

 StContact  StContact[]
 StSchedule StSchedule[]
}

// 担当者マスタ
model StContact {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 name  String // 担当者名
 phone String? // 電話番号

 active Boolean @default(true) // 有効フラグ

 StCustomer   StCustomer @relation(fields: [stCustomerId], references: [id], onDelete: Cascade)
 stCustomerId Int

 StSchedule StSchedule[]
}

// 祝日マスタ
model StHoliday {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date DateTime // 日付 (UTC 00:00:00)
 name String // 祝日名

 @@unique([date], name: "unique_stHoliday_date")
}

// スケジュール
model StSchedule {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date DateTime // 運行日 (UTC 00:00:00)

 // 顧客情報 (マスタ参照)
 StCustomer   StCustomer? @relation(fields: [stCustomerId], references: [id], onDelete: SetNull)
 stCustomerId Int?

 StContact   StContact? @relation(fields: [stContactId], references: [id], onDelete: SetNull)
 stContactId Int?

 // 車両情報 (マスタ参照)
 StVehicle   StVehicle? @relation(fields: [stVehicleId], references: [id], onDelete: SetNull)
 stVehicleId Int?

 // 手入力項目
 organizationName    String? // 団体名
 organizationContact String? // 担当者名 (手入力)
 destination         String? // 行き先
 hasGuide            Boolean @default(false) // ガイドの有無
 departureTime       String? // 出庫時間 (HH:mm)
 returnTime          String? // 帰庫時間 (HH:mm)
 remarks             String? // 備考

 // 添付ファイル
 pdfFileName String? // 運行指示書ファイル名
 pdfFileUrl  String? // 運行指示書ファイルURL

 // 一括登録用
 batchId String? // 一括登録ID (同じバッチで作成されたものを識別)

 // 論理削除
 deleted   Boolean   @default(false)
 deletedAt DateTime?

 // 乗務員 (中間テーブル)
 StScheduleDriver StScheduleDriver[]
}

// スケジュール-乗務員 中間テーブル
model StScheduleDriver {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 StSchedule   StSchedule @relation(fields: [stScheduleId], references: [id], onDelete: Cascade)
 stScheduleId Int

 userId Int // User.id への参照 (外部キー制約なし、アプリレベルで管理)

 @@unique([stScheduleId, userId], name: "unique_stScheduleDriver")
}

// 点呼者
model StRollCaller {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date   DateTime // 日付 (UTC 00:00:00)
 userId Int // User.id への参照 (外部キー制約なし)

 @@unique([date], name: "unique_stRollCaller_date")
}

// 公開範囲設定
model StPublishSetting {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 publishEndDate DateTime? // この日付より先のスケジュールは管理者以外非表示
}

// ユーザーごとの休日設定
model StUserHoliday {
 id        Int       @id @default(autoincrement())
 createdAt DateTime  @default(now())
 updatedAt DateTime? @default(now()) @updatedAt()
 sortOrder Float     @default(0)

 date   DateTime // 日付 (UTC 00:00:00)
 userId Int // User.id への参照 (外部キー制約なし、アプリレベルで管理)

 @@unique([userId, date], name: "unique_stUserHoliday_userId_date")
}

// 乗務員はUserテーブルを利用 (apps配列に'sanshoTourist'を持つユーザーが乗務員)
// StDriverテーブルは使用しない

datasource db {
  provider = "postgresql"
  url = "postgres://mutsuo:timeSpacer817@localhost:5432/sanshoTourist"
}

generator client {
  provider = "prisma-client"
  output   = "./generated/prisma"
}

model Department {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  code  String? @unique
  name  String
  color String?

  User User[]
}

model User {
  id            Int       @id @default(autoincrement())
  code          String?   @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime? @default(now()) @updatedAt()
  sortOrder     Float     @default(0)
  active        Boolean   @default(true)
  hiredAt       DateTime?
  retiredAt     DateTime?
  transferredAt DateTime?
  yukyuCategory String?   @default("A")

  name     String
  kana     String?
  email    String? @unique
  password String? @default("999999")

  type String?

  role String @default("user")

  tempResetCode        String?
  tempResetCodeExpired DateTime?
  storeId              Int?
  schoolId             Int?
  rentaStoreId         Int?
  type2                String?
  shopId               Int?
  membershipName       String?
  damageNameMasterId   Int?
  color                String?
  app                  String?
  apps                 String[]

  // tbm

  employeeCode String? @unique
  phone        String?

  avatar String? // 子ども用アバター画像URL

  bcc String?

  UserRole UserRole[]

  // TbmOperation                     TbmOperation[]
  // TbmOperationGroup                TbmOperationGroup[]

  department   Department? @relation(fields: [departmentId], references: [id])
  departmentId Int?
}

model ReleaseNotes {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  rootPath         String
  title            String?
  msg              String
  imgUrl           String?
  confirmedUserIds Int[]
}

model Tokens {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  name      String    @unique
  token     String
  expiresAt DateTime?
}

model GoogleAccessToken {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  email         String    @unique
  access_token  String?
  refresh_token String?
  scope         String?
  token_type    String?
  id_token      String?
  expiry_date   DateTime?
  tokenJSON     String?
}

model RoleMaster {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @updatedAt
  sortOrder Float     @default(0)

  name        String     @unique
  description String?
  color       String?
  apps        String[]
  UserRole    UserRole[]
}

model UserRole {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @updatedAt
  sortOrder Float     @default(0)

  User         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       Int
  RoleMaster   RoleMaster @relation(fields: [roleMasterId], references: [id], onDelete: Cascade)
  roleMasterId Int

  @@unique([userId, roleMasterId], name: "userId_roleMasterId_unique")
}

model ChainMethodLock {
  id        Int       @id @default(autoincrement())
  isLocked  Boolean   @default(false)
  expiresAt DateTime?
  updatedAt DateTime  @updatedAt
}

model Calendar {
  id        Int       @id @default(autoincrement())
  createdAt DateTime  @default(now())
  updatedAt DateTime? @default(now()) @updatedAt()
  sortOrder Float     @default(0)

  date DateTime @unique

  holidayType String @default("出勤")
}


`;

export const prismaDMMF = {
  "enums": [],
  "models": [
    {
      "name": "StVehicle",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "plateNumber",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "type",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "seats",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "subSeats",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "phone",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "active",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Boolean",
          "nativeType": null,
          "default": true,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StSchedule",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StSchedule",
          "nativeType": null,
          "relationName": "StScheduleToStVehicle",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "StCustomer",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "active",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Boolean",
          "nativeType": null,
          "default": true,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StContact",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StContact",
          "nativeType": null,
          "relationName": "StContactToStCustomer",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StSchedule",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StSchedule",
          "nativeType": null,
          "relationName": "StCustomerToStSchedule",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "StContact",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "phone",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "active",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Boolean",
          "nativeType": null,
          "default": true,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StCustomer",
          "kind": "object",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StCustomer",
          "nativeType": null,
          "relationName": "StContactToStCustomer",
          "relationFromFields": [
            "stCustomerId"
          ],
          "relationToFields": [
            "id"
          ],
          "relationOnDelete": "Cascade",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "stCustomerId",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StSchedule",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StSchedule",
          "nativeType": null,
          "relationName": "StContactToStSchedule",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "StHoliday",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "date",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [
        [
          "date"
        ]
      ],
      "uniqueIndexes": [
        {
          "name": "unique_stHoliday_date",
          "fields": [
            "date"
          ]
        }
      ],
      "isGenerated": false
    },
    {
      "name": "StSchedule",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "date",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StCustomer",
          "kind": "object",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StCustomer",
          "nativeType": null,
          "relationName": "StCustomerToStSchedule",
          "relationFromFields": [
            "stCustomerId"
          ],
          "relationToFields": [
            "id"
          ],
          "relationOnDelete": "SetNull",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "stCustomerId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StContact",
          "kind": "object",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StContact",
          "nativeType": null,
          "relationName": "StContactToStSchedule",
          "relationFromFields": [
            "stContactId"
          ],
          "relationToFields": [
            "id"
          ],
          "relationOnDelete": "SetNull",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "stContactId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StVehicle",
          "kind": "object",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StVehicle",
          "nativeType": null,
          "relationName": "StScheduleToStVehicle",
          "relationFromFields": [
            "stVehicleId"
          ],
          "relationToFields": [
            "id"
          ],
          "relationOnDelete": "SetNull",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "stVehicleId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "organizationName",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "organizationContact",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "destination",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "hasGuide",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Boolean",
          "nativeType": null,
          "default": false,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "departureTime",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "returnTime",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "remarks",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "pdfFileName",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "pdfFileUrl",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "batchId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "deleted",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Boolean",
          "nativeType": null,
          "default": false,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "deletedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StScheduleDriver",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StScheduleDriver",
          "nativeType": null,
          "relationName": "StScheduleToStScheduleDriver",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "StScheduleDriver",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "StSchedule",
          "kind": "object",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "StSchedule",
          "nativeType": null,
          "relationName": "StScheduleToStScheduleDriver",
          "relationFromFields": [
            "stScheduleId"
          ],
          "relationToFields": [
            "id"
          ],
          "relationOnDelete": "Cascade",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "stScheduleId",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "userId",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [
        [
          "stScheduleId",
          "userId"
        ]
      ],
      "uniqueIndexes": [
        {
          "name": "unique_stScheduleDriver",
          "fields": [
            "stScheduleId",
            "userId"
          ]
        }
      ],
      "isGenerated": false
    },
    {
      "name": "StRollCaller",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "date",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "userId",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [
        [
          "date"
        ]
      ],
      "uniqueIndexes": [
        {
          "name": "unique_stRollCaller_date",
          "fields": [
            "date"
          ]
        }
      ],
      "isGenerated": false
    },
    {
      "name": "StPublishSetting",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "publishEndDate",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "StUserHoliday",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "date",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "userId",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [
        [
          "userId",
          "date"
        ]
      ],
      "uniqueIndexes": [
        {
          "name": "unique_stUserHoliday_userId_date",
          "fields": [
            "userId",
            "date"
          ]
        }
      ],
      "isGenerated": false
    },
    {
      "name": "Department",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "code",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "color",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "User",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "User",
          "nativeType": null,
          "relationName": "DepartmentToUser",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "User",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "code",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "active",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Boolean",
          "nativeType": null,
          "default": true,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "hiredAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "retiredAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "transferredAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "yukyuCategory",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "String",
          "nativeType": null,
          "default": "A",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "kana",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "email",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "password",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "String",
          "nativeType": null,
          "default": "999999",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "type",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "role",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "String",
          "nativeType": null,
          "default": "user",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "tempResetCode",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "tempResetCodeExpired",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "storeId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "schoolId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "rentaStoreId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "type2",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "shopId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "membershipName",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "damageNameMasterId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "color",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "app",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "apps",
          "kind": "scalar",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "employeeCode",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "phone",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "avatar",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "bcc",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "UserRole",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "UserRole",
          "nativeType": null,
          "relationName": "UserToUserRole",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "department",
          "kind": "object",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Department",
          "nativeType": null,
          "relationName": "DepartmentToUser",
          "relationFromFields": [
            "departmentId"
          ],
          "relationToFields": [
            "id"
          ],
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "departmentId",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "ReleaseNotes",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "rootPath",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "title",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "msg",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "imgUrl",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "confirmedUserIds",
          "kind": "scalar",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "Tokens",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "token",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "expiresAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "GoogleAccessToken",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "email",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "access_token",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "refresh_token",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "scope",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "token_type",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "id_token",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "expiry_date",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "tokenJSON",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "RoleMaster",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "name",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "description",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "color",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "apps",
          "kind": "scalar",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "String",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "UserRole",
          "kind": "object",
          "isList": true,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "UserRole",
          "nativeType": null,
          "relationName": "RoleMasterToUserRole",
          "relationFromFields": [],
          "relationToFields": [],
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "UserRole",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "User",
          "kind": "object",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "User",
          "nativeType": null,
          "relationName": "UserToUserRole",
          "relationFromFields": [
            "userId"
          ],
          "relationToFields": [
            "id"
          ],
          "relationOnDelete": "Cascade",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "userId",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "RoleMaster",
          "kind": "object",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "RoleMaster",
          "nativeType": null,
          "relationName": "RoleMasterToUserRole",
          "relationFromFields": [
            "roleMasterId"
          ],
          "relationToFields": [
            "id"
          ],
          "relationOnDelete": "Cascade",
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "roleMasterId",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": true,
          "hasDefaultValue": false,
          "type": "Int",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [
        [
          "userId",
          "roleMasterId"
        ]
      ],
      "uniqueIndexes": [
        {
          "name": "userId_roleMasterId_unique",
          "fields": [
            "userId",
            "roleMasterId"
          ]
        }
      ],
      "isGenerated": false
    },
    {
      "name": "ChainMethodLock",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "isLocked",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Boolean",
          "nativeType": null,
          "default": false,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "expiresAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": true
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    },
    {
      "name": "Calendar",
      "dbName": null,
      "schema": null,
      "fields": [
        {
          "name": "id",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": true,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Int",
          "nativeType": null,
          "default": {
            "name": "autoincrement",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "createdAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "updatedAt",
          "kind": "scalar",
          "isList": false,
          "isRequired": false,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "DateTime",
          "nativeType": null,
          "default": {
            "name": "now",
            "args": []
          },
          "isGenerated": false,
          "isUpdatedAt": true
        },
        {
          "name": "sortOrder",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "Float",
          "nativeType": null,
          "default": 0,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "date",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": true,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": false,
          "type": "DateTime",
          "nativeType": null,
          "isGenerated": false,
          "isUpdatedAt": false
        },
        {
          "name": "holidayType",
          "kind": "scalar",
          "isList": false,
          "isRequired": true,
          "isUnique": false,
          "isId": false,
          "isReadOnly": false,
          "hasDefaultValue": true,
          "type": "String",
          "nativeType": null,
          "default": "出勤",
          "isGenerated": false,
          "isUpdatedAt": false
        }
      ],
      "primaryKey": null,
      "uniqueFields": [],
      "uniqueIndexes": [],
      "isGenerated": false
    }
  ],
  "types": [],
  "indexes": [
    {
      "model": "StVehicle",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StVehicle",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "plateNumber"
        }
      ]
    },
    {
      "model": "StCustomer",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StContact",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StHoliday",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StHoliday",
      "type": "unique",
      "isDefinedOnField": false,
      "name": "unique_stHoliday_date",
      "fields": [
        {
          "name": "date"
        }
      ]
    },
    {
      "model": "StSchedule",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StScheduleDriver",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StScheduleDriver",
      "type": "unique",
      "isDefinedOnField": false,
      "name": "unique_stScheduleDriver",
      "fields": [
        {
          "name": "stScheduleId"
        },
        {
          "name": "userId"
        }
      ]
    },
    {
      "model": "StRollCaller",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StRollCaller",
      "type": "unique",
      "isDefinedOnField": false,
      "name": "unique_stRollCaller_date",
      "fields": [
        {
          "name": "date"
        }
      ]
    },
    {
      "model": "StPublishSetting",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StUserHoliday",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "StUserHoliday",
      "type": "unique",
      "isDefinedOnField": false,
      "name": "unique_stUserHoliday_userId_date",
      "fields": [
        {
          "name": "userId"
        },
        {
          "name": "date"
        }
      ]
    },
    {
      "model": "Department",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "Department",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "code"
        }
      ]
    },
    {
      "model": "User",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "User",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "code"
        }
      ]
    },
    {
      "model": "User",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "email"
        }
      ]
    },
    {
      "model": "User",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "employeeCode"
        }
      ]
    },
    {
      "model": "ReleaseNotes",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "Tokens",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "Tokens",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "name"
        }
      ]
    },
    {
      "model": "GoogleAccessToken",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "GoogleAccessToken",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "email"
        }
      ]
    },
    {
      "model": "RoleMaster",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "RoleMaster",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "name"
        }
      ]
    },
    {
      "model": "UserRole",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "UserRole",
      "type": "unique",
      "isDefinedOnField": false,
      "name": "userId_roleMasterId_unique",
      "fields": [
        {
          "name": "userId"
        },
        {
          "name": "roleMasterId"
        }
      ]
    },
    {
      "model": "ChainMethodLock",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "Calendar",
      "type": "id",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "id"
        }
      ]
    },
    {
      "model": "Calendar",
      "type": "unique",
      "isDefinedOnField": true,
      "fields": [
        {
          "name": "date"
        }
      ]
    }
  ]
};
