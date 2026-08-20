// Minimal unit tests for the pure-logic core (normalize / computeColumns /
// serialize / JSON parsing via loadJSONText / addRecord / sorting).
//
// json-ledger.html has no build step and wires its whole IIFE straight into
// real DOM elements at load time (see the "Wire up controls" section), so
// these internals can't be pulled out and run in plain Node. Instead we load
// the actual file in a headless browser and reach into it through a
// test-only hook (window.__TEST__ / window.__jsonLedgerTest, see
// json-ledger.html) that stays inert unless a harness explicitly sets
// window.__TEST__ = true first.
//
// Run with: npm test  (requires `npm install` once, for the playwright devDependency)

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

const INDEX_HTML_URL = 'file://' + path.resolve(__dirname, '..', 'json-ledger.html');

let browser, page;

test.before(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.addInitScript(() => { window.__TEST__ = true; });
  await page.goto(INDEX_HTML_URL);
});

test.after(async () => {
  await browser.close();
});

function callTest(fnName, ...args){
  return page.evaluate(({ fnName, args }) => window.__jsonLedgerTest[fnName](...args), { fnName, args });
}

function getState(){
  return page.evaluate(() => window.__jsonLedgerTest.state);
}

function setState(patch){
  return page.evaluate((patch) => Object.assign(window.__jsonLedgerTest.state, patch), patch);
}

// ---------------- normalize() ----------------

test('normalize: top-level array of objects becomes root-array', async () => {
  const result = await callTest('normalize', [{ name: 'A' }, { name: 'B' }]);
  assert.deepEqual(result.wrapper, { type: 'root-array' });
  assert.deepEqual(result.records, [{ name: 'A' }, { name: 'B' }]);
});

test('normalize: object with one array property is "wrapped", other keys preserved as rest', async () => {
  const input = { store: 'My Shop', menu: [{ name: 'Item A' }] };
  const result = await callTest('normalize', input);
  assert.equal(result.wrapper.type, 'wrapped');
  assert.equal(result.wrapper.key, 'menu');
  assert.deepEqual(result.wrapper.rest, input);
  assert.deepEqual(result.records, [{ name: 'Item A' }]);
});

test('normalize: object with no array property is a single-object record', async () => {
  const input = { name: 'Item A', price: 500 };
  const result = await callTest('normalize', input);
  assert.deepEqual(result.wrapper, { type: 'single-object' });
  assert.deepEqual(result.records, [input]);
});

// ---------------- computeColumns() ----------------

test('computeColumns: unions keys across records in first-seen order, no duplicates', async () => {
  await setState({ records: [{ a: 1, b: 2 }, { b: 3, c: 4 }, { a: 5 }], showAddedAt: false });
  await callTest('computeColumns');
  const state = await getState();
  assert.deepEqual(state.columns, ['a', 'b', 'c']);
});

test('computeColumns: _added_at is excluded by default even if present on records', async () => {
  await setState({
    records: [{ name: 'A', _added_at: '2026-08-20T00:00:00.000Z' }],
    showAddedAt: false
  });
  await callTest('computeColumns');
  const state = await getState();
  assert.deepEqual(state.columns, ['name']);
});

test('computeColumns: _added_at is included when showAddedAt is true', async () => {
  await setState({
    records: [{ name: 'A', _added_at: '2026-08-20T00:00:00.000Z' }],
    showAddedAt: true
  });
  await callTest('computeColumns');
  const state = await getState();
  assert.deepEqual(state.columns, ['name', '_added_at']);
  await setState({ showAddedAt: false }); // reset for later tests
});

// ---------------- serialize() ----------------

test('serialize: root-array wrapper returns the records array as-is', async () => {
  await setState({ wrapper: { type: 'root-array' }, records: [{ x: 1 }] });
  const out = await callTest('serialize');
  assert.deepEqual(out, [{ x: 1 }]);
});

test('serialize: wrapped wrapper reassembles the original object shape', async () => {
  await setState({
    wrapper: { type: 'wrapped', key: 'menu', rest: { store: 'My Shop', menu: [] } },
    records: [{ name: 'Item A' }]
  });
  const out = await callTest('serialize');
  assert.deepEqual(out, { store: 'My Shop', menu: [{ name: 'Item A' }] });
});

test('serialize: single-object wrapper returns just the first record', async () => {
  await setState({ wrapper: { type: 'single-object' }, records: [{ name: 'Item A' }] });
  const out = await callTest('serialize');
  assert.deepEqual(out, { name: 'Item A' });
});

// ---------------- loadJSONText() (JSON parsing) ----------------

test('loadJSONText: valid JSON populates state and returns true', async () => {
  const ok = await callTest('loadJSONText', '[{"name":"Item A"}]', 'sample.json');
  assert.equal(ok, true);
  const state = await getState();
  assert.deepEqual(state.records, [{ name: 'Item A' }]);
  assert.equal(state.fileName, 'sample.json');
  assert.equal(state.dirty, false);
});

test('loadJSONText: malformed JSON returns false and does not touch state.records', async () => {
  await setState({ records: [{ keep: 'me' }] });
  const ok = await callTest('loadJSONText', '{ not valid json', 'broken.json');
  assert.equal(ok, false);
  const state = await getState();
  assert.deepEqual(state.records, [{ keep: 'me' }]);
});

test('loadJSONText: records missing _added_at are left as-is, not backfilled', async () => {
  await callTest('loadJSONText', '[{"name":"Item A"}]', 'no-added-at.json');
  const state = await getState();
  assert.equal('_added_at' in state.records[0], false);
});

// ---------------- addRecord() ----------------

test('addRecord: stamps the new record with an ISO8601 _added_at', async () => {
  await callTest('loadJSONText', '[{"name":"Item A"}]', 'for-add.json');
  await setState({ wrapper: { type: 'root-array' } });
  await callTest('addRecord');
  const state = await getState();
  const added = state.records[state.records.length - 1]._added_at;
  assert.equal(typeof added, 'string');
  assert.ok(!isNaN(Date.parse(added)), '_added_at parses as a valid date: ' + added);
  assert.ok(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(added), '_added_at looks like toISOString() output: ' + added);
});

// ---------------- Sorting (getDisplayOrder / compareSortValues) ----------------

test('getDisplayOrder: sortKey null returns original index order', async () => {
  await setState({ records: [{ v: 3 }, { v: 1 }, { v: 2 }], sortKey: null });
  const order = await callTest('getDisplayOrder');
  assert.deepEqual(order, [0, 1, 2]);
});

test('getDisplayOrder: sorts numbers ascending and descending without mutating state.records', async () => {
  await setState({ records: [{ v: 3 }, { v: 1 }, { v: 2 }], sortKey: 'v', sortDir: 'asc' });
  let order = await callTest('getDisplayOrder');
  assert.deepEqual(order, [1, 2, 0]); // records[1].v=1, records[2].v=2, records[0].v=3

  await setState({ sortDir: 'desc' });
  order = await callTest('getDisplayOrder');
  assert.deepEqual(order, [0, 2, 1]);

  const state = await getState();
  assert.deepEqual(state.records, [{ v: 3 }, { v: 1 }, { v: 2 }], 'state.records order is untouched by sorting');
});

test('getDisplayOrder: sorts ISO8601 date strings chronologically, not lexicographically by locale', async () => {
  await setState({
    records: [
      { d: '2026-08-20T00:00:00.000Z' },
      { d: '2024-01-01T00:00:00.000Z' },
      { d: '2025-06-15T00:00:00.000Z' }
    ],
    sortKey: 'd', sortDir: 'asc'
  });
  const order = await callTest('getDisplayOrder');
  assert.deepEqual(order, [1, 2, 0]);
});

test('getDisplayOrder: sorts plain strings via localeCompare', async () => {
  await setState({ records: [{ s: 'banana' }, { s: 'apple' }, { s: 'cherry' }], sortKey: 's', sortDir: 'asc' });
  const order = await callTest('getDisplayOrder');
  assert.deepEqual(order, [1, 0, 2]);
});

test('getDisplayOrder: records missing the sort key always sort last, in both directions', async () => {
  await setState({
    records: [{ v: 5 }, {}, { v: 1 }, {}],
    sortKey: 'v', sortDir: 'asc'
  });
  let order = await callTest('getDisplayOrder');
  assert.deepEqual(order, [2, 0, 1, 3], 'ascending: defined values first (1, 5), then the two missing ones');

  await setState({ sortDir: 'desc' });
  order = await callTest('getDisplayOrder');
  assert.deepEqual(order, [0, 2, 1, 3], 'descending: defined values first (5, 1), missing ones still last');
});

test('compareSortValues: both missing compares equal', async () => {
  const result = await callTest('compareSortValues', undefined, undefined, 'asc');
  assert.equal(result, 0);
});
