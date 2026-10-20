#!/usr/bin/env node
/* ============================================================
   build.js, the only build step. No dependencies.

   node build.js              builds every page, the SVGs, the sitemap,
                              robots.txt, llms.txt and the IndexNow key,
                              then exports images through Chrome when
                              any generated SVG is newer than its exports
   node build.js --no-images  skips the image export
   node build.js --images     forces the image export

   Pages are assembled from src/pages/*.js, the partials in
   src/partials and the data in assets/data. The generated HTML is
   committed, so Netlify serves plain files with no build settings.
   ============================================================ */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const ROOT = __dirname;
const site = require("./assets/data/site.js");
const episodes = require("./assets/data/whatif.js");
const layout = require("./src/partials/layout.js");
const svg = require("./src/svg/whatif.js");
const { contourSvg } = require("./src/svg/contour.js");
const { hashString } = require("./src/lib.js");

const args = process.argv.slice(2);
const NO_IMAGES = args.includes("--no-images");
const FORCE_IMAGES = args.includes("--images");

let written = 0, unchanged = 0;
function write(rel, content) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) { unchanged++; return false; }
  fs.writeFileSync(file, content);
  written++;
  return true;
}

/* 1. the contour motif used as a CSS background */
write("assets/img/contour.svg", contourSvg({ w: 1200, h: 1500, seed: 7, color: "#F1F4EC", opacity: 0.12 }));

/* 2. the What If artwork, as SVG, from the data. Every episode has the
   brand's own post at src/whatif-src/<slug>.jpg, referenced by file URL
   while Chrome renders, never served. */
function jpegDims(file) {
  const b = fs.readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}
function pngDims(file) {
  const b = fs.readFileSync(file);
  return b.length > 24 && b.toString("ascii", 1, 4) === "PNG" ? { w: b.readUInt32BE(16), h: b.readUInt32BE(20) } : null;
}
const svgJobs = [];
for (const ep of episodes) {
  const dir = `assets/whatif/${ep.slug}`;
  const seed = hashString(ep.slug);
  const src = path.join(ROOT, "src/whatif-src", ep.slug + ".jpg");
  if (!fs.existsSync(src)) throw new Error(`Episode ${ep.slug} needs its post image at src/whatif-src/${ep.slug}.jpg`);
  const href = "file://" + src;
  const dims = jpegDims(src) || { w: 1080, h: 1350 };
  const ratio = dims.h / dims.w;
  ep.brand.dims = dims;
  /* a single image remake is a finished PNG beside the post. It is exported
     as it is, and the cover and the Open Graph image are drawn around it. */
  let remakeHref = "";
  const remakeSrc = path.join(ROOT, "src/whatif-src", ep.slug + "-remake.png");
  if (ep.single) {
    if (!fs.existsSync(remakeSrc)) throw new Error(`Episode ${ep.slug} needs its remake at src/whatif-src/${ep.slug}-remake.png`);
    remakeHref = "file://" + remakeSrc;
    ep.remake.dims = pngDims(remakeSrc) || { w: 1080, h: 1350 };
    svgJobs.push({ svg: path.relative(ROOT, remakeSrc), html: `<img src="${remakeHref}" width="1080" height="1350" style="display:block;width:100vw;height:100vh;object-fit:cover">`, outputs: [
      { file: `${dir}/remake-1080.webp`, w: 1080, h: 1350, format: "webp", quality: 86 },
      { file: `${dir}/remake-560.webp`, w: 560, h: 700, format: "webp", quality: 84 },
      { file: `${dir}/remake-560.jpg`, w: 560, h: 700, format: "jpeg", quality: 84 },
      { file: `${dir}/remake-1080.jpg`, w: 1080, h: 1350, format: "jpeg", quality: 88 }
    ] });
    /* stale slide exports from an earlier six slide version of the episode */
    if (fs.existsSync(path.join(ROOT, dir))) for (const f of fs.readdirSync(path.join(ROOT, dir))) if (/^slide-/.test(f)) fs.unlinkSync(path.join(ROOT, dir, f));
  }
  const deps = remakeHref ? [src, remakeSrc] : [src];
  const add = (name, content, outputs) => { write(`${dir}/${name}`, content); svgJobs.push({ svg: `${dir}/${name}`, deps, outputs: outputs.map((o) => Object.assign({}, o, { file: `${dir}/${o.file}` })) }); };
  add("cover.svg", svg.cover(ep, seed, href, remakeHref), [
    { file: "cover-1080.webp", w: 1080, h: 1350, format: "webp", quality: 82 },
    { file: "cover-560.webp", w: 560, h: 700, format: "webp", quality: 82 },
    { file: "cover-560.jpg", w: 560, h: 700, format: "jpeg", quality: 82 },
    { file: "cover-1080.jpg", w: 1080, h: 1350, format: "jpeg", quality: 86 }
  ]);
  add("og.svg", svg.og(ep, seed, href, remakeHref), [{ file: "og.jpg", w: 1200, h: 630, format: "jpeg", quality: 86 }]);
  add("before.svg", svg.before(ep, href, ratio), [
    { file: "before-1080.webp", w: 1080, h: 1350, format: "webp", quality: 84 },
    { file: "before-560.webp", w: 560, h: 700, format: "webp", quality: 84 },
    { file: "before-560.jpg", w: 560, h: 700, format: "jpeg", quality: 84 }
  ]);
  if (ep.single) continue;
  ep.remakeSlides.forEach((s, i) => {
    const n = i + 1;
    const outs = [
      { file: `slide-${n}-1080.webp`, w: 1080, h: 1350, format: "webp", quality: 82 },
      { file: `slide-${n}-560.webp`, w: 560, h: 700, format: "webp", quality: 82 }
    ];
    if (n === 1) outs.push({ file: "slide-1-560.jpg", w: 560, h: 700, format: "jpeg", quality: 82 });
    add(`slide-${n}.svg`, svg.slide(ep, i, ep.remakeSlides.length, seed, href), outs);
  });
}

/* 2a. the fonts embedded in one stylesheet. Chrome refuses to load font files
   from a folder opened as file://, so pages opened straight from disk load
   this instead. It is never requested on a web server. */
const FONTS = [
  ["Space Grotesk", "spacegrotesk-var.woff2", "300 700", "normal"],
  ["Manrope", "manrope-var.woff2", "200 800", "normal"],
  ["Space Mono", "spacemono-400.woff2", "400", "normal"],
  ["Fraunces", "fraunces-500-italic.woff2", "500", "italic"]
];
write("assets/fonts/inline.css", "/* generated by build.js, the fonts as data URIs for pages opened from a folder */\n" + FONTS.map(([fam, file, weight, style]) =>
  `@font-face{font-family:'${fam}';src:url(data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, "assets/fonts", file)).toString("base64")}) format('woff2');font-weight:${weight};font-style:${style};font-display:swap}`).join("\n") + "\n");

/* 2b. the portraits as WebP, from the JPEGs at their own size */
for (const name of ["pratim-720x900", "pratim-1200x1500", "pratim-profile-720x900", "pratim-profile-1200x1500"]) {
  const jpg = `assets/img/${name}.jpg`;
  const [w, h] = name.split("x").map((p) => +p.replace(/\D/g, "")).slice(-2);
  const dims = name.endsWith("720x900") ? [720, 900] : [1200, 1500];
  svgJobs.push({ svg: jpg, html: `<img src="file://${path.join(ROOT, jpg)}" width="${dims[0]}" height="${dims[1]}" style="display:block">`, outputs: [{ file: `assets/img/${name}.webp`, w: dims[0], h: dims[1], format: "webp", quality: 84 }] });
}

/* 2c. the logos as WebP, drawn from the existing PNGs at their own size */
for (const name of ["pata", "atta", "gbta", "wfta", "adventure-travel"]) {
  const png = `assets/logos/${name}.png`;
  const dims = { pata: [190, 96], atta: [417, 96], gbta: [420, 67], wfta: [373, 96], "adventure-travel": [96, 96] }[name];
  svgJobs.push({ svg: png, html: `<img src="file://${path.join(ROOT, png)}" width="${dims[0]}" height="${dims[1]}" style="display:block">`, transparent: true, outputs: [{ file: `assets/logos/${name}.webp`, w: dims[0], h: dims[1], format: "webp", quality: 90 }] });
}

/* 3. a cache busting version from the stylesheet and the script */
const css = fs.readFileSync(path.join(ROOT, "assets/styles.css"), "utf8");
const js = fs.readFileSync(path.join(ROOT, "assets/main.js"), "utf8");
const version = crypto.createHash("md5").update(css + js).digest("hex").slice(0, 8);

/* every internal URL is written relative to the page, so the site works when
   index.html is opened straight from the folder, from a subfolder on any host,
   and on Netlify. Folder links carry index.html, which netlify.toml redirects
   back to the clean folder URL. The 404 page keeps root paths because Netlify
   serves it at any address. */
function relativise(html, file) {
  if (file === "404.html") return html;
  const dir = path.posix.dirname(file.replace(/\\/g, "/"));
  const depth = dir === "." ? 0 : dir.split("/").length;
  const prefix = "../".repeat(depth);
  const selfDir = dir === "." ? "" : dir + "/";
  const conv = (u) => {
    if (!/^\/(?!\/)/.test(u)) return u;
    const i = u.indexOf("#");
    const p = i >= 0 ? u.slice(0, i) : u;
    const h = i >= 0 ? u.slice(i) : "";
    const rel = p.slice(1);
    if (rel === "" || rel.endsWith("/")) {
      if (rel === selfDir) return h || "index.html";
      return prefix + rel + "index.html" + h;
    }
    return prefix + rel + h;
  };
  return html.replace(/\s(href|src|srcset|imagesrcset|data-fonts)="([^"]*)"/g, (m, attr, val) => {
    if (attr === "srcset" || attr === "imagesrcset") {
      return ` ${attr}="${val.split(",").map((part) => { const t = part.trim().split(/\s+/); t[0] = conv(t[0]); return t.join(" "); }).join(", ")}"`;
    }
    return ` ${attr}="${conv(val)}"`;
  });
}

/* 4. every page */
/* episode pages that are no longer published come out of the output.
   Their artwork in assets/whatif/ stays, so publishing one again is quick. */
for (const d of fs.readdirSync(path.join(ROOT, "whatif"), { withFileTypes: true })) {
  if (!d.isDirectory() || episodes.some((e) => e.slug === d.name)) continue;
  const page = path.join(ROOT, "whatif", d.name, "index.html");
  if (fs.existsSync(page)) { fs.rmSync(path.join(ROOT, "whatif", d.name), { recursive: true }); }
}

const modules = ["home", "offers", "whatif", "services", "clients", "misc"];
const pages = modules.flatMap((m) => require(`./src/pages/${m}.js`)());
const seen = new Set();
for (const p of pages) {
  if (!p.path || !p.file || !p.title || !p.description) throw new Error(`Page is missing path, file, title or description: ${JSON.stringify(p.path)}`);
  if (seen.has(p.path)) throw new Error(`Duplicate page path ${p.path}`);
  seen.add(p.path);
  if (p.title.length > 70) console.warn(`  title over 70 characters on ${p.path}`);
  if (p.description.length > 165) console.warn(`  description over 165 characters on ${p.path} (${p.description.length})`);
  write(p.file, relativise(layout.render(p, version), p.file));
}

/* 5. sitemap.xml, indexable pages only, with the images Google should know about */
const xml = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const indexable = pages.filter((p) => !p.noindex && !p.skipSitemap);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
  indexable.map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${p.lastmod || site.lastUpdated}</lastmod>${(p.images || []).map((im) => `<image:image><image:loc>${site.url}${im.src}</image:loc><image:title>${xml(im.title)}</image:title></image:image>`).join("")}</url>`).join("\n") +
  `\n</urlset>\n`;
write("sitemap.xml", sitemap);

/* 5a. an RSS feed of the What If series, so readers, Slack, LinkedIn tools
   and assistants can follow new episodes */
const rssDate = (iso) => new Date(iso + "T09:00:00Z").toUTCString();
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>The What If series by Pratim Narayan Moitra</title>
<link>${site.url}/whatif/</link>
<atom:link href="${site.url}/whatif/feed.xml" rel="self" type="application/rss+xml"/>
<description>Real tourism posts that got almost no reaction, rebuilt in a tested style and shown as a before and after.</description>
<language>en-gb</language>
<lastBuildDate>${rssDate(episodes[0].publishDate > site.lastUpdated ? episodes[0].publishDate : site.lastUpdated)}</lastBuildDate>
<image><url>${site.url}${site.ogImage}</url><title>The What If series by Pratim Narayan Moitra</title><link>${site.url}/whatif/</link></image>
${episodes.map((e) => `<item>
<title>${xml(e.coverLine)}</title>
<link>${site.url}/whatif/${e.slug}/</link>
<guid isPermaLink="true">${site.url}/whatif/${e.slug}/</guid>
<pubDate>${rssDate(e.publishDate)}</pubDate>
<description>${xml(`${e.storyTitle}. ${e.brandName}'s post got ${e.brand.engagement} on ${e.brand.followers} followers. ${e.single ? e.remake.changed.map((c) => c.name + ". " + c.text).join(" ") : e.bigIdea}`)}</description>
<media:content url="${site.url}/assets/whatif/${e.slug}/og.jpg" type="image/jpeg" medium="image"/>
<category>${xml(e.clientType)}</category>
</item>`).join("\n")}
</channel>
</rss>
`;
write("whatif/feed.xml", rss);

/* 6. robots.txt, every crawler allowed everywhere except the 404 page */
const bots = [
  ["Googlebot", "Google Search"], ["Googlebot-Image", "Google Images"], ["Google-Extended", "Google, Gemini training and grounding"],
  ["Bingbot", "Bing"], ["Applebot", "Apple, Siri and Spotlight"], ["Applebot-Extended", "Apple, foundation model training"],
  ["GPTBot", "OpenAI, model training"], ["OAI-SearchBot", "OpenAI, ChatGPT search"], ["ChatGPT-User", "OpenAI, user requests"],
  ["ClaudeBot", "Anthropic, model training"], ["Claude-SearchBot", "Anthropic, search"], ["Claude-User", "Anthropic, user requests"],
  ["PerplexityBot", "Perplexity, search"], ["Perplexity-User", "Perplexity, user requests"],
  ["Meta-ExternalAgent", "Meta AI"], ["Meta-ExternalFetcher", "Meta AI, user requests"], ["FacebookBot", "Facebook link previews"],
  ["LinkedInBot", "LinkedIn link previews"], ["Twitterbot", "X link previews"], ["WhatsApp", "WhatsApp link previews"], ["Slackbot", "Slack link previews"],
  ["DuckDuckBot", "DuckDuckGo"], ["DuckAssistBot", "DuckDuckGo AI answers"], ["YandexBot", "Yandex"], ["Baiduspider", "Baidu"], ["Amazonbot", "Amazon, Alexa"],
  ["CCBot", "Common Crawl"], ["cohere-ai", "Cohere"], ["MistralAI-User", "Mistral, user requests"], ["YouBot", "You.com"], ["Bytespider", "ByteDance"]
];
const robots = `# pratimnarayan.com\n# Every crawler is welcome on the whole site, search engines and AI\n# assistants alike. Each one below is named from its vendor's documentation\n# so the allowance is explicit. A plain language summary for assistants is\n# at ${site.url}/llms.txt and the full text at ${site.url}/llms-full.txt\n\n` +
  bots.map(([ua, who]) => `# ${who}\nUser-agent: ${ua}\nAllow: /\nDisallow: /404.html\n`).join("\n") +
  `\n# Everyone else\nUser-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${site.url}/sitemap.xml\n`;
write("robots.txt", robots);

/* 7. llms.txt, a plain summary for AI assistants */
const eps = episodes.slice().sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
const llms = `# Pratim Narayan Moitra

> ${site.summary}

Short forms of the name: Pratim Narayan, Pratim N. Moitra. Contact: ${site.email}. LinkedIn: ${site.linkedin}.

## What he offers

- The free week. 5 finished social media posts with captions, delivered 7 days after a complete brief. The client keeps them whether or not they hire him. ${site.url}/freeweek/
- The free audit. A written audit of website, social, email and search in 3 working days, with three priority fixes. No call needed. ${site.url}/audit/
- ${site.productName}. Monthly social media management for tourism brands, end to end. Strategy, the content calendar, carousels and photo posters, Reels and short video, captions, posting, community replies and a one page report every month, with a growth target agreed in writing in week one. If the targets are missed at day 90, month four is free. ${site.url}/services/social/
- Add on services. Video and Reels, email marketing, paid ads, website development and marketing coordination. ${site.url}/services/video/ ${site.url}/services/email/ ${site.url}/services/ads/ ${site.url}/services/websites/ ${site.url}/services/coordination/
- Tiers. Social support, Social takeover and Full marketing. Plans are built around the client's budget.
- A 30 second intro film about his work is on the homepage and the about page. ${site.url}/#film

## Who he works with

Tourism associations and trade bodies, DMCs and tour operators, boutique hotels and resorts, tourism boards, travel academies, travel media and booking platforms. He has worked with ${site.partners.map((p) => p.name).join(", ")}, ${site.partnersMore || ""}.

## Results

- One brand account grew from 13.02K to 23.68K followers across four platforms in under 90 days, up 82%. ${site.url}/#results
- One Instagram account went from around 20 likes a post to over 200, with 502 likes on its best post. ${site.url}/#results
- His promotion of the PATA summit lifted summit registrations by 25%. ${site.url}/#results
- Across the tourism accounts he has run, ${site.numbers.map((n) => n.value + " " + n.label).join(", ")}.

## Background

Masters in Tourism Management from Amity University and a BBA in Marketing. Interned at PATA as the only candidate selected from north India, with a personal endorsement from the CEO. First Indian intern at ATTA, with the role extended from 3 to 11 months. Currently Digital Systems and Marketing Consultant at the World Food Travel Association. Certified by ATTA and HubSpot Academy. Based in India.

## Key pages

- About: ${site.url}/about/
- The What If series. ${eps.length} episodes, each taking one real tourism brand's post that got almost no reaction, choosing one of twelve visual styles from a moodboard of 350 travel posts and rebuilding it, shown as a before and after with three notes on what changed. The brands are not clients and the posts are shown for commentary: ${site.url}/whatif/ (RSS ${site.url}/whatif/feed.xml)
- Start here, every free offer in one place: ${site.url}/start/
- How this compares: ${site.url}/compare/
- Client types: ${site.url}/for/associations/ ${site.url}/for/dmcs/ ${site.url}/for/hotels/ ${site.url}/for/boards/ ${site.url}/for/academies/
- Book a call: ${site.bookingUrl}

## The What If episodes, newest first

${eps.map((e) => `- Episode ${e.number}. ${e.coverLine} ${e.storyTitle}. The post got ${e.brand.engagement} on ${e.brand.followers} followers. Style tested, ${require("./assets/data/styles.js")[e.style].name.toLowerCase()}. ${site.url}/whatif/${e.slug}/`).join("\n")}
`;
write("llms.txt", llms);

/* 7a. llms-full.txt, the same plus the full text of every episode and the
   questions people ask, for assistants that read one file */
const stylesData = require("./assets/data/styles.js");
const faqData = require("./assets/data/faq.js");
const full = llms + `
## Every What If episode in full

${eps.map((e) => `### Episode ${e.number}. ${e.coverLine}

${e.storyTitle}. Brand ${e.brandName} (${e.brand.handle}), ${e.clientType}, ${e.region}. Original post ${e.brand.postUrl} with ${e.brand.engagement} on ${e.brand.followers} followers. Page ${site.url}/whatif/${e.slug}/

The post as it was. ${e.brand.describe}

Style tested. ${stylesData[e.style].name}. ${e.styleWhy}

Inspired by ${e.inspiredBy.brand}, which ${e.inspiredBy.what}.

The big idea. ${e.bigIdea}

Observations. ${e.observations.join(" ")}
${e.single ? `
The remake. ${e.remake.headline} ${e.remake.line} Photo, ${e.remake.photo.what}, by ${e.remake.photo.by} on ${e.remake.photo.source}.

What changed. ${e.remake.changed.map((c) => c.name + ". " + c.text).join(" ")}
` : `
The remake, ${e.remakeSlides.length} slides. ${e.remakeSlides.map((sl, i) => `Slide ${i + 1}. ${sl.headline}${sl.line ? " " + sl.line : ""}`).join(" ")}
`}
Strategy. Audience, ${e.strategy.audience} Pillars, ${e.strategy.pillars.join(" ")} Rhythm, ${e.strategy.rhythm} Target, ${e.strategy.target}

The caption in the brand's voice. ${e.caption}

Month one. ${e.monthOne.join(" ")}
`).join("\n")}
## Questions people ask

${faqData.home.map((f) => `- ${f.q} ${f.a}`).join("\n")}
${faqData.freeweek.map((f) => `- ${f.q} ${f.a}`).join("\n")}

## The twelve visual styles the series tests

${Object.values(stylesData).map((st) => `- ${st.number} ${st.name}. ${st.line} Best for ${st.bestFor} Watch out, ${st.watch}`).join("\n")}
`;
write("llms-full.txt", full);

/* 8. the IndexNow key file */
if (site.indexNowKey) write(`${site.indexNowKey}.txt`, site.indexNowKey);

console.log(`Built ${pages.length} pages. ${written} files written, ${unchanged} unchanged. Asset version ${version}.`);

/* 9. image export through Chrome, only when something is stale */
function stale(job) {
  const src = Math.max(fs.statSync(path.join(ROOT, job.svg)).mtimeMs, ...(job.deps || []).map((d) => fs.statSync(d).mtimeMs));
  return job.outputs.some((o) => { const f = path.join(ROOT, o.file); return !fs.existsSync(f) || fs.statSync(f).mtimeMs < src; });
}
const pending = FORCE_IMAGES ? svgJobs : svgJobs.filter(stale);
if (NO_IMAGES) {
  console.log(`Image export skipped (--no-images). ${pending.length} SVGs have stale or missing exports.`);
} else if (!pending.length) {
  console.log("Images are up to date.");
} else {
  fs.writeFileSync(path.join(ROOT, "scripts/.export-jobs.json"), JSON.stringify(pending));
  console.log(`Exporting images for ${pending.length} SVGs through Chrome…`);
  const r = spawnSync(process.execPath, [path.join(ROOT, "scripts/export-images.js"), path.join(ROOT, "scripts/.export-jobs.json")], { stdio: "inherit" });
  if (r.status !== 0) console.log("Image export did not finish. Install Google Chrome or set CHROME_PATH, then run: node build.js --images");
  try { fs.unlinkSync(path.join(ROOT, "scripts/.export-jobs.json")); } catch (e) {}
}
