# API 仕様（Server Actions）

[← README に戻る](./README.md) | [← 機能詳細](./features.md)

## 関連ドキュメント

- [データモデル](./data-model.md)
- [アーキテクチャ](./architecture.md)

---

## Server Actions 一覧

### スケジュール関連 (`schedule-actions.ts`)

| 関数名                       | 操作   | 説明                               |
| ---------------------------- | ------ | ---------------------------------- |
| `createStSchedule`           | CREATE | スケジュールを新規作成             |
| `createStSchedulesBatch`     | CREATE | スケジュールを一括作成（コピー用） |
| `getStSchedules`             | READ   | スケジュール一覧を取得             |
| `getStSchedulesByDriver`     | READ   | 乗務員別スケジュールを取得         |
| `getStSchedule`              | READ   | スケジュール詳細を取得             |
| `updateStSchedule`           | UPDATE | スケジュールを更新                 |
| `upsertStSchedule`           | UPSERT | スケジュールを作成または更新       |
| `deleteStSchedule`           | DELETE | スケジュールを論理削除             |
| `hardDeleteStSchedule`       | DELETE | スケジュールを物理削除             |
| `deleteStSchedulesByBatchId` | DELETE | 一括登録したスケジュールを削除     |

### 車両関連 (`vehicle-actions.ts`)

| 関数名            | 操作   | 説明                 |
| ----------------- | ------ | -------------------- |
| `getStVehicles`   | READ   | 車両一覧を取得       |
| `upsertStVehicle` | UPSERT | 車両を作成または更新 |
| `deleteStVehicle` | DELETE | 車両を削除           |

### 会社・担当者関連 (`customer-actions.ts`)

| 関数名             | 操作   | 説明                       |
| ------------------ | ------ | -------------------------- |
| `getStCustomers`   | READ   | 会社一覧を取得             |
| `upsertStCustomer` | UPSERT | 会社を作成または更新       |
| `deleteStCustomer` | DELETE | 会社を削除（担当者も削除） |
| `upsertStContact`  | UPSERT | 担当者を作成または更新     |
| `deleteStContact`  | DELETE | 担当者を削除               |

### 祝日関連 (`holiday-actions.ts`)

| 関数名            | 操作   | 説明                 |
| ----------------- | ------ | -------------------- |
| `getStHolidays`   | READ   | 祝日一覧を取得       |
| `upsertStHoliday` | UPSERT | 祝日を作成または更新 |
| `deleteStHoliday` | DELETE | 祝日を削除           |

### 点呼者関連 (`rollcaller-actions.ts`)

| 関数名               | 操作   | 説明                   |
| -------------------- | ------ | ---------------------- |
| `getStRollCallers`   | READ   | 点呼者一覧を取得       |
| `upsertStRollCaller` | UPSERT | 点呼者を作成または更新 |

### 設定関連 (`settings-actions.ts`)

| 関数名                   | 操作   | 説明                             |
| ------------------------ | ------ | -------------------------------- |
| `getStPublishSetting`    | READ   | 公開範囲設定を取得               |
| `updateStPublishSetting` | UPDATE | 公開範囲設定を更新               |
| `isScheduleVisible`      | READ   | スケジュールの公開可否をチェック |

---

## API 詳細

### スケジュール取得

#### `getStSchedules`

指定期間のスケジュール一覧を取得します。

```typescript
type GetStSchedulesParams = {
  where?: {
    dateFrom?: Date // 開始日
    dateTo?: Date // 終了日
    stVehicleId?: number // 車両ID
    deleted?: boolean // 削除フラグ
  }
  orderBy?: {[key: string]: 'asc' | 'desc'}
}

const schedules = await getStSchedules({
  where: {
    dateFrom: new Date('2024-01-01'),
    dateTo: new Date('2024-01-31'),
    deleted: false,
  },
})
```

**戻り値:** 関連データ（車両、会社、担当者、乗務員）を含むスケジュール配列

#### `getStSchedulesByDriver`

指定乗務員のスケジュール一覧を取得します。

```typescript
const schedules = await getStSchedulesByDriver({
  userId: 123,
  dateFrom: new Date('2024-01-01'),
  dateTo: new Date('2024-01-31'),
})
```

---

### スケジュール作成・更新

#### `upsertStSchedule`

スケジュールを作成または更新します。

```typescript
type StScheduleInput = {
  id?: number // IDがあれば更新、なければ作成
  date: Date // 運行日
  stVehicleId?: number // 車両ID
  stCustomerId?: number // 会社ID
  stContactId?: number // 担当者ID
  organizationName?: string // 団体名
  organizationContact?: string // 担当者名（手入力）
  destination?: string // 行き先
  hasGuide?: boolean // ガイドの有無
  departureTime?: string // 出庫時間 (HH:mm)
  returnTime?: string // 帰庫時間 (HH:mm)
  remarks?: string // 備考
  driverIds?: number[] // 乗務員IDリスト
}

await upsertStSchedule({
  date: new Date('2024-01-15'),
  stVehicleId: 1,
  organizationName: 'ABC観光',
  destination: '東京ディズニーランド',
  departureTime: '08:00',
  returnTime: '18:00',
  driverIds: [101, 102],
})
```

#### `createStSchedulesBatch`

複数のスケジュールを一括作成します（コピー機能用）。

```typescript
const newSchedules = [
  { date: new Date('2024-01-16'), stVehicleId: 1, ... },
  { date: new Date('2024-01-17'), stVehicleId: 2, ... },
]

await createStSchedulesBatch(newSchedules)
```

---

### スケジュール削除

#### `deleteStSchedule`（論理削除）

スケジュールを論理削除します。`deleted` フラグを `true` に設定。

```typescript
await deleteStSchedule(scheduleId)
```

#### `hardDeleteStSchedule`（物理削除）

スケジュールを物理削除します。関連する乗務員データも Cascade で削除。

```typescript
await hardDeleteStSchedule(scheduleId)
```

#### `deleteStSchedulesByBatchId`

一括登録されたスケジュールをまとめて論理削除します。

```typescript
await deleteStSchedulesByBatchId('batch-001')
```

---

### マスタ操作

#### 車両

```typescript
// 一覧取得
const vehicles = await getStVehicles()

// 作成・更新
await upsertStVehicle({
  id: 1, // 更新の場合
  plateNumber: '湘南230あ3409',
  type: '大型',
  seats: 45,
  subSeats: 10,
  phone: '090-1234-5678',
})

// 削除
await deleteStVehicle(vehicleId)
```

#### 会社・担当者

```typescript
// 会社一覧取得（担当者含む）
const customers = await getStCustomers({includeContacts: true})

// 会社作成・更新
await upsertStCustomer({
  name: '株式会社ABC観光',
})

// 担当者作成・更新
await upsertStContact({
  stCustomerId: 1,
  name: '山田太郎',
  phone: '03-1234-5678',
})

// 削除
await deleteStCustomer(customerId) // 担当者も削除
await deleteStContact(contactId)
```

#### 祝日

```typescript
// 一覧取得
const holidays = await getStHolidays()

// 作成・更新
await upsertStHoliday({
  date: new Date('2024-01-01'),
  name: '元日',
})

// 削除
await deleteStHoliday(holidayId)
```

---

### 点呼者操作

```typescript
// 一覧取得
const rollCallers = await getStRollCallers({
  where: {
    dateFrom: new Date('2024-01-01'),
    dateTo: new Date('2024-01-31'),
  },
})

// 設定・更新
await upsertStRollCaller({
  date: new Date('2024-01-15'),
  userId: 123,
})
```

---

### 公開範囲設定

```typescript
// 取得
const setting = await getStPublishSetting()

// 更新
await updateStPublishSetting({
  publishEndDate: new Date('2024-03-31'),
})

// 公開可否チェック
const isVisible = await isScheduleVisible(scheduleDate, userRole)
```

---

## 日付処理

### UTC 変換

Server Actions 内では、日付を UTC に変換して保存します。

```typescript
import {toUtc} from '@cm/class/Days/date-utils/calculations'

// 入力された日付を UTC に変換
const utcDate = toUtc(date)
```

### フィルタリング

日付範囲でのフィルタリング例：

```typescript
await prisma.stSchedule.findMany({
  where: {
    date: {
      gte: toUtc(dateFrom),
      lte: toUtc(dateTo),
    },
    deleted: false,
  },
})
```

---

## 権限チェック

### 公開範囲チェック

```typescript
export const isScheduleVisible = async (scheduleDate: Date, userRole: string): Promise<boolean> => {
  // 管理者は常に閲覧可能
  if (userRole === 'admin') return true

  const setting = await getStPublishSetting()

  // 設定がない場合は全て表示
  if (!setting?.publishEndDate) return true

  const utcDate = toUtc(scheduleDate)
  return utcDate <= setting.publishEndDate
}
```

### アプリアクセス権チェック

```typescript
// ユーザーが sanshoTourist アプリを持っているか確認
const user = await prisma.user.findUnique({
  where: {id: userId},
  select: {apps: true},
})

const hasAccess = user?.apps?.includes('sanshoTourist')
```

---

## エラーハンドリング

Server Actions でのエラーは、クライアント側で try-catch でハンドリングします。

```typescript
// クライアント側
try {
  await upsertStSchedule(data)
  toast.success('保存しました')
} catch (error) {
  toast.error('保存に失敗しました')
  console.error(error)
}
```

---

[← 機能詳細](./features.md) | [ユーザーマニュアル →](./user-manual.md)
