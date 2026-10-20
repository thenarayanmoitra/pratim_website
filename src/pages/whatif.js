/* The What If series. The index and one page per episode. */
"use strict";
const site = require("../../assets/data/site.js");
const episodes = require("../../assets/data/whatif.js");
const styles = require("../../assets/data/styles.js");
const schema = require("../partials/schema.js");
const C = require("../partials/components.js");
const { esc, attr, when, picture, icon, ARROW } = require("../lib.js");

const SERIES_FAQ = [
  { q: "What is the What If series?", a: "The What If series is a set of social media remakes by Pratim Narayan Moitra. Each episode takes one real post from a tourism brand that got almost no reaction, picks one visual style from a moodboard of 350 strong travel posts and rebuilds the post in that style, with three notes on what changed and why." },
  { q: "Are these brands clients?", a: "No. Every episode is made independently, without the brand's involvement, as a public exercise in what I would do. The original post is shown for commentary and is credited and linked to the account. If a brand would like an episode changed or removed, one email does it." },
  { q: "How are the posts chosen?", a: "From a benchmark of 150 travel accounts I track. I pick posts that reached a small fraction of the account's followers, on accounts that are good at what they do, because the gap between the two is where the lesson is. Every brand in round two is international and under 160,000 followers." },
  { q: "Where do the photos in the remakes come from?", a: "From the brand's own website where it has a photo worth using, otherwise from photographers who publish under the Unsplash licence. Every photo is credited on the episode page." },
  { q: "Can I get one for my brand?", a: "Yes. The free week does exactly this for your own account, with 5 finished posts you keep whether or not we work together." }
];

function index() {
  const eps = episodes;
  const latest = eps[0];
  const body = `<section class="pagehero pagehero--tight">
<div class="wrap">
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "What If", url: "/whatif/" }])}
<h1>What if I ran your social media?</h1>
<p class="lead">Real tourism posts that got almost no reaction, rebuilt in a tested style. Drag any one to compare.</p>
<ul class="risk"><li>${eps.length} episodes</li><li>Real brands, real numbers</li><li>Not clients</li></ul>
</div>
</section>
<section class="section section--tint epindex">
<div class="wrap">
${C.episodeFeature(latest)}
<div class="epgrid epgrid--few" data-reveal>
${eps.slice(1).map((e) => C.episodeCard(e, { sizes: "(max-width: 720px) 46vw, (max-width: 1100px) 30vw, 270px" })).join("\n")}
</div>
</div>
</section>
<section class="section">
<div class="wrap">
${C.head({ eyebrow: "The gap", title: "Big accounts, tiny reactions.", intro: "Each episode starts with a post that reached a small fraction of the people who already follow the brand. The bars show how many followers it took to get one reaction." })}
${C.gapChart(eps)}
</div>
</section>
<section class="section section--tint">
<div class="wrap seriesfaq">
<div class="seriesfaq__intro">${C.eyebrow("How the series works")}<h2>From the post as it is to the post it could be.</h2></div>
<div class="faq__list">${SERIES_FAQ.map((f) => `<details><summary>${esc(f.q)}<span class="faq__x" aria-hidden="true"></span></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join("\n")}</div>
</div>
</section>
<section class="section">
<div class="wrap epsignup">
<div><h2>New episodes, in your inbox.</h2><p>One email when a new episode goes up. Nothing else. There is an ${C.textlink("RSS feed", "/whatif/feed.xml")} too.</p></div>
${C.emailSignup({ id: "whatifEmail", dark: false })}
</div>
<div class="wrap">${C.offerCards({ where: "whatif-index" })}</div>
</section>`;
  return {
    path: "/whatif/",
    file: "whatif/index.html",
    nav: "whatif",
    bodyClass: "page--whatif",
    title: "What If. Real tourism posts, rebuilt",
    description: `${eps.length} real tourism posts that got almost no reaction, rebuilt by Pratim Narayan Moitra in a tested style. Drag the before and after. Boards, operators, hotels and more.`,
    schema: [schema.personStub(), schema.faqPage(SERIES_FAQ), schema.itemList("The What If series", eps.map((e) => ({ name: e.coverLine, url: `/whatif/${e.slug}/` })))],
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "What If", url: "/whatif/" }],
    images: eps.map((e) => ({ src: `/assets/whatif/${e.slug}/cover-1080.jpg`, title: e.coverLine })),
    body,
    lastmod: eps[0].publishDate > site.lastUpdated ? eps[0].publishDate : site.lastUpdated
  };
}

/* "20 likes and comments" -> ["20", "likes and comments"] */
function splitCount(text) {
  const m = /^([\d,.]+[KM]?)\s+(.*)$/i.exec(text || "");
  return m ? [m[1], m[2]] : ["", text || ""];
}

function episode(ep, i, eps) {
  const dir = `/assets/whatif/${ep.slug}`;
  const prev = eps[i + 1], next = eps[i - 1];
  const st = styles[ep.style];
  const b = ep.brand;
  const beforeAlt = `The original post by ${ep.brandName}. ${b.describe}`;
  const share = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(site.url + "/whatif/" + ep.slug + "/")}`;
  const slideAlt = (n) => `Remake slide ${n} of ${ep.remakeSlides.length} in the ${st.name.toLowerCase()} style. ${ep.remakeSlides[n - 1].headline}${ep.remakeSlides[n - 1].line ? " " + ep.remakeSlides[n - 1].line : ""}`;
  const remakeAlt = ep.single ? `The remake in the ${st.name.toLowerCase()} style. ${ep.remake.headline} ${ep.remake.line}` : slideAlt(1);
  const afterBase = ep.single ? `${dir}/remake` : `${dir}/slide-1`;
  const epNo = String(ep.number).padStart(2, "0");
  const dateMod = ep.publishDate > site.lastUpdated ? ep.publishDate : site.lastUpdated;
  const [reactN, reactK] = splitCount(b.engagement);
  const gap = C.gapOf(ep);
  const navCard = (e, k, cls) => `<a class="epnav__link ${cls}" href="/whatif/${e.slug}/">${picture({ base: `/assets/whatif/${e.slug}/cover`, alt: "", width: 1080, height: 1350, sizes: "96px", cls: "epnav__img" })}<span><span class="epnav__k">${k}</span><span class="epnav__t">${esc(e.coverLine)}</span></span></a>`;

  const remakeSection = ep.single
    ? `<section class="section section--tint epchanged" id="remake">
<div class="wrap epchanged__grid">
<figure class="epchanged__art" data-tilt-card>
${picture({ base: `${dir}/remake`, alt: remakeAlt, width: 1080, height: 1350, sizes: "(max-width: 880px) 92vw, 520px" })}
<figcaption>Photo, ${esc(ep.remake.photo.what)}, by <a href="${attr(ep.remake.photo.url)}" target="_blank" rel="noopener">${esc(ep.remake.photo.by)}</a> on ${esc(ep.remake.photo.source)}. Concept by Pratim, not a client.</figcaption>
</figure>
<div class="epchanged__body">
${C.eyebrow("What changed")}
<h2>Three changes, one post that works.</h2>
<ol class="changed" data-reveal>
${ep.remake.changed.map((c, n) => `<li class="changed__item"><span class="changed__n">0${n + 1}</span><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p></li>`).join("\n")}
</ol>
<p class="epchanged__idea"><b>The big idea.</b> ${esc(ep.bigIdea)}</p>
<p class="epchanged__style">Style tested, <b>${esc(st.name)}</b>. ${esc(st.line)}</p>
</div>
</div>
</section>`
    : `<section class="section section--tint epremake">
${C.row({
    id: "remake",
    cls: "row--slides",
    title: `${C.eyebrow("The remake")}<h2>Six slides, swipe through.</h2>`,
    items: ep.remakeSlides.map((sl, n) => `<figure class="slidecard">${picture({ base: `${dir}/slide-${n + 1}`, alt: slideAlt(n + 1), width: 1080, height: 1350, sizes: "(max-width: 720px) 72vw, 320px", jpg: n === 0 })}<figcaption>${n + 1} / ${ep.remakeSlides.length}</figcaption></figure>`),
    ariaLabel: "Remake slides, scroll sideways for more"
  })}
</section>`;

  const body = `<article class="episode" data-episode="${ep.slug}">
<header class="ephero section--dark">
<div class="wrap ephero__grid">
<div class="ephero__copy">
${C.breadcrumbs([{ name: "Home", url: "/" }, { name: "What If", url: "/whatif/" }, { name: `Episode ${epNo}`, url: `/whatif/${ep.slug}/` }])}
${C.chips([`Episode ${epNo}`, ep.clientType, ep.region, `Style tested, ${st.name.toLowerCase()}`])}
<h1>${esc(ep.coverLine)}</h1>
<p class="lead lead--light">${esc(ep.storyTitle)}</p>
<dl class="epstats">
<div><dt>Followers</dt><dd data-num>${esc(b.followers)}</dd></div>
<div class="epstats__low"><dt>${esc(reactK)}</dt><dd${reactN ? " data-num" : ""}>${esc(reactN || "0")}</dd></div>
${when(gap, () => `<div><dt>Followers per reaction</dt><dd data-num>${esc(gap.perLabel)}</dd></div>`)}
</dl>
<div class="btns">${C.btn("Compare before and after", "#compare", { kind: "light", cta: "episode-hero", arrow: true })}${C.textlink("What changed", "#remake", { arrow: true, cls: "textlink--light" })}</div>
</div>
<div class="ephero__cover" data-tilt-card>${picture({ base: `${dir}/cover`, alt: `${ep.coverLine} The episode cover, with the brand's own post and the remake.`, width: 1080, height: 1350, sizes: "(max-width: 880px) 70vw, 380px", eager: true, style: `view-transition-name:whatif-${ep.slug}` })}</div>
</div>
</header>

<section class="section epba" id="compare">
<div class="wrap">
<div class="epba__head">${C.eyebrow("Before and after")}<h2>Drag to see the difference.</h2></div>
${C.beforeAfter({ beforeBase: `${dir}/before`, afterBase, beforeAlt, afterAlt: remakeAlt, id: "ba-range", big: true })}
<p class="epba__credit">Original by <a href="${attr(b.postUrl)}" target="_blank" rel="noopener">${esc(b.handle)}</a>, shown for commentary. ${esc(b.engagement)} on ${esc(b.followers)} followers when checked.</p>
</div>
</section>

${remakeSection}

${when(gap, () => `<section class="section epgap">
<div class="wrap epgap__grid">
<div>
${C.eyebrow("The numbers")}
<h2>${esc(gap.headline)}</h2>
<p>${esc(gap.text)}</p>
</div>
${C.gapMeter(ep)}
</div>
</section>`)}

<section class="section section--dark epcta">
<div class="wrap">
<h2>Want this for your own brand?</h2>
<p class="lead lead--light">Your next 5 posts, free, in 7 days. You keep them either way.</p>
<div class="btns">${C.btn("Get 5 free posts", "/freeweek/", { kind: "light", size: "lg", cta: "episode", offer: "freeweek", extra: ' data-whatif-cta="freeweek"' })}${C.btn("Get a free audit", "/audit/", { kind: "ghost-light", size: "lg", cta: "episode", offer: "audit", extra: ' data-whatif-cta="audit"' })}</div>
<p class="epcta__note">Made independently. ${esc(ep.brandName)} is not a client. If you are the brand and want this changed or removed, <a href="mailto:${site.email}">email me</a>.</p>
</div>
</section>

<footer class="section epfoot">
<div class="wrap">
<nav class="epnav" aria-label="More episodes">
${prev ? navCard(prev, "Previous", "epnav__link--prev") : `<span class="epnav__link epnav__link--empty"></span>`}
<a class="epnav__all textlink" href="/whatif/">All episodes</a>
${next ? navCard(next, "Next", "epnav__link--next") : `<span class="epnav__link epnav__link--empty"></span>`}
</nav>
<div class="epfoot__share">
<a class="textlink" href="${attr(share)}" target="_blank" rel="noopener">Share on LinkedIn${ARROW}</a>
${when(ep.linkedinUrl, () => `<a class="textlink" href="${attr(ep.linkedinUrl)}" target="_blank" rel="noopener">The LinkedIn post${ARROW}</a>`)}
${C.lastUpdated(dateMod)}
</div>
</div>
</footer>
</article>`;
  const nodes = [schema.personStub(), schema.article({
    url: `/whatif/${ep.slug}/`, headline: ep.coverLine, description: ep.storyTitle, image: `${dir}/og.jpg`, datePublished: ep.publishDate, dateModified: dateMod,
    about: { "@type": "Organization", name: ep.brandName, sameAs: b.postUrl.replace(/\/p\/.*$/, "/") },
    keywords: [ep.clientType, st.name, "tourism social media", "before and after"].join(", "),
    articleSection: "The What If series"
  })];
  if (ep.single) nodes.push(schema.imageObject({ url: `${dir}/remake-1080.jpg`, name: `${ep.coverLine} The remake`, caption: `${ep.remake.headline} ${ep.remake.line}`, creditText: `Photo by ${ep.remake.photo.by} on ${ep.remake.photo.source}. Concept by ${site.name}.`, creator: ep.remake.photo.by, width: 1080, height: 1350 }));
  return {
    path: `/whatif/${ep.slug}/`,
    file: `whatif/${ep.slug}/index.html`,
    nav: "whatif",
    bodyClass: "page--episode",
    title: `${ep.coverLine} What If ${epNo}`,
    description: `${ep.coverLine} ${b.engagement} on ${b.followers} followers, rebuilt in the ${st.name.toLowerCase()} style. Drag the before and after.`,
    ogImage: `${dir}/og.jpg`,
    ogType: "article",
    schema: nodes,
    breadcrumbs: [{ name: "Home", url: "/" }, { name: "What If", url: "/whatif/" }, { name: `Episode ${epNo}`, url: `/whatif/${ep.slug}/` }],
    preload: [{ as: "image", href: `${dir}/cover-560.webp`, type: "image/webp", imagesrcset: `${dir}/cover-560.webp 560w, ${dir}/cover-1080.webp 1080w`, imagesizes: "(max-width: 880px) 70vw, 380px" }],
    images: [{ src: `${dir}/cover-1080.jpg`, title: ep.coverLine }, { src: ep.single ? `${dir}/remake-1080.jpg` : `${dir}/slide-1-560.jpg`, title: `${ep.coverLine} The remake` }, { src: `${dir}/before-560.jpg`, title: `${ep.brandName}, the post as it was` }],
    body,
    lastmod: dateMod
  };
}

module.exports = () => [index(), ...episodes.map((e, i) => episode(e, i, episodes))];
