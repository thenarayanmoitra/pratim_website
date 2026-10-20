#!/usr/bin/env node
/* Tells search engines which URLs changed, through IndexNow.
   node scripts/indexnow.js                 every URL in sitemap.xml
   node scripts/indexnow.js /about/ /whatif/  only these paths
   Run it after a deploy. Bing, Yandex, Seznam, Naver and Yep share one endpoint. */
"use strict";
const fs = require("fs");
const path = require("path");
const site = require("../assets/data/site.js");
const key = site.indexNowKey;
if (!key) { console.error("Set indexNowKey in assets/data/site.js first."); process.exit(1); }
let urls = process.argv.slice(2).map((p) => (p.startsWith("http") ? p : site.url + p));
if (!urls.length) {
  const sm = fs.readFileSync(path.join(__dirname, "..", "sitemap.xml"), "utf8");
  urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
const body = { host: site.host, key, keyLocation: `${site.url}/${key}.txt`, urlList: urls.slice(0, 10000) };
fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body) })
  .then(async (r) => { console.log(`IndexNow answered ${r.status} for ${urls.length} URL(s).`); if (r.status >= 400) console.log(await r.text()); })
  .catch((e) => { console.error("IndexNow request failed", e.message); process.exit(1); });
