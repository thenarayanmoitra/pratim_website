/* About, start, compare, privacy, hire and the 404 page. Sections 17 to 19 of the brief. */
"use strict";
const site = require("../../assets/data/site.js");
const compare = require("../../assets/data/compare.js");
const episodes = require("../../assets/data/whatif.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, attr, when, fmtDate, ARROW, penLine } = require("../lib.js");

/* the small pen arrow beside a pen note, pointing up at what it describes */
const NOTE_ARROW = '<svg class="pen__arrow" viewBox="0 0 64 44" fill="none" stroke="#CC0000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 38C22 40 44 30 56 8"></path><path d="M42 10L57 6L59 21"></path></svg>';

/* The About page, built from the homepage's parts. A hero with the pen
   underline and a tilted portrait, the credentials row and the logos, where
   I have worked as a timeline, the film, how I work, the two quotes, the
   quick facts and the closing band with the form. */
function about() {
  const profiles = site.socialProfiles.filter((p) => p.url);
  const logos = site.partners.filter((p) => p.logo);
  const CREDS = [
    ["PATA", "The only candidate selected from north India"],
    ["ATTA", "First Indian intern, kept on from 3 to 11 months"],
    ["WFTA", "Digital systems and marketing today"],
    ["Masters", "In Tourism Management, Amity University"]
  ];
  const STORY = [
    ["PATA", "The Pacific Asia Travel Association picked me as the only intern from north India, and its CEO personally endorsed my work."],
    ["ATTA", "At the Adventure Travel Trade Association I was the first intern from India, and a 3 month role became 11 months."],
    ["WFTA", "Today I run digital systems and marketing for the World Food Travel Association."],
    ["Brands", "I run social media end to end for tourism brands in India, Bhutan, the Philippines and the US."]
  ];
  const WAYS = [
    ["You see the work before you pay.", "Every project starts with a free week of posts or a free written audit. If the work isn't right for you, you keep it and we part as friends."],
    ["One person, start to finish.", "I plan the calendar, design the posts, write the captions and walk you through the numbers myself. Nothing is handed to someone you haven't met."],
    ["Your hours, not mine.", "For US clients, posts and replies are ready before your morning. For European clients, our afternoons overlap, and that's when we talk. I reply within one working day."],
    ["Proof every month.", "One page with three numbers that moved, what drove them and what changes next month. Your board can read it in two minutes."],
    ["End to end, videos included.", "I work out what goes where and when, make the carousels and the Reels, post them, answer the comments and report the numbers."],
    ["You see the value, or month four is free.", "We agree two targets from your own numbers in week one. If we miss them at day 90, the next month costs nothing."]
  ];
  const FACTS = [
    ["Name", "Pratim Narayan Moitra, also written Pratim Narayan and Pratim N. Moitra"],
    ["Role", `${esc(site.role)}. Runs digital systems and marketing for the World Food Travel Association`],
    ["Based in", "India, working with tourism brands worldwide"],
    ["Does", "Social media, email, content, video editing and day to day marketing help"],
    ["Works with", `<a href="/for/associations/">Tourism associations and trade bodies</a>, <a href="/for/dmcs/">DMCs and tour operators</a>, <a href="/for/hotels/">boutique hotels and resorts</a>, <a href="/for/boards/">tourism boards</a> and <a href="/for/academies/">travel academies</a>`],
    ["Has worked with", "PATA, ATTA, GBTA, the World Food Travel Association and Adventure.travel"],
    ["Education", "Masters in Tourism Management, Amity University. BBA in Marketing"],
    ["Certifications", "ATTA and HubSpot Academy"],
    ["Contact", `<a href="mailto:${site.email}">${site.email}</a>`],
    ["LinkedIn", `<a href="${attr(site.linkedin)}" target="_blank" rel="noopener">linkedin.com/in/pratimnarayan</a>`]
  ].concat(profiles.filter((p) => p.name !== "LinkedIn").map((p) => [esc(p.name), `<a href="${attr(p.url)}" target="_blank" rel="noopener">${esc(p.url.replace(/^https?:\/\/(www\.)?/, ""))}</a>`]));

  const body = `<article class="aboutpage">
<section class="abhero">
<div class="wrap abhero__grid">
<div class="abhero__copy">
<p class="label">${esc(site.name)}, ${esc(site.label.toLowerCase())}</p>
<h1 class="h1" data-pen>Hi, I'm Pratim.<br> ${penLine("I do the work myself.", "the work myself")}</h1>
<p class="sub">I run social media and email for tourism brands, from India. I plan the month, make the posts, publish, reply and report. I take a small number of brands at a time, so yours gets my full attention.</p>
<div class="btns">${C.btn("Get my 5 free posts", "#request", { kind: "primary", cta: "about-hero", offer: "freeweek" })}${C.textlink("Watch the 45 second film", "#film", { arrow: true })}</div>
</div>
<figure class="abprint">
${C.portrait({ eager: true, sizes: "(max-width: 760px) 78vw, 400px", variant: "profile", cls: "abprint__img" })}
<figcaption class="pen abprint__note">you work with me directly${NOTE_ARROW}</figcaption>
</figure>
</div>
</section>

<section class="proof" aria-label="Credentials and organisations">
<div class="wrap">
<ul class="creds">
${CREDS.map(([v, t]) => `<li class="fig"><span class="fig__v">${esc(v)}</span><span class="fig__t">${esc(t)}</span></li>`).join("\n")}
</ul>
<div class="logos">
<span class="label">Worked with</span>
${logos.map((p) => `<picture><source type="image/webp" srcset="/assets/logos/${p.logo}.webp"><img class="logos__img" src="/assets/logos/${p.logo}.png" width="${p.w}" height="${p.h}" alt="${attr(p.alt || p.name)}" loading="lazy" decoding="async"></picture>`).join("\n")}
</div>
</div>
</section>

<section class="sec" id="story">
<div class="wrap">
<p class="label">Where I've worked</p>
<h2 class="h2">Where I've worked, and what it taught me.</h2>
<p class="lede">Since then I've worked with many more tourism brands, on everything from a twelve week content calendar to the whole channel, videos included.</p>
<ol class="days">
${STORY.map(([h, p], i) => `<li class="day${i === STORY.length - 1 ? " day--last" : ""}"><span class="day__dot" aria-hidden="true"></span><h3 class="day__h">${esc(h)}</h3><p class="day__p">${esc(p)}</p></li>`).join("\n")}
</ol>
</div>
</section>

<section class="sec sec--alt" id="film">
<div class="wrap abfilm">
<div class="abfilm__copy">
<p class="label">Forty five seconds</p>
<h2 class="h2">What I do, in under a minute.</h2>
<p class="lede">If you'd rather watch than read, this is what I take off your desk, where I've worked, the results behind me and the free week.</p>
<p class="abfilm__links">${C.textlink("Open the film on its own page", "/film/", { arrow: true })}${C.copyLink("/film/")}</p>
</div>
${C.film({ where: "about" })}
</div>
</section>

<section class="sec" id="how">
<div class="wrap">
<p class="label">How I work</p>
<h2 class="h2">What working with me looks like.</h2>
<div class="ways">
${WAYS.map(([h, p], i) => `<div class="do__row"><span class="do__n" aria-hidden="true">${i + 1}</span><div><h3 class="do__h">${esc(h)}</h3><p class="do__p">${esc(p)}</p></div></div>`).join("\n")}
</div>
</div>
</section>

<section class="sec sec--alt" id="words">
<div class="wrap">
<p class="label">In their words</p>
<h2 class="h2">What the people I worked with say.</h2>
<div class="quotes quotes--both">
${C.quoteCard("murray")}
${C.quoteCard("diego")}
</div>
</div>
</section>

<section class="sec" id="facts">
<div class="wrap">
<p class="label">Quick facts</p>
<h2 class="h2">The short version.</h2>
<dl class="abfacts">
${FACTS.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("\n")}
</dl>
${C.lastUpdated(site.lastUpdated)}
</div>
</section>
${C.closeBand({ id: "c", where: "about-page", page: "/about/", label: "Start", title: "Two ways to start.", text: "Get 5 free posts in 7 days, or a free written audit in 3 working days. You keep the posts either way.", boxTitle: "Send me your handle." })}
</article>`;
  return {
    path: "/about/",
    file: "about/index.html",
    nav: "about",
    bodyClass: "page--about",
    title: "About Pratim Narayan Moitra",
    description: "Pratim Narayan Moitra is a freelance social media and email manager based in India who has worked with PATA, ATTA, the World Food Travel Association and GBTA.",
    ogType: "profile",
    schema: [schema.profilePage(site.lastUpdated), schema.website(), schema.business()].concat(schema.videoObject() ? [schema.videoObject()] : []),
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "About", url: "/about/" }],
    body,
    lastmod: site.lastUpdated
  };
}

/* The film on a page of its own, so it has one link to share, in an email
   signature or anywhere else. pratimnarayan.com/video goes here too. */
function filmPage() {
  const f = site.film;
  const body = `<section class="sec filmpage">
<div class="wrap">
<div class="filmpage__head">
<p class="label">Forty five seconds</p>
<h1 class="h1" data-pen>${penLine("What I do, in under a minute.", "under a minute")}</h1>
<p class="sub">What I take off your desk, where I've worked, the results behind me and the free week. Press play for sound.</p>
</div>
${C.film({ where: "film-page", eager: true })}
<div class="btns filmpage__btns">${C.btn("Get my 5 free posts", "#request", { kind: "primary", cta: "film-page", offer: "freeweek" })}${C.copyLink("/film/")}${C.textlink("More about me", "/about/", { arrow: true })}</div>
</div>
</section>
${C.closeBand({ id: "c", where: "film-page", page: "/film/", label: "The free week", title: "Your next 5 posts are on me.", text: "Send your website or Instagram handle. In 7 days you get 5 finished posts with captions. Keep them either way.", pen: "yours to keep either way", boxTitle: "Send me your handle." })}`;
  return {
    path: "/film/",
    file: "film/index.html",
    nav: "",
    bodyClass: "page--film",
    title: "What I do, in under a minute. A 45 second film",
    description: "A 45 second film by Pratim Narayan Moitra on what he takes off a tourism brand's desk, where he has worked, three results and the free week of 5 posts.",
    ogType: "video.other",
    ogImage: f.poster,
    ogWidth: 1280,
    ogHeight: 720,
    ogVideo: f.src,
    schema: [schema.personStub(), schema.videoObject()],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "Film", url: "/film/" }],
    images: [{ src: f.poster, title: f.title }],
    body,
    lastmod: f.uploadDate
  };
}

function start() {
  const latest = episodes.slice().sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1))[0];
  const wa = C.whatsappUrl();
  const body = `<section class="startpage">
<div class="wrap startpage__in">
<p class="wordmark wordmark--big">pratim n. moitra</p>
<h1>Social media and email for tourism brands, with a free week to start.</h1>
<p class="lead">Pratim Narayan Moitra. I've worked with PATA, ATTA, WFTA and GBTA.</p>
<nav class="stack" aria-label="Start here">
${C.btn("5 free posts", "/freeweek/", { kind: "primary", block: true, cta: "start", offer: "freeweek" })}
${C.btn("Free audit", "/audit/", { kind: "ghost", block: true, cta: "start", offer: "audit" })}
${C.btn("Latest What If episode", `/whatif/${latest.slug}/`, { kind: "ghost", block: true, cta: "start", offer: "whatif" })}
${C.btn("The 40 point checklist", "#checklist", { kind: "ghost", block: true, cta: "start", offer: "checklist" })}
${C.btn("The self scoring quiz", "#selfcheck", { kind: "ghost", block: true, cta: "start", offer: "quiz" })}
${when(wa, () => C.btn("WhatsApp me", wa, { kind: "ghost", block: true, extra: ' data-whatsapp="start"', arrow: false }))}
${C.btn("Book a call", site.bookingUrl, { kind: "ghost", block: true, book: "start", arrow: false })}
${C.btn("LinkedIn", site.linkedin, { kind: "ghost", block: true, arrow: false })}
</nav>
</div>
</section>
<section class="section section--tint">
<div class="wrap">${C.quiz()}</div>
</section>
<section class="section section--dark">
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
</tbody>
</table>
</div>
</section>
${C.closeBand({ id: "c", where: "compare-page", page: "/compare/", label: "The free week", title: "See the work before you decide.", text: "Get 5 free posts in 7 days, or a free written audit in 3 working days. You keep the posts either way.", boxTitle: "Send me your handle." })}`;
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
<h2>The free week and the free audit</h2>
<p>When you ask for the free week or an audit, your website or Instagram handle and your work email go to Formspree, which forwards them to my inbox. If you answer the three optional questions afterwards, the kind of organisation you run, your country and the budget you have in mind go the same way. I use them to write your brief or your audit, email it to you and reply if you write back. You are not added to a mailing list.</p>
<h2>The self check</h2>
<p>Your answers to the seven questions stay in your browser. Nothing is sent anywhere.</p>
<h2>The CV and checklist forms</h2>
<p>When you ask for my CV or the checklist, your email address goes to two places. Formspree forwards it to my inbox so I know who asked. Resend delivers the email with the file attached. I use your address to send what you asked for and to reply if you write back. You are not added to a mailing list.</p>
<h2>Booking a call</h2>
<p>The booking calendar is run by Cal.com. Anything you enter there, such as your name, email and notes, is collected by Cal.com under their own privacy policy and shared with me so the call can happen.</p>
<h2>Analytics and cookies</h2>
<p>This site uses Google Analytics to count visits and see which parts of the page get read and which buttons get clicked. That involves cookies set by Google. I look at the numbers in aggregate and make no attempt to identify individual visitors.</p>
<p>If you visit from Europe, including the UK and Switzerland, Google Analytics may not use cookies until you choose Allow in the notice at the foot of the page. If you choose No thanks, it stays that way. Anyone, anywhere, can change the choice at any time with the Cookies button at the foot of every page. No advertising cookies are ever used.</p>
<h2>What your browser remembers</h2>
<p>Your browser keeps three small notes for this site. Your cookie choice. Whether you closed the small offer card, so it stays closed. And any campaign tag on the link you arrived by, for that visit only. None of them identifies you, and clearing your site data removes them.</p>
<h2>What I never do</h2>
<ul>
<li>Sell, rent or share your details with anyone else</li>
<li>Add you to a newsletter you did not ask for</li>
<li>Run advertising or retargeting pixels</li>
</ul>
<h2>Your choices</h2>
<p>Email me at <a href="mailto:${site.email}">${site.email}</a> and I will delete anything you have sent me, tell you what I hold or correct it. You can block analytics cookies in your browser, or with the Cookies button, and the site works exactly the same.</p>
<h2>Changes</h2>
<p>If this policy changes, the new version appears on this page. It was last reviewed on 23 November 2026.</p>
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
    lastmod: "2026-11-23"
  };
}

/* the recruiter page, kept as it was, with the new header and footer. noindex, not linked from the site. */
function hire() {
  const body = `<section class="pagehero">
<div class="wrap hire">
<div class="hire__intro">
<p class="label">Hiring</p>
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
<div class="fld"><label class="fld__l" for="cvEmail">Your work email</label><input class="fld__i" id="cvEmail" name="email" type="email" autocomplete="email" inputmode="email" required></div>
<input class="hp" type="text" name="company_website" tabindex="-1" autocomplete="off" aria-hidden="true">
<button class="btn" type="submit">Email me the CV</button>
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
<p class="label">Page not found</p>
<h1>This page took a wrong turn.</h1>
<p class="lead">The link may be old, or the address has a typo. Here are the three places most people are looking for.</p>
<div class="stack stack--short">
${C.btn("Back to the homepage", "/", { kind: "primary", arrow: false })}
${C.btn("Get 5 free posts", "/freeweek/", { kind: "ghost", cta: "404", offer: "freeweek" })}
${C.btn("See the What If series", "/whatif/", { kind: "ghost", cta: "404", offer: "whatif" })}
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

module.exports = () => [about(), filmPage(), start(), comparePage(), privacy(), hire(), notFound()];
