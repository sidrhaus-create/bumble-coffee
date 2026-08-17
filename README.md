# Bumble Coffee — production build (tilda-build)

Production copy of **Bumble Full Website**, unchanged visually. Nothing was redesigned:
the master page and all six section files are byte-identical to the design source except
for two lines in `index.html` (runtime script renamed to `bumble.js`, `<title>` + `lang="ru"` added).

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
    cans/        6 can renders (png)
    scenes/      4 rhythm scenes (png)
    robusta/     7 parallax layers + lids (png)
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
