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

## Локальный запуск

Сайт **обязательно открывать по http**, а не двойным кликом по `index.html`:
секции подгружаются страницей во время работы, и браузер блокирует это на `file://`.
Картинки при этом не «теряются» — все пути относительные; без сервера просто не
соберётся сама страница.

* **macOS** — двойной клик по `start-local.command`
* **Windows** — двойной клик по `start-local.bat`
* **VS Code / Cursor** — расширение **Live Server** → правый клик по `index.html` →
  *Open with Live Server*
* **Любая консоль** — `npx serve .` или `python3 -m http.server 5173`

Затем открыть `http://localhost:5173/index.html`.

## Изменения этой сборки (мобильная версия)

1. **«ТВОЙ РИТМ. / ТВОЙ BUMBLE.»** — ровно две строки на телефоне. Строки заданы
   `white-space: nowrap`, кегль измеряется и подгоняется под колонку (97 % ширины),
   поэтому третья строка не появляется ни на 375, ни на 390/393/430 px.
   Пересчёт — при resize и после загрузки шрифтов.
2. **Шапка** — фирменный знак всегда целиком: феникс + надпись BLACK PHOENIX.
   Логотип — один неразрывный flex-блок (`flex:0 0 auto`), масштабируется
   (феникс `clamp(26–34px)`, надпись `clamp(82–132px)`); шапка `position:fixed`,
   бургер справа, скролл-анимации её не трогают.
3. **Банка больше не дрожит.** Все трансформации банки идут через единственную
   функцию `canPaint()`. Кадры от скролла пишутся без CSS-перехода (прежний
   `.78s` ease, догонявший цель каждый кадр, и давал тряску); плавность включается
   только на дискретных событиях — выбор режима, отпускание банки после drag.
   Используются `translate3d`, `will-change: transform`, `backface-visibility: hidden`
   и субпиксельное чтение скролла.

## Contents

```
tilda-build/
  index.html                  ← ГЛАВНАЯ СТРАНИЦА (весь сайт: hero → футер)
  bumble.js                   ← рантайм рендеринга (обязателен, грузится из index.html)
  Bumble Flavor Keys.html     ← секция 01–02  hero / линейка вкусов
  Bumble Inside.html          ← секция 03     что внутри
  Bumble Robusta.html         ← секция 04     robusta parallax
  Bumble Rhythm.html          ← секция 05     work / study / drive / gym
  Bumble Buy.html             ← секция 06     где купить
  Bumble Partners.html        ← секция 07     партнёрам
  assets/                     ← ВСЕ изображения, шрифты и SVG (28 файлов, 1.8 МБ)
    cans/       6 банок (webp, 620×1695) — orange, cherry, lime, berry, mango, cola
    scenes/     4 сцены ритма (webp) — work, study, drive, gym
    robusta/    7 слоёв параллакса + крышки (webp)
    fonts/      8 Unbounded woff2 (latin + cyrillic, 400/600/700/800)
    phoenix.svg, black-phoenix-wordmark.svg, bumble-script.svg
  api/                        ← не используется, см. api/README.md
  tilda-embed.html            ← код для блока T123 «HTML-код» в Tilda
  start-local.command         ← локальный запуск, macOS (двойной клик)
  start-local.bat             ← локальный запуск, Windows (двойной клик)
  README.md
```

There is no `bumble.css` and no `/video`: the site carries all styling inline
(that is how the animations and hover states are authored) and uses no video assets.
All images live in `assets/` — that folder is the `/images` equivalent.

## How to deploy

1. Upload the **entire `tilda-build` folder** to any static host over **HTTPS**
   (Netlify, Vercel, Cloudflare Pages, timeweb, nginx, S3+CloudFront…).
   Keep the folder structure exactly as-is — `index.html`, `bumble.js` and the six
   `Bumble ….html` section files must stay side by side in the same directory, and
   `assets/` must stay directly beneath them. All paths are relative, so the build
   works from a domain root or from any subfolder.
2. Open `https://your-host/…/index.html` and check the scroll once. That is the
   finished site: scroll morph, parallax, drag on the can, hover states, mobile layout.
3. In Tilda, add a **T123 “HTML‑код”** block and paste the contents of
   `tilda-embed.html`, replacing the placeholder URL with your hosted `index.html`.

### Important
* Папка `api/` оставлена, но сайтом не используется: форма «ПАРТНЁРАМ» передаёт
  заявку родительской странице Tilda через `postMessage` (см. ниже и `api/README.md`).
* Must be served over **http(s)**, not opened as a `file://` document — the sections
  are loaded at runtime by the page and browsers block that on `file://`.
* The server must send `.woff2` and `.png` with normal static MIME types (default
  everywhere) and allow the six `Bumble ….html` files to be served as `text/html`.
* Serve the whole build from **one origin** (no cross-domain split), otherwise the
  section fetches need CORS headers.

## Contact + partners form

The single public address is **info@bumblephoenix.ru** — used by the burger-menu
contacts, the footer contacts and every `mailto:` link in `index.html`.

The «ПАРТНЁРАМ» form does its own validation, then hands the lead to the PARENT
Tilda page over `postMessage` — there is no backend, no serverless function and no
mail provider in this build. Mail is sent by the native Tilda form on
https://bumblephoenix.ru, which is wired to info@bumblephoenix.ru.

Bridge contract (origin is the `parentOrigin` prop, default `https://bumblephoenix.ru`):

* iframe → parent: `{ type: 'BUMBLE_PARTNERS_SUBMIT', data: { name, phone, email, subject } }`
* parent → iframe: `{ type: 'BUMBLE_PARTNERS_RESULT', ok: true | false, error? }`

The success screen («СПАСИБО. СВЯЖЕМСЯ С ВАМИ.» + «ЗАЯВКА ПРИНЯТА») appears ONLY on
`ok: true` from that exact origin. Anything else — `ok: false`, a wrong origin, a
missing parent, or 20 s of silence — restores the button and shows
«НЕ УДАЛОСЬ ОТПРАВИТЬ. ПОПРОБУЙТЕ ЕЩЁ РАЗ.» with every entered value kept.

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
