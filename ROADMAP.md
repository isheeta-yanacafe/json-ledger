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

## 対象外

サーバーを必要とするもの（複数ユーザーでの同時編集、リアルタイム同期など）は検討していません。サーバーレスで、ブラウザ内で完結するという、このツールの根幹をなす性質と矛盾するためです。

## フィードバック

ご意見・Pull Requestを歓迎します。小さな修正以外は、まずIssueで方針を相談してください — 詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。
