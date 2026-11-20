// Serves e2e/.dist the way GitHub Pages does: /a → a.html, /a/ → a/index.html, otherwise
// 404.html with a 404 status. Text is gzipped like Pages does, so Lighthouse and the script
// budget measure what visitors download.
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

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
const compressible = new Set(['.html', '.js', '.mjs', '.css', '.json', '.xml', '.txt', '.svg'])
const file = (p) => (existsSync(p) && statSync(p).isFile() ? p : null)

function send(req, res, status, filePath) {
  const ext = path.extname(filePath)
  const headers = { 'content-type': types[ext] ?? 'application/octet-stream' }
  let body = readFileSync(filePath)
  if (compressible.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body)
    headers['content-encoding'] = 'gzip'
    headers.vary = 'Accept-Encoding'
  }
  res.writeHead(status, headers).end(body)
}

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
  const base = path.join(root, url)
  if (!base.startsWith(root)) {
    res.writeHead(400).end()
    return
  }
  const hit = file(base) ?? file(`${base}.html`) ?? file(path.join(base, 'index.html'))
  if (hit) send(req, res, 200, hit)
  else send(req, res, 404, path.join(root, '404.html'))
}).listen(port, () => console.log(`Serving e2e/.dist on http://localhost:${String(port)}`))
