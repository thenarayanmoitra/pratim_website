/* The homepage. Nine sections and a note, in the order of the approved
   design. It answers five things in turn: what I offer, what I can do,
   what problems I solve, how I work, and what I will do for you in what
   time frame. It has one button.

   The copy is the approved design's, word for word. The settings, the
   numbers, the posts, the questions and the testimonials come from
   assets/data. */
"use strict";
const site = require("../../assets/data/site.js");
const faq = require("../../assets/data/faq.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, penLine } = require("../lib.js");

/* the arrows between what a buyer says and the answer. Two drawings, so three rows do not repeat exactly. */
const ARROWS = [
  '<svg class="prob__arrow" viewBox="0 0 72 28" fill="none" stroke="#CC0000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 16C20 8 40 20 64 13"></path><path d="M52 5L66 13L53 22"></path></svg>',
  '<svg class="prob__arrow" viewBox="0 0 72 28" fill="none" stroke="#CC0000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13C22 20 42 7 64 14"></path><path d="M52 6L66 14L53 23"></path></svg>'
];
/* said is what the buyer says, in the pen. In the answer, the words between the bars carry the highlighter. */
const PROBLEMS = [
  { said: "Nobody really owns our marketing.", answer: "I own it, from the monthly plan to the day to day jobs. |Something good goes out every week.|" },
  { said: "We have followers. Where are the customers?", answer: "Social and email, connected, so |a post leads to an enquiry you can trace.|" },
  { said: "I can't show anyone this is working.", answer: "|One page a month.| Three numbers that moved and why." }
];
const DO = [
  ["1", "Plan", "The month's calendar reaches you by the 25th."],
  ["2", "Make", "Carousels, posters, Reels and captions in your voice."],
  ["3", "Post and reply", "Published at the hour that works. Comments answered within one working day."],
  ["4", "Report", "One page on the first working day of the month."],
  ["+", "Email, video and day to day marketing", "Newsletters, content, video editing and the marketing jobs that come up each week, when you want them."]
];
const DAYS = [
  ["Free week", "5 finished posts in 7 days. Yours to keep, whatever you decide."],
  ["Week 1", "We agree two targets from your own starting numbers, for example reach and enquiries from social."],
  ["Every month", "Calendar by the 25th. Posts go live once you approve them. One page report on the first working day."],
  ["Day 90", "We check the two targets. If we missed them, |month four is free.|"]
];
const WEEK = [
  ["Day 1", "You send a short brief."],
  ["Days 2 to 6", "I plan, write and design."],
  ["Day 7", "Five finished posts land in your inbox."],
  ["Then", "You decide. No pressure."]
];
const hl = (text) => esc(text).replace(/\|([^|]+)\|/, '<span class="hl">$1</span>');

module.exports = function () {
  /* 1. the hero. The label, the line with the pen underline, the two field
     form and one quote on the left. The fan of three posts on the right. */
  const hero = `<section class="hero" id="hero">
<div class="wrap hero__grid">
<div class="hero__copy">
<p class="label">${esc(site.label)}</p>
<h1 class="h1" data-pen>${penLine(site.line, site.lineUnderline)}</h1>
<p class="sub">I plan the month, design the posts, write the captions, publish, reply and report. You approve everything before it goes out.</p>
${C.quickForm({ id: "h", where: "hero", page: "/" })}
${C.vouch("diego")}
</div>
<div class="hero__visual">
${C.heroFan()}
</div>
</div>
</section>`;

  /* 2. the proof row */
  const proof = C.proofRow();

  /* 3. the problems. The buyer's words as a pen note, an arrow, the answer. */
  const problems = `<section class="sec" id="problems">
<div class="wrap">
<p class="label">The problems I solve</p>
<h2 class="h2">Three problems most businesses have with their marketing.</h2>
<div class="probs">
${PROBLEMS.map((p, i) => `<div class="prob">
<p class="pen prob__q">“${esc(p.said)}”</p>
${ARROWS[i % 2]}
<p class="prob__a">${hl(p.answer)}</p>
</div>`).join("\n")}
</div>
</div>
</section>`;

  /* 4. what I do. Five rows on the left, six posts on the right. */
  const work = `<section class="sec sec--alt" id="work">
<div class="wrap">
<p class="label">What I do</p>
<h2 class="h2">What I take off your desk.</h2>
<p class="lede">I plan and approve every post myself. You work with me directly.</p>
<div class="do__grid">
<div class="do__list">
${DO.map(([n, h, p]) => `<div class="do__row"><span class="do__n" aria-hidden="true">${n}</span><div><h3 class="do__h">${esc(h)}</h3><p class="do__p">${esc(p)}</p></div></div>`).join("\n")}
</div>
<div class="do__posts">
${C.postsGrid()}
</div>
</div>
</div>
</section>`;

  /* 5. the first 90 days, a four step timeline */
  const how = `<section class="sec" id="how">
<div class="wrap">
<p class="label">How I work</p>
<h2 class="h2">Your first 90 days.</h2>
<p class="lede">What happens, and when, from the day you send your handle.</p>
<ol class="days">
${DAYS.map(([h, p], i) => `<li class="day${i === DAYS.length - 1 ? " day--last" : ""}"><span class="day__dot" aria-hidden="true"></span><h3 class="day__h">${esc(h)}</h3><p class="day__p">${hl(p)}</p></li>`).join("\n")}
</ol>
</div>
</section>`;

  /* 6. results. The cards, then the two testimonials. */
  const results = `<section class="sec sec--alt" id="results">
<div class="wrap">
<p class="label">Results</p>
<h2 class="h2">Quiet accounts, turned into numbers a board can read.</h2>
${C.resultCards()}
<div class="quotes">
${C.quoteCard("murray")}
${C.quoteCard("diego", { cls: "quote--second" })}
</div>
</div>
</section>`;

  /* 7. the six questions */
  const questions = `<section class="sec" id="questions">
<div class="wrap">
<p class="label">Questions</p>
<h2 class="h2">What people ask before they send a handle.</h2>
${C.questions(faq.homepage)}
</div>
</section>`;

  /* 8. the close, the one dark band. The free week in four steps, and the
     same two field form in a white box. /#audit lands on the box. */
  const close = C.closeBand({ id: "c", where: "close", page: "/", label: "The free week", title: "Your next 5 posts are on me.", steps: WEEK, pen: "yours to keep either way", boxId: "audit", boxTitle: "Send me your handle.", fine: "No card. No contract. I reply within one working day." });

  /* 9. a note from me */
  const note = `<section class="sec" id="note" aria-labelledby="note-title">
<div class="wrap note__grid">
<picture><source type="image/webp" srcset="${site.notePhoto}.webp"><img class="note__img" src="${site.notePhoto}.jpg" width="720" height="900" alt="${esc(site.notePhotoAlt)}" loading="lazy" decoding="async"></picture>
<div>
<h2 class="label" id="note-title">A note from me</h2>
<p class="note__p">${esc(site.note)}</p>
<p class="note__sig">Pratim</p>
<p class="note__who">${esc(site.noteWho)}</p>
</div>
</div>
</section>`;

  const body = [hero, proof, problems, work, how, results, questions, close, note].join("\n");
  const title = `${site.name} | Social media and email for tourism brands`;
  const description = `${site.name} runs social media and email for tourism brands. Worked with PATA, ATTA, WFTA and GBTA. Get 5 free posts in 7 days or a free audit.`;
  const nodes = [schema.website(), schema.webPage({ url: "/", name: `${site.name}, social media and email for tourism brands`, description, dateModified: site.lastUpdated, speakable: [".h1", ".sub"] }), schema.business(), schema.personStub(), schema.faqPage(faq.homepage)];

  return [{
    path: "/",
    file: "index.html",
    nav: "home",
    bodyClass: "page--home",
    title,
    description,
    ogTitle: title,
    schema: nodes,
    images: [{ src: site.ogImage, title: site.name }, { src: `${site.notePhoto.replace("720x900", "1200x1500")}.jpg`, title: site.notePhotoAlt }],
    body,
    lastmod: site.lastUpdated
  }];
};
