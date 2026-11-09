'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const vote = require('../app.js');

function stats(counts = {}) {
  const full = Object.fromEntries(vote.IDS.map(id => [id, counts[id] || 0]));
  return { ok: true, pollId: vote.POLL_ID, counts: full, total: Object.values(full).reduce((a, b) => a + b, 0) };
}
const payload = { pollId: vote.POLL_ID, dept: '營運部', name: '測試同事', choice: 'forgetmenot', receiptToken: 'a'.repeat(64), requestId: 'b'.repeat(32), expectedRevision: 0 };
function confirmation() { return { ...stats({ forgetmenot: 1 }), choice: payload.choice, requestId: payload.requestId, revision: 1 }; }

test('name variants match while departments remain separate identities', () => {
  assert.equal(vote.normalizeIdentity('  ＤＫ   Team  ', ' 王 小明 '), vote.normalizeIdentity('dk team', '王小明'));
  assert.equal(vote.normalizeIdentity('電\u200B商 營運部', '王\u202A小 明\u2060'), vote.normalizeIdentity('電商營運部', '王小明'));
  assert.notEqual(vote.normalizeIdentity('營運', '王小明'), vote.normalizeIdentity('門市', '王小明'));
  assert.match(vote.validateIdentity('', '王小明'), /部門/);
  assert.match(vote.validateIdentity('營運', 'A\nB'), /換行/);
  assert.match(vote.validateIdentity('A'.repeat(41), '王小明'), /40/);
});

function mountHarness(savedReceipt, fetcher) {
  const nodes = new Map();
  function node() {
    const result = { value: '', className: '', handlers: {}, focus() {}, reportValidity() { return true; }, addEventListener(type, handler) { this.handlers[type] = handler; } };
    result.classList = { contains: name => result.className.split(' ').includes(name), toggle(name, active) { const names = new Set(result.className.split(' ').filter(Boolean)); active ? names.add(name) : names.delete(name); result.className = [...names].join(' '); } };
    return result;
  }
  const get = id => { if (!nodes.has(id)) nodes.set(id, node()); return nodes.get(id); };
  const radios = vote.IDS.map(value => {
    const radio = node(), card = node(), children = new Map();
    radio.value = value;
    radio.closest = () => card;
    card.querySelector = selector => { if (!children.has(selector)) children.set(selector, node()); return children.get(selector); };
    return radio;
  });
  const storage = values => ({ getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) });
  const saved = new Map();
  if (savedReceipt) saved.set('dk-flower-vote:' + vote.POLL_ID + ':receipt-v1', JSON.stringify(savedReceipt));
  const document = { getElementById: get, querySelectorAll: () => radios, body: node(), defaultView: { crypto: webcrypto, localStorage: storage(saved), sessionStorage: storage(new Map()), fetch: fetcher } };
  vote.mount(document, { pollId: vote.POLL_ID, endpoint: 'https://example.com/vote' });
  return { get, radios, submit: () => get('vote-form').handlers.submit({ preventDefault() {} }) };
}

test('new-tab identity typo stays editable and only a verified correction is locked', async () => {
  const digest = await vote.identityDigest(webcrypto, vote.normalizeIdentity('電商營運部', '王小明'));
  let sent = 0, ui;
  ui = mountHarness({ token: 'a'.repeat(64), revision: 1, choice: 'forgetmenot', identityDigest: digest }, async (url, options) => {
    sent++;
    assert.equal(ui.get('department').disabled, true);
    assert.equal(ui.get('voter-name').disabled, true);
    const body = JSON.parse(options.body);
    return { ok: true, json: async () => ({ ...stats({ forgetmenot: 1 }), choice: body.choice, requestId: body.requestId, revision: 2 }) };
  });
  ui.get('department').value = '電商營運部';
  ui.get('voter-name').value = '錯誤姓名';
  await ui.submit();
  assert.equal(sent, 0);
  assert.match(ui.get('vote-status').textContent, /原本填寫的身分/);
  assert.equal(ui.get('department').readOnly, false);
  assert.equal(ui.get('voter-name').readOnly, false);
  assert.equal(ui.get('voter-name').disabled, false);
  ui.get('department').value = '電商 營運部';
  ui.get('voter-name').value = '王\u200B小 明';
  await ui.submit();
  assert.equal(sent, 1);
  assert.equal(ui.get('department').readOnly, true);
  assert.equal(ui.get('voter-name').readOnly, true);
});

test('an uncertain request cannot be replayed under changed identity and preserves its exact payload', async () => {
  const sent = [];
  const ui = mountHarness(null, async (url, options) => {
    sent.push(options.body);
    if (sent.length === 1) throw new TypeError('offline after send');
    const body = JSON.parse(options.body);
    return { ok: true, json: async () => ({ ...stats({ sakura: 1 }), choice: body.choice, requestId: body.requestId, revision: 1 }) };
  });
  ui.get('department').value = '電商營運部';
  ui.get('voter-name').value = '王小明';
  ui.radios[0].handlers.change();
  await ui.submit();
  assert.equal(ui.get('voter-name').readOnly, true);
  ui.get('voter-name').value = '另一位同事';
  ui.get('voter-name').handlers.input();
  await ui.submit();
  assert.equal(sent.length, 1);
  assert.equal(ui.get('voter-name').readOnly, false);
  ui.get('voter-name').value = '王 小 明';
  await ui.submit();
  assert.equal(sent.length, 2);
  assert.equal(sent[1], sent[0]);
  assert.match(ui.get('vote-status').textContent, /你的票已收到/);
});

test('receipt stores no clear-text identity and rejects unusable credentials', () => {
  const raw = JSON.stringify({ token: 'a'.repeat(64), revision: 1, choice: 'sakura', identityDigest: 'b'.repeat(64), dept: 'PRIVATE DEPARTMENT', name: 'PRIVATE NAME' });
  const parsed = vote.parseReceipt(raw);
  assert.equal(parsed.revision, 1);
  assert.equal(parsed.name, undefined);
  assert.equal(parsed.dept, undefined);
  assert.equal(vote.parseReceipt(JSON.stringify({ token: 'not-random', revision: 1 })), null);
  assert.equal(vote.parseReceipt(JSON.stringify({ token: 'a'.repeat(64), revision: 0, pending: { requestId: 'x', choice: 'sakura', expectedRevision: 0 } })), null);
});

test('random receipt and identity digest are deterministic only where intended', async () => {
  const first = vote.randomHex(webcrypto, 32);
  const second = vote.randomHex(webcrypto, 32);
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.notEqual(first, second);
  const digest = await vote.identityDigest(webcrypto, vote.normalizeIdentity('營運部', '測試同事'));
  assert.match(digest, /^[a-f0-9]{64}$/);
  assert.equal(digest, await vote.identityDigest(webcrypto, vote.normalizeIdentity('營運部', ' 測試 同事 ')));
});

test('stats accept zero votes but reject negative, incomplete and mismatched totals', () => {
  assert.equal(vote.normalizeStats(stats(), vote.POLL_ID).total, 0);
  assert.equal(vote.normalizeStats(stats({ sakura: 2, plum: 1 }), vote.POLL_ID).total, 3);
  assert.throws(() => vote.normalizeStats({ ...stats(), total: 7 }, vote.POLL_ID));
  assert.throws(() => vote.normalizeStats({ ...stats(), counts: { sakura: 1 } }, vote.POLL_ID));
  assert.throws(() => vote.normalizeStats({ ...stats(), pollId: 'another-poll' }, vote.POLL_ID));
  const invalid = stats(); invalid.counts.sakura = -1;
  assert.throws(() => vote.normalizeStats(invalid, vote.POLL_ID));
});

test('only the matching request and choice may be confirmed', () => {
  assert.equal(vote.assertConfirmation(confirmation(), payload).revision, 1);
  for (const changed of [{ requestId: 'c'.repeat(32) }, { choice: 'plum' }, { revision: 0 }, { pollId: 'different' }, { total: 999 }, { ok: false }]) {
    assert.throws(() => vote.assertConfirmation({ ...confirmation(), ...changed }, payload), error => error.uncertain === true);
  }
  assert.throws(() => vote.assertConfirmation({ ...confirmation(), revision: 1 }, { ...payload, expectedRevision: 2 }));
});

test('unconfigured endpoint never calls fetch or simulates success', async () => {
  let called = false;
  await assert.rejects(vote.requestJSON('', { method: 'POST' }, async () => { called = true; }), error => error.code === 'NOT_READY' && !error.uncertain);
  assert.equal(called, false);
  assert.equal(vote.isConfigured('javascript:alert(1)'), false);
  assert.equal(vote.isConfigured('http://example.com'), false);
});

test('POST requires readable JSON; opaque, HTML and network failures stay uncertain', async () => {
  for (const response of [
    { ok: true, type: 'opaque', json: async () => confirmation() },
    { ok: false, json: async () => confirmation() },
    { ok: true, json: async () => { throw new SyntaxError('HTML instead of JSON'); } },
    { ok: true, json: async () => ({ message: 'success without protocol' }) }
  ]) {
    await assert.rejects(vote.requestJSON('https://example.com/vote', { method: 'POST' }, async () => response), error => error.uncertain === true);
  }
  await assert.rejects(vote.requestJSON('https://example.com/vote', { method: 'POST' }, async () => { throw new TypeError('Offline'); }), error => error.uncertain === true);
});

test('confirmed JSON and server-side rejection remain distinguishable', async () => {
  let request;
  const fetcher = async (url, options) => { request = options; return { ok: true, json: async () => confirmation() }; };
  const data = await vote.requestJSON('https://example.com/vote', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, body: JSON.stringify(payload) }, fetcher);
  assert.equal(vote.assertConfirmation(data, payload).choice, 'forgetmenot');
  assert.equal(request.credentials, 'omit');
  assert.notEqual(request.mode, 'no-cors');
  assert.equal(JSON.parse(request.body).requestId, payload.requestId);
  const rejection = await vote.requestJSON('https://example.com/vote', { method: 'POST' }, async () => ({ ok: true, json: async () => ({ ok: false, code: 'ALREADY_VOTED' }) }));
  assert.equal(rejection.ok, false);
  assert.equal(rejection.code, 'ALREADY_VOTED');
});

test('a timed-out POST is never treated as a failed-to-write certainty', async () => {
  const fetcher = (url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => { const error = new Error('aborted'); error.name = 'AbortError'; reject(error); });
  });
  await assert.rejects(vote.requestJSON('https://example.com/vote', { method: 'POST' }, fetcher, 10), error => error.code === 'TIMEOUT' && error.uncertain === true);
});

test('HTTP 409 business errors preserve duplicate and revision information for the UI', async () => {
  const duplicate = { ok: false, code: 'ALREADY_VOTED', message: 'Already voted' };
  const stale = { ok: false, code: 'STALE_REVISION', choice: 'plum', revision: 3 };
  for (const body of [duplicate, stale]) {
    const result = await vote.requestJSON('https://example.com/vote', { method: 'POST' }, async () => ({ ok: false, status: 409, json: async () => body }));
    assert.deepEqual(result, body);
  }
});
