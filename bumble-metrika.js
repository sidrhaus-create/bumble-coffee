/* Send Ozon clicks to the existing Metrika counter on the hosting Tilda page. */
(function (w, d) {
  'use strict';
  if (w.__bumbleMetrikaClient || w.parent === w) return;
  w.__bumbleMetrikaClient = true;

  var allowedParents = ['https://bumblephoenix.ru', 'https://www.bumblephoenix.ru'];
  var parentOrigin = allowedParents[0];
  try {
    var referrerOrigin = new URL(d.referrer).origin;
    if (allowedParents.indexOf(referrerOrigin) !== -1) parentOrigin = referrerOrigin;
  } catch (_) { /* An empty referrer still uses the exact production origin. */ }

  var pending = new Map();
  var timer = null;
  var sequence = 0;
  var retryWindow = 20000;

  function schedule() {
    if (timer !== null || !pending.size) return;
    timer = w.setTimeout(function () {
      timer = null;
      var now = Date.now();
      pending.forEach(function (entry, id) {
        if (now - entry.createdAt >= retryWindow) {
          pending.delete(id);
          return;
        }
        w.parent.postMessage(entry.message, parentOrigin);
      });
      schedule();
    }, 500);
  }

  w.addEventListener('message', function (event) {
    if (event.source !== w.parent || event.origin !== parentOrigin) return;
    var data = event.data;
    if (!data || data.type !== 'BUMBLE_METRIKA_ACK' || data.version !== 1) return;
    if (typeof data.eventId !== 'string') return;
    pending.delete(data.eventId);
    if (!pending.size && timer !== null) {
      w.clearTimeout(timer);
      timer = null;
    }
  });

  function onClick(event) {
    if (event.defaultPrevented) return;
    if (event.type === 'auxclick' ? event.button !== 1 : event.button !== 0) return;
    var target = event.target;
    if (target && target.nodeType !== 1) target = target.parentElement;
    if (!target || typeof target.closest !== 'function') return;
    var link = target.closest('a[data-hd-ozon], a[data-buy-tile]');
    if (!link) return;
    try {
      var url = new URL(link.href, d.baseURI);
      if (url.protocol !== 'https:' || !/(^|\.)ozon\.ru$/i.test(url.hostname)) return;
    } catch (_) { return; }

    if (pending.size >= 100) return;
    var id = Date.now().toString(36) + '-' + (++sequence) + '-' + Math.random().toString(36).slice(2, 10);
    var message = {
      type: 'BUMBLE_METRIKA_GOAL',
      version: 1,
      eventId: id,
      goal: link.hasAttribute('data-hd-ozon') ? 'ozon_header' : 'ozon_where_to_buy'
    };
    pending.set(id, { message: message, createdAt: Date.now() });
    w.parent.postMessage(message, parentOrigin);
    schedule();
  }

  // Delegation also covers sections rendered later by the Bumble runtime.
  // Observe existing links without cancelling their normal navigation.
  d.addEventListener('click', onClick, true);
  d.addEventListener('auxclick', onClick, true);
})(window, document);
