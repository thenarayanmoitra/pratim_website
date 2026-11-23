/* Service pages, section 15 of the brief. */
"use strict";
const site = require("../../assets/data/site.js");
const services = require("../../assets/data/services.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, icon, ARROW } = require("../lib.js");

const SVC_ICONS = { video: "play", email: "mail", ads: "megaphone", websites: "browser", coordination: "calendar" };

function social() {
  const s = services.main;
  const body = `<section class="pagehero">
<div class="wrap pagehero__grid">
<div>
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "Services", url: "/services/social/" }, { name: site.productName, url: "/services/social/" }])}
<h1>${esc(site.productName)}</h1>
<p class="lead">${esc(s.subhead)}</p>
<p class="summary">Monthly social media management for tourism associations, DMCs, hotels and tourism boards. Carousels and photo posters, captions, community replies and a one page report, with a growth target we agree in writing in week one.</p>
<div class="btns">${C.btn("Start with 5 free posts", "#request", { kind: "primary", cta: "service-hero", offer: "freeweek" })}${C.btn("Get a free audit", "/audit/", { kind: "ghost", cta: "service-hero", offer: "audit" })}</div>
</div>
<aside class="pagehero__aside"><ul class="risk risk--stack"><li>Growth target agreed in week one</li><li>Calendar by the 25th</li><li>Report on the first working day</li></ul></aside>
</div>
</section>
<section class="section section--tint">
<div class="wrap">
${C.head({ title: "What ships each month." })}
<dl class="ships">${s.ships.map((x) => `<div class="ships__item"><dt>${esc(x.name)}</dt><dd>${esc(x.text)}</dd></div>`).join("")}</dl>
</div>
</section>
<section class="section">
<div class="wrap">${C.endToEnd({ where: "service-e2e" })}</div>
</section>
<section class="section section--tint">
<div class="wrap">
${C.head({ eyebrow: "Plans", title: "Pick how much help you need." })}
<div class="plansgrid">
<div class="plansgrid__main">${C.plans({ where: "service-plans" })}</div>
<div class="plansgrid__side">${C.freeWeekBox({ where: "service-box" })}${C.termsBox()}${C.promise()}</div>
</div>
</div>
</section>
<section class="section">
<div class="wrap">
${C.head({ title: "From free week to monthly growth." })}
${C.routeSteps()}
<div class="reportwrap" id="report">${C.reportSample()}</div>
${C.timing()}
</div>
</section>
<section class="section section--tint">
<div class="wrap">
${C.head({ title: "From one post a week to the whole channel." })}
<div class="svc">
${services.addons.map((a) => `<a class="svc__card" href="/services/${a.slug}/">${icon(SVC_ICONS[a.slug] || "sparkle", "icon svc__icon")}<h3>${esc(a.label)}</h3><p>${esc(a.card)}</p>${ARROW}</a>`).join("\n")}
</div>
</div>
</section>
${C.closeBand({ id: "c", where: "service-page", page: "/services/social/", label: "Start", title: "Tell me about your brand.", text: "Share your budget if you have one in mind and I'll suggest a scope that fits. Or start with the free week and decide after.", boxTitle: "Send me your handle." })}`;
  return {
    path: "/services/social/",
    file: "services/social/index.html",
    nav: "services",
    bodyClass: "page--service",
    title: `${site.productName}. Monthly social media for tourism brands`,
    description: s.description,
    schema: [schema.personStub(), schema.service({ url: "/services/social/", name: `${site.productName}, monthly social media management`, description: s.short, serviceType: "Social media management" })],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Services", url: "/services/social/" }],
    body,
    lastmod: site.lastUpdated
  };
}

function addon(a) {
  const body = `<section class="pagehero">
<div class="wrap pagehero__grid">
<div>
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "Services", url: "/services/social/" }, { name: a.label, url: `/services/${a.slug}/` }])}
<h1>${esc(a.headline)}</h1>
<p class="lead">${esc(a.paras[0])}</p>
<p>${esc(a.paras[1])}</p>
</div>
<aside class="pagehero__aside">
<h2 class="aside__h">What you get</h2>
<ul class="ticks">${a.deliverables.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
</aside>
</div>
</section>
<section class="section section--tint">
<div class="wrap">
<p class="measure callout">Most tourism clients start with social only. If this won't pay off for you yet, I'll say so.</p>
<p class="measure">${C.textlink(`See ${esc(site.productName)}, the main product`, "/services/social/", { arrow: true })}</p>
</div>
</section>
${C.closeBand({ id: "c", where: "addon-page", page: `/services/${a.slug}/`, label: a.label, title: "Tell me what you have in mind.", text: "Send your website or handle and I reply within one working day.", boxTitle: "Send me your handle.", offer: "enquiry", subject: `An enquiry about ${a.label.toLowerCase()}` })}`;
  return {
    path: `/services/${a.slug}/`,
    file: `services/${a.slug}/index.html`,
    nav: "services",
    bodyClass: "page--service",
    title: a.title,
    description: a.description,
    schema: [schema.personStub(), schema.service({ url: `/services/${a.slug}/`, name: a.label, description: a.paras[0], serviceType: a.label })],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Services", url: "/services/social/" }, { name: a.label, url: `/services/${a.slug}/` }],
    body,
    lastmod: site.lastUpdated
  };
}

module.exports = () => [social(), ...services.addons.map(addon)];
