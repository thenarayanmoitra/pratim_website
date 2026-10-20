#!/usr/bin/env node
/* Validates the structured data in every page, plus robots.txt and
   sitemap.xml, against what the pages actually say. */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const site = require("../assets/data/site.js");

const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { if (!["node_modules", ".git", "src", "scripts", "assets", "netlify", "files"].includes(f)) walk(full); }
    else if (f.endsWith(".html")) files.push(path.relative(ROOT, full));
  }
})(ROOT);

let errors = 0;
const err = (f, m) => { errors++; console.log(`  ${f}: ${m}`); };
const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const indexable = [], noindex = [];

for (const f of files.sort()) {
  const html = fs.readFileSync(path.join(ROOT, f), "utf8");
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== 1) err(f, `${blocks.length} JSON LD blocks, expected 1`);
  let data;
  try { data = JSON.parse(blocks[0]); } catch (e) { err(f, "JSON LD does not parse: " + e.message); continue; }
  if (data["@context"] !== "https://schema.org") err(f, "missing @context");
  const graph = data["@graph"] || [];
  const types = graph.map((n) => n["@type"]);
  for (const n of graph) {
    if (!n["@type"]) err(f, "node without @type");
    if (n["@type"] === "Person" && n["@id"] !== site.url + "/about/#person") err(f, "Person id differs: " + n["@id"]);
    if (n["@type"] === "Person" && n.name !== site.name) err(f, "Person name differs");
    if (n["@type"] === "FAQPage") {
      for (const q of n.mainEntity) {
        if (!html.includes(q.name.replace(/'/g, "&#39;").replace(/&/g, "&amp;")) && !html.includes(q.name)) err(f, "FAQ question not in visible text: " + q.name.slice(0, 50));
      }
    }
    if (n["@type"] === "Article") {
      for (const k of ["headline", "datePublished", "dateModified", "author", "image", "url"]) if (!n[k]) err(f, "Article missing " + k);
      if (n.author && n.author["@id"] !== site.url + "/about/#person") err(f, "Article author is not the Person");
      if (n.headline && !strip(html).includes(n.headline)) err(f, "Article headline not in visible text");
    }
    if (n["@type"] === "BreadcrumbList") {
      n.itemListElement.forEach((it, i) => { if (it.position !== i + 1) err(f, "breadcrumb position out of order"); if (!it.name || !it.item) err(f, "breadcrumb item missing name or url"); });
    }
    if (n["@type"] === "ProfilePage" && (!n.mainEntity || n.mainEntity["@type"] !== "Person")) err(f, "ProfilePage without Person mainEntity");
  }
  if (!graph.some((n) => n["@type"] === "Person" || (n["@type"] === "ProfilePage"))) err(f, "no Person reference");
  const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (!canonical) err(f, "no canonical");
  else if (!/\/$|\.html$/.test(canonical)) err(f, "canonical is not a trailing slash URL: " + canonical);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
  if (!title.includes(site.name)) err(f, "title does not carry the name: " + title);
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) err(f, "no meta description");
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) err(f, `${h1s} h1 elements`);
  if (!/<meta property="og:image"/.test(html)) err(f, "no og:image");
  if (!/<meta name="twitter:card"/.test(html)) err(f, "no twitter card");
  if (!/<a class="skip"/.test(html)) err(f, "no skip link");
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(img[0])) err(f, "img without alt: " + img[0].slice(0, 60));
    if (!/\bwidth=/.test(img[0]) || !/\bheight=/.test(img[0])) err(f, "img without width and height: " + img[0].slice(0, 60));
  }
  if (/<meta name="robots" content="noindex/.test(html)) noindex.push(canonical); else indexable.push(canonical);
}

/* sitemap */
const sm = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!/^<\?xml version="1.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"( xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1")?>/.test(sm)) err("sitemap.xml", "unexpected header");
for (const m of sm.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)) { const rel = m[1].replace(site.url, ""); if (!fs.existsSync(path.join(ROOT, rel))) err("sitemap.xml", "image missing on disk: " + rel); }
if (!fs.existsSync(path.join(ROOT, "whatif/feed.xml"))) err("whatif/feed.xml", "missing"); else if (!/^<\?xml version="1.0" encoding="UTF-8"\?>\s*<rss version="2.0"/.test(fs.readFileSync(path.join(ROOT, "whatif/feed.xml"), "utf8"))) err("whatif/feed.xml", "unexpected header");
for (const f of ["llms.txt", "llms-full.txt"]) if (!fs.existsSync(path.join(ROOT, f))) err(f, "missing");
for (const u of indexable) if (!locs.includes(u)) err("sitemap.xml", "indexable page missing: " + u);
for (const u of noindex) if (locs.includes(u)) err("sitemap.xml", "noindex page present: " + u);
for (const m of sm.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) if (!/^\d{4}-\d{2}-\d{2}$/.test(m[1])) err("sitemap.xml", "bad lastmod " + m[1]);

/* robots */
const rb = fs.readFileSync(path.join(ROOT, "robots.txt"), "utf8");
const lines = rb.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
let group = null, groups = 0;
for (const l of lines) {
  const m = l.match(/^([A-Za-z-]+):\s*(.*)$/);
  if (!m) { err("robots.txt", "unparseable line: " + l); continue; }
  const k = m[1].toLowerCase();
  if (k === "user-agent") { group = m[2]; groups++; }
  else if (k === "allow" || k === "disallow") { if (!group) err("robots.txt", "rule before any user agent: " + l); if (k === "disallow" && m[2] && m[2] !== "/404.html") err("robots.txt", "blocks more than the 404 page: " + l); }
  else if (k === "sitemap") { if (m[2] !== site.url + "/sitemap.xml") err("robots.txt", "sitemap url differs"); }
  else err("robots.txt", "unknown directive " + k);
}
for (const ua of ["Googlebot", "Bingbot", "Applebot", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended"]) if (!rb.includes("User-agent: " + ua)) err("robots.txt", "missing " + ua);

console.log(`${files.length} pages, ${indexable.length} indexable, ${noindex.length} noindex, ${locs.length} sitemap URLs, ${groups} robots groups.`);
console.log(errors ? `${errors} problem(s).` : "Structured data, sitemap and robots.txt are consistent.");
process.exit(errors ? 1 : 0);
