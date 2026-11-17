const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const clientCode = fs.readFileSync(path.join(root, 'bumble-metrika.js'), 'utf8');
const bridgeCode = fs.readFileSync(path.join(root, 'tilda-metrika-bridge.js'), 'utf8');
const origins = { child: 'https://sidrhaus-create.github.io', parent: 'https://bumblephoenix.ru' };

function harness({ counter = true, parentScript = true, parentOrigin = origins.parent } = {}) {
  let now = 1000, nextTimer = 0;
  const timers = new Map(), calls = [], sent = [], clickHandlers = {};
  const setTimeout = (fn, delay) => { const id = ++nextTimer; timers.set(id, { fn, due: now + delay }); return id; };
  const clearTimeout = id => timers.delete(id);
  const tick = ms => {
    const end = now + ms;
    for (let n = 0; n < 10000; n++) {
      const next = [...timers].filter(([, t]) => t.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) { now = end; return; }
      now = next[1].due; timers.delete(next[0]); next[1].fn();
    }
    throw new Error('Unbounded timer loop');
  };
  const makeWindow = () => {
    const listeners = [];
    return { setTimeout, clearTimeout,
      addEventListener(type, fn) { if (type === 'message') listeners.push(fn); },
      emit(event) { for (const fn of listeners) fn(event); }
    };
  };
  const child = makeWindow(), parent = makeWindow();
  const parentProxy = { postMessage(data, targetOrigin) {
    sent.push({ data, targetOrigin });
    if (targetOrigin === parentOrigin) setTimeout(() => parent.emit({ data, origin: origins.child, source: childProxy }), 0);
  } };
  const childProxy = { postMessage(data, targetOrigin) {
    if (targetOrigin === origins.child) setTimeout(() => child.emit({ data, origin: parentOrigin, source: parentProxy }), 0);
  } };
  child.parent = parentProxy;
  const childDocument = { referrer: parentOrigin + '/', baseURI: origins.child + '/bumble-coffee/',
    addEventListener(type, fn) { (clickHandlers[type] ||= []).push(fn); }
  };
  const parentDocument = { getElementById(id) { return id === 'bumbleSite' ? { contentWindow: childProxy } : null; } };
  class ClockDate extends Date { static now() { return now; } }
  const context = (window, document) => vm.createContext({ window, document, Date: ClockDate, URL, Map, Math });
  const childContext = context(child, childDocument), parentContext = context(parent, parentDocument);
  const enableCounter = () => { parent.ym = (...args) => calls.push(args); };
  const loadParent = () => vm.runInContext(bridgeCode, parentContext);
  const loadChild = () => vm.runInContext(clientCode, childContext);
  if (counter) enableCounter();
  if (parentScript) loadParent();
  loadChild();

  // Use the actual published link markup, including its destination and markers.
  function click(placement, options = {}) {
    const file = placement === 'header' ? 'index.html' : 'Bumble Buy.html';
    const marker = placement === 'header' ? 'data-hd-ozon' : 'data-buy-tile';
    const markup = fs.readFileSync(path.join(root, file), 'utf8').match(new RegExp('<a\\s[^>]*' + marker + '[^>]*>'))?.[0];
    assert.ok(markup, 'The intended link still exists');
    const attrs = new Set([...markup.matchAll(/\b(data-[a-z-]+)/g)].map(m => m[1]));
    const link = { href: options.href || markup.match(/href="([^"]+)"/)[1],
      hasAttribute(name) { return attrs.has(name); }, target: '_blank' };
    const element = { nodeType: 1, closest() { return options.unrelated ? null : link; } };
    const event = { type: options.type || 'click', button: options.button ?? 0,
      defaultPrevented: !!options.prevented,
      target: options.textNode ? { nodeType: 3, parentElement: element } : element,
      preventDefault() { throw new Error('Tracking must not block navigation'); },
      stopPropagation() { throw new Error('Tracking must not block other handlers'); }
    };
    for (const fn of clickHandlers[event.type] || []) fn(event);
    assert.equal(link.target, '_blank');
    return event;
  }
  return { calls, sent, timers, click, tick, enableCounter, loadParent, loadChild, parent, child, childProxy, parentProxy };
}

test('routes header and later-rendered purchase-card clicks to separate goals', () => {
  const h = harness();
  h.click('header', { textNode: true }); h.tick(0);
  h.click('buy'); h.tick(0);
  assert.deepEqual(h.calls, [[112136110, 'reachGoal', 'ozon_header'], [112136110, 'reachGoal', 'ozon_where_to_buy']]);
  assert.ok(h.sent.every(s => s.targetOrigin === origins.parent));
  assert.equal(h.timers.size, 0, 'Acknowledgements stop retries');
});

test('waits for the delayed Tilda counter without duplicating a goal', () => {
  const h = harness({ counter: false });
  h.click('buy'); h.tick(3000);
  assert.equal(h.calls.length, 0);
  assert.equal(h.sent.length, 1, 'The parent acknowledges buffered clicks');
  h.enableCounter(); h.tick(250);
  assert.deepEqual(h.calls, [[112136110, 'reachGoal', 'ozon_where_to_buy']]);
});

test('retries when the parent script loads after the visitor clicks', () => {
  const h = harness({ parentScript: false });
  h.click('header'); h.tick(1000);
  assert.equal(h.calls.length, 0);
  h.loadParent(); h.tick(5000);
  assert.equal(h.calls.length, 1);
  assert.equal(new Set(h.sent.map(s => s.data.eventId)).size, 1);
  assert.equal(h.timers.size, 0);
});

test('deduplicates repeated messages and ignores hostile origins, sources and goals', () => {
  const h = harness();
  h.click('header'); h.tick(0);
  const data = h.sent[0].data;
  h.parent.emit({ data, origin: origins.child, source: h.childProxy });
  h.parent.emit({ data: { ...data, eventId: 'different' }, origin: 'https://example.com', source: h.childProxy });
  h.parent.emit({ data: { ...data, eventId: 'different' }, origin: origins.child, source: {} });
  h.parent.emit({ data: { ...data, eventId: 'different', goal: 'purchase' }, origin: origins.child, source: h.childProxy });
  h.parent.emit({ data: { ...data, eventId: {} }, origin: origins.child, source: h.childProxy });
  h.tick(1000);
  assert.equal(h.calls.length, 1);
});

test('does not track right-clicks, cancelled clicks, unrelated links or deceptive hosts', () => {
  const h = harness();
  h.click('header', { type: 'auxclick', button: 2 });
  h.click('header', { prevented: true });
  h.click('header', { unrelated: true });
  h.click('header', { href: 'https://ozon.ru.example.com/' });
  h.click('header', { href: 'javascript:alert(1)' });
  h.tick(1000);
  assert.equal(h.sent.length, 0);
  assert.equal(h.calls.length, 0);
});

test('supports middle-click and keyboard-generated click without changing navigation', () => {
  const h = harness();
  h.click('header', { type: 'auxclick', button: 1 }); h.tick(0);
  h.click('buy', { button: 0 }); h.tick(0);
  assert.equal(h.calls.length, 2);
});

test('loading either script twice does not duplicate listeners or reporting', () => {
  const h = harness(); h.loadChild(); h.loadParent();
  h.click('header'); h.tick(2000);
  assert.equal(h.calls.length, 1);
  assert.equal(h.sent.length, 1);
});

test('an untrusted acknowledgement cannot discard a pending click', () => {
  const h = harness({ parentScript: false });
  h.click('header'); h.tick(0);
  h.child.emit({ data: { type: 'BUMBLE_METRIKA_ACK', version: 1, eventId: h.sent[0].data.eventId },
    origin: 'https://example.com', source: h.parentProxy });
  h.loadParent(); h.tick(1000);
  assert.equal(h.calls.length, 1);
});

test('uses the exact www parent origin when present in the referrer', () => {
  const h = harness({ parentOrigin: 'https://www.bumblephoenix.ru' });
  h.click('buy'); h.tick(0);
  assert.equal(h.sent[0].targetOrigin, 'https://www.bumblephoenix.ru');
  assert.equal(h.calls.length, 1);
});

test('stops retries and counter polling if analytics remains unavailable', () => {
  const missingParent = harness({ parentScript: false });
  missingParent.click('header'); missingParent.tick(21000);
  assert.equal(missingParent.timers.size, 0);
  const missingCounter = harness({ counter: false });
  missingCounter.click('header'); missingCounter.tick(31000);
  assert.equal(missingCounter.timers.size, 0);
  assert.equal(missingCounter.calls.length, 0);
});
