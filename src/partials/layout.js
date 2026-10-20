/* ============================================================
   The page shell. Head, top bar, header, menu sheet, footer and
   the mobile bottom bar. Every page passes through render().
   ============================================================ */
"use strict";
const site = require("../../assets/data/site.js");
const schema = require("./schema.js");
const C = require("./components.js");
const { esc, attr, when, ARROW } = require("../lib.js");

const NAV = [
  { label: "Results", href: "/#results", key: "results" },
  { label: "Work", href: "/#work", key: "work" },
  { label: "What If", href: "/whatif/", key: "whatif" },
  { label: "Services", href: "/services/social/", key: "services" },
  { label: "About", href: "/about/", key: "about" },
  { label: "FAQ", href: "/#questions", key: "faq" }
];

function fullTitle(title) {
  return title.startsWith(site.name) ? title : `${title} | ${site.name}`;
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
${when(page.noindex, '<meta name="robots" content="noindex, follow">')}
<meta name="theme-color" content="#F1F4EC">
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
<link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/spacegrotesk-var.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/manrope-var.woff2" crossorigin>
${preloads}
<link rel="stylesheet" href="/assets/styles.css?v=${version}">
<script data-fonts="/assets/fonts/inline.css">document.documentElement.className+=" js";if(location.protocol==="file:"){var l=document.createElement("link");l.rel="stylesheet";l.href=document.currentScript.getAttribute("data-fonts");document.head.appendChild(l)}</script>
<script type="application/ld+json">${JSON.stringify(schema.graph(nodes))}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=${site.gaId}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}');</script>
</head>`;
}

function topbar() {
  return `<div class="topbar"><div class="wrap topbar__in"><span class="topbar__time" data-clock="Asia/Kolkata" data-place="India"></span><span class="topbar__note">Replies within one working day</span></div></div>`;
}

function header(page) {
  const links = NAV.map((n) => `<li><a href="${n.href}"${page.nav === n.key ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("");
  return `<header class="header" id="header">
<div class="wrap header__in">
<a class="brand" href="/" aria-label="Pratim Narayan Moitra, home">pratim <em>n.</em> moitra</a>
<nav class="nav" aria-label="Site"><ul class="nav__list">${links}</ul></nav>
<div class="header__cta">
<a class="header__call" href="${attr(site.bookingUrl)}" target="_blank" rel="noopener" data-book="header">Book a call</a>
${C.btn("5 free posts", "/freeweek/", { kind: "primary", size: "sm", cta: "header", offer: "freeweek", arrow: false })}
<button class="menu-btn" type="button" id="menuBtn" aria-expanded="false" aria-controls="sheet" aria-label="Open menu"><span class="menu-btn__bars" aria-hidden="true"><i></i><i></i></span></button>
</div>
</div>
</header>`;
}

function sheet(page) {
  const links = NAV.map((n) => `<li><a href="${n.href}"${page.nav === n.key ? ' aria-current="page"' : ""}>${n.label}</a></li>`).join("");
  const wa = C.whatsappUrl();
  return `<div class="menu" id="sheet" hidden>
<div class="menu__in wrap">
<div class="menu__top"><span class="brand">pratim <em>n.</em> moitra</span><button class="menu__close" type="button" id="menuClose">Close<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/></svg></button></div>
<nav aria-label="Menu"><ul class="menu__links">${links}<li><a href="/compare/">Compare</a></li><li><a href="/start/">Start here</a></li></ul></nav>
<div class="menu__cta">
${C.btn("Get 5 free posts", "/freeweek/", { kind: "primary", size: "lg", block: true, cta: "menu", offer: "freeweek" })}
${C.btn("Get a free audit", "/audit/", { kind: "ghost", size: "lg", block: true, cta: "menu", offer: "audit" })}
${when(wa, () => C.btn("WhatsApp me", wa, { kind: "ghost", size: "lg", block: true, extra: ' data-whatsapp="menu"', arrow: false }))}
<a class="textlink" href="${attr(site.bookingUrl)}" target="_blank" rel="noopener" data-book="menu">Book a call${ARROW}</a>
</div>
<p class="menu__contact"><a href="mailto:${site.email}">${site.email}</a><a href="${attr(site.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></p>
</div>
</div>`;
}

function footer() {
  const profiles = site.socialProfiles.filter((p) => p.url && p.url !== site.linkedin).map((p) => `<li><a href="${attr(p.url)}" target="_blank" rel="noopener">${esc(p.name)}</a></li>`).join("");
  return `<footer class="footer">
<div class="wrap footer__grid">
<div class="footer__about">
<a class="brand brand--light" href="/" aria-label="Pratim Narayan Moitra, home">pratim <em>n.</em> moitra</a>
<p class="footer__line">${esc(site.oneLine)}</p>
<ul class="footer__links">
<li><a href="mailto:${site.email}">${site.email}</a></li>
<li><a href="${attr(site.linkedin)}" target="_blank" rel="noopener">LinkedIn</a></li>
${profiles}
<li><a href="/privacy/">Privacy</a></li>
</ul>
</div>
<div class="footer__signup">
${C.emailSignup({ id: "footerEmail" })}
<ul class="footer__links footer__links--tools">
<li><a href="/start/#checklist">The 40 point checklist</a></li>
<li><a href="/start/#selfcheck">The self scoring quiz</a></li>
<li><a href="/compare/">How this compares</a></li>
<li><a href="/start/">Start here</a></li>
</ul>
</div>
</div>
<div class="wrap footer__bottom">
<span>Concept posts use made up brands. What If episodes show real posts for commentary, and the brands are not clients.</span>
<span>&copy; <span id="yr">${new Date().getFullYear()}</span> ${esc(site.name)}</span>
</div>
</footer>`;
}

function dock() {
  const wa = C.whatsappUrl();
  const second = wa
    ? `<a class="btn btn--ghost" href="${attr(wa)}" target="_blank" rel="noopener" data-whatsapp="dock">WhatsApp me</a>`
    : C.btn("Free audit", "/audit/", { kind: "ghost", cta: "dock", offer: "audit", arrow: false });
  return `<div class="dock" id="dock" hidden>
${C.btn("5 free posts", "/freeweek/", { kind: "primary", cta: "dock", offer: "freeweek", arrow: false })}
${second}
</div>`;
}

function render(page, version) {
  return `<!DOCTYPE html>
<html lang="${site.lang}">
${headTag(page, version)}
<body class="${attr(page.bodyClass || "")}">
<a class="skip" href="#main">Skip to content</a>
<div class="top" id="top">
${topbar()}
${header(page)}
<span class="progress" id="progress" aria-hidden="true"></span>
</div>
${sheet(page)}
<main id="main">
${page.body}
</main>
${footer()}
${dock()}
${page.after || ""}
<script src="/assets/main.js?v=${version}" defer></script>
</body>
</html>
`;
}

module.exports = { render, NAV, fullTitle };
