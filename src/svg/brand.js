/* ============================================================
   The brand's own images, drawn in the red pen system and exported
   through Chrome by build.js.

   icon()       the favicon and the app icons. The initials of the
                wordmark in Newsreader italic with the pen underline.
   shareImage() the Open Graph image. White ground, the headline in
                Newsreader with the red underline, the wordmark and
                the fan of three posts from heroPosts.

   Each returns HTML for the export page. Sizes are inline because the
   export page gives every bare svg the full size of the image.
   ============================================================ */
"use strict";
const path = require("path");
const site = require("../../assets/data/site.js");
const { esc } = require("../lib.js");
const ROOT = path.join(__dirname, "..", "..");

const INK = "#222222", ACCENT = "#CC0000", PAPER = "#FFFFFF", SOFT = "#666666";
const underline = (style) => `<svg viewBox="0 0 300 14" preserveAspectRatio="none" fill="none" style="position:absolute;display:block;overflow:visible;${style}"><path d="M3 9C50 3 110 12 170 7S260 4 297 8" stroke="${ACCENT}" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;

/* size in pixels. round gives the tile the system's radius, scaled, on a clear
   ground. safe keeps the letters inside the middle of a maskable icon. */
function icon({ size = 96, round = true, safe = false } = {}) {
  const f = Math.round(size * (safe ? 0.46 : 0.6));
  const stroke = Math.max(2, Math.round(size * (safe ? 0.035 : 0.05)));
  return `<div style="width:${size}px;height:${size}px;background:${PAPER};${round ? `border-radius:${Math.round(size / 6)}px;` : ""}display:flex;align-items:center;justify-content:center;overflow:hidden">
<span style="position:relative;display:inline-block;font-family:'Newsreader',Georgia,serif;font-style:italic;font-weight:500;font-size:${f}px;line-height:1;letter-spacing:-.03em;color:${INK};padding-bottom:${Math.round(f * 0.06)}px;margin-top:-${Math.round(f * 0.1)}px">pm<svg viewBox="0 0 300 14" preserveAspectRatio="none" fill="none" style="position:absolute;display:block;overflow:visible;left:-4%;bottom:-${Math.round(f * 0.1)}px;width:108%;height:${Math.round(f * 0.16)}px"><path d="M3 9C50 3 110 12 170 7S260 4 297 8" stroke="${ACCENT}" stroke-width="${stroke}" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg></span>
</div>`;
}

function shareImage() {
  const line = site.line, phrase = site.lineUnderline;
  const i = line.indexOf(phrase);
  let end = i + phrase.length;
  while (i >= 0 && end < line.length && /[.,!?]/.test(line[end])) end++;
  const headline = i < 0 ? esc(line) : `${esc(line.slice(0, i))}<span style="position:relative;display:inline-block;white-space:nowrap">${esc(line.slice(i, end))}${underline("left:-2%;bottom:-.14em;width:104%;height:.2em")}</span>${esc(line.slice(end))}`;
  const posts = site.heroPosts.slice(0, 3).map((p) => "file://" + path.join(ROOT, p.src.replace(/\.(webp|avif)$/i, ".jpg")));
  const post = (src, style) => `<img src="${src}" style="position:absolute;width:49%;aspect-ratio:4 / 5;object-fit:cover;border-radius:4px;border:1px solid rgba(0,0,0,.08);box-shadow:0 24px 44px -22px rgba(0,0,0,.5);${style}">`;
  return `<div style="width:1200px;height:630px;background:${PAPER};display:grid;grid-template-columns:minmax(0,1.18fr) minmax(0,.82fr);gap:48px;align-items:center;padding:0 72px;box-sizing:border-box;font-family:'Google Sans Flex',Arial,sans-serif;color:${INK}">
<div>
<p style="margin:0;font-size:17px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${SOFT}">${esc(site.label)}</p>
<h1 style="margin:20px 0 0;font-family:'Newsreader',Georgia,serif;font-weight:500;font-size:74px;line-height:1.03;letter-spacing:-.018em">${headline}</h1>
<p style="margin:44px 0 0;font-family:'Newsreader',Georgia,serif;font-style:italic;font-weight:500;font-size:30px;letter-spacing:-.01em">pratim n. moitra</p>
</div>
<div style="position:relative;width:100%;aspect-ratio:54 / 56">
${post(posts[0], "left:0;top:17%;transform:rotate(-7deg)")}
${post(posts[1], "left:25.5%;top:1%;transform:rotate(2deg);z-index:2")}
${post(posts[2], "right:0;top:21%;transform:rotate(8deg)")}
</div>
</div>`;
}

/* the picture for an email signature. The film's poster with a red play
   button and one line under it. Shown at 300 by 169 in an email, drawn at
   twice that so it stays sharp. */
function filmThumb() {
  const poster = "file://" + path.join(ROOT, site.film.poster);
  return `<div style="position:relative;width:600px;height:338px;background:${PAPER};overflow:hidden;font-family:'Google Sans Flex',Arial,sans-serif">
<img src="${poster}" style="position:absolute;left:0;top:0;width:600px;height:338px;object-fit:cover;object-position:center 30%">
<div style="position:absolute;left:0;right:0;bottom:0;height:68px;background:${INK};display:flex;align-items:center;gap:16px;padding:0 20px 0 14px;box-sizing:border-box">
<div style="flex:none;width:44px;height:44px;border-radius:50%;background:${ACCENT};display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 40 40" style="display:block;width:20px;height:20px;margin-left:3px"><path d="M8 4L36 20L8 36Z" fill="#FFFFFF"/></svg></div>
<span style="flex:1;font-size:23px;font-weight:600;color:#FFFFFF">Watch the 45 second film</span>
<span style="font-size:18px;font-weight:600;color:#CCCCCC">0:45</span>
</div>
</div>`;
}

module.exports = { icon, shareImage, filmThumb };
