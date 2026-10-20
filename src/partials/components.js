/* ============================================================
   Shared components. Every function returns an HTML string.
   Nothing here depends on JavaScript to be readable.
   ============================================================ */
"use strict";
const site = require("../../assets/data/site.js");
const testimonials = require("../../assets/data/testimonials.js");
const services = require("../../assets/data/services.js");
const styles = require("../../assets/data/styles.js");
const { esc, attr, when, map, picture, ARROW, icon, typeKey, fmtDate } = require("../lib.js");

/* ---------- small pieces ---------- */
function btn(label, href, o = {}) {
  const kind = o.kind || "primary";
  const cls = ["btn", `btn--${kind}`, o.size ? `btn--${o.size}` : "", o.block ? "btn--block" : "", o.cls || ""].filter(Boolean).join(" ");
  const data = [
    o.cta ? ` data-cta="${attr(o.cta)}"` : "",
    o.offer ? ` data-offer="${attr(o.offer)}"` : "",
    o.book ? ` data-book="${attr(o.book)}"` : "",
    o.extra || ""
  ].join("");
  const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
  return `<a class="${cls}" href="${attr(href)}"${ext}${data}>${esc(label)}${o.arrow === false ? "" : ARROW}</a>`;
}

function textlink(label, href, o = {}) {
  const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
  const data = (o.cta ? ` data-cta="${attr(o.cta)}"` : "") + (o.offer ? ` data-offer="${attr(o.offer)}"` : "") + (o.book ? ` data-book="${attr(o.book)}"` : "") + (o.extra || "");
  return `<a class="textlink${o.cls ? " " + o.cls : ""}" href="${attr(href)}"${ext}${data}>${esc(label)}${o.arrow ? ARROW : ""}</a>`;
}

const chip = (text, cls = "") => `<span class="chip${cls ? " " + cls : ""}">${esc(text)}</span>`;
const chips = (arr, cls = "") => `<div class="chips${cls ? " " + cls : ""}">${arr.filter(Boolean).map((c) => chip(c)).join("")}</div>`;
const eyebrow = (text) => `<p class="eyebrow">${esc(text)}</p>`;

function head({ eyebrow: eb, title, intro, id, cls = "" }) {
  return `<div class="head${cls ? " " + cls : ""}">${when(eb, () => eyebrow(eb))}<h2${id ? ` id="${id}"` : ""}>${title}</h2>${when(intro, () => `<p>${intro}</p>`)}</div>`;
}

/* a big quiet number with a Space Mono label */
function num(value, label, o = {}) {
  return `<p class="num${o.cls ? " " + o.cls : ""}"><span class="num__v" data-num>${esc(value)}</span><span class="num__k">${esc(label)}</span></p>`;
}

function breadcrumbs(list) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${list.map((b, i) => i === list.length - 1
    ? `<li aria-current="page">${esc(b.name)}</li>`
    : `<li><a href="${attr(b.url)}">${esc(b.name)}</a></li>`).join("")}</ol></nav>`;
}

function whatsappUrl() {
  return site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}` : "";
}

/* ---------- testimonials ---------- */
function testimonial(key, o = {}) {
  const t = testimonials[key];
  const name = t.url ? `<a href="${attr(t.url)}" target="_blank" rel="noopener">${esc(t.name)}</a>` : `<b>${esc(t.name)}</b>`;
  return `<figure class="voice${o.cls ? " " + o.cls : ""}">
<div class="voice__photo"><picture><source type="image/webp" srcset="${t.photo}.webp"><img src="${t.photo}.jpg" width="400" height="400" alt="${attr(t.name)}" loading="lazy" decoding="async"></picture></div>
<div class="voice__body"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption>${name}<span>${esc(t.title)}</span></figcaption></div>
</figure>`;
}

/* ---------- the people I have worked with ----------
   A band of logos that drifts sideways. The list is written twice so the
   loop has no seam, and the copy is hidden from screen readers. With
   reduced motion it sits still and wraps. */
function partners() {
  const list = site.partners.filter((p) => p.logo);
  const logo = (p, hidden) => `<picture><source type="image/webp" srcset="/assets/logos/${p.logo}.webp"><img src="/assets/logos/${p.logo}.png" width="${p.w}" height="${p.h}" style="--h:${p.hh}" alt="${hidden ? "" : attr(p.alt || p.name)}" loading="lazy" decoding="async"></picture>`;
  const items = (hidden) => list.map((p) => `<li${p.mark ? ' class="partners__mark"' : ""}>${logo(p, hidden)}${p.mark ? `<span>${esc(p.name)}</span>` : ""}</li>`).join("");
  return `<div class="partners">
<div class="marquee">
<ul class="marquee__track" aria-label="Organisations I have worked with">${items(false)}</ul>
<ul class="marquee__track" aria-hidden="true">${items(true)}</ul>
</div>
${when(site.partnersMore, () => `<p class="partners__more"><span>+</span>${esc(site.partnersMore)}</p>`)}
</div>`;
}
const logos = partners;

/* ---------- the results board ----------
   One card per result from site.results. A big number, two bars drawn
   to scale and the drawn arrow between them, then one line of context.
   The bars grow and the arrow draws when the card arrives. There are no
   case study pages, so each card carries its own story. */
function scoreViz(v) {
  const base = 132, top = 34, maxH = base - top;
  const bh = Math.max(5, (v.before / v.after) * maxH);
  const x1 = 70, x2 = 170, y1 = base - bh - 10, y2 = top - 10;
  /* the arrow, a curve that rises off the first bar and lands on the second */
  const c1 = [x1, Math.min(y1 - 40, 20)], c2 = [x2 - 46, y2 - 22];
  const ex = x2 - 6, ey = y2;
  const dx = ex - c2[0], dy = ey - c2[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  const head = (rot) => { const c = Math.cos(rot), s2 = Math.sin(rot); return [ex - 9 * (ux * c - uy * s2), ey - 9 * (uy * c + ux * s2)]; };
  const h1 = head(0.5), h2 = head(-0.5);
  const f = (n) => Math.round(n * 10) / 10;
  return `<svg class="score__svg" viewBox="0 0 240 160" aria-hidden="true">
<line class="score__base" x1="20" y1="${base}" x2="220" y2="${base}"/>
<rect class="score__bar score__bar--before" x="${x1 - 28}" y="${f(base - bh)}" width="56" height="${f(bh)}" rx="3"/>
<rect class="score__bar score__bar--after" x="${x2 - 28}" y="${top}" width="56" height="${maxH}" rx="3"/>
<path class="score__arrow" pathLength="1" d="M${x1} ${f(y1)} C ${c1[0]} ${f(c1[1])}, ${f(c2[0])} ${f(c2[1])}, ${f(ex)} ${f(ey)}"/>
<path class="score__head" d="M${f(h1[0])} ${f(h1[1])} L${f(ex)} ${f(ey)} L${f(h2[0])} ${f(h2[1])}"/>
<text class="score__lbl" x="${x1}" y="152" text-anchor="middle">${esc(v.bl)}</text>
<text class="score__lbl score__lbl--after" x="${x2}" y="152" text-anchor="middle">${esc(v.al)}</text>
</svg>`;
}
function scoreCard(r, o = {}) {
  return `<article class="score${o.cls ? " " + o.cls : ""}">
<span class="score__time">${esc(r.time)}</span>
<span class="score__v" data-num>${esc(r.value)}</span>
<span class="score__k">${esc(r.label)}</span>
<span class="score__viz">${scoreViz(r)}</span>
<span class="score__who">${esc(r.who)}</span>
<span class="score__ctx">${esc(r.context)}</span>
</article>`;
}
function scoreboard() {
  return `<ol class="scores" data-reveal>
${site.results.map((r) => `<li>${scoreCard(r)}</li>`).join("\n")}
</ol>`;
}

/* ---------- the gap in a What If episode ----------
   Followers divided by reactions. "13,000" and "3 likes" -> 1 reaction
   per 4,333 followers. Returns null when the counts cannot be read. */
function gapOf(ep) {
  const toN = (t) => { const m = /^([\d,.]+)\s*([KM]?)/i.exec(String(t || "").trim()); if (!m) return 0; const n = parseFloat(m[1].replace(/,/g, "")); return m[2].toUpperCase() === "K" ? n * 1000 : m[2].toUpperCase() === "M" ? n * 1e6 : n; };
  const followers = toN(ep.brand.followers), reactions = toN(ep.brand.engagement);
  if (!(followers > 0) || !(reactions > 0)) return null;
  const per = Math.round(followers / reactions);
  const pct = (reactions / followers) * 100;
  const pctLabel = pct >= 1 ? pct.toFixed(1) + "%" : pct >= 0.1 ? pct.toFixed(2) + "%" : pct.toFixed(3).replace(/0+$/, "") + "%";
  return {
    followers, reactions, per, pct, pctLabel,
    perLabel: "1 in " + per.toLocaleString("en-GB"),
    headline: `One reaction for every ${per.toLocaleString("en-GB")} followers.`,
    text: `${ep.brand.engagement} on ${ep.brand.followers} followers is ${pctLabel} of the people who already chose to follow ${ep.brandName}. A post that lands usually hears back from about 1 in 100. That is the gap the remake is built to close, and it is the number a board understands without a chart.`
  };
}
/* the meter on an episode page, the post against 1 in 100 */
function gapMeter(ep) {
  const g = gapOf(ep);
  if (!g) return "";
  const post = Math.max(0.02, Math.min(1, g.pct / 1));
  return `<div class="gapmeter" role="img" aria-label="${attr(`This post, ${g.pctLabel} of followers reacted. A post that lands, about 1%.`)}" data-reveal>
<div class="gapmeter__row gapmeter__row--post"><span class="gapmeter__k">This post</span><span class="gapmeter__bar"><i style="--v:${post.toFixed(3)}"></i></span><b class="gapmeter__v">${esc(g.pctLabel)}</b></div>
<div class="gapmeter__row"><span class="gapmeter__k">A post that lands</span><span class="gapmeter__bar"><i style="--v:1"></i></span><b class="gapmeter__v">about 1%</b></div>
<p class="gapmeter__note">Share of followers who reacted. The 1% line is a working rule of thumb for an account this size, not a promise.</p>
</div>`;
}
/* the chart on the index, every episode's followers per reaction */
function gapChart(eps) {
  const rows = eps.map((e) => ({ e, g: gapOf(e) })).filter((r) => r.g);
  if (!rows.length) return "";
  const max = Math.max(...rows.map((r) => r.g.per));
  return `<div class="gapchart" data-reveal>
${rows.map(({ e, g }) => `<a class="gapchart__row" href="/whatif/${e.slug}/">
<span class="gapchart__brand"><b>${esc(e.brandName)}</b><span>${esc(e.brand.followers)} followers, ${esc(e.brand.engagement)}</span></span>
<span class="gapchart__bar"><i style="--v:${(g.per / max).toFixed(3)}"></i></span>
<span class="gapchart__v"><b>${esc(g.perLabel)}</b><span>followers per reaction</span></span>
</a>`).join("\n")}
<p class="gapchart__note">Counts as they were when each post was checked. A post that lands usually hears back from about 1 in 100 followers.</p>
</div>`;
}

/* ---------- before and after, the drag ----------
   A range input does the dragging, so touch, mouse and keyboard all
   work. The after image is clipped. Used on episode pages, the What If
   index and the homepage. */
function beforeAfter({ beforeBase, afterBase, beforeAlt, afterAlt, id = "ba-range", big = false, sizes, eager = false, cls = "" }) {
  const sz = sizes || (big ? "(max-width: 720px) 92vw, 620px" : "(max-width: 720px) 92vw, 480px");
  return `<div class="ba${big ? " ba--big" : ""}${cls ? " " + cls : ""}" data-ba style="--split:50%">
<div class="ba__before">${picture({ base: beforeBase, alt: beforeAlt, width: 1080, height: 1350, sizes: sz, eager })}</div>
<div class="ba__after">${picture({ base: afterBase, alt: afterAlt, width: 1080, height: 1350, sizes: sz, eager })}</div>
<span class="ba__tag ba__tag--before" aria-hidden="true">Before</span><span class="ba__tag ba__tag--after" aria-hidden="true">Remake</span>
<span class="ba__handle" aria-hidden="true"><i></i></span>
<label class="sr-only" for="${id}">Compare the original post with the remake</label>
<input class="ba__range" id="${id}" type="range" min="0" max="100" value="50" step="1">
</div>`;
}

/* the newest episode as a live drag, with its numbers, for the homepage */
function latestCompare(ep, { where = "home" } = {}) {
  const st = styles[ep.style];
  const dir = `/assets/whatif/${ep.slug}`;
  const g = gapOf(ep);
  const afterBase = ep.single ? `${dir}/remake` : `${dir}/slide-1`;
  const afterAlt = ep.single ? `The remake. ${ep.remake.headline}` : `The first remake slide. ${ep.remakeSlides[0].headline}`;
  return `<div class="latest">
<div class="latest__copy">
${eyebrow("Newest episode")}
<h3 class="latest__t"><a href="/whatif/${ep.slug}/">${esc(ep.coverLine)}</a></h3>
<p class="latest__s">${esc(ep.storyTitle)}</p>
<dl class="latest__stats">
<div><dt>Followers</dt><dd data-num>${esc(ep.brand.followers)}</dd></div>
<div class="latest__low"><dt>${esc(splitCountK(ep.brand.engagement))}</dt><dd data-num>${esc(splitCountN(ep.brand.engagement))}</dd></div>
${when(g, () => `<div><dt>Followers per reaction</dt><dd data-num>${esc(g.perLabel)}</dd></div>`)}
</dl>
${when(ep.single, () => `<ul class="latest__changed">${ep.remake.changed.map((c) => `<li>${icon("check")}<span>${esc(c.name)}</span></li>`).join("")}</ul>`)}
${btn("See what changed", `/whatif/${ep.slug}/`, { kind: "primary", cta: where + "-latest", offer: "whatif" })}
<p class="latest__note">Style tested, ${esc(st.name.toLowerCase())}. ${esc(ep.brandName)} is not a client. Shown for commentary.</p>
</div>
<div class="latest__ba">
${beforeAfter({ beforeBase: `${dir}/before`, afterBase, beforeAlt: `The original post by ${ep.brandName}. ${ep.brand.describe}`, afterAlt, id: "ba-" + where, sizes: "(max-width: 880px) 92vw, 460px" })}
<p class="latest__hint">${icon("drag")}Drag the handle</p>
</div>
</div>`;
}
const splitCountN = (t) => { const m = /^([\d,.]+[KM]?)\s+(.*)$/i.exec(t || ""); return m ? m[1] : "0"; };
const splitCountK = (t) => { const m = /^([\d,.]+[KM]?)\s+(.*)$/i.exec(t || ""); return m ? m[2] : t || ""; };

/* the four numbers under the results, each with an icon */
const NUM_ICONS = ["eye", "inbox", "grid", "chat"];
function numbersBand() {
  return `<div class="numband" data-reveal>
${site.numbers.map((n, i) => `<div class="numband__item">${icon(NUM_ICONS[i % NUM_ICONS.length], "icon numband__icon")}${num(n.value, n.label)}</div>`).join("\n")}
</div>
<p class="numband__note">${esc(site.numbersNote)}</p>`;
}

/* the three results, under the hero and beside forms */
function resultsRow(href = "/#results") {
  return `<ul class="proofrow">${site.headline.map((h) => `<li><a href="${attr(h.href || href)}"><span class="proofrow__v">${esc(h.value)}</span><span class="proofrow__k">${esc(h.label)}</span></a></li>`).join("")}</ul>`;
}

/* ---------- episode cards ---------- */
function episodeCard(ep, o = {}) {
  const base = `/assets/whatif/${ep.slug}/cover`;
  const st = styles[ep.style];
  const g = gapOf(ep);
  const after = ep.single ? `/assets/whatif/${ep.slug}/remake` : `/assets/whatif/${ep.slug}/slide-1`;
  return `<a class="epcard${o.cls ? " " + o.cls : ""}" href="/whatif/${ep.slug}/" data-type="${typeKey(ep.clientType)}">
<span class="epcard__media">
${picture({ base, alt: `${ep.coverLine} The episode cover, with the brand's own post and the remake.`, width: 1080, height: 1350, sizes: o.sizes || "(max-width: 720px) 70vw, 320px", cls: "epcard__cover", style: `view-transition-name:whatif-${ep.slug}` })}
${picture({ base: after, alt: "", width: 1080, height: 1350, sizes: o.sizes || "(max-width: 720px) 70vw, 320px", cls: "epcard__after", jpg: false })}
<span class="epcard__peek" aria-hidden="true">The remake</span>
</span>
<span class="epcard__body">
<span class="epcard__meta"><span class="epcard__n">Episode ${String(ep.number).padStart(2, "0")}</span>${chips([ep.clientType, st ? st.name : ""])}</span>
<span class="epcard__t">${esc(ep.storyTitle)}</span>
${when(g, () => `<span class="epcard__gap"><b>${esc(ep.brand.engagement)}</b> on ${esc(ep.brand.followers)} followers</span>`)}
</span>
</a>`;
}

/* the newest episode, large, at the top of the index */
function episodeFeature(ep) {
  const st = styles[ep.style];
  const dir = `/assets/whatif/${ep.slug}`;
  const afterBase = ep.single ? `${dir}/remake` : `${dir}/slide-1`;
  const afterAlt = ep.single ? `The remake. ${ep.remake.headline}` : `The first remake slide. ${ep.remakeSlides[0].headline}`;
  const g = gapOf(ep);
  return `<div class="epfeat">
<div class="epfeat__media">
${beforeAfter({ beforeBase: `${dir}/before`, afterBase, beforeAlt: `The original post by ${ep.brandName}. ${ep.brand.describe}`, afterAlt, id: "ba-feature", sizes: "(max-width: 880px) 92vw, 440px", eager: true })}
<p class="latest__hint">${icon("drag")}Drag the handle</p>
</div>
<div class="epfeat__body">
<span class="epfeat__k">Newest episode, ${esc(fmtDate(ep.publishDate))}</span>
<h2 class="epfeat__t"><a href="/whatif/${ep.slug}/">${esc(ep.coverLine)}</a></h2>
<p class="epfeat__s">${esc(ep.storyTitle)}</p>
<dl class="latest__stats">
<div><dt>Followers</dt><dd data-num>${esc(ep.brand.followers)}</dd></div>
<div class="latest__low"><dt>${esc(splitCountK(ep.brand.engagement))}</dt><dd data-num>${esc(splitCountN(ep.brand.engagement))}</dd></div>
${when(g, () => `<div><dt>Followers per reaction</dt><dd data-num>${esc(g.perLabel)}</dd></div>`)}
</dl>
${chips([ep.clientType, ep.region, st ? "Style tested, " + st.name.toLowerCase() : ""])}
${btn("See what changed", `/whatif/${ep.slug}/`, { kind: "primary", cta: "whatif-feature", offer: "whatif" })}
</div>
</div>`;
}

/* ---------- the shared lead form ---------- */
const PRESETS = {
  freeweek: { looking: "Free week of posts", button: "Get my 5 free posts", done: "Got it. I'll email you a short brief within one working day.", offer: "freeweek" },
  audit: { looking: "Free audit", button: "Get my free audit", done: "Got it. Your written audit arrives within 3 working days.", offer: "audit" },
  monthly: { looking: "Monthly social media", button: "Send", done: "Got it. I'll reply within one working day.", offer: "monthly" },
  other: { looking: "Something else", button: "Send", done: "Got it. I'll reply within one working day.", offer: "other" }
};

function leadForm({ preset = "freeweek", page = "/", id = "lead", dark = false, title, intro } = {}) {
  const p = PRESETS[preset] || PRESETS.freeweek;
  const f = (n) => `${id}-${n}`;
  const opt = (v, sel) => `<option value="${attr(v)}"${sel ? " selected" : ""}>${esc(v)}</option>`;
  return `<div class="leadbox${dark ? " leadbox--dark" : ""}" id="${id}">
${when(title || intro, `<div class="leadbox__copy">${when(title, `<h3>${title}</h3>`)}${when(intro, `<p>${intro}</p>`)}</div>`)}
<form class="leadbox__form" id="${f("form")}" action="${attr(site.formspree)}" method="POST" novalidate data-lead data-preset="${preset}" data-done-freeweek="${attr(PRESETS.freeweek.done)}" data-done-audit="${attr(PRESETS.audit.done)}" data-done-other="${attr(PRESETS.other.done)}">
<input type="hidden" name="_subject" value="Enquiry from pratimnarayan.com">
<input type="hidden" name="page" value="${attr(page)}">
<input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_medium" value=""><input type="hidden" name="utm_campaign" value=""><input type="hidden" name="utm_content" value="">
<div class="field"><label for="${f("looking")}">I'm looking for</label><div class="select"><select id="${f("looking")}" name="looking" required>${["Free week of posts", "Free audit", "Monthly social media", "Video and Reels", "Something else"].map((v) => opt(v, v === p.looking)).join("")}</select></div></div>
<div class="field"><label for="${f("name")}">Your name</label><input id="${f("name")}" name="name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${f("email")}">Work email</label><input id="${f("email")}" name="email" type="email" autocomplete="email" inputmode="email" required></div>
<div class="field"><label for="${f("website")}">Website</label><input id="${f("website")}" name="website" type="url" autocomplete="url" inputmode="url" placeholder="yourbrand.com" autocapitalize="off" spellcheck="false" required></div>
<div class="field"><label for="${f("instagram")}">Instagram handle <span class="field__opt">optional</span></label><input id="${f("instagram")}" name="instagram" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="@yourbrand"></div>
<div class="field"><label for="${f("youare")}">You are</label><div class="select"><select id="${f("youare")}" name="organisation" required><option value="" selected disabled>Choose one</option>${["Tourism association or trade body", "DMC or tour operator", "Hotel or resort", "Tourism board", "Travel academy", "Travel media or events", "Airline or booking platform", "Other travel brand"].map((v) => opt(v)).join("")}</select></div></div>
<div class="field"><label for="${f("country")}">Country</label><input id="${f("country")}" name="country" type="text" autocomplete="country-name" required></div>
<div class="field"><label for="${f("budget")}">Monthly budget <span class="field__opt">optional</span></label><div class="select"><select id="${f("budget")}" name="budget" data-budget><option value="" selected>Prefer not to say yet</option>${["Under USD 300", "USD 300 to 500", "USD 500 to 1,000", "More than USD 1,000", "I have my own number in mind"].map((v) => opt(v)).join("")}</select></div></div>
<div class="field" data-budget-own hidden><label for="${f("budgetown")}">Your number</label><input id="${f("budgetown")}" name="budget_own" type="text" inputmode="numeric" autocomplete="off" placeholder="USD a month"></div>
<div class="field field--full"><label for="${f("notes")}">Anything else <span class="field__opt">optional</span></label><textarea id="${f("notes")}" name="notes" rows="3"></textarea></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn--${dark ? "light" : "primary"} btn--lg btn--block" type="submit" data-label-freeweek="${attr(PRESETS.freeweek.button)}" data-label-audit="${attr(PRESETS.audit.button)}" data-label-other="Send">${esc(p.button)}${ARROW}</button>
<p class="form__status" role="status" aria-live="polite"></p>
<p class="form__small">No list, no chasing. Your details go to my inbox and nowhere else. <a href="/privacy/">Privacy</a></p>
</form>
<div class="leadbox__done" id="${f("done")}" hidden tabindex="-1">
<span class="leadbox__tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
<h3>Got it.</h3>
<p class="leadbox__donetext">${esc(p.done)}</p>
<p>Want to talk it through sooner?</p>
${btn("Book a call", site.bookingUrl, { kind: dark ? "ghost-light" : "ghost", book: "form-done", arrow: false })}
</div>
</div>`;
}

/* ---------- the two free offers ---------- */
function offerCards({ dark = false, where = "offers" } = {}) {
  return `<div class="offers">
<article class="offer">
<h3>Get 5 free posts in 7 days</h3>
<p>You keep them either way.</p>
${btn("Get 5 free posts", "/freeweek/", { kind: dark ? "light" : "primary", cta: where, offer: "freeweek" })}
</article>
<article class="offer">
<h3>Get a free written audit in 3 working days</h3>
<p>No call needed.</p>
${btn("Get a free audit", "/audit/", { kind: dark ? "ghost-light" : "ghost", cta: where, offer: "audit" })}
</article>
</div>`;
}

/* the boxed free week offer that sits beside the plans */
function freeWeekBox(o = {}) {
  return `<aside class="box box--offer">
<h3>Free week</h3>
<p>5 finished posts with captions in 7 days. Yours to keep, whatever you decide. No card, no contract.</p>
${btn("Start with 5 free posts", "/freeweek/", { kind: "primary", cta: o.where || "plans-box", offer: "freeweek" })}
</aside>`;
}

function termsBox() {
  return `<aside class="box box--terms"><h3>The terms</h3><ul class="ticks">
<li>Billed monthly, stop with 15 days notice.</li>
<li>Pause in your low season.</li>
<li>Your accounts, designs and captions stay in your name.</li>
<li>You work with Pratim directly.</li>
</ul></aside>`;
}

function promise() {
  return site.promiseText ? `<p class="promise">${esc(site.promiseText)}</p>` : "";
}

/* ---------- plans ---------- */
function plans({ where = "plans" } = {}) {
  const tiers = [
    { key: "support", name: "Social support", who: "A single boutique hotel or small DMC.", ticks: ["posts", "captions", "report"] },
    { key: "takeover", name: "Social takeover", who: "Associations and multi property groups.", ticks: ["posts", "video", "captions", "replies", "report", "call"] },
    { key: "full", name: "Full marketing", who: "Tourism boards and larger brands.", ticks: ["posts", "video", "captions", "replies", "report", "call", "email", "ads", "web"] }
  ];
  const rows = [
    { key: "posts", label: "Carousels and photo posters" },
    { key: "video", label: "Reels and short video" },
    { key: "captions", label: "Captions" },
    { key: "replies", label: "Community replies" },
    { key: "report", label: "Monthly one page report" },
    { key: "call", label: "Monthly call" },
    { key: "email", label: "Email marketing" },
    { key: "ads", label: "Paid ads" },
    { key: "web", label: "Website updates" }
  ];
  const ppm = site.postsPerMonth || {};
  const showPpm = tiers.some((t) => ppm[t.key]);
  const tick = '<span class="tick" role="img" aria-label="Included"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg></span>';
  const dash = '<span class="notick" role="img" aria-label="Not included"></span>';
  const th = (t) => `<th scope="col" data-tier="${t.key}"><span class="plans__name">${esc(t.name)}</span>${when(site.markMostChosen && site.mostChosenTier === t.key, '<span class="plans__most">Most chosen</span>')}</th>`;
  const cell = (t, content, label) => `<td data-tier="${t.key}" data-label="${attr(label)}">${content}</td>`;
  return `<div class="plans" data-plans>
<div class="plans__switch" role="tablist" aria-label="Choose a tier" hidden>${tiers.map((t, i) => `<button class="seg__btn" role="tab" type="button" aria-selected="${i === 1}" data-tier-btn="${t.key}"${i === 1 ? "" : ' tabindex="-1"'}>${esc(t.name)}</button>`).join("")}</div>
<table class="plans__table">
<thead><tr><th scope="col" class="plans__corner"><span class="sr-only">What is included</span></th>${tiers.map(th).join("")}</tr></thead>
<tbody>
<tr class="plans__who"><th scope="row">Who it's for</th>${tiers.map((t) => cell(t, `<span>${esc(t.who)}</span>`, "Who it's for")).join("")}</tr>
${when(showPpm, () => `<tr><th scope="row">Posts per month</th>${tiers.map((t) => cell(t, `<span>${esc(ppm[t.key] || "")}</span>`, "Posts per month")).join("")}</tr>`)}
${rows.map((r) => `<tr><th scope="row">${esc(r.label)}</th>${tiers.map((t) => cell(t, t.ticks.includes(r.key) ? tick : dash, r.label)).join("")}</tr>`).join("\n")}
<tr class="plans__cta"><th scope="row"><span class="sr-only">Start</span></th>${tiers.map((t) => cell(t, btn("Start with 5 free posts", "/freeweek/", { kind: "primary", size: "sm", cta: where + "-" + t.key, offer: "freeweek", arrow: false }), "")).join("")}</tr>
</tbody>
</table>
<div class="plans__budget">
<p>Plans are built around your budget. Tell me what you have in mind, and I'll shape the scope to fit.</p>
<p class="plans__moves">What moves the scope</p>
<ul class="chips chips--list"><li class="chip">Posts per week</li><li class="chip">Reels per month</li><li class="chip">Number of platforms</li><li class="chip">Ads or email added</li></ul>
${textlink("See how this compares", "/compare/", { arrow: true })}
</div>
</div>`;
}

/* ---------- end to end ---------- */
const E2E_ICONS = ["target", "calendar", "layers", "play", "pen", "send", "chat", "chart"];
function endToEnd({ where = "e2e" } = {}) {
  const e = services.endToEnd;
  return `<div class="e2e">
<div class="e2e__intro">
${eyebrow("End to end")}
<h2>${esc(e.title)}</h2>
<p class="e2e__promise">${esc(e.promise)}</p>
${btn("Start with 5 free posts", "/freeweek/", { kind: "primary", cta: where, offer: "freeweek" })}
</div>
<ol class="e2e__steps" data-reveal>
${e.steps.map((s2, i) => `<li class="e2e__step">${icon(E2E_ICONS[i % E2E_ICONS.length], "icon e2e__icon")}<span class="e2e__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s2.name)}</h3><p>${esc(s2.short || s2.text)}</p></li>`).join("\n")}
</ol>
</div>`;
}

/* ---------- the intro film ---------- */
function film({ where = "film", eager = false } = {}) {
  const f = site.film;
  if (!f || !f.src) return "";
  return `<figure class="film" data-film="${attr(where)}">
<video class="film__video" controls preload="${eager ? "metadata" : "none"}" playsinline poster="${attr(f.poster)}" width="${f.width}" height="${f.height}" aria-label="${attr(f.title)}">
<source src="${attr(f.src)}" type="video/mp4">
</video>
<figcaption><b>${esc(f.title)}.</b> A real post that got 3 likes from 13,000 followers, why, the remake, the results and the free week.</figcaption>
</figure>`;
}

/* ---------- how it works ----------
   Steps joined by the hand drawn route line, which draws itself as the
   steps scroll into view. flow() takes any list of [title, line]. */
function flow(steps, { cls = "" } = {}) {
  return `<div class="route${cls ? " " + cls : ""}">
<svg class="route__svg route__svg--h" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true"><path class="route__path" pathLength="1" vector-effect="non-scaling-stroke" d="M8 20 C 180 2, 300 38, 420 20 S 640 2, 760 20 S 920 36, 992 20"/></svg>
<svg class="route__svg route__svg--v" viewBox="0 0 40 1000" preserveAspectRatio="none" aria-hidden="true"><path class="route__path" pathLength="1" vector-effect="non-scaling-stroke" d="M20 8 C 2 180, 38 300, 20 420 S 2 640, 20 760 S 36 920, 20 992"/></svg>
<ol class="steps" style="--n:${steps.length}">
${steps.map(([t, d], i) => `<li class="step"><span class="step__n">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
</ol>
</div>`;
}
function routeSteps() {
  return flow([
    ["Free week", "5 posts in 7 days."],
    ["Your 90 day plan", "Agreed in week one."],
    ["Weekly posts go live", "Calendar shared by the 25th."],
    ["One page report", "First working day of each month."]
  ]);
}

/* ---------- the free week, the giveaway ---------- */
function freeWeek({ where = "freeband" } = {}) {
  const concepts = require("../../assets/data/concepts.js").slice(0, 5);
  return `<div class="fw">
<div class="fw__copy">
${eyebrow("The free week")}
<h2>Your next 5 posts are on me.</h2>
<p class="fw__lead">See if I can give you what you need. If I can, we work together. If not, you keep the posts.</p>
<div class="btns">${btn("Get 5 free posts", "/freeweek/", { kind: "primary", size: "lg", cta: where, offer: "freeweek" })}</div>
<ul class="fw__ticks">${["No card", "No contract", "Yours to keep"].map((t) => `<li>${icon("check")}${esc(t)}</li>`).join("")}</ul>
</div>
<div class="fw__stack" aria-hidden="true">
${concepts.map((c, i) => `<span class="fw__card" style="--i:${i}">${picture({ base: `/assets/concepts/${c.set}-1`, alt: "", width: 560, height: 700, sizes: "200px" })}</span>`).join("\n")}
<span class="fw__badge"><b>5</b>free posts</span>
</div>
</div>
${flow([
    ["Day 1", "You send a short brief."],
    ["Days 2 to 6", "I plan, write and design."],
    ["Day 7", "5 finished posts land in your inbox."],
    ["Then", "You decide. No pressure."]
  ], { cls: "route--fw" })}`;
}

function timing() {
  const items = [["Free audit", "3 working days"], ["Free week", "7 days from a complete brief"], ["Monthly calendar", "by the 25th"], ["Monthly report", "first working day"], ["Replies", "within one working day"]];
  return `<div class="timing"><h3>How long things take</h3><dl class="timing__list">${items.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></div>`;
}

/* the monthly report, one page, with the five parts explained */
function reportSample() {
  const parts = [
    ["Three numbers that moved", "The ones tied to the thing you are judged on, with last month beside them."],
    ["What drove them", "The two or three posts, emails or replies that did the work, so you know what to do more of."],
    ["What changes next month", "The decisions I'm making with the calendar, written down before I make them."],
    ["Next month at a glance", "The four weeks, what goes out in each, and the dates that matter."],
    ["One question for you", "The single thing I need from you this month, so nothing waits on a meeting."]
  ];
  return `<div class="report">
<div class="report__copy">
${eyebrow("The one page report")}
<h3>From a dashboard export to one page you can forward.</h3>
<p>Five parts, one page, every month. Ready to forward to your board.</p>
<ol class="report__parts">${parts.map(([k]) => `<li><b>${esc(k)}</b></li>`).join("")}</ol>
<div class="seg" role="tablist" aria-label="Show a sample report for">
<button class="seg__btn" role="tab" type="button" aria-selected="true" data-report="assoc">Associations</button>
<button class="seg__btn" role="tab" type="button" aria-selected="false" data-report="dmc" tabindex="-1">DMCs and operators</button>
<button class="seg__btn" role="tab" type="button" aria-selected="false" data-report="hotel" tabindex="-1">Hotels</button>
</div>
<p class="report__measure" id="reportMeasure">New member signups, event registrations, sponsor visibility and newsletter growth.</p>
</div>
<article class="sheet sheet--report" id="reportPage" aria-live="polite">
<header class="sheet__top"><span>Monthly report, <span id="rpWho">sample travel association</span></span><span>September</span></header>
<h4 class="sheet__h">Three numbers that moved</h4>
<div class="sheet__stats">
<div class="stat"><b id="rs1v">18</b><span id="rs1k">new member signups</span><em id="rs1d">up 7 on August</em></div>
<div class="stat"><b id="rs2v">214</b><span id="rs2k">summit registrations</span><em id="rs2d">up 31%</em></div>
<div class="stat"><b id="rs3v">4,180</b><span id="rs3k">newsletter subscribers</span><em id="rs3d">up 260</em></div>
</div>
<div class="sheet__cols">
<div><h4 class="sheet__h">What drove them</h4><ul id="rpDrove"><li>Member spotlight carousels on LinkedIn, reshared by the members themselves</li><li>The early bird reminder email, opened by 46% of the list</li></ul></div>
<div><h4 class="sheet__h">What changes next month</h4><ul id="rpNext"><li>Sponsor posts move to Tuesdays, when members are most active</li><li>A registration link goes on every speaker post</li></ul></div>
</div>
<h4 class="sheet__h">Next month at a glance</h4>
<ol class="sheet__weeks" id="rpWeeks"><li><b>Week 1</b>Speaker of the week starts, one Reel from the venue</li><li><b>Week 2</b>Member spotlight, two carousels, the sponsor post</li><li><b>Week 3</b>Early bird closes, the reminder email, the countdown</li><li><b>Week 4</b>Behind the summit, the agenda carousel, the report</li></ol>
<p class="sheet__ask"><b>One question for you</b><span id="rpAsk">Which three speakers can I announce first?</span></p>
<p class="sheet__foot">Sample report. The numbers are illustrative.</p>
</article>
</div>`;
}

/* ---------- the audit sample, moved from the homepage ---------- */
function reportCard() {
  const bars = [["Website", 6], ["Social", 5], ["Email", 3], ["Search", 4]];
  return `<article class="scorecard" data-scorecard>
<header class="sheet__top"><span>Free audit, sample DMC, Kathmandu</span><span>Summary</span></header>
<div class="scorecard__top">
<div><h3>Where you stand today</h3><p>Four areas scored out of 10, then the three fixes worth doing first.</p></div>
${num("4.5", "overall, out of 10")}
</div>
<ul class="meters meters--card">
${bars.map(([k, v]) => `<li><span>${k}</span><i style="--v:${v / 10}"><b></b></i><b>${v}</b></li>`).join("")}
</ul>
<h4>Fix these three first</h4>
<ol class="fixes">
<li>Send a newsletter this month, even a short one. 2,400 past guests haven't heard from you in 74 days.</li>
<li>Point your Instagram bio link at the trip people just saw, not your home page.</li>
<li>Cut your enquiry form from 11 questions to 4.</li>
</ol>
<p class="sheet__foot">Sample pages from a made up DMC. Your report uses your own website and channels, measured and not guessed.</p>
</article>`;
}

function auditViewer() {
  const tab = (id, name, what, score, first) => `<button class="vtab" role="tab" type="button" id="vt-${id}" aria-controls="vp-${id}" aria-selected="${first ? "true" : "false"}"${first ? "" : ' tabindex="-1"'}><span class="vtab__name">${name}</span><span class="vtab__what">${what}</span><span class="vtab__score" aria-hidden="true">${score}</span></button>`;
  const sheet = (id, n, title, score, body, first) => `<article class="sheet${first ? " is-active" : ""}" role="tabpanel" id="vp-${id}" aria-labelledby="vt-${id}" tabindex="0"${first ? "" : " hidden"}>
<header class="sheet__top"><span>Free audit, sample DMC, Kathmandu</span><span>Page ${n} of 5</span></header>
<div class="sheet__title"><h3>${title}</h3><p class="sheet__score"><b>${score}</b><span>out of 10</span></p></div>
${body}
</article>`;
  const checks = (items) => `<ul class="checks">${items.map(([ok, t]) => `<li class="${ok ? "ok" : "no"}">${t}</li>`).join("")}</ul>`;
  const found = (t) => `<p class="sheet__found"><b>The one that matters most</b>${t}</p>`;
  return `<div class="viewer" id="viewer">
<div class="viewer__tabs" role="tablist" aria-label="Pages in a sample audit">
${tab("summary", "Summary", "Your score and the three fixes worth doing first", "4.5", true)}
${tab("website", "Website", "Speed on a phone, the enquiry path, trip pages, tracking", "6")}
${tab("social", "Social", "How often you post, which formats reach people, where the bio link goes", "5")}
${tab("email", "Email", "Your list, how often it hears from you, subject lines, the welcome", "3")}
${tab("search", "Search", "What Google shows for your trips, reviews, your local listing", "4")}
</div>
<div class="viewer__stage"><div class="sheets">
${sheet("summary", 1, "Where you stand today", "4.5", `<ul class="meters"><li><span>Website</span><i style="--v:.6"></i><b>6</b></li><li><span>Social</span><i style="--v:.5"></i><b>5</b></li><li><span>Email</span><i style="--v:.3"></i><b>3</b></li><li><span>Search</span><i style="--v:.4"></i><b>4</b></li></ul>
<h4>Fix these three first</h4><ul class="sheet__fixes"><li>Send a newsletter this month, even a short one. 2,400 past guests haven't heard from you in 74 days.</li><li>Point your Instagram bio link at the trip people just saw, not your home page.</li><li>Cut your enquiry form from 11 questions to 4.</li></ul>`, true)}
${sheet("website", 2, "Website", "6", checks([[true, "Reads well on a phone"], [false, "Takes 6.8 seconds to load on mobile data. Aim for under 3."], [false, "No enquiry button until you scroll past the fold"], [true, "Every trip page has dates and a day by day plan"], [false, "No tracking on booking links, so you can't tell which post sent people"]]) + found("Your enquiry form asks 11 questions before anyone can reach you. Name, email, trip and dates are enough to start a conversation."))}
${sheet("social", 3, "Social", "5", checks([[false, "23 posts in 90 days, and 17 of them in the two weeks before your festival"], [true, "Strong photography that is clearly your own"], [false, "Reels reach 3 times more people than photos, but make up 1 post in 10"], [false, "Bio link goes to the home page"], [true, "Comments get a reply within a day"]]) + found("Posting comes in bursts. A calendar planned a month ahead, three posts a week with one Reel, would keep you in feeds all year instead of only in festival season."))}
${sheet("email", 4, "Email", "3", checks([[true, "2,400 subscribers, most of them past guests"], [false, "Last newsletter went out 74 days ago"], [false, "Subject lines say \"Newsletter 14\" instead of what's inside"], [false, "No welcome email when someone signs up"], [false, "The sign up form only appears on the contact page"]]) + found("Past guests are the people most likely to book again and to send friends. One honest newsletter a month and a three email welcome would put them back to work."))}
${sheet("search", 5, "Search", "4", checks([[true, "First on Google for your own name"], [false, "Not on page one for \"Everest base camp trek from Kathmandu\""], [false, "12 Google reviews, the last one answered eight months ago"], [false, "Every trip page shares one title, so Google can't tell them apart"], [true, "Rated 4.8 on Tripadvisor"]]) + found("Travellers search for the trip, not the company. A proper title on every trip page and a reply to every review is a week of work that pays for years."))}
</div></div>
</div>`;
}

/* ---------- the self scoring quiz, existing code ---------- */
function quiz() {
  const q = (name, area, gap, legend, opts) => `<fieldset class="q${name === "q1" ? " is-active" : ""}" data-area="${attr(area)}" data-gap="${attr(gap)}"><legend>${esc(legend)}</legend><div class="q__opts">${opts.map(([v, l]) => `<label><input type="radio" name="${name}" value="${v}"><span>${esc(l)}</span></label>`).join("")}</div></fieldset>`;
  return `<div class="check" id="selfcheck">
<div class="check__intro"><h2>Score yourself in a minute.</h2><p>Seven quick questions from the same list I audit against. You get a score out of 10 and the gaps worth fixing first.</p></div>
<div class="check__card" id="checkCard">
<div class="check__play" id="checkPlay">
<div class="check__meta"><span id="checkStep">Question 1 of 7</span><button class="check__back" type="button" id="checkBack" hidden>Back</button></div>
<div class="check__progress" aria-hidden="true"><i id="checkBar"></i></div>
<div class="check__qs" id="checkQs">
${q("q1", "Social", "Quiet weeks cost reach you have to buy back later.", "Do you post at least three times a week, every week?", [["1", "Yes"], ["0.5", "Some weeks"], ["0", "No"]])}
${q("q2", "Social", "When everyone owns social media, nobody posts. One named owner fixes that.", "Does one named person own your social media?", [["1", "Yes"], ["0.5", "Sort of"], ["0", "No"]])}
${q("q3", "Email", "Your list is your warmest audience, and silence cools it. One newsletter a month keeps it warm.", "Did your newsletter go out this month?", [["1", "Yes"], ["0.5", "Last month"], ["0", "No"]])}
${q("q4", "Conversion", "Tracked links on every post and email show which ones bring in enquiries.", "Can you see how many enquiries, bookings or signups came from social or email last month?", [["1", "Yes"], ["0.5", "Roughly"], ["0", "No"]])}
${q("q5", "Proof", "One page with three numbers answers the board before they ask.", "Does your board or owner get a marketing report every month?", [["1", "Yes"], ["0.5", "Sometimes"], ["0", "No"]])}
${q("q6", "Website", "Every extra field and tap on a phone loses people who were ready to book.", "Can someone enquire, book or register on your website in under a minute, on their phone?", [["1", "Yes"], ["0.5", "Not sure"], ["0", "No"]])}
${q("q7", "Search", "Travellers search for the trip, not the company. Your pages should answer that search.", "Do you show up on Google for what you sell, and not only for your own name?", [["1", "Yes"], ["0.5", "Not sure"], ["0", "No"]])}
</div>
</div>
<div class="check__result" id="checkResult" hidden tabindex="-1">
<div class="dial" aria-hidden="true"><svg viewBox="0 0 120 120"><circle class="dial__track" cx="60" cy="60" r="52"/><circle class="dial__fill" id="dialFill" cx="60" cy="60" r="52"/></svg><span class="dial__v"><b id="dialNum">0</b><small>of 10</small></span></div>
<div class="check__verdict">
<p class="sr-only" id="checkScoreText"></p>
<h3 id="checkVerdict"></h3>
<ul class="gaps" id="checkGaps"></ul>
<p class="check__next">Want the full version?</p>
<div class="btns">${btn("Get a free audit", "/audit/", { kind: "light", cta: "selfcheck", offer: "audit" })}<button class="check__again" type="button" id="checkAgain">Start again</button></div>
</div>
</div>
</div>
<noscript><p class="check__noscript">The quiz needs JavaScript. The free audit covers the same seven questions and more, written up for you. ${textlink("Get a free audit", "/audit/", { arrow: true })}</p></noscript>
</div>`;
}

/* the checklist request, with organisation type and country added */
function checklistForm() {
  return `<div class="soft" id="checklist">
<div class="soft__copy"><h2>${esc(site.checklistName)}</h2><p>The same checks I run before I touch any account, with a score out of 40 and a 30 day fix plan. I'll email it to you.</p></div>
<form class="capture capture--grid" data-kind="guide" action="${attr(site.formspree)}" method="POST" novalidate>
<input type="hidden" name="_subject" value="Checklist request from pratimnarayan.com">
<input type="hidden" name="request" value="Checklist">
<div class="field"><label for="guideEmail">Your email</label><input id="guideEmail" name="email" type="email" autocomplete="email" inputmode="email" required></div>
<div class="field"><label for="guideOrg">You are</label><div class="select"><select id="guideOrg" name="organisation" required><option value="" selected disabled>Choose one</option>${["Tourism association or trade body", "DMC or tour operator", "Hotel or resort", "Tourism board", "Travel academy", "Travel media or events", "Airline or booking platform", "Other travel brand"].map((v) => `<option>${esc(v)}</option>`).join("")}</select></div></div>
<div class="field"><label for="guideCountry">Country</label><input id="guideCountry" name="country" type="text" autocomplete="country-name" required></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn--light" type="submit">Send me the checklist${ARROW}</button>
<p class="capture__status" role="status" aria-live="polite"></p>
</form>
</div>`;
}

/* the email signup for new episodes, in the footer and on /whatif/ */
function emailSignup({ id = "epmail", dark = true, cls = "" } = {}) {
  return `<form class="capture capture--inline${cls ? " " + cls : ""}" data-kind="whatif" action="${attr(site.formspree)}" method="POST" novalidate>
<input type="hidden" name="_subject" value="What If episode signup from pratimnarayan.com">
<input type="hidden" name="request" value="What If episodes by email">
<div class="field"><label for="${id}">Get each new What If episode by email.</label><input id="${id}" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@yourbrand.com" required></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn--${dark ? "ghost-light" : "ghost"}" type="submit">Sign up</button>
<p class="capture__status" role="status" aria-live="polite"></p>
</form>`;
}

/* ---------- the live clocks ---------- */
function clocks() {
  const spots = site.openSpots ? `<span class="pill pill--note">${esc(site.openSpots)} spots left this month</span>` : "";
  return `<div class="clocks">
<span class="pill pill--open"><i aria-hidden="true"></i>Open for new clients</span>${spots}
<span class="pill" data-clock="Asia/Kolkata" data-place="India"><b>India</b> <span class="pill__t"></span></span>
<span class="pill" data-clock="Europe/London" data-place="London"><b>London</b> <span class="pill__t"></span></span>
<span class="pill" data-clock="America/New_York" data-place="New York"><b>New York</b> <span class="pill__t"></span></span>
</div>`;
}

/* ---------- horizontal rows ---------- */
function row({ id, title, intro, items, cls = "", ariaLabel, headExtra = "", wrapHead = true }) {
  return `<div class="row${cls ? " " + cls : ""}" data-row${id ? ` id="${id}"` : ""}>
<div class="row__head${wrapHead ? " wrap" : ""}">
<div class="row__copy">${when(title, title)}${when(intro, intro)}</div>
<div class="row__arrows"><button class="arrow-btn" type="button" data-dir="-1" aria-label="Scroll back" disabled><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3.5M7.5 3.5 3 8l4.5 4.5"/></svg></button><button class="arrow-btn" type="button" data-dir="1" aria-label="Scroll forward"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"/></svg></button></div>
</div>
<ul class="row__track" tabindex="0" aria-label="${attr(ariaLabel || "Scroll sideways for more")}">${items.map((it) => `<li class="row__item">${it}</li>`).join("\n")}</ul>
<div class="wrap"><div class="row__bar" aria-hidden="true"><i></i></div></div>
${headExtra}
</div>`;
}

/* the concept post card, opening the existing slide viewer */
function conceptCard(c) {
  return `<article class="poster">
<button class="poster__open" type="button" data-set="${c.set}" data-count="${c.count}" data-title="${attr(c.title)}" aria-label="Open the ${attr(c.title)} concept carousel, ${c.count} slides">
${picture({ base: `/assets/concepts/${c.set}-1`, alt: c.alt, width: 560, height: 700, sizes: "(max-width: 720px) 62vw, 300px" })}
<span class="poster__count"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="4.5" y="1.5" width="10" height="10" rx="1"/><path d="M1.5 4.5v9a1 1 0 0 0 1 1h9"/></svg>${c.count} slides</span>
</button>
<div class="poster__cap">${chips([c.format, c.clientType])}<h3>${esc(c.heading)}</h3></div>
</article>`;
}

function lightbox() {
  return `<dialog class="lb" id="lightbox" aria-labelledby="lbTitle">
<div class="lb__inner">
<header class="lb__head"><div>${chip("Concept, the brand is made up")}<p class="lb__title" id="lbTitle"></p></div><span class="lb__count" id="lbCount" aria-live="polite"></span><button class="lb__close" type="button" id="lbClose" aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button></header>
<div class="lb__body"><button class="arrow-btn arrow-btn--light lb__prev" type="button" id="lbPrev" aria-label="Previous slide"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3.5M7.5 3.5 3 8l4.5 4.5"/></svg></button><ul class="lb__track" id="lbTrack" tabindex="0"></ul><button class="arrow-btn arrow-btn--light lb__next" type="button" id="lbNext" aria-label="Next slide"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5"/></svg></button></div>
<div class="lb__dots" id="lbDots" aria-hidden="true"></div>
</div>
</dialog>`;
}

/* the portrait, once per page. variant "profile" is the second photo. */
function portrait({ eager = false, sizes = "(max-width: 880px) 80vw, 400px", cls = "portrait", variant = "" } = {}) {
  const base = variant === "profile" ? "/assets/img/pratim-profile" : "/assets/img/pratim";
  const alt = variant === "profile" ? site.photoProfileAlt : site.photoAlt;
  const loading = eager ? " fetchpriority=\"high\"" : " loading=\"lazy\" decoding=\"async\"";
  return `<picture class="${cls}">
<source type="image/webp" srcset="${base}-720x900.webp 720w, ${base}-1200x1500.webp 1200w" sizes="${sizes}">
<img src="${base}-720x900.jpg" srcset="${base}-720x900.jpg 720w, ${base}-1200x1500.jpg 1200w" sizes="${sizes}" width="720" height="900" alt="${attr(alt)}"${loading}>
</picture>`;
}

/* the four credentials as badges */
function proofLines() {
  const items = [
    ["award", "PATA", "The only candidate selected from north India"],
    ["globe", "ATTA", "First Indian intern, kept on from 3 to 11 months"],
    ["sparkle", "WFTA", "Consultant to the World Food Travel Association"],
    ["book", "Masters", "In Tourism Management"]
  ];
  return `<ul class="badges" data-reveal>${items.map(([ic, k, v]) => `<li class="badge">${icon(ic, "icon badge__icon")}<b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ul>`;
}

const noteBox = () => `<p class="about__note">I take a small number of tourism clients at a time, so yours gets my full attention.</p>`;

function lastUpdated(iso) {
  return `<p class="updated">Last updated <time datetime="${iso}">${fmtDate(iso)}</time></p>`;
}

module.exports = {
  btn, textlink, chip, chips, eyebrow, head, num, breadcrumbs, whatsappUrl, testimonial, logos, partners, scoreCard, scoreboard, numbersBand,
  gapOf, gapMeter, gapChart, beforeAfter, latestCompare, episodeCard, episodeFeature,
  leadForm, offerCards, freeWeekBox, termsBox, promise, plans, endToEnd, film, flow, routeSteps, freeWeek, timing, reportSample, reportCard, auditViewer,
  quiz, checklistForm, emailSignup, clocks, row, conceptCard, lightbox, resultsRow, portrait, proofLines, noteBox, lastUpdated, PRESETS
};
