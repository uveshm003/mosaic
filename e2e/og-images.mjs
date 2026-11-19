// Renders apps/site's social preview images (public/og/<profile>.png), its Apple touch
// icon and favicon.ico from HTML templates, with each profile's fonts and theme tokens.
// Rerun after changing a profile's tagline, colours or fonts:
//
//   pnpm --filter @mosaic/e2e og:images
//
// Uses Playwright's Chromium, or the installed Chrome when Chromium isn't downloaded.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const repo = join(dirname(fileURLToPath(import.meta.url)), '..')
const site = join(repo, 'apps/site')
const HOST = 'uveshm003.github.io'
const NAME = 'Uvesh Menpurwala'
// The "M" from apps/site/src/app/icon.svg (64 × 64 viewBox).
const MARK = 'M14 46V18h7l11 15 11-15h7v28h-7V30L32 44 21 30v16z'

// Fonts mirror each route group's layout; taglines are the profiles' published taglines.
const profiles = [
  {
    key: 'root',
    kicker: 'Portfolio',
    tagline: 'Apps for phones, desktops, delivery robots and gas-detection instruments.',
    display: 'Bricolage Grotesque',
    body: 'Inter',
    mono: 'JetBrains Mono',
    chips: ['Flutter', 'Product', 'Freelance', 'Full-stack'],
  },
  {
    key: 'flutter',
    kicker: 'Flutter',
    tagline:
      'Flutter across Android, iOS, Windows and macOS, with native Android and BLE hardware.',
    display: 'Bricolage Grotesque',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },
  {
    key: 'product',
    kicker: 'Product',
    tagline: 'Taking products from proof of concept to release.',
    display: 'Newsreader',
    body: 'Figtree',
    mono: 'IBM Plex Mono',
  },
  {
    key: 'freelance',
    kicker: 'Freelance',
    tagline: 'Mobile apps, web apps and backends, built end to end.',
    display: 'DM Sans',
    body: 'DM Sans',
    mono: 'DM Mono',
  },
  {
    key: 'fullstack',
    kicker: 'Full-stack',
    tagline: 'Backends, APIs and the apps on top of them.',
    display: 'Geist',
    body: 'Geist',
    mono: 'Geist Mono',
  },
]

// The light (default) values from packages/tokens/css/<theme>.css.
function tokens(theme) {
  const css = readFileSync(join(repo, `packages/tokens/css/${theme}.css`), 'utf8')
  const pick = (name) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim()
  return {
    bg: pick('bg'),
    fg: pick('fg'),
    muted: pick('muted'),
    accent: pick('accent'),
    accent2: pick('accent-2') ?? pick('accent'),
  }
}

const escape = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// Keeps hyphenated words such as "gas-detection" on one line.
const noBreak = (s) => escape(s).replace(/(\S+-\S+)/g, '<span class="nw">$1</span>')

// Dark themes get the icon's own dark tile with a hairline; light themes a tile in the text colour.
function isDark(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b < 128
}

function fontsLink(...families) {
  const unique = [...new Set(families)]
  const query = unique.map((f) => `family=${f.replaceAll(' ', '+')}:wght@400;500;600;700`).join('&')
  return `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${query}&display=block">`
}

function card(p) {
  const t = tokens(p.key)
  const url = p.key === 'root' ? HOST : `${HOST}/${p.key}`
  const tile = isDark(t.bg)
    ? `background: ${tokens('root').bg}; border: 2px solid ${t.muted}55;`
    : `background: ${t.fg};`
  const chips = (p.chips ?? []).map((c) => `<span class="chip">${escape(c)}</span>`).join('')
  return `<!doctype html><html><head><meta charset="utf-8">
${fontsLink(p.display, p.body, p.mono)}
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: ${t.bg}; color: ${t.fg};
    font-family: '${p.body}', sans-serif; position: relative; overflow: hidden; }
  .wrap { position: absolute; inset: 72px 80px 88px; display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; gap: 20px; }
  .mark { width: 56px; height: 56px; border-radius: 14px; ${tile} display: grid; place-items: center; }
  .nw { white-space: nowrap; }
  .url { font-family: '${p.mono}', monospace; font-size: 24px; color: ${t.muted}; }
  .main { margin-top: auto; }
  .kicker { font-family: '${p.mono}', monospace; font-size: 26px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${t.accent}; }
  h1 { font-family: '${p.display}', sans-serif; font-weight: 700; font-size: 104px; line-height: 1;
    letter-spacing: -0.02em; margin-top: 18px; }
  p { font-size: 34px; line-height: 1.35; color: ${t.muted}; margin-top: 26px; max-width: 960px; }
  .chips { display: flex; gap: 14px; margin-top: 30px; }
  .chip { font-family: '${p.mono}', monospace; font-size: 22px; padding: 10px 18px; border-radius: 999px;
    border: 2px solid ${t.accent}; color: ${t.fg}; }
  .bar { position: absolute; left: 0; right: 0; bottom: 0; height: 14px; display: flex; }
  .bar i { flex: 3; background: ${t.accent}; } .bar i + i { flex: 1; background: ${t.accent2}; }
</style></head><body>
<div class="wrap">
  <div class="top">
    <div class="mark"><svg width="40" height="40" viewBox="10 14 44 36"><path d="${MARK}" fill="${t.accent}"/></svg></div>
    <span class="url">${url}</span>
  </div>
  <div class="main">
    <div class="kicker">${escape(p.kicker)}</div>
    <h1>${NAME}</h1>
    <p>${noBreak(p.tagline)}</p>
    ${chips ? `<div class="chips">${chips}</div>` : ''}
  </div>
</div>
<div class="bar"><i></i><i></i></div>
</body></html>`
}

function icon(size, fullBleed) {
  const t = tokens('root')
  const radius = fullBleed ? 0 : size * 0.22
  return `<!doctype html><html><body style="margin:0;background:transparent">
<svg style="display:block" width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="${(radius / size) * 64}" fill="${t.bg}"/>
  <path d="${MARK}" fill="${t.accent}"/>
</svg></body></html>`
}

// favicon.ico holding one 32 × 32 PNG (supported by every current browser).
function ico(png) {
  const header = Buffer.alloc(22)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(1, 4)
  header.writeUInt8(32, 6)
  header.writeUInt8(32, 7)
  header.writeUInt16LE(1, 10)
  header.writeUInt16LE(32, 12)
  header.writeUInt32LE(png.length, 14)
  header.writeUInt32LE(22, 18)
  return Buffer.concat([header, png])
}

async function launch() {
  try {
    return await chromium.launch()
  } catch {
    return chromium.launch({ channel: 'chrome' })
  }
}

const browser = await launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
mkdirSync(join(site, 'public/og'), { recursive: true })
for (const p of profiles) {
  await page.setContent(card(p), { waitUntil: 'networkidle' })
  // Runs in the page; a string keeps Node's lint rules out of it.
  await page.evaluate('document.fonts.ready.then(() => true)')
  const out = join(site, `public/og/${p.key}.png`)
  await page.screenshot({ path: out })
  console.log(`wrote ${out}`)
}

// Icons get their own pages: resizing the card page leaves the old layout behind.
async function renderIcon(size, fullBleed, transparent) {
  const iconPage = await browser.newPage({ viewport: { width: size, height: size } })
  await iconPage.setContent(icon(size, fullBleed))
  const png = await iconPage.screenshot({
    omitBackground: transparent,
    clip: { x: 0, y: 0, width: size, height: size },
  })
  await iconPage.close()
  return png
}

writeFileSync(join(site, 'src/app/apple-icon.png'), await renderIcon(180, true, false))
writeFileSync(join(site, 'src/app/favicon.ico'), ico(await renderIcon(32, false, true)))
console.log('wrote apple-icon.png and favicon.ico')
await browser.close()
