### 1. 全体方針

- **コンポーネント指向**: 機能とUIを再利用可能なコンポーネント単位で設計し、疎結合を維持する。
- **サーバーコンポーネント中心**: データ取得は原則としてサーバーコンポーネント（RSC）で行い、インタラクティブなUIのみクライアントコンポーネント（RCC）として分離する。
- **URLによる状態管理**: フィルタ、ソート、ページネーションなどの状態はURLクエリパラメータで管理し、再現性と共有可能性を担保する。
- **型安全**: TypeScriptの型を最大限活用し、Prismaで生成された型を基本として安全なデータ操作を実現する。

---

### 2. コーディング規約

### 2.1. 命名規則

| 対象                                                                 | 規約                                                   | 例                      |
| -------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------- |
| ファイル名 (Component)                                               | `PascalCase`とし、コンポーネント名と一致させる。       | `UserEditModal.tsx`     |
| ファイル名 (Server Actions)                                          | `kebab-case`とし、関連するモデル名を接頭辞とする。     | `user-actions.ts`       |
| ファイル名 (Class)                                                   | `PascalCase`とし、モデル名に`Cl`を付与する。           | `UserCl.ts`             |
| サーバーコンポーネントからデータを受け取るクライアントコンポーネント | `PascalCase`とし、ページ名に`Client`または`CC`を付与。 | `ReservationClient.tsx` |
| 日付関連フィールド                                                   | `camelCase`とし、末尾に`At`を付与する。                | `publishedAt`           |

### 2.2. 型定義

- **基本方針**: `any`の使用を禁止し、できる限り厳密な型を定義する。
- **Prismaの型活用**: データベースから取得するデータには、Prismaが自動生成する型を利用する。必要に応じて`Partial<T>`などを用い、部分的な型も活用する。

### 2.3. 関数定義

- **アロー関数**: 全ての関数はアロー関数 (`const func = () => {}`) で統一する。

---

### 3. アーキテクチャ設計

### 3.1. ディレクトリ構成

### 共通リソース (`/src`)

| ディレクトリ  | 役割                                       |
| ------------- | ------------------------------------------ |
| `/app`        | Next.js App Routerのルート定義             |
| `/components` | 複数のアプリで利用する汎用UIコンポーネント |
| `/hooks`      | 共通カスタムフック                         |
| `/lib`        | 共通ロジック、ユーティリティ関数           |
| `/types`      | 共通の型定義                               |
| `/styles`     | 共通スタイルシート                         |

### 個別アプリ構成 (`/app/(apps)/[appName]/`)

| ディレクトリ  | 役割                                      |
| ------------- | ----------------------------------------- |
| `/components` | そのアプリ専用のUIコンポーネント          |
| `/(pages)`    | 機能単位のルートディレクトリ (Features)   |
| `/hooks`      | アプリ専用のカスタムフック                |
| `/lib`        | アプリ専用のロジック、APIクライアントなど |
| `/types`      | アプリ専用の型定義                        |

### 3.2. ページコンポーネント設計

1. **セッション取得**: `initServerComopnent` を使用してサーバーコンポーネント内でセッション情報とスコープを取得する。
2. **データ取得**: `async function Page(props)` 内（サーバーコンポーネント）で、`props.searchParams` を基にデータ取得処理（Server Actions呼び出しなど）を実行する。
3. **初期条件のリダイレクト**: 日付フィルタなど初期値が必要な場合、サーバーコンポーネントでURLクエリを検証し、不足していれば適切なクエリを付与したURLへリダイレクトする。
4. **Propsでのデータ渡し**: 取得したデータをクライアントコンポーネントに`props`として渡す。

```jsx
TypeScript

// app/(apps)/sbm/(pages)/reservations/page.tsx
import ReservationClient from './ReservationClient'
import {dateSwitcherTemplate} from '@cm/lib/methods/redirect-method'
import Redirector from '@cm/components/utils/Redirector'
import {initServerComopnent} from 'src/non-common/serverSideFunction'
import {getReservations} from './_actions/reservation-actions' // データ取得関数

export default async function Page(props) {
  const query = await props.searchParams

  // 1. セッションとスコープを取得
  const {session, scopes} = await initServerComopnent({query})

  // 2. 初期条件がない場合のリダイレクト処理
  const {redirectPath, whereQuery} = await dateSwitcherTemplate({
    query,
    defaultWhere: {
      /* ... */
    },
  })
  if (redirectPath) return <Redirector redirectPath={redirectPath} />

  // 3. サーバーコンポーネントでデータを取得
  const reservations = await getReservations({where: whereQuery})

  // 4. クライアントコンポーネントにPropsで渡す
  return <ReservationClient reservations={reservations} />
}
```

---

### 4. UI/UX 設計

### 4.1. 表示形式の選択

| 用途                         | 推奨UI         | 理由・補足                                                                                                                                     |
| ---------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **単純な情報提示・編集**     | **モーダル**   | コンテキストを維持したまま操作が完結するため、ユーザーの負担が少ない。                                                                         |
| **複雑な詳細表示・複数工程** | **ページ遷移** | 専用のURLを持つため、状態の共有や復元が容易。モーダルで実装する場合も、将来的にページ (`/[id]`) へ移行できるようコンポーネントを分離しておく。 |
| **確認**                     | `window.alert` | 簡易的な確認に限定。                                                                                                                           |
| **結果通知**                 | トースト       | 操作を妨げずに結果を通知する。                                                                                                                 |

### 4.2. パフォーマンス

- **UIのシンプル化**: 機能は必要最小限に絞り、直感的で迷わないUIを設計する。
- **速度最優先**: ユーザーの操作性を損なわないよう、常にパフォーマンスを意識した実装を行う。

---

### 5. データ管理

### 5.1. Prisma スキーマ

- **必須フィールド**:
  - `id`: `Int @id @default(autoincrement())`
  - `createdAt`: `DateTime @default(now())`
  - `updatedAt`: `DateTime? @updatedAt`
  - `sortOrder`: `Float @default(0)`
- **リレーション**:
  - リレーション名は、対象モデル名の`PascalCase`とする (例: `model User { Post Post[] }`)。
  - 外部キー名は、対象モデル名の`camelCase` + `Id`とする (例: `model Post { userId Int }`)。
- **日付データ**:
  - フィールド名は末尾に `At` を付ける (例: `publishedAt`)。
  - DBには**UTC**で格納する。
    - 日付のみ: 当日 `00:00:00` (UTC) 日本時間の場合は、15:00:00となる
    - 日時: 時刻まで含めた (UTC)
    - new Date()で取得した時間をUTCに変換するための関数として「toUTC」を用意している

### 5.2. データベースアクセス (Server Actions)

- **ファイル構成**: 主たるモデルごとに`actions.ts`ファイルを作成する (例: `user-actions.ts`)。
- **関数定義順**: ファイル内では **C (Create) → R (Read) → U (Update) → D (Delete)** の順で関数を定義する。
- **データ取得 (`Read`)**:
  - 検索、フィルタ、ソート条件はURLクエリパラメータ (`query`) を基にする。
  - 検索欄を作成するとき、onChangeで検索を実行せず、「確定」ボタンによって検索が実行されるようにして
  - 関数は引数として `where`, `orderBy`, `take`, `skip` などを受け取れるように設計する。
  - 原則として`include`を使い関連データをまとめて取得する。パフォーマンスが問題になるページでのみ`select`でカラムを絞る。
- **データ更新 (`Create`/`Update`)**:
  - ロジックが共通化できる場合は`upsert`メソッドを実装する。複雑になるなら`create`と`update`に分ける。

### 5.3. ビジネスロジック (Class)

- **目的**: 複雑な計算処理や、モデルに紐づくビジネスロジックをカプセル化する。
- **ファイル/クラス名**: `[ModelName]Cl.ts` / `class [ModelName]Cl`
- **基本構造**:
  - `constructor`でモデルのデータを受け取り、`this.data`に保持する。
  - `data`の型は `[ModelName]ClData`として定義する。
  - 引数不要の算出プロパティは `get` アクセサを用いる。
  - 引数が必要な場合は通常のメソッドとして定義する。
  - テーブル固有の定数などは`static`プロパティ/メソッドとして定義する。

```jsx
// userCl.ts

import { User, Post } from '@prisma/generated/prisma/client';

// 関連データを含む型を定義
export type UserClData = User & {
  posts: Post[];
};

export class UserCl {
  data: UserClData;

  // 定数はstaticで定義
  static readonly MIN_AGE = 20;

  constructor(userData: UserClData) {
    this.data = userData;
  }

  // 引数不要の算出プロパティ
  get fullName(): string {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  // 引数が必要なメソッド
  hasPostsAfter(date: Date): boolean {
    return this.data.posts.some(post => post.createdAt > date);
  }
}
```

---

### 6. 共通カスタムフック (`/hooks`)

- useModal：モーダルの開閉に利用

  ```jsx
  //利用例

  //ユーザー編集モーダルを開く
    UserEditModalReturn.handleOpen({userId})

    //ユーザー編集モーダルを閉じる
    UserEditModalReturn.handleClose()

    //ユーザー編集モーダルの設置
    <UserEditModalReturn.Modal>
      <UserEditForm {...{
        onUpdate:()=>{
          //実際の処理...
          UserEditModalReturn.handleClose()
        },
        onClose:()=>{
          UserEditModalReturn.handleClose()
        }
      }}/>
    </UserEditModalReturn.Modal>
  ```

- useGlobal:
  - {toggleLoad}：ローディング処理が必要な場合、これを実行し、callbackで処理を渡せば、画面にローディングUIが表示される
  - {query, addQuery}: URL parameterの取得・更新に関する処理
  - {session} ：ユーザー情報が入っている（例：userIdは、session.id）

- useBasicForm
  - シンプルなフォームを作成する
  - forSelectを付与し、idを「model名＋Id」にすると、該当テーブルから選択するselectコンポーネントになる。ただし、場合によってconfigオブジェクトの設定が必要
  - 若干仕様が複雑なため、これにこだわる必要はない

  ```jsx
  const {BasicForm, latestFormData} = useBasicFormProps({
    columns: new Fields([
      //
      {id: `NO_CYUMON`, label: `注文番号`, form: {}, type: 'number'},
      {id: `userId`, label: `ユーザー`, form: {}, forSelect: {}},
    ]).transposeColumns(),
  })
  return (
    <BasicForm
      {...{
        alignModa: 'col',
        latestFormData,
        onSubmit: async data => {
          //
        },
      }}
    >
      <Button>確定</Button>
    </BasicForm>
  )
  ```
