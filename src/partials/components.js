/* ============================================================
   Shared components. Every function returns an HTML string.
   Nothing here depends on JavaScript to be readable.
   ============================================================ */
"use strict";
const site = require("../../assets/data/site.js");
const testimonials = require("../../assets/data/testimonials.js");
const services = require("../../assets/data/services.js");
const styles = require("../../assets/data/styles.js");
const { esc, attr, when, map, picture, ARROW, icon, typeKey, fmtDate, postPicture, PEN_ARROW_UP } = require("../lib.js");

/* ---------- small pieces ---------- */
/* There is one button. A second action beside it is a text link, so the
   kinds ghost and ghost-light come out as links. */
function btn(label, href, o = {}) {
  const data = [
    o.cta ? ` data-cta="${attr(o.cta)}"` : "",
    o.offer ? ` data-offer="${attr(o.offer)}"` : "",
    o.book ? ` data-book="${attr(o.book)}"` : "",
    o.extra || ""
  ].join("");
  const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
  if (o.kind === "ghost" || o.kind === "ghost-light") return `<a class="textlink${o.cls ? " " + o.cls : ""}" href="${attr(href)}"${ext}${data}>${esc(label)}${ARROW}</a>`;
  const cls = ["btn", o.size === "sm" ? "btn--sm" : "", o.block ? "btn--block" : "", o.cls || ""].filter(Boolean).join(" ");
  return `<a class="${cls}" href="${attr(href)}"${ext}${data}>${esc(label)}</a>`;
}

function textlink(label, href, o = {}) {
  const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "";
  const data = (o.cta ? ` data-cta="${attr(o.cta)}"` : "") + (o.offer ? ` data-offer="${attr(o.offer)}"` : "") + (o.book ? ` data-book="${attr(o.book)}"` : "") + (o.extra || "");
  return `<a class="textlink${o.cls ? " " + o.cls : ""}" href="${attr(href)}"${ext}${data}>${esc(label)}${o.arrow ? ARROW : ""}</a>`;
}

const chip = (text, cls = "") => `<span class="chip${cls ? " " + cls : ""}">${esc(text)}</span>`;
const chips = (arr, cls = "") => `<div class="chips${cls ? " " + cls : ""}">${arr.filter(Boolean).map((c) => chip(c)).join("")}</div>`;
const eyebrow = (text) => `<p class="label">${esc(text)}</p>`;

function head({ eyebrow: eb, title, intro, id, cls = "" }) {
  return `<div class="head${cls ? " " + cls : ""}">${when(eb, () => eyebrow(eb))}<h2${id ? ` id="${id}"` : ""}>${title}</h2>${when(intro, () => `<p>${intro}</p>`)}</div>`;
}

/* a big quiet number with its label */
function num(value, label, o = {}) {
  return `<p class="num${o.cls ? " " + o.cls : ""}"><span class="num__v">${esc(value)}</span><span class="num__k">${esc(label)}</span></p>`;
}

function breadcrumbs(list) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${list.map((b, i) => i === list.length - 1
    ? `<li aria-current="page">${esc(b.name)}</li>`
    : `<li><a href="${attr(b.url)}">${esc(b.name)}</a></li>`).join("")}</ol></nav>`;
}

function whatsappUrl() {
  return site.whatsappNumber ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}` : "";
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
  return `<div class="gapmeter" role="img" aria-label="${attr(`This post, ${g.pctLabel} of followers reacted. A post that lands, about 1%.`)}">
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
  return `<div class="gapchart">
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
const splitCountN = (t) => { const m = /^([\d,.]+[KM]?)\s+(.*)$/i.exec(t || ""); return m ? m[1] : "0"; };
const splitCountK = (t) => { const m = /^([\d,.]+[KM]?)\s+(.*)$/i.exec(t || ""); return m ? m[2] : t || ""; };

/* the four numbers under the results, each with an icon */

/* the three results, under the hero and beside forms */
function resultsRow() {
  return `<ul class="figs">${site.headline.map((h) => `<li class="fig"><span class="fig__v">${esc(h.value)}</span><span class="fig__t">${esc(h.label)}</span>${when(h.source, () => `<span class="fig__s">${esc(h.source)}</span>`)}</li>`).join("")}</ul>`;
}

/* ---------- episode cards ---------- */
function episodeCard(ep, o = {}) {
  const base = `/assets/whatif/${ep.slug}/cover`;
  const st = styles[ep.style];
  const g = gapOf(ep);
  const after = ep.single ? `/assets/whatif/${ep.slug}/remake` : `/assets/whatif/${ep.slug}/slide-1`;
  return `<a class="epcard${o.cls ? " " + o.cls : ""}" href="/whatif/${ep.slug}/" data-type="${typeKey(ep.clientType)}">
<span class="epcard__media">
${picture({ base, alt: `${ep.coverLine} The episode cover, with the brand's own post and the remake.`, width: 1080, height: 1350, sizes: o.sizes || "(max-width: 720px) 70vw, 320px", cls: "epcard__cover" })}
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
<div><dt>Followers</dt><dd>${esc(ep.brand.followers)}</dd></div>
<div class="latest__low"><dt>${esc(splitCountK(ep.brand.engagement))}</dt><dd>${esc(splitCountN(ep.brand.engagement))}</dd></div>
${when(g, () => `<div><dt>Followers per reaction</dt><dd>${esc(g.perLabel)}</dd></div>`)}
</dl>
${chips([ep.clientType, ep.region, st ? "Style tested, " + st.name.toLowerCase() : ""])}
${btn("See what changed", `/whatif/${ep.slug}/`, { kind: "primary", cta: "whatif-feature", offer: "whatif" })}
</div>
</div>`;
}

/* ---------- the offers, their button labels and the line shown once a form is sent ---------- */
const PRESETS = {
  freeweek: { looking: "Free week of posts", button: "Get my 5 free posts", done: "Got it. I'll email you a short brief within one working day.", offer: "freeweek" },
  audit: { looking: "Free audit", button: "Get my free audit", done: "Got it. Your written audit arrives within 3 working days.", offer: "audit" },
  monthly: { looking: "Monthly social media", button: "Send", done: "Got it. I'll reply within one working day.", offer: "monthly" },
  other: { looking: "Something else", button: "Send", done: "Got it. I'll reply within one working day.", offer: "other" }
};

/* ---------- the two field form ----------
   One form, in the hero, in the close and on the offer pages. It asks for a
   website or Instagram handle and a work email, and names the offer in a
   hidden field. Once it is sent, one line replaces it and three optional
   questions are offered as a second submission. The quiet link under the
   button, and the address /#audit, switch every copy of the form on the
   page to the audit offer. Without JavaScript it posts straight to Formspree. */
const OFFERS = {
  freeweek: { value: site.primaryOffer, button: PRESETS.freeweek.button, done: PRESETS.freeweek.done, fine: "5 posts in 7 days. Yours to keep. No card, no contract.", swap: "Or get a free audit instead", swapTo: "audit", swapHref: "/audit/" },
  audit: { value: site.secondaryOffer, button: PRESETS.audit.button, done: PRESETS.audit.done, fine: "A written audit in 3 working days. No call needed.", swap: "Or get 5 free posts instead", swapTo: "freeweek", swapHref: "/freeweek/" },
  /* a plain enquiry, on the add on service pages */
  enquiry: { value: "an enquiry", button: PRESETS.other.button, done: PRESETS.other.done, fine: "I reply within one working day." }
};
const ORG_TYPES = ["Tourism association or trade body", "DMC or tour operator", "Hotel or resort", "Tourism board", "Travel academy", "Travel media or events", "Airline or booking platform", "Other travel brand"];

function quickForm({ id = "q", where = "hero", page = "/", offer = "freeweek", fine = "", stack = false, subject = "", extra = "" } = {}) {
  const o = Object.assign({}, OFFERS[offer] || OFFERS.freeweek);
  if (subject) o.value = subject;
  if (!o.swap && !fine) fine = o.fine;
  const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content"].map((k) => `<input type="hidden" name="${k}" value="">`).join("");
  return `<div class="quickwrap" data-quick-wrap data-offer="${offer}" data-offers="${attr(JSON.stringify(OFFERS))}">
<form class="quick${stack ? " quick--stack" : ""}" id="${id}-form" action="${attr(site.formspree)}" method="POST" novalidate data-quick data-where="${attr(where)}">
<input type="hidden" name="offer" value="${attr(o.value)}">
<input type="hidden" name="_subject" value="${attr(o.value)}, from pratimnarayan.com">
<input type="hidden" name="page" value="${attr(page)}">
<input type="hidden" name="placement" value="${attr(where)}">
${utm}
<div class="fld"><label class="fld__l" for="${id}-handle">Your website or Instagram handle</label><input class="fld__i" id="${id}-handle" name="handle" type="text" placeholder="yourbrand.com" autocomplete="off" autocapitalize="off" spellcheck="false" required></div>
<div class="fld"><label class="fld__l" for="${id}-email">Work email</label><input class="fld__i" id="${id}-email" name="email" type="email" placeholder="you@yourbrand.com" autocomplete="email" inputmode="email" required></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn quick__btn" type="submit" data-cta="${attr(where)}" data-offer="${offer}"${extra}>${esc(o.button)}</button>
<p class="form__status" role="status" aria-live="polite"></p>
</form>
${fine
    ? `<p class="fine" data-quick-fine>${esc(fine)}</p>`
    : `<p class="fine" data-quick-fine><span data-quick-finetext>${esc(o.fine)}</span> <a class="fine__a" href="${o.swapHref}" data-quick-swap="${o.swapTo}">${esc(o.swap)}</a></p>`}
<p class="fine fine--privacy" data-quick-privacy>Your details go to my inbox and nowhere else. <a href="/privacy/">Privacy</a></p>
<div class="quick__done" id="${id}-done" hidden tabindex="-1">
<p class="quick__ok" data-quick-ok>${esc(o.done)}</p>
<form class="quick quick--more${stack ? " quick--stack" : ""}" id="${id}-more" action="${attr(site.formspree)}" method="POST" novalidate data-quick-more>
<p class="quick__note">Three optional details help me prepare.</p>
<input type="hidden" name="_subject" value="More detail, from pratimnarayan.com">
<input type="hidden" name="offer" value="${attr(o.value)}"><input type="hidden" name="handle" value=""><input type="hidden" name="email" value="">
<div class="fld"><label class="fld__l" for="${id}-org">Type of organisation</label><select class="fld__i" id="${id}-org" name="organisation"><option value="" selected>Choose one</option>${ORG_TYPES.map((v) => `<option value="${attr(v)}">${esc(v)}</option>`).join("")}</select></div>
<div class="fld"><label class="fld__l" for="${id}-country">Country</label><input class="fld__i" id="${id}-country" name="country" type="text" autocomplete="country-name"></div>
<div class="fld quick__full"><label class="fld__l" for="${id}-budget">Budget you have in mind, optional</label><input class="fld__i" id="${id}-budget" name="budget" type="text" autocomplete="off"></div>
<button class="btn quick__btn" type="submit">Send</button>
<p class="form__status" role="status" aria-live="polite"></p>
</form>
<p class="quick__note" data-quick-thanks hidden>Thanks. That is all I need.</p>
</div>
</div>`;
}

/* ---------- the closing band ----------
   The one dark band on a page, always last. The offer on the left and the
   two field form in a white box on the right. Every page that has one
   gives it the id request, so the header button and the P key land on it. */
function closeBand({ id = "c", where = "close", page = "/", label = "The free week", title = "Your next 5 posts are on me.", text = "", steps = null, pen = "", note = "", boxId = "lead", boxTitle = "Send me your handle.", offer = "freeweek", fine = "", subject = "", extra = "" } = {}) {
  return `<section class="close" id="request">
<div class="wrap close__grid">
<div>
<p class="label close__label">${esc(label)}</p>
<h2 class="h2 close__h">${esc(title)}</h2>
${when(text, () => `<p class="close__p">${text}</p>`)}
${when(steps, () => `<div class="week">
${steps.map(([d, t]) => `<div class="week__row"><span class="week__d">${esc(d)}</span><span>${esc(t)}</span></div>`).join("\n")}
</div>`)}
${when(pen, () => `<p class="pen close__pen">${esc(pen)}</p>`)}
${when(note, () => `<p class="close__note">${note}</p>`)}
</div>
<div class="reqbox" id="${boxId}">
<h3 class="reqbox__h">${esc(boxTitle)}</h3>
${quickForm({ id, where, page, offer, stack: true, fine, subject, extra })}
</div>
</div>
</section>`;
}

/* the one line quote with a face, under the hero form */
function vouch(key = "diego") {
  const t = testimonials[key];
  return `<div class="vouch">
<picture><source type="image/webp" srcset="${t.photo}.webp"><img class="vouch__img" src="${t.photo}.jpg" width="400" height="400" alt="${attr(t.name)}"></picture>
<div><blockquote class="vouch__q">\u201C${esc(t.excerpt || t.quote)}\u201D</blockquote><p class="vouch__who">${esc(t.name)}, ${esc(t.title.replace(" at the ", ", "))}</p></div>
</div>`;
}

/* the fan of three posts in the hero, from heroPosts, with the pen note and
   its arrow. The caption says the brands are not clients until every post
   in the list is a client post. */
function heroFan() {
  const posts = site.heroPosts.slice(0, 3);
  const allClient = posts.every((p) => p.kind === "client");
  return `<div class="fan" data-pen>
${posts.map((p, i) => postPicture(p, { cls: `fan__p fan__p${i + 1}`, eager: i === 1 ? "high" : true })).join("\n")}
<p class="pen fan__note">5 like these, yours in 7 days</p>
${PEN_ARROW_UP}
</div>
${when(!allClient, `<p class="fan__cap">Concept posts and remakes from my What If series.</p>`)}`;
}

/* the proof row under the hero. The three figures from headline, each
   with its source line, then the logos in greyscale. */
function proofRow() {
  const logos = site.partners.filter((p) => p.logo);
  return `<section class="proof" aria-label="Results and clients">
<div class="wrap">
<ul class="proof__grid">
${site.headline.map((h) => `<li class="fig"><span class="fig__v">${esc(h.value)}</span><span class="fig__t">${esc(h.label)}</span>${when(h.source, () => `<span class="fig__s">${esc(h.source)}</span>`)}</li>`).join("\n")}
</ul>
<div class="logos">
<span class="label">Worked with</span>
${logos.map((p) => `<picture><source type="image/webp" srcset="/assets/logos/${p.logo}.webp"><img class="logos__img" src="/assets/logos/${p.logo}.png" width="${p.w}" height="${p.h}" alt="${attr(p.alt || p.name)}" loading="lazy" decoding="async"></picture>`).join("\n")}
</div>
</div>
</section>`;
}

/* ---------- the homepage results ----------
   One large card with the before and after bars drawn to scale from the
   first entry in results, two smaller cards, then the two testimonials. */
function resultCards() {
  const [big, ...rest] = site.results;
  const pct = (big.before / big.after * 100).toFixed(2).replace(/\.?0+$/, "");
  return `<div class="res__grid">
<div class="card">
<p class="card__v card__v--big">${esc(big.value)}</p>
<p class="card__t">${esc(big.label)}</p>
<p class="card__s">${esc(big.who)}</p>
<div class="sbars">
<div class="sbar"><span>Before</span><span class="sbar__track"><span class="sbar__fill" style="width:${pct}%"></span></span></div>
<div class="sbar"><span></span><span class="sbar__n">${esc(big.bl)} ${esc(big.unit || "")}</span></div>
<div class="sbar"><span>After</span><span class="sbar__track"><span class="sbar__fill sbar__fill--after" style="width:100%"></span></span></div>
<div class="sbar"><span></span><span class="sbar__n">${esc(big.al)} ${esc(big.unit || "")}</span></div>
</div>
<p class="card__p">${esc(big.short || big.context)}</p>
${when(big.pen, () => `<p class="pen card__pen">${esc(big.pen)}</p>`)}
</div>
<div class="res__side">
${rest.map((r) => `<div class="card">
<p class="card__v">${esc(r.value)}</p>
<p class="card__t">${esc(r.label)}</p>
<p class="card__s">${esc(r.who)}</p>
<p class="card__p">${esc(r.short || r.context)}</p>
</div>`).join("\n")}
</div>
</div>`;
}

/* one result as a card, for the client type pages */
function resultCard(r) {
  return `<div class="card card--one">
<p class="card__v card__v--big">${esc(r.value)}</p>
<p class="card__t">${esc(r.label)}</p>
<p class="card__s">${esc(r.who)}</p>
<p class="card__p">${esc(r.context)}</p>
</div>`;
}

/* a testimonial as a card, quoted exactly, with the highlighter on one phrase */
function quoteCard(key, o = {}) {
  const t = testimonials[key];
  let q = esc(t.quote);
  if (o.highlight !== false && t.highlight && t.quote.includes(t.highlight)) q = q.replace(esc(t.highlight), `<span class="hl">${esc(t.highlight)}</span>`);
  return `<figure class="quote${o.cls ? " " + o.cls : ""}">
<blockquote class="quote__q">\u201C${q}\u201D</blockquote>
<figcaption class="quote__by"><picture><source type="image/webp" srcset="${t.photo}.webp"><img class="quote__img" src="${t.photo}.jpg" width="400" height="400" alt="" loading="lazy" decoding="async"></picture><span><span class="quote__n">${esc(t.name)}</span>${esc(t.title)}</span></figcaption>
</figure>`;
}

/* the grid of six posts under What I do, from homePosts */
function postsGrid() {
  const posts = site.homePosts.slice(0, 6);
  const allClient = posts.every((p) => p.kind === "client");
  return `<ul class="posts" aria-label="Six posts, scroll sideways on a phone">
${posts.map((p) => `<li class="posts__item">${postPicture(p, { cls: "posts__img" })}</li>`).join("\n")}
</ul>
<p class="posts__cap">${when(!allClient, "Concept posts and What If remakes. The brands shown are not clients. ")}<a href="/whatif/">See the What If series</a></p>`;
}

/* the questions. Plain headings and answers, all open. Under 760 pixels
   JavaScript turns each heading into a button and folds all but the first. */
function questions(items, id = "qa") {
  return `<div class="qas" data-qas>
${items.map((f, i) => `<div class="qa"><h3 class="qa__q" id="${id}-${i + 1}-q"><span>${esc(f.q)}</span></h3><p class="qa__a" id="${id}-${i + 1}-a">${esc(f.a)}</p></div>`).join("\n")}
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
<ol class="e2e__steps">
${e.steps.map((s2, i) => `<li class="e2e__step">${icon(E2E_ICONS[i % E2E_ICONS.length], "icon e2e__icon")}<span class="e2e__n">${String(i + 1).padStart(2, "0")}</span><h3>${esc(s2.name)}</h3><p>${esc(s2.short || s2.text)}</p></li>`).join("\n")}
</ol>
</div>`;
}

/* ---------- the intro film ---------- */
function film({ where = "film", eager = false } = {}) {
  const f = site.film;
  if (!f || !f.src) return "";
  return `<div class="film__wrap">
<figure class="film" data-film="${attr(where)}">
<video class="film__video" controls preload="${eager ? "metadata" : "none"}" playsinline poster="${attr(f.poster)}" width="${f.width}" height="${f.height}" aria-label="${attr(f.title)}">
<source src="${attr(f.src)}" type="video/mp4">
</video>
<figcaption><b>${esc(f.title)}.</b> ${esc(f.caption || "")}</figcaption>
</figure>
${when(f.transcript && f.transcript.length, () => `<details class="film__text">
<summary>Read what the film shows</summary>
<ol>${f.transcript.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
</details>`)}
</div>`;
}

/* a button that copies a page's full address, so it can be pasted into an
   email signature or a message. Without JavaScript it stays hidden. */
function copyLink(pathname) {
  return `<button class="copylink" type="button" data-copy="${attr(site.url + pathname)}" hidden>Copy the link</button>`;
}

/* ---------- how it works ----------
   A timeline of steps, drawn like the first 90 days on the homepage.
   flow() takes any list of [title, line]. */
function flow(steps, { cls = "" } = {}) {
  return `<ol class="days${cls ? " " + cls : ""}">
${steps.map(([t, d], i) => `<li class="day${i === steps.length - 1 ? " day--last" : ""}"><span class="day__dot" aria-hidden="true"></span><h3 class="day__h">${esc(t)}</h3><p class="day__p">${esc(d)}</p></li>`).join("\n")}
</ol>`;
}
function routeSteps() {
  return flow([
    ["Free week", "5 posts in 7 days."],
    ["Your 90 day plan", "Agreed in week one."],
    ["Weekly posts go live", "Calendar shared by the 25th."],
    ["One page report", "First working day of each month."]
  ]);
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

/* ---------- the audit sample ---------- */
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
<div class="fld"><label class="fld__l" for="guideEmail">Your email</label><input class="fld__i" id="guideEmail" name="email" type="email" autocomplete="email" inputmode="email" required></div>
<div class="fld"><label class="fld__l" for="guideOrg">You are</label><select class="fld__i" id="guideOrg" name="organisation" required><option value="" selected disabled>Choose one</option>${ORG_TYPES.map((v) => `<option>${esc(v)}</option>`).join("")}</select></div>
<div class="fld"><label class="fld__l" for="guideCountry">Country</label><input class="fld__i" id="guideCountry" name="country" type="text" autocomplete="country-name" required></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn" type="submit">Send me the checklist</button>
<p class="capture__status" role="status" aria-live="polite"></p>
</form>
</div>`;
}

/* the email signup for new episodes, in the footer and on /whatif/ */
function emailSignup({ id = "epmail", dark = true, cls = "" } = {}) {
  return `<form class="capture capture--inline${cls ? " " + cls : ""}" data-kind="whatif" action="${attr(site.formspree)}" method="POST" novalidate>
<input type="hidden" name="_subject" value="What If episode signup from pratimnarayan.com">
<input type="hidden" name="request" value="What If episodes by email">
<div class="fld"><label class="fld__l" for="${id}">Get each new What If episode by email.</label><input class="fld__i" id="${id}" name="email" type="email" autocomplete="email" inputmode="email" placeholder="you@yourbrand.com" required></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn" type="submit">Sign up</button>
<p class="capture__status" role="status" aria-live="polite"></p>
</form>`;
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

/* the portrait, once per page. variant "profile" is the second photo. */
function portrait({ eager = false, sizes = "(max-width: 880px) 80vw, 400px", cls = "portrait", variant = "" } = {}) {
  const base = variant === "profile" ? "/assets/img/pratim-profile" : "/assets/img/pratim";
  const alt = variant === "profile" ? site.photoProfileAlt : site.photoAlt;
  const loading = eager ? " fetchpriority=\"high\"" : " loading=\"lazy\" decoding=\"async\"";
  return `<picture class="${cls}">
<source type="image/webp" srcset="${base}-720x900.webp 720w, ${base}-1200x1500.webp 1200w" sizes="${sizes}">
<img src="${base}-720x900.jpg" width="720" height="900" alt="${attr(alt)}"${loading}>
</picture>`;
}

/* the four credentials as badges */
function proofLines() {
  const items = [
    ["award", "PATA", "The only candidate selected from north India"],
    ["globe", "ATTA", "First Indian intern, kept on from 3 to 11 months"],
    ["sparkle", "WFTA", "Digital systems and marketing for the World Food Travel Association"],
    ["book", "Masters", "In Tourism Management"]
  ];
  return `<ul class="badges">${items.map(([ic, k, v]) => `<li class="badge">${icon(ic, "icon badge__icon")}<b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ul>`;
}

const noteBox = () => `<p class="about__note">I take a small number of tourism clients at a time, so yours gets my full attention.</p>`;

function lastUpdated(iso) {
  return `<p class="updated">Last updated <time datetime="${iso}">${fmtDate(iso)}</time></p>`;
}

module.exports = {
  btn, textlink, chip, chips, eyebrow, head, num, breadcrumbs, whatsappUrl,
  gapOf, gapMeter, gapChart, beforeAfter, episodeCard, episodeFeature,
  quickForm, closeBand, copyLink, vouch, heroFan, proofRow, resultCards, resultCard, quoteCard, postsGrid, questions, OFFERS,
  freeWeekBox, termsBox, promise, plans, endToEnd, film, flow, routeSteps, timing, reportSample, reportCard, auditViewer,
  quiz, checklistForm, emailSignup, row, resultsRow, portrait, proofLines, noteBox, lastUpdated, PRESETS
};
