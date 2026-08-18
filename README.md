# Bumble Coffee — production build (tilda-build)

Production copy of **Bumble Full Website**, unchanged visually. Nothing was redesigned:
the master page and all six section files are byte-identical to the design source except
for `index.html` (runtime script renamed to `bumble.js`, `<title>` + `lang="ru"`, and the
same critical-asset `<link rel="preload">` set the design carries in its helmet).

All raster artwork ships as **WebP** (alpha preserved, production pixel sizes) — the
`assets/` tree is 1.8 MB, down from 10.4 MB of PNG. Hero cans and the phoenix mark are
preloaded; every below-the-fold image is `loading="lazy" decoding="async"` with explicit
`width`/`height`, and the master page warms the next section's images one and a half
screens ahead via IntersectionObserver.

## Contents

```
tilda-build/
  index.html                  ← MAIN ENTRY POINT (the whole site, hero → footer)
  bumble.js                   ← rendering runtime (required, loaded by index.html)
  Bumble Flavor Keys.dc.html  ← section 01–02  hero / flavour lineup
  Bumble Inside.dc.html       ← section 03     что внутри
  Bumble Robusta.dc.html      ← section 04     robusta parallax
  Bumble Rhythm.dc.html       ← section 05     work / study / drive / gym
  Bumble Buy.dc.html          ← section 06     где купить
  Bumble Partners.dc.html     ← section 07     партнёрам
  assets/
    cans/        6 can renders (webp, 620×1695)
    scenes/      4 rhythm scenes (webp)
    robusta/     7 parallax layers + lids (webp)
    fonts/       8 Unbounded woff2 (latin + cyrillic, 400/600/700/800)
    phoenix.svg, black-phoenix-wordmark.svg, bumble-script.svg
  tilda-embed.html            ← snippet to paste into Tilda's T123 HTML block
  README.md
```

There is no `bumble.css` and no `/video`: the site carries all styling inline
(that is how the animations and hover states are authored) and uses no video assets.
All images live in `assets/` — that folder is the `/images` equivalent.

## How to deploy

1. Upload the **entire `tilda-build` folder** to any static host over **HTTPS**
   (Netlify, Vercel, Cloudflare Pages, timeweb, nginx, S3+CloudFront…).
   Keep the folder structure exactly as-is — `index.html`, `bumble.js` and the six
   `.dc.html` section files must stay side by side in the same directory, and
   `assets/` must stay directly beneath them. All paths are relative, so the build
   works from a domain root or from any subfolder.
2. Open `https://your-host/…/index.html` and check the scroll once. That is the
   finished site: scroll morph, parallax, drag on the can, hover states, mobile layout.
3. In Tilda, add a **T123 “HTML‑код”** block and paste the contents of
   `tilda-embed.html`, replacing the placeholder URL with your hosted `index.html`.

### Important
* Must be served over **http(s)**, not opened as a `file://` document — the sections
  are loaded at runtime by the page and browsers block that on `file://`.
* The server must send `.woff2` and `.png` with normal static MIME types (default
  everywhere) and allow the six `.dc.html` files to be served as `text/html`.
* Serve the whole build from **one origin** (no cross-domain split), otherwise the
  section fetches need CORS headers.

## Contact + partners form

The single public address is **info@bumblephoenix.ru** — used by the burger-menu
contacts, the footer contacts and every `mailto:` link in `index.html`.

The «ПАРТНЁРАМ» form validates and POSTs its lead as JSON to the `endpoint` prop
(default `/api/partners`) with the intended recipient `info@bumblephoenix.ru`.
**A browser cannot send mail by itself**, so real delivery still needs one server-side
piece — any of:

* a serverless function (Netlify / Vercel / Cloudflare Worker) at `/api/partners`
  that forwards the JSON to info@bumblephoenix.ru via SMTP or an API
  (Resend, SendGrid, Mailgun, Unisender, Яндекс 360);
* a form service endpoint (Formspree / Getform / Tilda's own form receiver) — set its
  URL as the `endpoint` and its recipient to info@bumblephoenix.ru;
* Tilda: replace the form's submit target with a Tilda form block wired to
  info@bumblephoenix.ru in Настройки → Формы.

Until that endpoint answers 2xx, the lead is logged to the console with the recipient
address; nothing is silently dropped and no mail is sent.

## External dependencies

`bumble.js` loads React 18.3.1 (`react.production.min.js` + `react-dom.production.min.js`)
from `unpkg.com` at runtime — two public CDN files, ~140 KB, HTTPS, with SRI hashes.
Nothing else is fetched from outside your host. If you must be fully self-hosted,
download those two files, put them next to `index.html`, and add before `bumble.js`:

```html
<script src="./react.production.min.js"></script>
<script src="./react-dom.production.min.js"></script>
```

The runtime skips the CDN when `window.React` / `window.ReactDOM` already exist.

No debug UI, no editor panels, no localhost references are present in this build.
