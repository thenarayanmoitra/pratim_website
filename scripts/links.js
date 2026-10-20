#!/usr/bin/env node
/* Checks every internal link and anchor in the generated pages resolves to a file or an id.
   node scripts/links.js */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const files = [];
(function walk(dir) { for (const f of fs.readdirSync(dir)) { const full = path.join(dir, f); if (fs.statSync(full).isDirectory()) { if (!["node_modules", ".git", "src", "scripts", "netlify", "files", "assets"].includes(f)) walk(full); } else if (f.endsWith(".html")) files.push(full); } })(ROOT);
const ids = new Map();
const pages = new Map();
for (const f of files) {
  const html = fs.readFileSync(f, "utf8");
  const rel = "/" + path.relative(ROOT, f).split(path.sep).join("/");
  pages.set(rel, html);
  ids.set(rel, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}
let bad = 0, checked = 0;
for (const [rel, html] of pages) {
  const dir = path.posix.dirname(rel);
  for (const m of html.matchAll(/\s(?:href|src|srcset|imagesrcset|action)="([^"]+)"/g)) {
    for (const url of m[1].split(",").map((s) => s.trim().split(" ")[0])) {
      if (!url || /^(https?:|mailto:|tel:|data:)/.test(url)) continue;
      checked++;
      const i = url.indexOf("#");
      let p = i >= 0 ? url.slice(0, i) : url;
      const hash = i >= 0 ? url.slice(i + 1) : "";
      if (p.includes("?")) p = p.split("?")[0];
      let target = p ? path.posix.resolve(dir, p) : rel;
      if (target.endsWith("/")) target += "index.html";
      else if (fs.existsSync(path.join(ROOT, target)) && fs.statSync(path.join(ROOT, target)).isDirectory()) target += "/index.html";
      if (p) {
        const fsPath = path.join(ROOT, target);
        if (!fs.existsSync(fsPath) || !fs.statSync(fsPath).isFile()) { bad++; console.log(`${rel}: missing ${url}`); continue; }
      }
      if (hash) {
        const set = ids.get(target);
        if (set && !set.has(hash)) { bad++; console.log(`${rel}: anchor #${hash} not found in ${target}`); }
      }
    }
  }
}
console.log(`${checked} references checked, ${bad} broken.`);
process.exit(bad ? 1 : 0);
