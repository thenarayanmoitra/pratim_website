/* /freeweek/ and /audit/, section 12 of the brief. */
"use strict";
const site = require("../../assets/data/site.js");
const faq = require("../../assets/data/faq.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, PEN_UNDERLINE } = require("../lib.js");

function freeweek() {
  const days = [
    ["Day 0", "Brief received."],
    ["Day 1", "Style direction and 5 post ideas for your approval."],
    ["Day 3", "Posts 1 to 3 as drafts."],
    ["Day 5", "Posts 4 and 5 with all captions."],
    ["Day 6", "One round of edits."],
    ["Day 7", "Final files, a short walkthrough video and a one page plan for your next 90 days."]
  ];
  const asks = ["Who books with you.", "What you want to sell in the next 30 days.", "Dates coming up.", "Accounts you admire.", "Words you always use and never use.", "Where your photos are.", "Who approves posts."];
  const body = `<section class="pagehero">
<div class="wrap pagehero__grid">
<div>
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "Free week", url: "/freeweek/" }])}
<h1 data-pen>Your next 5 posts, <span class="mark">free.${PEN_UNDERLINE}</span></h1>
<p class="lead">Tell me about your brand in a short brief. In 7 days you get 5 finished posts with captions, ready to publish. Keep them, whether we work together or not.</p>
<div class="btns">${C.btn("Start my free week", "#request", { kind: "primary", cta: "freeweek-hero", offer: "freeweek" })}${C.textlink("See the What If series", "/whatif/", { arrow: true })}</div>
</div>
<aside class="pagehero__aside">
<ul class="risk risk--stack"><li>5 posts in 7 days</li><li>Captions included</li><li>Yours to keep, no card, no contract</li></ul>
</aside>
</div>
</section>
<section class="section section--tint">
<div class="wrap tlgrid">
<div>
${C.head({ title: "The 7 days, step by step." })}
<ol class="days days--v">
${days.map(([d, t], n) => `<li class="day${n === days.length - 1 ? " day--last" : ""}"><span class="day__dot" aria-hidden="true"></span><h3 class="day__h">${d}</h3><p class="day__p">${esc(t)}</p></li>`).join("\n")}
</ol>
</div>
<aside class="asks">
<h3>What I'll ask you</h3>
<ul class="ticks">${asks.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
<p class="small">One free week per brand. For tourism and hospitality businesses with a live website. I use your own photos or licensed stock, and I never post to your accounts during the free week.</p>
</aside>
</div>
</section>
<section class="sec">
<div class="wrap">
<h2 class="h2">Three questions people ask first.</h2>
${C.questions(faq.freeweek, "fq")}
</div>
</section>
${C.closeBand({ id: "c", where: "freeweek-page", page: "/freeweek/", label: "The free week", title: "Your next 5 posts are on me.", text: "I reply within one working day with a short brief. A few lines on each point is enough.", pen: "yours to keep either way", boxTitle: "Send me your handle.", fine: "No card. No contract. I reply within one working day." })}`;
  return {
    path: "/freeweek/",
    file: "freeweek/index.html",
    nav: "",
    bodyClass: "page--freeweek",
    title: "Free week. 5 social media posts for your tourism brand in 7 days",
    description: "Your next 5 social media posts free, with captions, 7 days after a short brief. For tourism associations, DMCs, hotels and tourism boards. You keep them either way.",
    schema: [schema.personStub(), schema.faqPage(faq.freeweek)],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Free week", url: "/freeweek/" }],
    body,
    lastmod: site.lastUpdated
  };
}

function audit() {
  const body = `<section class="pagehero">
<div class="wrap pagehero__grid">
<div>
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "Free audit", url: "/audit/" }])}
<h1 data-pen>Send me your website. Get back <span class="mark">a written audit.${PEN_UNDERLINE}</span></h1>
<p class="lead">A written report covering your website, social, email and search, in your inbox within 3 working days, with the three fixes worth doing first. Every audit includes one of your own posts, remade. No call needed. Built for tourism associations, DMCs, hotels and tourism boards.</p>
<div class="btns">${C.btn("Get my free audit", "#request", { kind: "primary", cta: "audit-hero", offer: "audit" })}</div>
</div>
<aside class="pagehero__aside">
<ul class="risk risk--stack"><li>Written, so you can forward it</li><li>Scored out of 10, four areas</li><li>In 3 working days, no call needed</li></ul>
</aside>
</div>
</section>
<section class="section section--tint">
<div class="wrap scoregrid">
<div class="scoregrid__copy">
${C.head({ title: "What the report card looks like." })}
<ul class="ticks">
<li>A score for your website, social, email and search</li>
<li>What I found, in plain English, with the numbers behind it</li>
<li>The three fixes worth doing first, whoever does them</li>
<li>One of your own posts, remade, in every audit</li>
<li>Written, so you can forward it to your board or owner</li>
</ul>
</div>
${C.reportCard()}
</div>
</section>
<section class="section">
<div class="wrap">
${C.head({ title: "The five pages inside a sample audit." })}
${C.auditViewer()}
</div>
</section>
${C.closeBand({ id: "c", where: "audit-page", page: "/audit/", label: "The free audit", title: "Request your free audit.", text: `The report lands in your inbox within 3 working days, from ${site.email}, with one of your own posts remade. No call needed and nobody will chase you. If you'd rather talk first, ${C.textlink("book a call", site.bookingUrl, { book: "audit-page" })}.`, boxTitle: "Send me your website.", offer: "audit" })}`;
  return {
    path: "/audit/",
    file: "audit/index.html",
    nav: "",
    bodyClass: "page--audit",
    title: "Free written audit of your tourism marketing in 3 working days",
    description: "A free written audit of your tourism brand's website, social, email and search, scored out of 10, with three fixes and one post remade. In 3 working days.",
    schema: [schema.personStub()],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Free audit", url: "/audit/" }],
    body,
    lastmod: site.lastUpdated
  };
}

module.exports = () => [freeweek(), audit()];
