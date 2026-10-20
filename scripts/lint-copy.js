#!/usr/bin/env node
/* Scans the visible text of every generated page against the copy rules
   in section 8 of the brief, and prints every violation with its file.
   node scripts/lint-copy.js            every page
   node scripts/lint-copy.js index.html one page */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

const SKIP_TAGS = new Set(["script", "style", "svg", "title", "template", "head"]);
const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "button", "summary", "label", "legend", "dt", "th"]);
const PROPER = new Set("PATA ATTA WFTA GBTA DMC DMCs India Indian Instagram LinkedIn Facebook YouTube Google Meta Pratim Narayan Moitra WhatsApp US UK USD Europe European Bhutan Nepal Paro Taktsang Amity University World Food Travel Association Adventure Trade HubSpot Academy Asia Pacific If What Reel Reels Tourism Management BBA Marketing OTAs NDA Digital Systems Consultant Summit Kathmandu Delhi Old Everest Base Camp Japan Maldives Bali Haa Bumthang Phobjikha Namche Phakding Tiger's Nest Destination British Columbia Switzerland Hoxton Belmond VisitScotland Lonely Planet Zostel Lindblad National Geographic Flash Pack Cal.com Formspree Resend Netlify Director Senior Manager London New York Tuesdays August September June March Sunday Monday Himalayan Ladakh Sri Lanka Meghalaya Ella Nine Arch Bridge Dochula Exchange High Desert Western SDF MICE Social Full Varies CV Western Adventure.travel Privacy Compare Start Results Work Services About FAQ Home Hiring Open Close Back Yes No Some Sort Not Last Roughly Sometimes Fix Day Days Session Sessions Sample Episode Episodes Concept Before Remake Audit Free Monthly Something Else Email Paid Websites Website Search Summary Page Question Posts Captions Community Report Call Ads Website Support Takeover Full Marketing Early Register Who Carousel Carousels Photo Download Pastry Front Events Getting Venues Budget Dish Comment PLAN VALLEY BASECAMP Save Plan Add Follow Tag Applications Seats Mornings Quiet Days One Three Where Next Here's".split(/\s+/));

require("../assets/data/site.js").productName.split(/\s+/).forEach((w) => PROPER.add(w));
/* brand names, places and people from the What If episodes, and the partner names */
for (const ep of require("../assets/data/whatif.js")) {
  [ep.brandName, ep.region, ...(ep.names || [])].join(" ").split(/\s+/).forEach((w) => { if (w) PROPER.add(w.replace(/[^\p{L}\p{N}'.]/gu, "")); });
}
for (const p of (require("../assets/data/site.js").partners || [])) p.name.split(/\s+/).forEach((w) => PROPER.add(w));
for (const k of Object.keys(require("../assets/data/styles.js"))) require("../assets/data/styles.js")[k].name.split(/\s+/).forEach((w) => PROPER.add(w));
const FILLER = ["elevate", "unleash", "seamless", "revolutioni[sz]e", "next gen", "delve", "crucial", "pivotal", "showcase", "tapestry", "robust", "vibrant", "leverage", "landscape", "testament"];
const BANNED = [["not just", "negative parallelism"], ["in conclusion", "filler"], ["cheap", "price word"], ["affordable", "price word"], ["not expensive", "price word"]];

function decode(s) {
  return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&copy;/g, "©").replace(/&middot;/g, "·").replace(/&times;/g, "×").replace(/&nbsp;/g, " ").replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n));
}

/* a tiny tokenizer, enough for our own generated HTML */
function textNodes(html) {
  const out = [];
  const stack = [];
  const re = /<!--[\s\S]*?-->|<\/?([a-zA-Z][\w-]*)([^>]*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith("<!--")) continue;
    if (m[1]) {
      const tag = m[1].toLowerCase();
      if (m[0].startsWith("</")) { const i = stack.lastIndexOf(tag); if (i >= 0) stack.splice(i); continue; }
      if (/\/>$/.test(m[0]) || ["br", "img", "input", "meta", "link", "source", "hr", "path", "rect", "circle"].includes(tag)) continue;
      stack.push(tag);
      continue;
    }
    const text = decode(m[3]).replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (stack.some((t) => SKIP_TAGS.has(t))) continue;
    out.push({ text, path: stack.slice() });
  }
  return out;
}

function lintFile(rel) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const problems = [];
  for (const node of textNodes(html)) {
    const { text, path: p } = node;
    const inQuote = p.includes("blockquote");
    const where = p.slice(-2).join(">");
    const add = (rule) => problems.push({ file: rel, rule, where, text: text.length > 90 ? text.slice(0, 87) + "…" : text });
    if (inQuote) continue; /* quotes from other people keep their punctuation */
    if (/-/.test(text)) add("hyphen");
    if (/:/.test(text)) add("colon");
    if (/[—–]/.test(text)) add("dash");
    if (/;/.test(text)) add("semicolon");
    if (/\[PLACEHOLDER/.test(text) && !/whatif\/sample/.test(rel)) add("visible placeholder");
    for (const f of FILLER) if (new RegExp("\\b" + f + "\\b", "i").test(text)) add("filler word " + f);
    for (const [b, why] of BANNED) if (new RegExp("\\b" + b + "\\b", "i").test(text)) add(why + " " + b);
    const tag = p[p.length - 1];
    const headingish = p.some((t) => HEADING_TAGS.has(t)) || (tag === "a" && p.includes("nav"));
    if (headingish && text.length > 3) {
      const caps = [];
      for (const sentence of text.split(/(?<=[.!?])\s+/)) {
        const words = sentence.replace(/[“”"'’(),.!?]/g, " ").split(/\s+/).filter(Boolean);
        words.slice(1).forEach((w) => { if (/^[A-Z][a-z]+$/.test(w) && !PROPER.has(w) && !PROPER.has(w.replace(/s$/, ""))) caps.push(w); });
      }
      if (caps.length) add("title case? " + caps.join(" "));
    }
  }
  return problems;
}

const files = process.argv.slice(2).length ? process.argv.slice(2) : [];
if (!files.length) {
  const walk = (dir) => { for (const f of fs.readdirSync(dir)) { const full = path.join(dir, f); if (fs.statSync(full).isDirectory()) { if (!["node_modules", ".git", "src", "scripts", "assets", "netlify", "files"].includes(f)) walk(full); } else if (f.endsWith(".html")) files.push(path.relative(ROOT, full)); } };
  walk(ROOT);
}
let total = 0;
for (const f of files.sort()) {
  const probs = lintFile(f);
  total += probs.length;
  for (const p of probs) console.log(`${p.file}  [${p.rule}]  <${p.where}>  ${p.text}`);
}
console.log(total ? `\n${total} violation${total === 1 ? "" : "s"} in ${files.length} pages.` : `No violations in ${files.length} pages.`);
process.exit(total ? 1 : 0);
