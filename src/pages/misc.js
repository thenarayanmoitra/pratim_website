/* About, start, compare, privacy, hire and the 404 page. Sections 17 to 19 of the brief. */
"use strict";
const site = require("../../assets/data/site.js");
const compare = require("../../assets/data/compare.js");
const episodes = require("../../assets/data/whatif.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, attr, when, fmtDate, ARROW } = require("../lib.js");

function about() {
  const profiles = site.socialProfiles.filter((p) => p.url);
  const body = `<article class="aboutpage">
<header class="pagehero">
<div class="wrap pagehero__grid pagehero__grid--about">
<div>
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "About", url: "/about/" }])}
<h1>Pratim Narayan Moitra</h1>
<p class="lead">${esc(site.summary)}</p>
<div class="btns">${C.btn("Get 5 free posts", "/freeweek/", { kind: "primary", size: "lg", cta: "about-hero", offer: "freeweek" })}${C.textlink("LinkedIn", site.linkedin, { arrow: true })}</div>
</div>
<figure class="about__photo about__photo--page">${C.portrait({ eager: true, sizes: "(max-width: 880px) 80vw, 360px", variant: "profile" })}</figure>
</div>
</header>
<section class="section section--tint">
<div class="wrap facts">
<div class="facts__copy">${C.head({ title: "Quick facts" })}${C.noteBox()}</div>
<dl class="facts__list">
<div><dt>Name</dt><dd>Pratim Narayan Moitra, also written Pratim Narayan and Pratim N. Moitra</dd></div>
<div><dt>Role</dt><dd>Tourism social media marketer. Digital Systems and Marketing Consultant at the World Food Travel Association</dd></div>
<div><dt>Based in</dt><dd>India</dd></div>
<div><dt>Works with</dt><dd>Tourism associations and trade bodies, DMCs and tour operators, boutique hotels and resorts, tourism boards and travel academies</dd></div>
<div><dt>Has worked with</dt><dd>PATA, ATTA, GBTA, the World Food Travel Association and Adventure.travel</dd></div>
<div><dt>Education</dt><dd>Masters in Tourism Management, Amity University. BBA in Marketing</dd></div>
<div><dt>Selected for</dt><dd>PATA internship as the only candidate from north India. First Indian intern at ATTA, extended from 3 to 11 months</dd></div>
<div><dt>Certifications</dt><dd>ATTA and HubSpot Academy</dd></div>
<div><dt>Contact</dt><dd><a href="mailto:${site.email}">${site.email}</a></dd></div>
<div><dt>LinkedIn</dt><dd><a href="${attr(site.linkedin)}" target="_blank" rel="noopener">linkedin.com/in/pratimnarayan</a></dd></div>
${profiles.filter((p) => p.name !== "LinkedIn").map((p) => `<div><dt>${esc(p.name)}</dt><dd><a href="${attr(p.url)}" target="_blank" rel="noopener">${esc(p.url.replace(/^https?:\/\/(www\.)?/, ""))}</a></dd></div>`).join("")}
</dl>
</div>
</section>
<section class="section">
<div class="wrap">
<div class="aboutfilm">
<div class="aboutfilm__copy">
${C.eyebrow("Thirty seconds")}
<h2>A real post, fixed on screen, in one short film.</h2>
<p>If you'd rather watch than read, this is one What If episode done live, the numbers behind me and the offer, in half a minute.</p>
</div>
${C.film({ where: "about" })}
</div>
</div>
</section>
<section class="section section--tint">
<div class="wrap about about--page">
<div class="about__body">
<h2>Where I've worked, and what it taught me.</h2>
${C.proofLines()}
<p class="measure">The Pacific Asia Travel Association picked me as the only intern from north India, and its CEO personally endorsed my work. At the Adventure Travel Trade Association I was the first intern from India, and a 3 month role became 11 months. Today I work with the World Food Travel Association as its Digital Systems and Marketing Consultant, and I run social media end to end for tourism brands in India, Bhutan, the Philippines and the US.</p>
<p class="measure">Since then I've worked with many more tourism brands, on everything from a twelve week content calendar to the whole channel, videos included.</p>
</div>
<div class="about__quotes">${C.testimonial("murray", { cls: "voice--light" })}${C.testimonial("diego", { cls: "voice--light" })}</div>
</div>
</section>
<section class="section">
<div class="wrap howiwork">
${C.head({ title: "How I work" })}
<div class="howiwork__grid">
<div><h3>You see the work before you pay.</h3><p>Every project starts with a free week of posts or a free written audit. If the work isn't right for you, you keep it and we part as friends.</p></div>
<div><h3>One person, start to finish.</h3><p>I plan the calendar, design the posts, write the captions and walk you through the numbers myself. Nothing is handed to someone you haven't met.</p></div>
<div><h3>Your hours, not mine.</h3><p>For US clients, posts and replies are ready before your morning. For European clients, our afternoons overlap, and that's when we talk. I reply within one working day.</p></div>
<div><h3>Proof every month.</h3><p>One page with three numbers that moved, what drove them and what changes next month. Your board can read it in two minutes.</p></div>
<div><h3>End to end, videos included.</h3><p>I work out what goes where and when, make the carousels and the Reels, post them, answer the comments and report the numbers. The whole channel comes off your desk.</p></div>
<div><h3>You see the value, or month four is free.</h3><p>We agree two targets from your own numbers in week one. If we miss them at day 90, the next month costs nothing.</p></div>
</div>
</div>
</section>
<section class="section section--tint">
<div class="wrap">
${C.head({ title: "Two ways to start." })}
${C.offerCards({ where: "about" })}
${C.lastUpdated(site.lastUpdated)}
</div>
</section>
</article>`;
  return {
    path: "/about/",
    file: "about/index.html",
    nav: "about",
    bodyClass: "page--about",
    title: "About Pratim Narayan Moitra",
    description: "Pratim Narayan Moitra is a tourism social media marketer based in India who has worked with PATA, ATTA, the World Food Travel Association and GBTA.",
    ogType: "profile",
    schema: [schema.profilePage(site.lastUpdated), schema.website(), schema.business()].concat(schema.videoObject() ? [schema.videoObject()] : []),
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "About", url: "/about/" }],
    body,
    lastmod: site.lastUpdated
  };
}

function start() {
  const latest = episodes.slice().sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1))[0];
  const wa = C.whatsappUrl();
  const body = `<section class="startpage">
<div class="wrap startpage__in">
<p class="brand brand--big">pratim <em>n.</em> moitra</p>
<h1>Social media for tourism brands, with a free week to start.</h1>
<p class="lead">Pratim Narayan Moitra. I've worked with PATA, ATTA, WFTA and GBTA.</p>
<nav class="stack" aria-label="Start here">
${C.btn("5 free posts", "/freeweek/", { kind: "primary", size: "lg", block: true, cta: "start", offer: "freeweek" })}
${C.btn("Free audit", "/audit/", { kind: "ghost", size: "lg", block: true, cta: "start", offer: "audit" })}
${C.btn("Latest What If episode", `/whatif/${latest.slug}/`, { kind: "ghost", size: "lg", block: true, cta: "start", offer: "whatif" })}
${C.btn("The 40 point checklist", "#checklist", { kind: "ghost", size: "lg", block: true, cta: "start", offer: "checklist" })}
${C.btn("The self scoring quiz", "#selfcheck", { kind: "ghost", size: "lg", block: true, cta: "start", offer: "quiz" })}
${when(wa, () => C.btn("WhatsApp me", wa, { kind: "ghost", size: "lg", block: true, extra: ' data-whatsapp="start"', arrow: false }))}
${C.btn("Book a call", site.bookingUrl, { kind: "ghost", size: "lg", block: true, book: "start", arrow: false })}
${C.btn("LinkedIn", site.linkedin, { kind: "ghost", size: "lg", block: true, arrow: false })}
</nav>
</div>
</section>
<section class="section section--dark">
<div class="wrap">${C.quiz()}</div>
</section>
<section class="section section--dark section--flush">
<div class="wrap">${C.checklistForm()}</div>
</section>`;
  return {
    path: "/start/",
    file: "start/index.html",
    nav: "",
    bodyClass: "page--start",
    title: "Start here. Free posts, free audit and the What If series",
    description: "Every free offer from Pratim Narayan Moitra in one place. 5 free posts, a free written audit, the latest What If episode, the 40 point checklist and the quiz.",
    schema: [schema.personStub()],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Start", url: "/start/" }],
    body,
    lastmod: site.lastUpdated
  };
}

function comparePage() {
  const costs = site.compareCosts || {};
  const showCosts = compare.columns.some((c) => costs[c.key]);
  const cell = (v) => v === true ? '<span class="tick" role="img" aria-label="Yes"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg></span>' : v === false ? '<span class="notick" role="img" aria-label="No"></span>' : '<span class="varies">Varies</span>';
  const body = `<section class="pagehero pagehero--tight">
<div class="wrap">
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "Compare", url: "/compare/" }])}
<h1>How this compares.</h1>
<p class="lead">An honest look at the four ways a tourism brand usually gets its social media done. Where a column could go either way, it says so.</p>
</div>
</section>
<section class="section section--tint">
<div class="wrap">
<table class="cmp" data-cmp>
<thead><tr><th scope="col" class="cmp__corner"><span class="sr-only">What you get</span></th>${compare.columns.map((c) => `<th scope="col"${c.key === "pratim" ? ' class="cmp__me"' : ""}>${esc(c.label)}</th>`).join("")}</tr></thead>
<tbody>
${compare.rows.map((r) => `<tr><th scope="row">${esc(r.label)}</th>${compare.columns.map((c) => `<td data-label="${attr(c.label)}"${c.key === "pratim" ? ' class="cmp__me"' : ""}>${cell(r[c.key])}</td>`).join("")}</tr>`).join("\n")}
${when(showCosts, () => `<tr><th scope="row">Typical monthly cost</th>${compare.columns.map((c) => `<td data-label="${attr(c.label)}"${c.key === "pratim" ? ' class="cmp__me"' : ""}><span class="varies">${esc(costs[c.key] || "Varies")}</span></td>`).join("")}</tr>`)}
</tbody>
</table>
${when(showCosts, () => `<p class="small cmp__note">${esc(site.compareCostNote)}</p>`)}
</div>
</section>
<section class="section">
<div class="wrap">
${C.head({ title: "See the work before you decide." })}
${C.offerCards({ where: "compare" })}
</div>
</section>`;
  return {
    path: "/compare/",
    file: "compare/index.html",
    nav: "",
    bodyClass: "page--compare",
    title: "How this compares with an agency, an in house hire or a marketplace",
    description: "How working with Pratim Narayan Moitra compares with a Western travel marketing agency, an in house hire and a freelance marketplace for tourism social media.",
    schema: [schema.personStub()],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Compare", url: "/compare/" }],
    body,
    lastmod: site.lastUpdated
  };
}

function privacy() {
  const body = `<section class="pagehero pagehero--tight">
<div class="wrap">
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "Privacy", url: "/privacy/" }])}
<h1>What I collect, and what I do with it.</h1>
<p class="lead">Short version. I collect what you type into a form, I count page visits, and I never sell anything to anyone.</p>
</div>
</section>
<section class="section section--tint">
<div class="wrap"><article class="prose">
<h2>The free audit request</h2>
<p>When you request an audit, your name, work email, website and the kind of organisation you run go to Formspree, which forwards them to my inbox. If you took the self check first, your score goes along too. I use it to write your audit, email it to you and reply if you write back. You are not added to a mailing list.</p>
<h2>The self check</h2>
<p>Your answers to the seven questions stay in your browser. Nothing is sent anywhere unless you then request an audit, and even then only the final score is included.</p>
<h2>The CV and checklist forms</h2>
<p>When you ask for my CV or the checklist, your email address goes to two places. Formspree forwards it to my inbox so I know who asked. Resend delivers the email with the file attached. I use your address to send what you asked for and to reply if you write back. You are not added to a mailing list.</p>
<h2>Booking a call</h2>
<p>The booking calendar is run by Cal.com. Anything you enter there, such as your name, email and notes, is collected by Cal.com under their own privacy policy and shared with me so the call can happen.</p>
<h2>Analytics</h2>
<p>This site uses Google Analytics to count visits and see which parts of the page get read and which buttons get clicked. That involves cookies set by Google. I look at the numbers in aggregate and make no attempt to identify individual visitors.</p>
<h2>What I never do</h2>
<ul>
<li>Sell, rent or share your details with anyone else</li>
<li>Add you to a newsletter you did not ask for</li>
<li>Run advertising or retargeting pixels</li>
</ul>
<h2>Your choices</h2>
<p>Email me at <a href="mailto:${site.email}">${site.email}</a> and I will delete anything you have sent me. You can block analytics cookies in your browser and the site works exactly the same.</p>
<h2>Changes</h2>
<p>If this policy changes, the new version appears on this page. It was last reviewed on 29 September 2026.</p>
</article></div>
</section>`;
  return {
    path: "/privacy/",
    file: "privacy/index.html",
    nav: "",
    bodyClass: "page--privacy",
    title: "Privacy",
    description: "What pratimnarayan.com collects through its forms, booking calendar and analytics, what happens to it, and how to have it deleted.",
    schema: [schema.personStub()],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Privacy", url: "/privacy/" }],
    body,
    lastmod: "2026-09-29"
  };
}

/* the recruiter page, kept as it was, with the new header and footer. noindex, not linked from the site. */
function hire() {
  const body = `<section class="pagehero">
<div class="wrap hire">
<div class="hire__intro">
<p class="eyebrow">Hiring</p>
<h1>Bring me onto your team in whatever way fits.</h1>
<p class="lead">I've worked with PATA, ATTA, GBTA and the World Food Travel Association. Full time, part time or project by project all work for me, and we'll find the right fit on a call.</p>
<p class="hire__plain">No agency markup and no account managers. You get the person doing the work.</p>
</div>
<div class="hire__pick">
<fieldset class="options">
<legend>How would you like to work together?</legend>
<label class="option"><input type="radio" name="engagement" value="Full time"><span class="option__body"><span class="option__title">Full time</span><span class="option__text">Your in house social media and marketing lead, working your hours.</span></span></label>
<label class="option"><input type="radio" name="engagement" value="Part time"><span class="option__body"><span class="option__title">Part time</span><span class="option__text">Set days each week, enough to keep every channel planned and reported on.</span></span></label>
<label class="option"><input type="radio" name="engagement" value="A project"><span class="option__body"><span class="option__title">A project</span><span class="option__text">A launch or an event campaign, scoped up front with a clear finish line.</span></span></label>
</fieldset>
<div class="cta-row">${C.btn("Book a call", site.bookingUrl, { kind: "primary", book: "hire", extra: ' id="hireBook"' })}<p id="hireNote">Pick one and it goes into your booking, so the call starts in the right place.</p></div>
</div>
</div>
</section>
<section class="section">
<div class="wrap">
<div class="box box--dark cv" id="cv">
<div class="cv__copy"><h2>Get my CV.</h2><p>Leave your work email and I'll send it straight over. It's used only to send the CV, and you won't be added to any list.</p></div>
<form class="capture capture--inline" data-kind="cv" action="${attr(site.formspree)}" method="POST" novalidate>
<input type="hidden" name="_subject" value="CV request from pratimnarayan.com">
<input type="hidden" name="request" value="CV">
<div class="field"><label for="cvEmail">Your work email</label><input id="cvEmail" name="email" type="email" autocomplete="email" inputmode="email" required></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn btn--light" type="submit">Email me the CV</button>
<p class="capture__status" role="status" aria-live="polite"></p>
</form>
</div>
</div>
</section>`;
  return {
    path: "/hire/",
    file: "hire/index.html",
    nav: "",
    bodyClass: "page--hire",
    title: "Hire Pratim Narayan Moitra, tourism social media and email",
    description: "Hiring for a social media or marketing role in tourism? Full time, part time or project by project. Get my CV or book a call.",
    noindex: true,
    schema: [schema.personStub()],
    body,
    lastmod: "2026-09-29"
  };
}

function notFound() {
  const body = `<section class="pagehero pagehero--tight notfound">
<div class="wrap">
<p class="eyebrow">Page not found</p>
<h1>This page took a wrong turn.</h1>
<p class="lead">The link may be old, or the address has a typo. Here are the three places most people are looking for.</p>
<div class="stack stack--short">
${C.btn("Back to the homepage", "/", { kind: "primary", size: "lg", arrow: false })}
${C.btn("Get 5 free posts", "/freeweek/", { kind: "ghost", size: "lg", cta: "404", offer: "freeweek" })}
${C.btn("See the What If series", "/whatif/", { kind: "ghost", size: "lg", cta: "404", offer: "whatif" })}
</div>
</div>
</section>`;
  return {
    path: "/404.html",
    file: "404.html",
    nav: "",
    bodyClass: "page--404",
    title: "Page not found",
    description: "That page isn't here. Head to the homepage, the free week of posts or the What If series.",
    noindex: true,
    schema: [schema.personStub()],
    body,
    skipSitemap: true
  };
}

module.exports = () => [about(), start(), comparePage(), privacy(), hire(), notFound()];
