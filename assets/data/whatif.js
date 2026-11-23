/* ============================================================
   The What If series.
   One file per episode in assets/data/episodes/. This loader reads
   them all, checks the fields the build needs, keeps the ones named
   in site.whatifLive, numbers those from the oldest publishDate, and
   exports them newest first.

   To add an episode, copy any file in episodes/, change every
   field, drop the post image at src/whatif-src/<slug>.jpg and run
   `node build.js`. README.md has the exact steps.

   Fields
     slug          lowercase letters and digits only, no hyphens
     publishDate   YYYY-MM-DD
     brandName     the brand as it is written, for example "Agoda"
     brand         handle, color, second (optional), followers,
                   engagement, postType, postUrl, text (the words on
                   the post), describe (what the post looks like)
     clientType    one of the keys in src/lib.js TYPE_KEYS
     region        shown as a chip
     platform      the main platform the remake is made for
     coverLine     the heading, always "What if <brand> posted like this?"
     storyTitle    the subhead
     style         a key from assets/data/styles.js
     styleWhy      two or three sentences on why this style for this brand
     inspiredBy    { brand, what } from the inspirations list
     bigIdea       one sentence
     observations  three lines, the first on what works
     strategy      audience, pillars (three), rhythm, target
     remakeSlides  six slides, each with headline and optional line,
                   kicker, items, stat and photo (true to use the post's photo).
                   A single image remake lists one slide and adds remake
     remake        single image episodes only. headline, line, photo
                   { what, by, source, url } for the credit, and changed,
                   three { name, text } notes on what the remake changed.
                   The finished image sits at src/whatif-src/<slug>-remake.png
     caption       the remake's caption, in the brand's voice
     monthOne      three actions
     names         proper nouns used in headings, for the copy lint
     linkedinUrl   optional
   ============================================================ */
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "episodes");
const REQUIRED = ["slug", "publishDate", "brandName", "brand", "clientType", "region", "platform", "coverLine", "storyTitle", "style", "styleWhy", "inspiredBy", "bigIdea", "observations", "strategy", "remakeSlides", "caption", "monthOne"];

const episodes = fs.readdirSync(dir).filter((f) => f.endsWith(".js")).map((f) => {
  const ep = require(path.join(dir, f));
  for (const k of REQUIRED) if (ep[k] == null) throw new Error(`Episode ${f} is missing ${k}`);
  if (!/^[a-z0-9]+$/.test(ep.slug)) throw new Error(`Episode ${f} has a slug with characters other than lowercase letters and digits`);
  ep.single = !!ep.remake;
  if (ep.single) {
    for (const k of ["headline", "line", "photo", "changed"]) if (ep.remake[k] == null) throw new Error(`Episode ${ep.slug} remake is missing ${k}`);
    if (!Array.isArray(ep.remake.changed) || ep.remake.changed.length < 3) throw new Error(`Episode ${ep.slug} remake needs three changed notes`);
    if (!ep.remakeSlides.length) ep.remakeSlides = [{ photo: true, headline: ep.remake.headline, line: ep.remake.line }];
  } else if (ep.remakeSlides.length < 4) throw new Error(`Episode ${ep.slug} needs at least four remake slides`);
  ep.sample = false;
  ep.names = ep.names || [];
  ep.linkedinUrl = ep.linkedinUrl || "";
  return ep;
});

const seen = new Set();
for (const e of episodes) { if (seen.has(e.slug)) throw new Error(`Two episodes share the slug ${e.slug}`); seen.add(e.slug); }

/* only the slugs in site.whatifLive are published */
const live = require("./site.js").whatifLive;
if (Array.isArray(live)) {
  for (const s of live) if (!seen.has(s)) throw new Error(`site.whatifLive names ${s}, which has no file in episodes/`);
  for (let i = episodes.length - 1; i >= 0; i--) if (!live.includes(episodes[i].slug)) episodes.splice(i, 1);
}

/* oldest first, and on the same day in the order site.whatifLive lists them */
const pos = (e) => (Array.isArray(live) ? live.indexOf(e.slug) : -1);
episodes.sort((a, b) => (a.publishDate < b.publishDate ? -1 : a.publishDate > b.publishDate ? 1 : pos(a) - pos(b) || (a.slug < b.slug ? -1 : 1)));
episodes.forEach((e, i) => { e.number = i + 1; });
episodes.reverse();

module.exports = episodes;
