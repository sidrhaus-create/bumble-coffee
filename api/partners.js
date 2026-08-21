/**
 * Bumble Coffee — partners lead handler (serverless).
 *
 * Deploy this file as a serverless function. It is the ONLY place that knows
 * the recipient and the mail-provider key; nothing secret ships to the browser.
 *
 * Works as-is on Vercel (/api/partners.js) and Netlify (netlify/functions/partners.js
 * via the exported handler at the bottom).
 *
 * Required environment variables (set them in the hosting dashboard, never in git):
 *   RESEND_API_KEY   — API key from https://resend.com  (free tier is enough)
 *   MAIL_FROM        — verified sender, e.g. "Bumble Coffee <site@bumblephoenix.ru>"
 *   MAIL_TO          — recipient, default info@bumblephoenix.ru
 *   ALLOW_ORIGIN     — the site origin allowed to POST, e.g. https://bumblephoenix.ru
 */

const RECIPIENT = process.env.MAIL_TO || 'info@bumblephoenix.ru';
const SENDER = process.env.MAIL_FROM || 'Bumble Coffee <onboarding@resend.dev>';
const ORIGIN = process.env.ALLOW_ORIGIN || '*';

const esc = s => String(s == null ? '' : s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])).slice(0, 500);

function validate(b){
  const name = (b.name || '').trim();
  const phone = (b.phone || '').trim();
  const email = (b.email || '').trim();
  const subject = (b.subject || '').trim();
  const digits = phone.replace(/\D/g, '');
  if (name.length < 2) return 'name';
  if (digits.length < 10 || digits.length > 15) return 'phone';
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z\u0400-\u04FF]{2,}$/.test(email)) return 'email';
  if (!subject) return 'subject';
  return null;
}

async function sendMail(b){
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const text = [
    'Имя: ' + b.name,
    'Телефон: ' + b.phone,
    'Почта: ' + b.email,
    'Тема обращения: ' + b.subject,
    '',
    'Отправлено: ' + new Date().toISOString()
  ].join('\n');
  const html = '<div style="font:14px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#14100E">'
    + '<p><b>Имя:</b> ' + esc(b.name) + '</p>'
    + '<p><b>Телефон:</b> ' + esc(b.phone) + '</p>'
    + '<p><b>Почта:</b> ' + esc(b.email) + '</p>'
    + '<p><b>Тема обращения:</b> ' + esc(b.subject) + '</p>'
    + '</div>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: SENDER,
      to: [RECIPIENT],
      reply_to: b.email,
      subject: 'Новая заявка партнёра — Bumble Coffee',
      text,
      html
    })
  });
  if (!res.ok) throw new Error('resend HTTP ' + res.status + ' ' + (await res.text()).slice(0, 300));
}

const CORS = {
  'Access-Control-Allow-Origin': ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/* ── Vercel / Next.js style ─────────────────────────────────────────── */
module.exports = async function handler(req, res){
  Object.keys(CORS).forEach(k => res.setHeader(k, CORS[k]));
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const bad = validate(body);
    if (bad) return res.status(400).json({ ok: false, error: 'invalid ' + bad });
    await sendMail(body);
    return res.status(200).json({ ok: true });
  } catch (e){
    console.error('partners lead failed', e);
    return res.status(502).json({ ok: false, error: 'mail delivery failed' });
  }
};

/* ── Netlify / Cloudflare style (same logic, Response API) ──────────── */
module.exports.handler = async function(event){
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ ok: false, error: 'method not allowed' }) };
  try {
    const body = JSON.parse(event.body || '{}');
    const bad = validate(body);
    if (bad) return { statusCode: 400, headers: CORS, body: JSON.stringify({ ok: false, error: 'invalid ' + bad }) };
    await sendMail(body);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  } catch (e){
    console.error('partners lead failed', e);
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ ok: false, error: 'mail delivery failed' }) };
  }
};
