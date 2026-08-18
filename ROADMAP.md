# Roadmap (Ideas / Not committed)

Nothing on this page is a promise. These are directions the project might explore — not a schedule, and not a guarantee that any of it ships. Treat this as "things worth thinking about," not a backlog.

Today, JSON Ledger is scoped to editing a single JSON file at a time.

## Directions being considered

- [ ] Column-based filtering and sorting, alongside the existing full-text search
- [ ] Optional JSON Schema validation for records
- [ ] Opening a folder and treating several JSON files as related tables
- [ ] A lightweight query syntax for filtering (something in the spirit of JMESPath)

## Out of scope

Anything that would require a server — multi-user concurrent editing, real-time sync, and similar — isn't being considered. It would conflict with the tool staying serverless and fully client-side, which is a core part of what it is.

## Feedback

Thoughts and pull requests are welcome. For anything beyond a small fix, please open an issue first so the approach can be discussed — see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

# ロードマップ（アイデア段階・確約ではありません）

このページに書かれているものは、どれも確約ではありません。プロジェクトが検討しうる方向性を並べているだけで、スケジュールでも実装の保証でもありません。「バックログ」ではなく「考える価値のあること」として読んでください。

現状のJSON Ledgerは、1つのJSONファイルを編集することに機能を絞っています。

## 検討中の方向性

- [ ] 既存の全文検索に加えた、列指定でのフィルタ・ソート機能
- [ ] レコードに対するオプショナルなJSON Schemaバリデーション
- [ ] フォルダを開いて、複数のJSONファイルを関連するテーブルとして扱う機能
- [ ] 軽量なクエリ構文によるフィルタリング（JMESPathのような方向性）

## 対象外

サーバーを必要とするもの（複数ユーザーでの同時編集、リアルタイム同期など）は検討していません。サーバーレスで、ブラウザ内で完結するという、このツールの根幹をなす性質と矛盾するためです。

## フィードバック

ご意見・Pull Requestを歓迎します。小さな修正以外は、まずIssueで方針を相談してください — 詳しくは [CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。
