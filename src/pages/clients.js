/* Client type pages, section 16 of the brief. */
"use strict";
const site = require("../../assets/data/site.js");
const clients = require("../../assets/data/clients.js");
const episodes = require("../../assets/data/whatif.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, when } = require("../lib.js");

function page(c) {
  /* the result that fits this client type best, from site.results */
  const RESULT = { growth: 0, engagement: 1, pata: 2 };
  const result = site.results[RESULT[c.caseSlug] == null ? 0 : RESULT[c.caseSlug]];
  const eps = episodes.filter((e) => e.clientType === c.clientType).sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
  const body = `<section class="pagehero">
<div class="wrap pagehero__grid">
<div>
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "Who I work with", url: "/#clients" }, { name: c.label, url: `/for/${c.slug}/` }])}
<h1>${esc(c.headline)}</h1>
<p class="lead">${esc(c.intro)}</p>
<p class="summary">Social media for ${esc(c.label.toLowerCase())} by Pratim Narayan Moitra. Start with 5 free posts in 7 days or a free written audit.</p>
<div class="btns">${C.btn("Get 5 free posts", "/freeweek/", { kind: "primary", size: "lg", cta: "client-hero", offer: "freeweek" })}${C.btn("Get a free audit", "/audit/", { kind: "ghost", size: "lg", cta: "client-hero", offer: "audit" })}</div>
</div>
<aside class="pagehero__aside">${C.resultsRow("/#results")}</aside>
</div>
</section>
<section class="section section--dark">
<div class="wrap">
${C.head({ title: "The result that fits you best." })}
<div class="scores scores--one" data-reveal>${C.scoreCard(result, { cls: "score--wide" })}</div>
<p class="small">${C.textlink("All the numbers", "/#results", { arrow: true, cls: "textlink--light" })}</p>
</div>
</section>
${when(eps.length, () => `<section class="section">
${C.row({
    cls: "row--episodes",
    title: `<h2>What If, for ${esc(c.label.toLowerCase())}</h2>`,
    intro: `<p>I rebuild one post from a brand like yours. Drag to compare.</p>`,
    items: eps.map((e) => C.episodeCard(e)),
    ariaLabel: "What If episodes, scroll sideways for more",
    headExtra: `<div class="wrap row__after">${C.textlink("See all episodes", "/whatif/", { arrow: true })}</div>`
  })}
</section>`)}
<section class="section section--tint">
<div class="wrap">
<p class="eyebrow">What a past client said</p>
${C.testimonial(c.testimonial, { cls: "voice--light" })}
</div>
</section>
<section class="section">
<div class="wrap formwrap">
<div class="formwrap__copy"><h2>Start with 5 free posts.</h2><p>Tell me about your ${esc(c.label.toLowerCase().replace(/s$/, "").replace("dmcs and tour operator", "DMC or tour operator"))} in a short brief. In 7 days you get 5 finished posts with captions. Keep them either way.</p></div>
${C.leadForm({ preset: "freeweek", page: `/for/${c.slug}/`, id: "lead" })}
</div>
</section>`;
  return {
    path: `/for/${c.slug}/`,
    file: `for/${c.slug}/index.html`,
    nav: "",
    bodyClass: "page--client",
    title: c.title,
    description: c.description,
    schema: [schema.personStub()],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Who I work with", url: "/#clients" }, { name: c.label, url: `/for/${c.slug}/` }],
    body,
    lastmod: site.lastUpdated
  };
}

module.exports = () => clients.map(page);
