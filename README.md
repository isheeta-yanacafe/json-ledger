# JSON Ledger

A single-file, browser-based editor for local JSON files. It presents an array of JSON objects as an editable table or card view — no server, no build step, no dependencies.

## Features

- Switch between table view and card view for the same data
- Edit nested objects and arrays: array-of-objects fields expand into an inline accordion for direct editing, while other nested values (plain objects, mixed arrays) open a raw-JSON edit modal
- Undo (Ctrl/Cmd+Z or the Undo button), with multiple steps of history
- On browsers that support the File System Access API, files can be saved directly back to disk (overwrite or Save As); other browsers fall back to a regular file download
- Runs entirely in the browser — no data is ever sent anywhere

## Supported JSON shapes

The app inspects the loaded JSON and adapts to one of three shapes.

**A top-level array**
```json
[{ "name": "Item A" }, { "name": "Item B" }]
```
Each array element becomes a row/card.

**An object with one array property** (a "wrapped" array)
```json
{ "store": "My Shop", "menu": [{ "name": "Item A" }] }
```
The array property (here, `menu`) becomes the editable rows; any other top-level properties (here, `store`) are preserved and written back unchanged on save.

**A single object with no array property**
```json
{ "name": "Item A", "price": 500 }
```
The whole object is treated as one record. In this mode, adding or deleting records is disabled, since the file has no concept of multiple rows.

## Usage

**Opening data**: Use "Open File" to load a local `.json` file, or "Try the Sample" to load a small built-in café menu. Opening a different file while there are unsaved changes asks for confirmation first.

**Editing cells**: Plain values (text, numbers, booleans) are edited in place — text cells are a click-to-edit field, numbers get a number input, booleans get a checkbox. Arrays of plain values (e.g. tags) are shown as removable chips with an inline "add" field. Arrays of objects expand into an accordion, where each item's fields are edited individually. Anything else (a plain nested object, or a mixed/irregular array) opens a small modal for direct JSON editing.

**Adding nested items to a cell**: Every plain-value cell has a "+Field" button that turns it into a list of nested items with an inline accordion editor. This replaces the cell's current value — if the cell already holds something, a confirmation dialog warns that the value will be lost, since a value can't be both a scalar and a list of nested items at once.

**Columns**: "+ Add Field" adds a new column across every record. The ✕ next to a column header deletes that column from every record (with confirmation). Columns can be reordered with the ◀ / ▶ buttons next to each header in table view, or ▲ / ▼ next to each field in card view — the order is shared between both views.

**Saving**: "Save" writes directly back to the open file when the browser supports it and a save location has already been chosen; otherwise it prompts for one. "Save As" always lets you choose a new location and filename. On browsers without the File System Access API, both fall back to a normal browser download.

**Undo**: Nearly every change (edits, additions, deletions, reordering) can be undone with the Undo button or Ctrl/Cmd+Z. Rapid consecutive keystrokes in the same field are grouped into a single undo step.

## Browser support

Direct save/overwrite requires the File System Access API (available in Chromium-based browsers such as Chrome and Edge). In browsers without it (e.g. Firefox, Safari), saving always downloads a new file instead.

## Live demo

https://isheeta-yanacafe.github.io/json-ledger/

## Running locally

No installation or build step is required — download `json-ledger.html` and open it directly in a browser.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for directions being considered (ideas only, nothing committed).

## License

MIT — Copyright (c) 2026 Mosozo Inc. See [LICENSE](./LICENSE) for the full text.

---

# JSON Ledger（日本語）

ローカルのJSONファイルをブラウザだけで編集できる、単一HTMLファイルのエディタです。JSONオブジェクトの配列を、編集可能なテーブルまたはカードとして表示します。サーバー、ビルド手順、外部依存は一切不要です。

## 主な特徴

- 同じデータをテーブル表示とカード表示で切り替えて表示できる
- ネストしたオブジェクト・配列の編集に対応: オブジェクトの配列はその場でアコーディオン展開して編集でき、それ以外のネスト値（単純なオブジェクトや不揃いな配列）はJSON直接編集モーダルで編集する
- Undo（元に戻す）に対応。Undoボタンまたは Ctrl/Cmd+Z で、複数ステップ分の履歴を戻せる
- File System Access APIに対応したブラウザでは、ファイルへ直接上書き保存（または名前を付けて保存）ができる。非対応のブラウザでは通常のダウンロードにフォールバックする
- すべての処理はブラウザ内で完結し、データが外部に送信されることはない

## 対応しているJSON形式

読み込んだJSONの形を見て、次の3パターンのいずれかとして扱います。

**トップレベルが配列**
```json
[{ "name": "商品A" }, { "name": "商品B" }]
```
配列の各要素が1行（1カード）になります。

**オブジェクトの中に配列プロパティが1つあるもの（ラップ型）**
```json
{ "store": "お店", "menu": [{ "name": "商品A" }] }
```
その配列プロパティ（例では `menu`）が編集対象の行になります。それ以外のトップレベルのプロパティ（例では `store`）はそのまま保持され、保存時にも変更されずに書き戻されます。

**配列を含まない単一オブジェクト**
```json
{ "name": "商品A", "price": 500 }
```
オブジェクト全体を1件のレコードとして扱います。このモードでは、そもそも「複数行」という概念がファイル側に無いため、レコードの追加・削除はできません。

## 使い方

**ファイルを開く**: 「ファイルを開く」でローカルの `.json` ファイルを読み込むか、「サンプルを試す」で内蔵の小さなカフェメニューを読み込みます。未保存の変更がある状態で別のファイルを開こうとすると、先に確認ダイアログが出ます。

**セルの編集**: 単純な値（文字列・数値・真偽値）はその場で編集します。文字列セルはクリックして直接入力、数値セルは数値入力欄、真偽値はチェックボックスになります。単純な値の配列（タグなど）は、削除可能なチップと追加用の入力欄として表示されます。オブジェクトの配列はアコーディオンとして展開し、各項目のフィールドを個別に編集できます。それ以外（単純なネストオブジェクトや、型が混在した配列など）は、小さなモーダルでJSONを直接編集します。

**セルに下位項目を追加する**: 単純な値のセルには必ず「+項目」ボタンがあり、押すとそのセルを下位項目のリスト（アコーディオン編集）に変えます。この操作は**セルの現在の値を置き換える**破壊的な操作である点に注意してください。すでに値が入っている場合は、値が失われる旨の確認ダイアログが出ます（1つの値が、単純な値と下位項目のリストを同時に持つことはできないためです）。

**列（項目）の追加・削除・並び替え**: 「＋ 項目追加」で全レコード共通の新しい列を追加します。列ヘッダー横の ✕ で、その列を全レコードから削除します（確認あり）。列の並び順は、テーブル表示ではヘッダー横の ◀ / ▶、カード表示では各項目横の ▲ / ▼ で入れ替えられます。この並び順はテーブル表示・カード表示で共通です。

**保存**: 「保存」は、対応ブラウザで既に保存先が決まっていればそのファイルへ直接上書きします。保存先が未定なら、保存先を選ぶダイアログが出ます。「名前を付けて保存」は常に新しい保存先・ファイル名を選び直せます。File System Access APIに非対応のブラウザでは、どちらも通常のダウンロードになります。

**Undo**: 編集・追加・削除・並び替えなど、ほぼ全ての操作をUndoボタンまたは Ctrl/Cmd+Z で元に戻せます。同じ欄への連続した素早いキー入力は、1回のUndo操作にまとめられます。

## 対応ブラウザについて

直接上書き保存にはFile System Access API（Chrome・EdgeなどChromium系ブラウザで利用可能）が必要です。非対応のブラウザ（Firefox、Safariなど）では、保存は常に新規ダウンロードになります。

## ライブデモ

https://isheeta-yanacafe.github.io/json-ledger/

## ローカルでの使い方

インストールやビルド手順は不要です。`json-ledger.html` をダウンロードして、ブラウザで直接開くだけで動作します。

## ロードマップ

検討中の方向性は [ROADMAP.md](./ROADMAP.md) を参照してください（あくまでアイデア段階で、確約ではありません）。

## ライセンス

MIT — Copyright (c) 2026 Mosozo Inc. 全文は [LICENSE](./LICENSE) を参照してください。
