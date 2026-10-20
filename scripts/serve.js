#!/usr/bin/env node
/* A tiny static server for previewing the site locally. No dependencies.
   node scripts/serve.js [port]      default 4455
   Folders serve their index.html, misses get 404.html, like Netlify. */
"use strict";
const http = require("http");
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const PORT = +(process.argv[2] || process.env.PORT || 4455);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".webmanifest": "application/manifest+json", ".pdf": "application/pdf" };
http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (/^\/(src|scripts|netlify|node_modules)\//.test(p) || /^\/(build\.js|netlify\.toml|README\.md)$/.test(p)) p = "/404.html";
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith("/")) { res.writeHead(301, { Location: p + "/" }); return res.end(); }
    file = path.join(file, "index.html");
  }
  let status = 200;
  if (!fs.existsSync(file)) { status = 404; file = path.join(ROOT, "404.html"); }
  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext] || "application/octet-stream";
  const text = /^(text\/|application\/(json|xml|manifest\+json|javascript))|image\/svg/.test(type);
  const enc = (req.headers["accept-encoding"] || "");
  if (text && /\bbr\b/.test(enc)) { res.writeHead(status, { "Content-Type": type, "Content-Encoding": "br", "Cache-Control": "no-cache", Vary: "Accept-Encoding" }); fs.createReadStream(file).pipe(zlib.createBrotliCompress()).pipe(res); return; }
  if (text && /\bgzip\b/.test(enc)) { res.writeHead(status, { "Content-Type": type, "Content-Encoding": "gzip", "Cache-Control": "no-cache", Vary: "Accept-Encoding" }); fs.createReadStream(file).pipe(zlib.createGzip()).pipe(res); return; }
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`Serving ${ROOT} at http://localhost:${PORT}`));
