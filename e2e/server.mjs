// Serves e2e/.dist the way GitHub Pages does: /a → a.html, /a/ → a/index.html, otherwise
// 404.html with a 404 status.
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'

const root = path.join(import.meta.dirname, '.dist')
const port = Number(process.env.PORT ?? 4317)
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
}
const file = (p) => (existsSync(p) && statSync(p).isFile() ? p : null)

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
  const base = path.join(root, url)
  if (!base.startsWith(root)) {
    res.writeHead(400).end()
    return
  }
  const hit = file(base) ?? file(`${base}.html`) ?? file(path.join(base, 'index.html'))
  if (!hit) {
    res.writeHead(404, { 'content-type': types['.html'] })
    res.end(readFileSync(path.join(root, '404.html')))
    return
  }
  res.writeHead(200, { 'content-type': types[path.extname(hit)] ?? 'application/octet-stream' })
  res.end(readFileSync(hit))
}).listen(port, () => console.log(`Serving e2e/.dist on http://localhost:${String(port)}`))
