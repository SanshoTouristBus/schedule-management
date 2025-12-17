# システムアーキテクチャ

[← README に戻る](./README.md)

## 関連ドキュメント

- [データモデル](./data-model.md)
- [機能詳細](./features.md)
- [API 仕様](./api.md)

---

## 技術スタック

| カテゴリ       | 技術                 | バージョン |
| -------------- | -------------------- | ---------- |
| フレームワーク | Next.js (App Router) | 15.x       |
| UI ライブラリ  | React                | 18.x       |
| スタイリング   | Tailwind CSS         | 4.x        |
| ORM            | Prisma               | 7.x        |
| データベース   | PostgreSQL           | -          |
| 認証           | NextAuth.js          | 4.x        |
| 状態管理       | SWR                  | 2.x        |
| アイコン       | Lucide React         | -          |

## アーキテクチャ概要

```mermaid
flowchart TB
    subgraph client [クライアント層]
        browser[ブラウザ]
        components[React コンポーネント]
        hooks[カスタムフック]
        swr[SWR キャッシュ]
    end

    subgraph server [サーバー層]
        pages[Server Components]
        actions[Server Actions]
        auth[NextAuth]
    end

    subgraph data [データ層]
        prisma[Prisma Client]
        db[(PostgreSQL)]
    end

    browser --> components
    components --> hooks
    hooks --> swr
    swr --> actions
    components --> pages
    pages --> actions
    actions --> prisma
    prisma --> db
    auth --> db
```

## レイヤー構成

### 1. プレゼンテーション層

ユーザーインターフェースを担当するレイヤーです。

```mermaid
flowchart LR
    subgraph presentation [プレゼンテーション層]
        page[page.tsx<br/>Server Component]
        cc[*CC.tsx<br/>Client Component]
        ui[UI コンポーネント]
    end

    page -->|props| cc
    cc --> ui
```

- **Server Components (page.tsx)**: 初期データ取得、認証チェック
- **Client Components (\*CC.tsx)**: インタラクティブな UI 制御
- **UI コンポーネント**: 再利用可能な UI パーツ

### 2. ビジネスロジック層

Server Actions によるデータ操作を担当します。

```mermaid
flowchart LR
    subgraph business [ビジネスロジック層]
        scheduleActions[schedule-actions.ts]
        vehicleActions[vehicle-actions.ts]
        customerActions[customer-actions.ts]
        holidayActions[holiday-actions.ts]
        settingsActions[settings-actions.ts]
        rollcallerActions[rollcaller-actions.ts]
    end

    scheduleActions --> prisma[(Prisma)]
    vehicleActions --> prisma
    customerActions --> prisma
    holidayActions --> prisma
    settingsActions --> prisma
    rollcallerActions --> prisma
```

### 3. データアクセス層

Prisma ORM を使用したデータベースアクセスを担当します。

```mermaid
flowchart TB
    prisma[Prisma Client]

    subgraph models [モデル]
        StVehicle
        StCustomer
        StContact
        StHoliday
        StSchedule
        StScheduleDriver
        StRollCaller
        StPublishSetting
    end

    prisma --> StVehicle & StCustomer & StContact & StHoliday
    prisma --> StSchedule & StScheduleDriver & StRollCaller & StPublishSetting
```

## ディレクトリ構造詳細

```
src/app/(apps)/sanshoTourist/
│
├── (builders)/                    # ビルダークラス
│   ├── ColBuilder.tsx             # カラム定義
│   ├── ModelBuilder.tsx           # モデル設定
│   ├── PageBuilder.tsx            # ページ設定
│   ├── QueryBuilder.tsx           # クエリ設定
│   └── ViewParamBuilder.tsx       # 表示パラメータ
│
├── (components)/                  # UIコンポーネント
│   ├── CopyModeController.tsx     # コピーモード制御
│   ├── ScheduleForm.tsx           # スケジュール入力フォーム
│   ├── ScheduleGrid/              # スケジュールグリッド
│   │   ├── ScheduleGrid.tsx       # メインコンポーネント
│   │   ├── ScheduleGridHeader.tsx # ヘッダー（日付、点呼者）
│   │   ├── ScheduleGridBody.tsx   # ボディ（車両×日付）
│   │   └── ScheduleBar.tsx        # スケジュールバー
│   └── MyPageViews/               # マイページビュー
│       ├── WeeklyView.tsx         # 週間ビュー
│       └── MonthlyView.tsx        # 月間ビュー
│
├── (hooks)/                       # カスタムフック
│   ├── useCopyMode.tsx            # コピーモード管理
│   └── useScheduleGrid.tsx        # グリッド操作
│
├── (pages)/                       # ページ
│   ├── layout.tsx                 # 共通レイアウト
│   ├── template.tsx               # テンプレート
│   ├── page.tsx                   # トップページ
│   ├── schedule/                  # スケジュール管理
│   │   ├── page.tsx               # Server Component
│   │   └── ScheduleCC.tsx         # Client Component
│   ├── master/                    # マスタ管理
│   │   ├── page.tsx
│   │   └── MasterCC.tsx
│   ├── myPage/                    # マイページ
│   │   ├── page.tsx
│   │   └── MyPageCC.tsx
│   ├── settings/                  # 設定
│   │   ├── page.tsx
│   │   └── SettingsCC.tsx
│   └── [dataModelName]/           # 汎用CRUD
│       ├── page.tsx
│       └── [id]/page.tsx
│
├── (server-actions)/              # Server Actions
│   ├── schedule-actions.ts        # スケジュール操作
│   ├── vehicle-actions.ts         # 車両操作
│   ├── customer-actions.ts        # 会社・担当者操作
│   ├── holiday-actions.ts         # 祝日操作
│   ├── rollcaller-actions.ts      # 点呼者操作
│   ├── settings-actions.ts        # 設定操作
│   └── driver-actions.ts          # 乗務員操作
│
└── docs/                          # ドキュメント
    ├── README.md
    ├── architecture.md
    ├── data-model.md
    ├── features.md
    ├── api.md
    └── ...
```

## データフロー

### スケジュール取得フロー

```mermaid
sequenceDiagram
    participant Browser as ブラウザ
    participant Page as page.tsx
    participant CC as ScheduleCC
    participant SWR as SWR
    participant Action as Server Action
    participant Prisma as Prisma
    participant DB as PostgreSQL

    Browser->>Page: ページアクセス
    Page->>Prisma: 初期データ取得
    Prisma->>DB: クエリ実行
    DB-->>Prisma: 結果
    Prisma-->>Page: データ
    Page->>CC: props渡し
    CC->>SWR: useSWR
    SWR->>Action: getStSchedules
    Action->>Prisma: findMany
    Prisma->>DB: SELECT
    DB-->>Prisma: 結果
    Prisma-->>Action: スケジュール
    Action-->>SWR: データ
    SWR-->>CC: キャッシュ済みデータ
    CC-->>Browser: UI 表示
```

### スケジュール更新フロー

```mermaid
sequenceDiagram
    participant Browser as ブラウザ
    participant CC as ScheduleCC
    participant Form as ScheduleForm
    participant Action as Server Action
    participant Prisma as Prisma
    participant DB as PostgreSQL
    participant SWR as SWR

    Browser->>CC: 編集ボタンクリック
    CC->>Form: モーダル表示
    Browser->>Form: データ入力
    Form->>CC: onSave
    CC->>Action: upsertStSchedule
    Action->>Prisma: upsert
    Prisma->>DB: INSERT/UPDATE
    DB-->>Prisma: 結果
    Prisma-->>Action: 更新データ
    Action-->>CC: 成功
    CC->>SWR: mutate
    SWR-->>CC: 再取得
    CC-->>Browser: UI 更新
```

## 認証フロー

```mermaid
flowchart TB
    subgraph auth [認証フロー]
        login[ログイン]
        session[セッション確認]
        check[権限チェック]
    end

    subgraph access [アクセス制御]
        admin[管理者機能]
        editor[編集者機能]
        viewer[閲覧者機能]
    end

    login --> session
    session --> check
    check -->|admin| admin
    check -->|editor| editor
    check -->|viewer| viewer
```

## キャッシュ戦略

SWR を使用したクライアントサイドキャッシュ：

```typescript
// スケジュールデータのキャッシュキー
;['stSchedules', startDate.toISOString(), endDate.toISOString()][
  // 点呼者データのキャッシュキー
  ('stRollCallers', startDate.toISOString(), endDate.toISOString())
]

// マスタデータのキャッシュキー
;('stVehicles')
;('stCustomers')
;('stHolidays')
```

- **自動再検証**: フォーカス時、再接続時
- **楽観的更新**: mutate による即時反映
- **エラーリトライ**: 自動リトライ機能

## パフォーマンス最適化

1. **Server Components**: 初期データをサーバーサイドで取得
2. **SWR キャッシュ**: クライアントサイドでのデータキャッシュ
3. **メモ化**: useMemo, useCallback による再計算防止
4. **遅延読み込み**: 必要時のみデータ取得

---

[← README に戻る](./README.md) | [データモデル →](./data-model.md)
