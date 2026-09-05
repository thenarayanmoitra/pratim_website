/* ============================================================
   pratimnarayan.com, shared layout partials
   Every page is generated from these. Edit here, run
   `node tools/build.js`, and every page updates together.
   ============================================================ */

const SITE = {
  origin: "https://pratimnarayan.com",
  legalName: "Pratim Narayan Moitra",
  wordmark: 'pratim <em>n.</em> moitra',
  email: "pratimxnarayan@gmail.com",
  linkedin: "https://www.linkedin.com/in/pratimnarayan",
  booking: "https://cal.com/pratimnarayan/discovery-call",
  /* Bump this whenever styles.css or main.js changes. Netlify caches
     everything under /assets for a year, so without a new value the
     browsers of returning visitors keep serving the old files. */
  assetVersion: "2026-09-06",
  /* Bump this only when the icon files themselves change. Browsers and
     Google cache favicons harder than anything else on a site, so the
     query string is the only reliable way to force a refetch. */
  iconVersion: "2026-09-06",
  ga: "G-5T8Y684KF6",
  ogImage: "https://pratimnarayan.com/og-image.png",
  /* sameAs is what merges every scattered mention of Pratim into one
     entity in Google's eyes. Add Instagram and YouTube here the day
     they exist. Nothing else on the site needs to change. */
  sameAs: [
    "https://www.linkedin.com/in/pratimnarayan",
    "https://cal.com/pratimnarayan"
  ]
};

/* ---------- navigation, one primary action everywhere ---------- */
const NAV = [
  { href: "/about", label: "about" },
  { href: "/why-work-with-me", label: "why me" },
  { href: "/services", label: "services" },
  { href: "/work", label: "work" },
  { href: "/pricing", label: "pricing" },
  { href: "/contact", label: "contact" }
];

const SERVICES = [
  {
    slug: "social-media",
    nav: "Social media",
    title: "Social media that sells trips",
    blurb:
      "Planned, written, shot, scheduled, and reported on. Every post hooks to booking intent, audience lifecycle, or destination storytelling."
  },
  {
    slug: "email-and-newsletters",
    nav: "Email and newsletters",
    title: "Email and member newsletters",
    blurb:
      "Setup, segmentation, automations, and campaigns people actually open and forward."
  },
  {
    slug: "websites",
    nav: "Websites",
    title: "Websites, built and managed",
    blurb:
      "Fast, clear sites where every page points at an enquiry. Built from scratch or reworked, and included inside the Growth retainer."
  },
  {
    slug: "digital-audits",
    nav: "Digital audits",
    title: "Written digital audits",
    blurb:
      "A full written review of your digital presence with quick wins and a 90 day playbook. The first one is free."
  },
  {
    slug: "events-and-partnerships",
    nav: "Events and partnerships",
    title: "Event promotion and partner marketing",
    blurb:
      "Event campaigns, partner outreach, sponsorship decks, onboarding flows. The unglamorous work most teams never find time for."
  }
];

/* ---------- url shape ----------
   Netlify serves every folder at its trailing slash form and 301s the
   bare path to it. Canonicals, the sitemap, and internal links all have
   to agree with that, otherwise every canonical points at a redirect and
   Google quietly drops the page. One function decides the shape. */
function canonicalPath(p) {
  if (p === "/") return "/";
  return p.endsWith("/") ? p : p + "/";
}
function canonicalUrl(p) {
  return SITE.origin + canonicalPath(p);
}

/* ---------- schema ---------- */
function personSchema() {
  return {
    "@type": "Person",
    "@id": SITE.origin + "/#pratim",
    name: "Pratim Narayan Moitra",
    givenName: "Pratim",
    familyName: "Moitra",
    jobTitle: "Tourism Marketing Consultant",
    description:
      "Tourism marketing consultant trained inside PATA and ATTA, running social media, email, and websites for travel associations and travel brands.",
    url: SITE.origin + "/",
    image: SITE.origin + "/assets/img/pratim-800.jpg",
    email: "mailto:" + SITE.email,
    knowsAbout: [
      "Tourism marketing",
      "Social media marketing",
      "Email marketing",
      "Destination marketing",
      "Travel trade associations"
    ],
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Amity University" }
    ],
    worksFor: { "@id": SITE.origin + "/#practice" },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Siliguri",
      addressRegion: "West Bengal",
      addressCountry: "IN"
    },
    sameAs: SITE.sameAs
  };
}

function practiceSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": SITE.origin + "/#practice",
    name: "Pratim Narayan Moitra, Tourism Marketing Consultant",
    url: SITE.origin + "/",
    image: SITE.origin + "/assets/img/pratim-800.jpg",
    email: "mailto:" + SITE.email,
    founder: { "@id": SITE.origin + "/#pratim" },
    areaServed: "Worldwide",
    priceRange: "$$",
    serviceType: [
      "Social media management",
      "Email marketing",
      "Website design and management",
      "Digital marketing audits"
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Siliguri",
      addressRegion: "West Bengal",
      addressCountry: "IN"
    },
    sameAs: SITE.sameAs
  };
}

/* The @id has to be page scoped. Every page used to publish a
   BreadcrumbList under the same identifier, which makes the whole set
   read as one contradictory node instead of seventeen distinct trails. */
function breadcrumbSchema(trail, pagePath) {
  return {
    "@type": "BreadcrumbList",
    "@id": canonicalUrl(pagePath) + "#breadcrumb",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: canonicalUrl(t.href || pagePath)
    }))
  };
}

/* The nav, stated as data. It does not force sitelinks, nothing does,
   but it is the one machine readable statement of what the site's
   main sections are. */
function siteNavSchema() {
  return {
    "@type": "ItemList",
    "@id": SITE.origin + "/#sitenav",
    name: "Main navigation",
    itemListElement: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/why-work-with-me", label: "Why work with me" },
      { href: "/services", label: "Services" },
      { href: "/work", label: "Work and case studies" },
      { href: "/pricing", label: "Pricing" },
      { href: "/audit", label: "Free audit" },
      { href: "/contact", label: "Contact" }
    ].map((n, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: n.label,
      url: canonicalUrl(n.href)
    }))
  };
}

/* ---------- head ---------- */
function head(p) {
  const canonical = canonicalUrl(p.path);
  const graph = [personSchema(), practiceSchema()];

  /* WebSite belongs on every page, not just home, so that each WebPage
     below has a real node to hang isPartOf on. */
  graph.push({
    "@type": "WebSite",
    "@id": SITE.origin + "/#website",
    url: SITE.origin + "/",
    name: "Pratim Narayan Moitra",
    publisher: { "@id": SITE.origin + "/#pratim" },
    inLanguage: "en"
  });

  /* One WebPage node per URL. This is what lets a crawler see seventeen
     distinct documents under one site rather than seventeen copies of
     the same Person and ProfessionalService blocks. */
  const page = {
    "@type": "WebPage",
    "@id": canonical + "#webpage",
    url: canonical,
    name: p.title,
    description: p.description,
    isPartOf: { "@id": SITE.origin + "/#website" },
    about: { "@id": SITE.origin + "/#pratim" },
    primaryImageOfPage: SITE.ogImage,
    inLanguage: "en"
  };
  if (p.breadcrumb) page.breadcrumb = { "@id": canonical + "#breadcrumb" };
  graph.push(page);

  if (p.path === "/") graph.push(siteNavSchema());
  if (p.breadcrumb) graph.push(breadcrumbSchema(p.breadcrumb, p.path));
  if (p.extraSchema) p.extraSchema.forEach((x) => graph.push(typeof x === "function" ? x(p) : x));

  const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.title}</title>
  <meta name="description" content="${p.description}" />
  <meta name="author" content="Pratim Narayan Moitra" />
  <link rel="canonical" href="${canonical}" />

  <meta property="og:type" content="${p.path === "/" ? "website" : "article"}" />
  <meta property="og:site_name" content="Pratim Narayan Moitra" />
  <meta property="og:title" content="${p.ogTitle || p.title}" />
  <meta property="og:description" content="${p.description}" />
  <meta property="og:image" content="${SITE.ogImage}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.ogTitle || p.title}" />
  <meta name="twitter:description" content="${p.description}" />
  <meta name="twitter:image" content="${SITE.ogImage}" />

  <link rel="icon" href="/favicon.ico?v=${SITE.iconVersion}" sizes="any" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=${SITE.iconVersion}" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=${SITE.iconVersion}" />
  <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png?v=${SITE.iconVersion}" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=${SITE.iconVersion}" />
  <link rel="manifest" href="/site.webmanifest?v=${SITE.iconVersion}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;1,500&family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/styles.css?v=${SITE.assetVersion}" />

  <script type="application/ld+json">
${ld}
  </script>

  <script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.ga}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${SITE.ga}');
  </script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
`;
}

/* ---------- nav ---------- */
function nav(activePath) {
  const items = NAV.map((n) => {
    const active = activePath === n.href || activePath.startsWith(n.href + "/");
    return `        <li><a href="${n.href}"${active ? ' class="active" aria-current="page"' : ""}>${n.label}</a></li>`;
  }).join("\n");

  return `  <header class="nav">
    <div class="wrap nav__inner">
      <a class="brand" href="/" aria-label="Pratim Narayan Moitra, home">${SITE.wordmark}</a>
      <button class="nav__toggle" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">&#9776;</button>
      <ul class="nav__links" id="navLinks">
${items}
        <li><a class="nav__cta" href="/audit">free audit &#8594;</a></li>
      </ul>
    </div>
  </header>

  <main id="main">
`;
}

/* ---------- reusable blocks ---------- */
function crumb(trail) {
  const parts = trail.map((t, i) =>
    i === trail.length - 1
      ? t.name
      : `<a href="${t.href}">${t.name}</a>`
  );
  return `      <p class="crumb">${parts.join(" &nbsp;/&nbsp; ")}</p>`;
}

/* The single repeated call to action. One primary, one quiet secondary. */
function ctaBand(opts = {}) {
  const tint = opts.tint === false ? "" : " section--tint";
  return `  <section class="section${tint}">
    <div class="wrap">
      <div class="head reveal" style="max-width:56ch">
        <p class="eyebrow">Next step</p>
        <h2>${opts.heading || "Start with the audit. <em>Decide after.</em>"}</h2>
        <p>${opts.body || "Send me your website and socials. Within a few days you get a written audit with quick wins and a 90 day playbook. Free, no deck, no upsell."}</p>
        <div class="pagehero__cluster">
          <a class="btn btn--primary" href="/audit">Request a free audit</a>
          <a class="btn btn--ghost" href="${SITE.booking}" target="_blank" rel="noopener">Book a 30 minute call</a>
        </div>
      </div>
    </div>
  </section>
`;
}

/* Logo marquee. Real marks, sized optically rather than uniformly,
   because a wordmark and a roundel never look right at the same height. */
function marquee() {
  const brands = [
    { file: "pata", alt: "Pacific Asia Travel Association", h: 42 },
    { file: "atta", alt: "Adventure Travel Trade Association", h: 30 },
    { file: "gbta", alt: "Global Business Travel Association", h: 26 },
    { file: "wfta", alt: "World Food Travel Association", h: 32 },
    { file: "adventure-travel", alt: "Adventure.travel", h: 46 }
  ];
  const run = (hidden) =>
    brands
      .map(
        (b) =>
          `        <span class="marquee__item"><img class="marquee__logo" src="/assets/logos/${b.file}.png" style="height:${b.h}px" alt="${hidden ? "" : b.alt}"${hidden ? ' aria-hidden="true"' : ""} loading="lazy" /></span>`
      )
      .join("\n");
  return `  <div class="marquee reveal">
    <p class="marquee__label">Where the training and the work come from, and many more</p>
    <div class="marquee__viewport">
      <div class="marquee__track">
${run(false)}
${run(true)}
${run(true)}
      </div>
    </div>
  </div>
`;
}

function testimonials() {
  const items = [
    {
      photo: "murray",
      name: "Murray Bartholomew",
      link: "https://www.linkedin.com/in/murraybarth/",
      role: "then Director at ATTA",
      quote:
        "During a brand relaunch for a consumer travel website for travel planners in the USA, Pratim took the lead on restarting the social media with the objective of increasing audience reach and engagement. Owning the process and results, Pratim creatively and collaboratively led the social media marketing which quickly and consistently achieved the results we were looking for. Not only did Pratim demonstrate skills and acumen, but his fun, can-do attitude was easy to work with. I can definitely recommend him for other organizations needing digital marketing services."
    },
    {
      photo: "diego",
      name: "Diego Arellano",
      link: null,
      role: "Senior Marketing Manager at ATTA",
      quote:
        "Pratim played a key role in implementing our social media strategy and supported content creation efforts with creativity, dedication, and attention to detail. He brought fresh ideas to the table, was always eager to learn, and showed great professionalism throughout the project. Pratim was a valuable asset to the team, and I&rsquo;m confident he will continue to excel in any role he takes on."
    }
  ];

  const cards = items
    .map((t, i) => {
      const nameEl = t.link
        ? `<a href="${t.link}" target="_blank" rel="noopener">${t.name}</a>`
        : t.name;
      return `        <figure class="quote reveal"${i ? ' data-d="1"' : ""}>
          <span class="quote__mark" aria-hidden="true">&ldquo;</span>
          <blockquote>${t.quote}</blockquote>
          <figcaption class="quote__foot">
            <picture>
              <source srcset="/assets/img/${t.photo}-400.webp" type="image/webp" />
              <img class="quote__photo" src="/assets/img/${t.photo}-400.jpg" width="56" height="56" loading="lazy" alt="${t.name}" />
            </picture>
            <span class="quote__who">
              <span class="quote__name">${nameEl}</span>
              <span class="quote__role">${t.role}</span>
            </span>
          </figcaption>
        </figure>`;
    })
    .join("\n");

  return `  <section class="section section--dark" id="words">
    <div class="wrap">
      <div class="head reveal">
        <h2>Some of the reviews <em>I am able to share.</em></h2>
        <p>Both of these are public on LinkedIn, written by the people I reported to at ATTA. Several clients prefer not to be quoted, which I would rather respect than pad this page.</p>
      </div>
      <div class="quotes">
${cards}
      </div>
    </div>
  </section>
`;
}

/* ---------- footer ---------- */
function footer(opts = {}) {
  const svcLinks = SERVICES.map(
    (s) => `          <p><a href="/services/${s.slug}">${s.nav}</a></p>`
  ).join("\n");

  return `  </main>

  <footer class="footer">
    <div class="wrap">
      <div class="footer__grid">
        <div>
          <div class="footer__brand">${SITE.wordmark}</div>
          <p style="margin-top:.6rem; max-width:34ch; color:rgba(241,244,236,.6)">Pratim Narayan Moitra, tourism marketing consultant. Trained inside PATA and ATTA. Built for small teams that want marketing to earn revenue.</p>
        </div>
        <div>
          <div class="k">Navigate</div>
          <p><a href="/about">About</a></p>
          <p><a href="/why-work-with-me">Why work with me</a></p>
          <p><a href="/services">Services</a></p>
          <p><a href="/work">Work</a></p>
          <p><a href="/pricing">Pricing</a></p>
          <p><a href="/audit">Free audit</a></p>
          <p><a href="/contact">Contact</a></p>
        </div>
        <div>
          <div class="k">Services</div>
${svcLinks}
        </div>
        <div>
          <div class="k">Contact</div>
          <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
          <p><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></p>
          <p><a href="${SITE.booking}" target="_blank" rel="noopener">Book a call</a></p>
          <p><a href="/privacy">Privacy</a></p>
        </div>
      </div>
      <div class="footer__bottom">
        <span>&copy; <span id="yr">2026</span> Pratim Narayan Moitra, tourism marketing consultant</span>
      </div>
    </div>
  </footer>

  <button class="totop" id="totop" aria-label="Back to top">&#8593;</button>

${opts.noModal ? "" : exitModal()}
  <script src="/assets/main.js?v=${SITE.assetVersion}"></script>
</body>
</html>
`;
}

function exitModal() {
  return `  <div class="modal" id="exitModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="exitTitle">
    <div class="modal__card reveal in">
      <button class="modal__close" data-close aria-label="Close">&times;</button>
      <p class="eyebrow">Before you go</p>
      <h3 id="exitTitle">Take the 90 day tourism marketing checklist <em>with you.</em></h3>
      <p class="modal__lead">One page, plain English, the same running order I use when I start an audit. Website, social, email, and the guest journey, with the checks that catch the easy wins first. Different from the full audit. This one you can act on tonight.</p>
      <form id="checklistForm" method="POST" action="https://formspree.io/f/mwvzowbe">
        <input type="hidden" name="form-type" value="checklist-request" />
        <div class="field"><label for="xEmail">Your email</label><input id="xEmail" name="email" type="email" required /></div>
        <button class="btn btn--primary btn--block" type="submit">Send me the checklist</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
      <p class="modal__fine">No sequence, no spam. One email with the checklist, and that is it.</p>
    </div>
  </div>

`;
}

module.exports = {
  SITE,
  canonicalPath,
  canonicalUrl,
  NAV,
  SERVICES,
  head,
  nav,
  footer,
  crumb,
  ctaBand,
  marquee,
  testimonials
};
