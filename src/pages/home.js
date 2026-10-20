/* The homepage. */
"use strict";
const site = require("../../assets/data/site.js");
const episodes = require("../../assets/data/whatif.js");
const concepts = require("../../assets/data/concepts.js");
const clients = require("../../assets/data/clients.js");
const faq = require("../../assets/data/faq.js");
const services = require("../../assets/data/services.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, attr, when, picture, icon, ARROW } = require("../lib.js");

const TILE_ICONS = { associations: "users", dmcs: "compass", hotels: "bed", boards: "flag", academies: "cap" };
/* the six questions people ask most, on the homepage */
const homeFaq = [1, 9, 4, 5, 10, 11].map((i) => faq.home[i]);
const SVC_ICONS = { video: "play", email: "mail", ads: "megaphone", websites: "browser", coordination: "calendar" };

module.exports = function () {
  const eps = episodes;
  const phone = concepts.find((c) => c.set === "bhutan");
  const fan = ["kathmandu", "srilanka", "ladakh"].map((s) => concepts.find((c) => c.set === s));
  /* the phone shows the remakes from the live episodes, newest first */
  const shots = eps.map((e) => ({ base: e.single ? `/assets/whatif/${e.slug}/remake` : `/assets/whatif/${e.slug}/slide-1`, alt: e.single ? `${e.brandName}, the remake. ${e.remake.headline}` : `${e.brandName}, the first remake slide. ${e.remakeSlides[0].headline}`, label: e.brandName, jpg: true }));

  const hero = `<section class="hero" id="hero">
<div class="wrap hero__grid">
<div class="hero__copy">
<h1 class="hero__title"><span class="mask"><span class="mask__in">Social media</span></span> <span class="mask"><span class="mask__in">that grows</span></span> <span class="mask"><span class="mask__in">tourism brands</span></span> <span class="mask"><span class="mask__in"><em class="hero__hl">in 90 days.</em></span></span></h1>
<p class="hero__lead hero__fade">I'm Pratim Narayan Moitra. I've run social media for PATA, ATTA, WFTA and GBTA. <b>Your next 5 posts are free.</b></p>
<div class="hero__actions hero__fade">
${C.btn("Get 5 free posts", "/freeweek/", { kind: "primary", size: "lg", cta: "hero", offer: "freeweek" })}
${C.btn("Get a free audit", "/audit/", { kind: "ghost", size: "lg", cta: "hero", offer: "audit" })}
</div>
<p class="hero__sub hero__fade">${C.textlink("See the What If series", "/whatif/", { arrow: true, cta: "hero", offer: "whatif" })} <span class="hero__dot" aria-hidden="true"></span> ${C.textlink("Watch the 30 second film", "#film", { arrow: true, cta: "hero", offer: "film" })}</p>
<ul class="risk hero__fade"><li>5 posts in 7 days</li><li>You keep them</li><li>No lock in</li></ul>
</div>
<div class="herowork hero__fade" data-tilt>
<div class="phone" aria-label="A concept carousel, swipe through the slides">
<div class="phone__screen"><ul class="phone__track" tabindex="0" aria-label="The What If remakes, ${shots.length} posts, scroll sideways">
${shots.map((sh, i) => `<li>${picture({ base: sh.base, alt: sh.alt, width: 1080, height: 1350, sizes: "(max-width: 880px) 70vw, 300px", eager: i === 0 ? "high" : i === 1 ? "eager" : false, jpg: sh.jpg })}<span class="phone__label" aria-hidden="true">${esc(sh.label)}</span></li>`).join("\n")}
</ul></div>
<div class="phone__dots" aria-hidden="true">${shots.map((_, i) => `<i${i === 0 ? ' class="on"' : ""}></i>`).join("")}</div>
</div>
<ul class="fan">
${fan.map((c, i) => `<li class="fan__card" style="--i:${i}">${picture({ base: `/assets/concepts/${c.set}-1`, alt: c.alt, width: 560, height: 700, sizes: "(max-width: 880px) 70vw, 220px" })}${C.chip(c.clientType)}</li>`).join("\n")}
</ul>
</div>
</div>
<div class="wrap hero__proof hero__fade">${C.resultsRow("#results")}</div>
</section>`;

  const partnersSection = `<section class="logoband" aria-labelledby="logos-title">
<div class="wrap">
<p class="logoband__label" id="logos-title">I've worked with</p>
${C.partners()}
${C.testimonial("murray", { cls: "voice--band" })}
</div>
</section>`;

  const results = `<section class="section section--dark results" id="results">
<div class="wrap">
${C.head({ eyebrow: "Results", title: "Quiet accounts, turned into numbers a board can read.", intro: "Three accounts I ran, before and after. The bars are drawn to scale from the real counts." })}
${C.scoreboard()}
${C.numbersBand()}
</div>
</section>`;

  const whatif = `<section class="section" id="whatif">
<div class="wrap">
${C.head({ eyebrow: "The What If series", title: "What if I ran your social media?", intro: "Real tourism posts that got almost no reaction, rebuilt in a tested style. Drag the handle." })}
${C.latestCompare(eps[0], { where: "home" })}
</div>
<div class="section__gap"></div>
${C.row({
    id: "whatif-row",
    cls: "row--episodes",
    title: `<h3 class="row__title">Every episode</h3>`,
    intro: `<p>Hover or tap a cover to see the remake. Open one to drag the before and after.</p>`,
    items: eps.map((e) => C.episodeCard(e)),
    ariaLabel: "What If episodes, scroll sideways for more",
    headExtra: `<div class="wrap row__after">${C.textlink(`See all ${episodes.length} episodes`, "/whatif/", { arrow: true, cta: "whatif-row", offer: "whatif" })}</div>`
  })}
<div class="section__gap"></div>
${C.row({
    id: "work",
    cls: "row--concepts",
    title: `<h3 class="row__title">Concept posts</h3>`,
    intro: `<p>Carousels for made up brands. Tap any cover to swipe through.</p>`,
    items: concepts.map((c) => C.conceptCard(c)),
    ariaLabel: "Concept posts, scroll sideways for more"
  })}
</section>`;

  const who = `<section class="section section--tint" id="clients">
<div class="wrap">
${C.head({ title: "Built for tourism teams." })}
<ul class="tiles" data-reveal>
${clients.map((c, i) => `<li class="tile tile--${i + 1}"><a href="/for/${c.slug}/">${icon(TILE_ICONS[c.slug] || "compass", "icon tile__icon")}<span class="tile__name">${esc(c.label)}</span><span class="tile__line">${esc(c.tile)}</span>${ARROW}</a></li>`).join("\n")}
</ul>
</div>
</section>`;

  const e2e = `<section class="section section--tint" id="endtoend">
<div class="wrap">
${C.endToEnd({ where: "e2e" })}
<div class="filmwrap" id="film">
${C.film({ where: "home" })}
</div>
</div>
</section>`;

  const pains = [
    { word: "Consistency", said: "Nobody really owns our social media.", fix: "Something good goes out every week, planned a month ahead.", link: ["See what ships", "/services/social/"] },
    { word: "Conversion", said: "We have followers. Where are the bookings?", fix: "Social and email, connected, so a post leads to a booking you can trace.", link: ["See the results", "#results"] },
    { word: "Proof", said: "I can't show the board this is working.", fix: "One page a month. Three numbers that moved and why.", link: ["See the report", "#report"] }
  ];
  const problems = `<section class="section" id="problems">
<div class="wrap">
${C.head({ title: "Three things that keep tourism marketers up at night." })}
<div class="pains" data-reveal>
${pains.map((p, i) => `<article class="pain">
<span class="pain__n">0${i + 1}</span>
<h3 class="pain__word">${esc(p.word)}<span>.</span></h3>
<p class="pain__said"><q>${esc(p.said)}</q></p>
<p class="pain__fix">${icon("check")}${esc(p.fix)}</p>
${C.textlink(p.link[0], p.link[1], { arrow: true })}
</article>`).join("\n")}
</div>
</div>
</section>`;

  const freeband = `<section class="section section--tint fwband" id="free">
<div class="wrap">
${C.freeWeek({ where: "freeband" })}
</div>
</section>`;

  const servicesSec = `<section class="section" id="services">
<div class="wrap">
${C.head({ title: "From one post a week to the whole channel." })}
<div class="svc" data-reveal>
<article class="svc__main">
${C.chip("The main product")}
<h3>${esc(site.productName)}</h3>
<p>Strategy, design, Reels, captions, posting, replies and a one page report. Every month.</p>
${C.btn("See what's included", "/services/social/", { kind: "primary", cta: "services", offer: "monthly" })}
</article>
${services.addons.map((a) => `<a class="svc__card" href="/services/${a.slug}/">${icon(SVC_ICONS[a.slug] || "sparkle", "icon svc__icon")}<h3>${esc(a.label)}</h3><p>${esc(a.card)}</p>${ARROW}</a>`).join("\n")}
</div>
</div>
</section>`;

  const plansSec = `<section class="section section--tint" id="plans">
<div class="wrap">
${C.head({ eyebrow: "Plans", title: "Pick how much help you need.", intro: site.showStartingPrice && site.startingPriceText ? esc(site.startingPriceText) : "" })}
<div class="plansgrid">
<div class="plansgrid__main">${C.plans()}</div>
<div class="plansgrid__side">${C.freeWeekBox()}${C.termsBox()}${C.promise()}</div>
</div>
</div>
</section>`;

  const how = `<section class="section" id="how">
<div class="wrap">
${C.head({ title: "From free week to monthly growth." })}
${C.routeSteps()}
<div id="report">${C.reportSample()}</div>
${C.timing()}
</div>
</section>`;

  const about = `<section class="section section--tint" id="team">
<div class="wrap">
<div class="about">
<figure class="about__photo">
${C.portrait()}
</figure>
<div class="about__body">
${C.eyebrow("Who you work with")}
<h2>I plan and approve every post myself.</h2>
${C.noteBox()}
${C.proofLines()}
<div class="about__links">${C.textlink("More about Pratim", "/about/", { arrow: true })}${C.textlink("Watch the 30 second film", "#film", { arrow: true })}</div>
</div>
</div>
<div class="about__voice">${C.testimonial("diego", { cls: "voice--light" })}</div>
</div>
</section>`;

  const faqSec = `<section class="section" id="questions">
<div class="wrap faq">
<div class="faq__intro">
${C.eyebrow("Questions")}
<h2>What people ask before they send a link.</h2>
<p>If yours isn't here, <a href="mailto:${site.email}">email me</a> or <a href="${attr(site.bookingUrl)}" target="_blank" rel="noopener" data-book="faq">book a call</a>.</p>
</div>
<div class="faq__list">
${homeFaq.map((f) => `<details><summary>${esc(f.q)}<span class="faq__x" aria-hidden="true"></span></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join("\n")}
</div>
</div>
</section>`;

  const close = `<section class="section section--dark close" id="book">
<div class="wrap">
${C.head({ title: "Let's get your brand followed and booked." })}
${C.offerCards({ dark: true, where: "close" })}
<div class="close__form" id="request">
${C.leadForm({ preset: "freeweek", page: "/", id: "audit", dark: true, title: "Tell me about your brand", intro: "A few lines are enough. I reply within one working day." })}
</div>
<p class="close__call">Or book a call with Pratim. ${C.textlink("Pick a time", site.bookingUrl, { arrow: true, book: "close", cls: "textlink--light" })}</p>
${C.clocks()}
</div>
</section>`;

  const body = [hero, partnersSection, results, freeband, whatif, who, problems, e2e, servicesSec, plansSec, how, about, faqSec, close].join("\n");
  const nodes = [schema.website(), schema.webPage({ url: "/", name: "Pratim Narayan Moitra, social media for tourism brands", description: "Social media that grows tourism brands in 90 days, by Pratim Narayan Moitra. Worked with PATA, ATTA, WFTA and GBTA. Get 5 free posts in 7 days or a free audit.", dateModified: site.lastUpdated, speakable: [".hero__title", ".hero__lead"] }), schema.business(), schema.personStub(), schema.faqPage(homeFaq)];
  const video = schema.videoObject();
  if (video) nodes.push(video);

  return [{
    path: "/",
    file: "index.html",
    nav: "home",
    bodyClass: "page--home",
    title: "Pratim Narayan Moitra | Social media for tourism brands",
    description: "Social media that grows tourism brands in 90 days, by Pratim Narayan Moitra. Worked with PATA, ATTA, WFTA and GBTA. Get 5 free posts in 7 days or a free audit.",
    ogTitle: "Pratim Narayan Moitra | Social media for tourism brands",
    schema: nodes,
    preload: [{ as: "image", href: `${shots[0].base}-560.webp`, type: "image/webp", imagesrcset: `${shots[0].base}-560.webp 560w, ${shots[0].base}-1080.webp 1080w`, imagesizes: "(max-width: 880px) 70vw, 300px" }],
    images: [{ src: site.ogImage, title: "Pratim Narayan Moitra" }, { src: "/assets/img/pratim-1200x1500.jpg", title: site.photoAlt }],
    body,
    after: C.lightbox(),
    lastmod: site.lastUpdated
  }];
};
