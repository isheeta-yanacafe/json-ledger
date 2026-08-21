# Roadmap (Ideas / Not committed)

Nothing on this page is a promise. These are directions the project might explore — not a schedule, and not a guarantee that any of it ships. Treat this as "things worth thinking about," not a backlog.

Today, JSON Ledger is scoped to editing a single JSON file at a time.

## Known bugs

- [ ] `json-ledger.en.html`: the "not set" cell placeholder text (shown on an empty editable cell) is still in Japanese (`未設定（クリックして入力）`) instead of English — a leftover from the original translation pass

## Directions being considered

- ~~Column-based filtering and sorting, alongside the existing full-text search~~
  - Sorting: implemented (any column, ascending/descending, including _added_at)
  - Filtering: not yet implemented (a separate axis from the existing tag filter and full-text search)
- [ ] Optional JSON Schema validation for records
- [ ] Opening a folder and treating several JSON files as related tables
- [ ] A lightweight query syntax for filtering (something in the spirit of JMESPath)
- [ ] Per-column show/hide toggling (e.g. for users who want to hide the tags column)
  - Persistence policy (saved into the file vs. session-only) not yet decided
- [ ] Add a tree-structure view (a third display mode alongside Table/Card)
  - Background: Table/Card requires `normalize()` to force JSON's tree structure into a flat table,
    which misfires on JSON that contains an array but is really a single record — e.g.
    `{ name: "Tanaka", age: 14, clubs: ["Soccer Club", "Computer Club"], isPresident: false }` —
    where what should be one record gets incorrectly expanded into multiple records based on the
    array's contents
  - Idea: add a view that shows the JSON's structure as-is, as a collapsible tree, without converting it
  - UX idea: on paste/file load, detect structures that don't map well to a table (e.g. a top-level
    object whose only array property contains just short strings) and default to tree view
    automatically, with the Table/Card toggle grayed out and a reason shown
    (discovered via a school student-profile JSON example)
  - Open questions: read-only vs. editable; the detection criteria for "doesn't map well to a table" itself

## Out of scope

Anything that would require a server — multi-user concurrent editing, real-time sync, and similar — isn't being considered. It would conflict with the tool staying serverless and fully client-side, which is a core part of what it is.

## Feedback

Thoughts and pull requests are welcome. For anything beyond a small fix, please open an issue first so the approach can be discussed — see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

# ロードマップ（アイデア段階・確約ではありません）

このページに書かれているものは、どれも確約ではありません。プロジェクトが検討しうる方向性を並べているだけで、スケジュールでも実装の保証でもありません。「バックログ」ではなく「考える価値のあること」として読んでください。

現状のJSON Ledgerは、1つのJSONファイルを編集することに機能を絞っています。

## 既知の不具合

- [ ] `json-ledger.en.html`: 未設定セルのプレースホルダー文言（空の編集可能セルに表示される案内）が英語版なのに日本語（`未設定（クリックして入力）`）のまま残っている（当初の翻訳作業の取りこぼし）

## 検討中の方向性

- ~~列指定でのフィルタ・ソート機能~~
  - ソート: 実装済み（任意カラム昇順/降順、_added_at含む）
  - フィルタ: 未実装（既存のタグ絞り込み・検索とは別軸での列指定フィルタ）
- [ ] レコードに対するオプショナルなJSON Schemaバリデーション
- [ ] フォルダを開いて、複数のJSONファイルを関連するテーブルとして扱う機能
- [ ] 軽量なクエリ構文によるフィルタリング（JMESPathのような方向性）
- [ ] 任意カラムの表示/非表示切り替え（例: タグ列を隠したいユーザー向け）
  - 状態の永続化方針（ファイル保存 vs セッションのみ）は未検討
- [ ] ツリー構造ビューの追加（テーブル/カードに次ぐ第三の表示モード）
  - 背景: テーブル/カードは`normalize()`がJSONの木構造を無理やり表形式に変換する必要があり、
    「配列を含むが実質は単一レコード」のようなJSON（例:
    `{ 名前: "たなか", 年齢: 14, 部活: ["サッカー部", "パソコン部"], 生徒会長: false }`）では、
    本来1件のレコードであるべきものが、配列の中身の数だけ複数レコードとして誤って展開されてしまう
  - 案: JSONの構造を変換せず、折りたたみ可能な木構造としてそのまま表示するビューを追加する
  - UX案: 貼り付け/ファイル読み込み時に構造を判定し、「表になりにくい」形（例: トップレベル
    オブジェクトの配列プロパティの中身が短い文字列のみ、など）と判定された場合は自動的にツリー
    表示をデフォルトにし、テーブル/カードのトグルはグレーアウトしてその理由を表示する
    （中学校の生徒プロフィールJSONの検証で発見したケースがきっかけ）
  - 未検討事項: 読み取り専用か編集可能か／「表になりにくい」の判定基準そのもの

## 対象外

サーバーを必要とするもの（複数ユーザーでの同時編集、リアルタイム同期など）は検討していません。サーバーレスで、ブラウザ内で完結するという、このツールの根幹をなす性質と矛盾するためです。

## フィードバック

ご意見・Pull Requestを歓迎します。小さな修正以外は、まずIssueで方針を相談してください — 詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。
