/* ============================================================
   The page shell. Head, header, menu sheet, footer and the bar
   pinned to the bottom of a phone. Every page passes through
   render().
   ============================================================ */
"use strict";
const site = require("../../assets/data/site.js");
const schema = require("./schema.js");
const C = require("./components.js");
const { esc, attr, when, ARROW, penLine } = require("../lib.js");

/* the four links in the header, and the three more in the menu sheet */
const NAV = [
  { label: "What I do", href: "/#work" },
  { label: "First 90 days", href: "/#how" },
  { label: "Results", href: "/#results" },
  { label: "Questions", href: "/#questions" }
];
const MENU_MORE = [
  { label: "What If", href: "/whatif/" },
  { label: "Free audit", href: "/audit/" },
  { label: "About", href: "/about/" }
];

/* every title carries the name once, so the page and the person stay tied together in search */
function fullTitle(title) {
  return title.includes(site.name) ? title : `${title} | ${site.name}`;
}

function headTag(page, version) {
  const url = site.url + page.path;
  const og = site.url + (page.ogImage || site.ogImage);
  const ogW = page.ogWidth || 1200, ogH = page.ogHeight || 630;
  const nodes = [].concat(page.schema || []);
  if (page.breadcrumbs && page.breadcrumbs.length > 1) nodes.push(schema.breadcrumbs(page.breadcrumbs));
  const preloads = (page.preload || []).map((p) => `<link rel="preload" as="${p.as}" href="${attr(p.href)}"${p.type ? ` type="${p.type}"` : ""}${p.imagesrcset ? ` imagesrcset="${attr(p.imagesrcset)}"` : ""}${p.imagesizes ? ` imagesizes="${attr(p.imagesizes)}"` : ""}${p.crossorigin ? " crossorigin" : ""}${p.as === "image" ? " fetchpriority=\"high\"" : ""}>`).join("\n");
  return `<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle(page.title))}</title>
<meta name="description" content="${attr(page.description)}">
<meta name="author" content="${attr(site.name)}">
<link rel="canonical" href="${attr(url)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'}
<meta name="theme-color" content="#FFFFFF">
${when(site.searchVerification.google, () => `<meta name="google-site-verification" content="${attr(site.searchVerification.google)}">`)}
${when(site.searchVerification.bing, () => `<meta name="msvalidate.01" content="${attr(site.searchVerification.bing)}">`)}
<meta property="og:type" content="${page.ogType || "website"}">
<meta property="og:site_name" content="${attr(site.name)}">
<meta property="og:locale" content="en_GB">
<meta property="og:title" content="${attr(page.ogTitle || fullTitle(page.title))}">
<meta property="og:description" content="${attr(page.description)}">
<meta property="og:image" content="${attr(og)}">
<meta property="og:image:alt" content="${attr(page.ogAlt || page.ogTitle || fullTitle(page.title))}">
<meta property="og:image:width" content="${ogW}">
<meta property="og:image:height" content="${ogH}">
${when(page.ogVideo, () => `<meta property="og:video" content="${attr(site.url + page.ogVideo)}">
<meta property="og:video:secure_url" content="${attr(site.url + page.ogVideo)}">
<meta property="og:video:type" content="video/mp4">
<meta property="og:video:width" content="${site.film.width}">
<meta property="og:video:height" content="${site.film.height}">`)}
<meta property="og:url" content="${attr(url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${attr(page.ogTitle || fullTitle(page.title))}">
<meta name="twitter:description" content="${attr(page.description)}">
<meta name="twitter:image" content="${attr(og)}">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="The What If series" href="/whatif/feed.xml">
<link rel="alternate" type="text/plain" title="A plain summary of this site for AI assistants" href="/llms.txt">
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/newsreader-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/googlesansflex-var.woff2" crossorigin>
${preloads}
<link rel="stylesheet" href="/assets/styles.css?v=${version}">
<script data-fonts="/assets/fonts/inline.css">document.documentElement.className+=" js";if(location.protocol==="file:"){var l=document.createElement("link");l.rel="stylesheet";l.href=document.currentScript.getAttribute("data-fonts");document.head.appendChild(l)}</script>
<script type="application/ld+json">${JSON.stringify(schema.graph(nodes))}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}${consentDefault()}gtag('js',new Date());gtag('config','${site.gaId}');</script>
</head>`;
}

/* the address of the form. Every page with a closing band has it at #request. */
const requestHref = (page) => (/ id="request"/.test(page.body || "") ? "#request" : "/#request");

function header(page) {
  return `<header class="site" id="top">
<div class="wrap site__in">
<a class="wordmark" href="/" aria-label="Pratim Narayan Moitra, home">pratim n. moitra</a>
<nav class="nav" aria-label="Main">${NAV.map((n) => `<a class="nav__a" href="${n.href}">${n.label}</a>`).join("")}</nav>
<div class="site__cta">
<span class="keyhint">Press <kbd class="key">P</kbd> for 5 free posts</span>
<a class="btn btn--sm" href="${requestHref(page)}" data-cta="header" data-offer="freeweek">Get 5 free posts</a>
</div>
<button class="menu-btn" type="button" id="menuBtn" aria-expanded="false" aria-controls="sheet" aria-label="Open menu"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14"></path></svg></button>
</div>
</header>`;
}

/* the full screen menu, under 760 pixels. The four links, then What If,
   Free audit and About, then the one button. */
function sheet(page) {
  const links = NAV.concat(MENU_MORE).map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("");
  return `<div class="menu" id="sheet" role="dialog" aria-modal="true" aria-label="Menu" hidden>
<div class="wrap">
<div class="menu__top"><span class="wordmark">pratim n. moitra</span><button class="menu__close" type="button" id="menuClose">Close<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button></div>
<nav aria-label="Menu"><ul class="menu__links">${links}</ul></nav>
<div class="menu__cta"><a class="btn" href="${requestHref(page)}" data-cta="menu" data-offer="freeweek">Get 5 free posts</a></div>
</div>
</div>`;
}

/* one line of text, then the links. Services and About are here so every
   page links to them. The line under them stays, concept
   posts use made up brands and the What If brands are not clients. */
function footer() {
  const links = [
    [`mailto:${site.email}`, site.email],
    [site.linkedin, "LinkedIn"],
    ["/services/social/", "Services"],
    ["/about/", "About"],
    ["/whatif/", "What If"],
    ["/audit/", "Free audit"],
    ["/start/", "Start"],
    ["/compare/", "Compare"],
    ["/privacy/", "Privacy"]
  ];
  return `<footer class="foot">
<div class="wrap foot__in">
<span>${esc(site.oneLine)}</span>
<ul class="foot__links">${links.map(([href, label]) => `<li><a class="foot__a" href="${attr(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : ""}>${esc(label)}</a></li>`).join("")}</ul>
</div>
<div class="wrap foot__base"><div>
<span>Concept posts use made up brands. What If episodes show real posts for commentary, and the brands are not clients.</span>
<span>${when(site.consentNotice, '<button class="foot__cookie" type="button" id="cookieBtn" hidden>Cookies</button>')}&copy; <span id="yr">${new Date().getFullYear()}</span> ${esc(site.name)}</span>
</div></div>
</footer>`;
}

/* Consent, set before Google Analytics starts. Advertising storage is always
   denied. Analytics storage is denied in Europe until the visitor allows it,
   and a stored choice, either way, applies everywhere. */
const CONSENT_REGIONS = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH"];
function consentDefault() {
  if (!site.consentNotice) return "";
  return `gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(CONSENT_REGIONS)},wait_for_update:500});try{var pnc=localStorage.getItem('pn_consent');if(pnc==='granted'||pnc==='denied')gtag('consent','update',{analytics_storage:pnc})}catch(e){}`;
}

/* the cookie notice. JavaScript shows it to visitors in Europe who have not
   chosen yet, and to anyone who presses Cookies in the footer. The two
   choices carry the same weight. */
function consent() {
  if (!site.consentNotice) return "";
  return `<div class="consent" id="consent" role="region" aria-label="Cookies" hidden>
<p class="consent__p">This site counts visits with Google Analytics, which uses cookies. <a href="/privacy/">Privacy</a></p>
<div class="consent__btns"><button class="consent__btn" type="button" id="consentYes">Allow</button><button class="consent__btn" type="button" id="consentNo">No thanks</button></div>
</div>`;
}

/* the pop up. A dialog in the middle of the screen over a blurred page, with
   the offer and the same two field form as the rest of the site. JavaScript
   opens it once a visit, on pages that have the form. Without JavaScript it
   never shows. Focus starts on the heading, so a screen reader reads the
   offer first and a phone keyboard does not open by itself. */
function nudge(page) {
  if (!site.popup || page.noindex || !/ id="request"/.test(page.body || "")) return "";
  return `<dialog class="pop" id="pop" aria-labelledby="pop-title" data-days="${+site.popupDays || 14}">
<div class="pop__in">
<button class="pop__close" type="button" id="popClose" aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button>
<p class="label">The free week</p>
<h2 class="pop__h" id="pop-title" tabindex="-1" autofocus data-pen>${penLine("Your next 5 posts are on me.", "on me")}</h2>
<p class="pop__p">Send your website or Instagram handle and your work email. In 7 days you get 5 finished posts with captions. Keep them either way.</p>
${C.quickForm({ id: "p", where: "popup", page: page.path, stack: true })}
</div>
</dialog>`;
}

/* the bar pinned to the bottom of a phone. JavaScript shows it once the
   hero form has left the screen and hides it while the form in the close
   is on screen. Without JavaScript it never shows. */
function stickybar(page) {
  return `<div class="stickybar" id="stickybar"><span>${esc(site.primaryOffer)}</span><a class="btn btn--sm" href="${requestHref(page)}" data-cta="sticky_bar" data-offer="freeweek">Get my 5 free posts</a></div>`;
}

function render(page, version) {
  return `<!DOCTYPE html>
<html lang="${site.lang}">
${headTag(page, version)}
<body class="${attr(page.bodyClass || "")}">
<a class="skip" href="#main">Skip to content</a>
${header(page)}
${sheet(page)}
<main id="main">
${page.body}
</main>
${footer()}
${stickybar(page)}
${nudge(page)}
${consent()}
${page.after || ""}
<script src="/assets/main.js?v=${version}" defer onerror="document.documentElement.classList.remove('js')"></script>
</body>
</html>
`;
}

module.exports = { render, NAV, fullTitle };
