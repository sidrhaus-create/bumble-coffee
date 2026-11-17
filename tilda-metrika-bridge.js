/* Load on bumblephoenix.ru, alongside its existing counter 112136110. */
(function (w, d) {
  'use strict';
  if (w.__bumbleMetrikaBridge) return;
  w.__bumbleMetrikaBridge = true;

  var counterId = 112136110;
  var childOrigin = 'https://sidrhaus-create.github.io';
  var goals = ['ozon_header', 'ozon_where_to_buy'];
  var pending = [];
  var seen = new Map();
  var timer = null;

  function flush() {
    timer = null;
    var now = Date.now();
    pending = pending.filter(function (item) { return now - item.createdAt < 30000; });
    if (typeof w.ym === 'function') {
      while (pending.length) {
        try {
          w.ym(counterId, 'reachGoal', pending[0].goal);
          pending.shift();
        } catch (_) { break; }
      }
    }
    if (pending.length) timer = w.setTimeout(flush, 250);
  }

  w.addEventListener('message', function (event) {
    var frame = d.getElementById('bumbleSite');
    if (!frame || event.source !== frame.contentWindow || event.origin !== childOrigin) return;
    var data = event.data;
    if (!data || data.type !== 'BUMBLE_METRIKA_GOAL' || data.version !== 1) return;
    if (goals.indexOf(data.goal) === -1 || typeof data.eventId !== 'string') return;
    if (!/^[a-zA-Z0-9-]{1,80}$/.test(data.eventId)) return;

    var now = Date.now();
    seen.forEach(function (time, id) { if (now - time > 120000) seen.delete(id); });
    if (!seen.has(data.eventId)) {
      if (pending.length >= 100 || seen.size >= 1000) return;
      seen.set(data.eventId, now);
      pending.push({ goal: data.goal, createdAt: now });
    }

    // Acknowledges receipt into our queue; delivery waits for Tilda's delayed ym.
    event.source.postMessage({
      type: 'BUMBLE_METRIKA_ACK', version: 1, eventId: data.eventId
    }, childOrigin);
    if (timer === null && pending.length) flush();
  });
})(window, document);
