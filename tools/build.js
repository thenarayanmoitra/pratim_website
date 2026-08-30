/* ============================================================
   pratimnarayan.com, static page generator
   Run `node tools/build.js` from the repo root.
   Every page in the site is written from the data below, so the
   nav, footer, schema, and calls to action can never drift apart.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const P = require("./partials");
const { SITE, SERVICES } = P;

const ROOT = path.join(__dirname, "..");

/* ============================================================
   SHARED CONTENT FRAGMENTS
   ============================================================ */

const CREDSTRIP = `  <div class="credstrip">
    <div class="wrap">
      <div class="credstrip__inner">
        <div class="credstrip__item reveal">
          <b>Trained inside PATA</b>
          <i>Only candidate picked from north India</i>
        </div>
        <div class="credstrip__item reveal" data-d="1">
          <b>First Indian intern at ATTA</b>
          <i>Three months became eleven</i>
        </div>
        <div class="credstrip__item reveal" data-d="2">
          <b>Working with GBTA and WFTA</b>
          <i>Two global associations, today</i>
        </div>
        <div class="credstrip__item reveal" data-d="3">
          <b>Ghostwriting for Booking.com</b>
          <i>For a Regional Head</i>
        </div>
      </div>
    </div>
  </div>
`;

const STATS = `  <div class="stats">
    <div class="wrap">
      <div class="stats__inner">
        <div class="stat reveal">
          <div class="stat__k">Client retention rate</div>
          <div class="stat__v">100%</div>
        </div>
        <div class="stat reveal" data-d="1">
          <div class="stat__k">Average engagement lift</div>
          <div class="stat__v">120%</div>
        </div>
        <div class="stat reveal" data-d="2">
          <div class="stat__k">Posts published across active accounts</div>
          <div class="stat__v">350+</div>
        </div>
        <div class="stat reveal" data-d="3">
          <div class="stat__k">Countries my clients operate in</div>
          <div class="stat__v">6</div>
        </div>
      </div>
      <p class="stats__note">Figures cover accounts I run today and move as the roster changes.</p>
    </div>
  </div>
`;

const CREDROWS = `        <div class="credrows">
          <div class="credrow reveal">
            <span class="credrow__mark"><img src="/assets/logos/pata.png" style="height:36px" alt="Pacific Asia Travel Association" loading="lazy" /></span>
            <div>
              <div class="credrow__name">Pacific Asia Travel Association</div>
              <p class="credrow__line">Interned during my masters, the only candidate selected from north India that cycle.</p>
            </div>
          </div>
          <div class="credrow reveal">
            <span class="credrow__mark"><img src="/assets/logos/atta.png" style="height:28px" alt="Adventure Travel Trade Association" loading="lazy" /></span>
            <div>
              <div class="credrow__name">Adventure Travel Trade Association</div>
              <p class="credrow__line">First Indian intern they ever brought on. A three month role that ran for eleven.</p>
            </div>
          </div>
          <div class="credrow reveal">
            <span class="credrow__mark"><img src="/assets/logos/gbta.png" style="height:22px" alt="Global Business Travel Association" loading="lazy" /></span>
            <div>
              <div class="credrow__name">Global Business Travel Association</div>
              <p class="credrow__line">Client. Social media and content, run end to end from my desk.</p>
            </div>
          </div>
          <div class="credrow reveal">
            <span class="credrow__mark"><img src="/assets/logos/wfta.png" style="height:30px" alt="World Food Travel Association" loading="lazy" /></span>
            <div>
              <div class="credrow__name">World Food Travel Association</div>
              <p class="credrow__line">Client. Academy site migration off LearnWorlds, plus ongoing marketing support.</p>
            </div>
          </div>
          <div class="credrow reveal">
            <span class="credrow__mark"><img src="/assets/logos/adventure-travel.png" style="height:46px" alt="Adventure.travel" loading="lazy" /></span>
            <div>
              <div class="credrow__name">Adventure.travel</div>
              <p class="credrow__line">Client. Knowledge base setup and marketing for Adventure Commons.</p>
            </div>
          </div>
        </div>`;

const FAQ_ITEMS = [
  {
    q: "Who is a bad fit for you?",
    a: "Teams of 15 or more with a full in house marketing department, and brands that want ten platforms covered overnight. If you already have three marketers, you need a strategist, and I would rather tell you that on the first call than take your money."
  },
  {
    q: "How is this different from hiring in house?",
    a: "A junior marketing hire takes months to recruit, needs a laptop, leave, and management, and costs several times my retainer in most markets. I start within a week, bring my own tools, and you can stop after any month. The honest tradeoff is that I am one person, which is exactly why I keep my client roster small."
  },
  {
    q: "What if we do not like the work after month one?",
    a: "You stop paying and keep everything I made, including the website. The trial month exists so that neither of us is trapped. So far, nobody has used the exit, but it matters that it is there."
  },
  {
    q: "Do you do everything yourself?",
    a: "I lead every account personally and stay your single point of contact. For design and video volume, I work with a small bench of trusted freelancers I have used across client work, so quality holds when output scales."
  },
  {
    q: "What about timezones?",
    a: "I am based in India and already work with clients in Singapore, the United States, and Europe. I plan around your calendar, and you will never chase me for a reply. Everything gets answered within 24 hours."
  },
  {
    q: "Is the audit really free, really?",
    a: "Yes. No call required to receive it, no pricing pitch inside it, no follow up sequence hammering your inbox. Some people read it and do the work themselves, which is fine. Enough people come back that the maths works for me."
  }
];

function faqBlock(items) {
  const rows = items
    .map(
      (f) => `        <details>
          <summary>${f.q}<span class="x">+</span></summary>
          <p class="a">${f.a}</p>
        </details>`
    )
    .join("\n");
  return `  <section class="section" id="faq">
    <div class="wrap">
      <div class="head reveal" style="max-width:820px;margin-left:auto;margin-right:auto">
        <h2>The things smart prospects <em>ask silently.</em></h2>
      </div>
      <div class="faq reveal">
${rows}
      </div>
    </div>
  </section>
`;
}

const faqSchema = {
  "@type": "FAQPage",
  "@id": SITE.origin + "/#faq",
  mainEntity: FAQ_ITEMS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a }
  }))
};

const AUDIT_FORM = `      <div class="audit-card reveal" data-d="1">
        <p class="eyebrow">Request yours</p>
        <h3>Tell me where to look.</h3>
        <form id="auditForm" method="POST" action="https://formspree.io/f/mwvzowbe">
          <input type="hidden" name="form-type" value="audit-request" />
          <div class="field"><label for="aSite" style="color:rgba(241,244,236,.5)">Your website</label><input id="aSite" name="website" type="text" required style="color:#F1F4EC;border-bottom-color:rgba(241,244,236,.25)" /></div>
          <div class="field"><label for="aEmail" style="color:rgba(241,244,236,.5)">Your email</label><input id="aEmail" name="email" type="email" required style="color:#F1F4EC;border-bottom-color:rgba(241,244,236,.25)" /></div>
          <button class="btn btn--light btn--block" type="submit">Send me the audit</button>
          <p class="form-status" role="status" aria-live="polite" style="color:#E8B25C"></p>
        </form>
      </div>`;

const JOURNEY = `      <div class="journey">
        <span class="journey__line" aria-hidden="true"></span>
        <div class="stop reveal">
          <span class="stop__dot" aria-hidden="true"></span>
          <h3>The audit</h3>
          <p>Send me your website and socials. I send back a free written audit with quick wins and a 90 day playbook. It is a real document you keep, whether or not we ever speak again.</p>
        </div>
        <div class="stop reveal">
          <span class="stop__dot" aria-hidden="true"></span>
          <h3>The call</h3>
          <p>If the audit lands, we talk for thirty minutes about the one thing you most want fixed in the next ninety days. You will know by the end of the call whether I am the right person for it.</p>
        </div>
        <div class="stop reveal">
          <span class="stop__dot" aria-hidden="true"></span>
          <h3>The trial month</h3>
          <p>We start with a single month at whichever retainer fits. Real deliverables from week one. If it does not work, you walk away and keep everything I made.</p>
        </div>
        <div class="stop reveal">
          <span class="stop__dot" aria-hidden="true"></span>
          <h3>The retainer</h3>
          <p>If the trial earns it, we continue month to month. Prefer defined projects instead of a retainer? I also work at an hourly rate. Either way, no lock in, ever.</p>
        </div>
      </div>`;


/* ============================================================
   WHY WORK WITH ME
   The section that has to answer, in about eight seconds, why
   someone should pick a consultant over a hire or an agency.
   ============================================================ */

const WHY_CARDS = [
  {
    h: "One person, every deliverable",
    p: "Strategy, writing, design direction, video, scheduling, community replies, and the monthly report all sit with me. You brief once instead of six times, and there is never a question about who owns the outcome."
  },
  {
    h: "I work in your timezone",
    p: "I plan around your calendar rather than mine. I already run accounts across Singapore, the United States, and Europe. Nothing waits overnight, and everything is answered within 24 hours."
  },
  {
    h: "I grow accounts from zero",
    p: "Restarting a channel that has gone quiet is the work I have done most. ATTA brought me in for exactly that during a brand relaunch, and the account hit the goals we set and kept hitting them."
  },
  {
    h: "The process is visible",
    p: "You see the content calendar a month ahead and approve it before anything goes live. You get a plain English report at the end of every month. Nothing about the work is a black box."
  },
  {
    h: "Roughly a fifth of the cost",
    p: "Hiring the same scope in house costs five to six times my retainer in many markets, and that is before laptops, leave, benefits, recruitment, and the management time somebody has to give up."
  },
  {
    h: "Global names already trust the work",
    p: "PATA and ATTA trained me. GBTA, the World Food Travel Association, and Adventure.travel are on my roster now. The standard I hold your account to is the one those organisations set."
  }
];

const COMPARE = [
  {
    label: "An in house hire",
    items: [
      "Five to six times the monthly cost in many markets",
      "Recruitment takes two to three months",
      "Laptop, leave, benefits, and payroll on top",
      "Somebody senior has to manage them",
      "Learns your industry from scratch",
      "A notice period if it does not work out"
    ]
  },
  {
    label: "An agency",
    items: [
      "An account manager sits between you and the work",
      "A senior sells it, a junior executes it",
      "Minimum contract terms are normal",
      "Your account is one of thirty on a floor",
      "Change requests turn into scope conversations",
      "You rarely meet the person posting"
    ]
  },
  {
    label: "Working with me",
    feature: true,
    items: [
      "One flat monthly retainer, published openly",
      "I start inside a week",
      "No benefits, no equipment, no overhead",
      "You talk to the person doing the work",
      "Trained inside PATA and ATTA",
      "Cancel after any month and keep everything"
    ]
  }
];

function whyCards() {
  return WHY_CARDS.map(
    (c, i) => `        <div class="why reveal"${i % 3 ? ` data-d="${i % 3}"` : ""}>
          <h3>${c.h}</h3>
          <p>${c.p}</p>
        </div>`
  ).join("\n");
}

function compareTable() {
  const cols = COMPARE.map(
    (c, i) => `        <div class="cmp${c.feature ? " cmp--me" : ""} reveal"${i ? ` data-d="${i}"` : ""}>
          <div class="cmp__label">${c.label}</div>
          <ul>
${c.items.map((x) => `            <li>${x}</li>`).join("\n")}
          </ul>
        </div>`
  ).join("\n");
  return `      <div class="cmp-grid">
${cols}
      </div>`;
}

function whySection(opts = {}) {
  return `  <section class="section${opts.tint ? " section--tint" : ""}" id="why">
    <div class="wrap">
      <div class="head reveal">
        <h2>${opts.heading || "A consultant who works like part of your team, <em>at a fraction of what a team costs.</em>"}</h2>
        <p>Most small travel brands are choosing between hiring somebody, paying an agency, or carrying on doing it at midnight themselves. Here is the honest case for the fourth option.</p>
      </div>
      <div class="why-grid">
${whyCards()}
      </div>
    </div>
  </section>

  <section class="section${opts.tint ? "" : " section--tint"}">
    <div class="wrap">
      <div class="head reveal" style="max-width:56ch">
        <h2>The same work, <em>three different ways to buy it.</em></h2>
      </div>
${compareTable()}
      <p class="price-note reveal">Rates are published on the <a href="/pricing" style="color:var(--terracotta)">pricing page</a> so you never have to ask for them.</p>
    </div>
  </section>
`;
}

/* ---------- the standalone page ---------- */
function whyPage() {
  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "Why work with me" }])}
      <p class="eyebrow">Why me</p>
      <h1>Why travel brands hire me instead of <em>building a team.</em></h1>
      <p class="lead">I am one consultant who runs your social media end to end, in your timezone, for roughly a fifth of what the same scope costs in house. Here is the whole argument, with the tradeoffs included.</p>
      <div class="pagehero__cluster">
        <a class="btn btn--primary" href="/audit">Request a free audit</a>
        <a class="btn btn--ghost" href="${SITE.booking}" target="_blank" rel="noopener">Book a 30 minute call</a>
      </div>
    </div>
  </section>

${whySection({ tint: true })}
${P.marquee()}
${P.testimonials()}
  <section class="section">
    <div class="wrap">
      <div class="head reveal">
        <h2>Where I am <em>the wrong choice.</em></h2>
        <p>Every argument above has a limit, and pretending otherwise would waste a call.</p>
      </div>
      <div class="fit-grid">
        <div class="fit fit--yes reveal">
          <h3>A strong fit</h3>
          <ul>
            <li>Tourism associations and trade bodies under 15 staff</li>
            <li>Single property hotels, lodges, and boutique stays</li>
            <li>DMCs and tour operators growing from 2 to 20 people</li>
            <li>Founders doing their own marketing at midnight</li>
          </ul>
        </div>
        <div class="fit fit--no reveal" data-d="1">
          <h3>Probably not</h3>
          <ul>
            <li>Chains and boards with an agency of record</li>
            <li>Teams that already have three in house marketers</li>
            <li>Brands chasing overnight virality</li>
            <li>Anyone who wants ten platforms covered by next week</li>
          </ul>
        </div>
      </div>
      <p class="price-note reveal">I am one person, which is the real tradeoff. It is also why the client roster stays small on purpose.</p>
    </div>
  </section>

${faqBlock(FAQ_ITEMS)}
${P.ctaBand()}`;
}

/* ============================================================
   PAGE BODIES
   ============================================================ */

/* ---------- home ---------- */
function home() {
  const svcRows = SERVICES.map(
    (s) => `        <a class="svc-row reveal" href="/services/${s.slug}" style="text-decoration:none">
          <h3>${s.title}</h3>
          <div class="svc-body">
            <p>${s.blurb}</p>
            <p class="svc-proof">Read the full page &#8594;</p>
          </div>
        </a>`
  ).join("\n");

  return `  <section class="hero">
    <div class="wrap hero__inner">
      <div class="hero__copy">
        <h1 class="stage">Your entire social media team. <em>One person</em>, every deliverable, start to finish.</h1>
        <div class="hero__foot stage">
          <p class="lead">I plan, shoot, write, schedule, and report on your social media so you never have to think about it. Trained inside PATA and ATTA. Running GBTA, WFTA, and travel brands across the world today.</p>
          <div class="hero__cluster">
            <a class="btn btn--primary" href="/audit">Request a free audit <span class="btn__arrow" aria-hidden="true">&#8599;</span></a>
            <a class="btn btn--ghost" href="${SITE.booking}" target="_blank" rel="noopener">Book a 30 minute call</a>
          </div>
        </div>
      </div>
      <div class="hero__media">
        <figure class="portrait portrait--tall">
          <picture>
            <source srcset="/assets/img/pratim-1200x1500.webp" type="image/webp" />
            <img src="/assets/img/pratim-1200x1500.jpg" width="1200" height="1500" loading="eager" alt="Pratim Narayan Moitra, tourism marketing consultant" />
          </picture>
        </figure>
      </div>
    </div>
  </section>

${CREDSTRIP}
${STATS}
${whySection()}
  <section class="section" id="about-teaser">
    <div class="wrap">
      <div class="head reveal" style="max-width:60ch">
        <h2>I learned this trade inside the associations that <em>run global travel.</em></h2>
      </div>
      <div class="about-split">
        <div class="reveal">
          <p style="color:var(--ink-mid);max-width:56ch">My route into tourism marketing went through the institutions themselves, not through an agency floor. That is why the work looks the way it does. I write like someone who has sat inside a travel association, because I have.</p>
${CREDROWS}
          <div class="pagehero__cluster">
            <a class="btn btn--ghost" href="/about">Read the full story</a>
          </div>
        </div>
        <div class="reveal" data-d="1">
          <figure class="portrait portrait--tall">
            <picture>
              <source srcset="/assets/img/pratim-1200x1500.webp" type="image/webp" />
              <img src="/assets/img/pratim-1200x1500.jpg" width="1200" height="1500" loading="lazy" alt="Pratim Narayan Moitra, tourism marketing consultant" />
            </picture>
          </figure>
          <p class="portrait__cap">Pratim Narayan Moitra, Paro, Bhutan</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="process">
    <div class="wrap">
      <div class="head reveal">
        <h2>Four stops from first hello <em>to running your marketing.</em></h2>
        <p>No discovery workshops, no forty page proposals. This is the whole journey, and you can step off at any point.</p>
      </div>
${JOURNEY}
    </div>
  </section>

  <section class="section" id="services">
    <div class="wrap">
      <div class="head reveal">
        <p class="eyebrow">Services</p>
        <h2>The work, and what makes mine <em>different.</em></h2>
        <p>Five things, done properly, instead of twenty done thinly. Each one has its own page.</p>
      </div>
      <div class="svc-list">
${svcRows}
      </div>
    </div>
  </section>

${P.marquee()}
${P.testimonials()}
  <section class="section" id="work">
    <div class="wrap">
      <div class="head reveal">
        <h2>Case studies, written the way I would <em>brief a client.</em></h2>
        <p>Short, honest, and specific. Each one takes a few minutes to read.</p>
      </div>
      <div class="cards cards--feature3">
        <a class="card reveal" href="/work/pata">
          <span class="card__tag">PATA</span>
          <h3>Three months inside Asia's oldest travel association</h3>
          <p>Content strategy and channel level execution during my internship, and the industry event in Delhi where I met the CEO.</p>
          <span class="card__go">Read the case study &#8594;</span>
        </a>
        <a class="card reveal" data-d="1" href="/work/atta">
          <span class="card__tag">ATTA</span>
          <h3>How I spent 11 months as ATTA's first Indian intern</h3>
          <p>A three month role extended to eleven because of the output. The work behind the extension.</p>
          <span class="card__go">Read the case study &#8594;</span>
        </a>
        <a class="card card--soft reveal" data-d="2" href="/work">
          <span class="card__tag">Everything else</span>
          <h3>All case studies and pitches</h3>
          <p>Client work with WFTA, plus written pitches for the organisations I would love to work with next.</p>
          <span class="card__go">View all work &#8594;</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="audit">
    <div class="wrap audit-grid">
      <div class="reveal">
        <p class="eyebrow">Free audit</p>
        <h2>Start with the audit. <em>Decide after.</em></h2>
        <p class="lead" style="margin-top:1.2rem">Send me your website, socials, and newsletter. Within a few days you get a written audit with quick wins and a 90 day playbook. Free, no deck, no upsell. If it is useful, we talk. If not, you keep the playbook.</p>
        <ul class="checklist">
          <li>Website and SEO hygiene</li>
          <li>Social channels and posting cadence</li>
          <li>Email and newsletter setup</li>
          <li>Member or guest journey gaps</li>
          <li>Three quick wins to ship this month</li>
          <li>A 90 day playbook to follow after</li>
        </ul>
      </div>
${AUDIT_FORM}
    </div>
  </section>

${faqBlock(FAQ_ITEMS)}`;
}

/* ---------- about ---------- */
function about() {
  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "About" }])}
      <p class="eyebrow">About</p>
      <h1>I learned this trade inside the associations that <em>run global travel.</em></h1>
      <p class="lead">Pratim Narayan Moitra, tourism marketing consultant. Trained at PATA and ATTA, now running social media, email, and websites for travel associations and travel brands across six countries.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="about-split">
        <div class="reveal prose">
          <p>My route into tourism marketing went through the institutions themselves. At PATA, I was the only candidate selected from north India that cycle, and I met CEO Noor Ahmad Hamid at an industry event in Delhi, where he posted about our conversation.</p>
          <p>At ATTA, I was the first Indian intern they ever brought on. The role was scoped for three months. It ran for eleven, because the work kept earning extensions.</p>
          <p>Today I work with GBTA, the World Food Travel Association, Adventure.travel, and a small roster of private travel clients across Asia, and I ghostwrite LinkedIn content for a Regional Head at Booking.com. I keep client names private, the way I would keep yours.</p>
          <p>One thing worth being upfront about. I am a junior consultant, early in my career, and I price like one. What you get for that is someone hungry, fast, trained inside the industry's own institutions, and personally on your account every single day.</p>
${CREDROWS}
        </div>
        <div class="reveal" data-d="1">
          <figure class="portrait portrait--tall" style="margin-bottom:1.8rem">
            <picture>
              <source srcset="/assets/img/pratim-1200x1500.webp" type="image/webp" />
              <img src="/assets/img/pratim-1200x1500.jpg" width="1200" height="1500" loading="lazy" alt="Pratim Narayan Moitra, tourism marketing consultant" />
            </picture>
          </figure>
          <aside class="facts">
            <div class="fact"><div class="k">Education</div><div class="v">Masters in Tourism Management, Bachelors in Marketing</div></div>
            <div class="fact"><div class="k">Trained inside</div><div class="v">PATA, and ATTA as their first Indian intern over eleven months</div></div>
            <div class="fact"><div class="k">Working with</div><div class="v">GBTA, WFTA, Adventure.travel, private travel clients across Asia, and a Regional Head at Booking.com</div></div>
            <div class="fact"><div class="k">Based in</div><div class="v">India, works worldwide on IST</div></div>
          </aside>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="wrap">
      <div class="head reveal">
        <h2>Four stops from first hello <em>to running your marketing.</em></h2>
        <p>No discovery workshops, no forty page proposals. This is the whole journey, and you can step off at any point.</p>
      </div>
${JOURNEY}
    </div>
  </section>

  <section class="section" id="fit">
    <div class="wrap">
      <div class="head reveal">
        <h2>I am built for small teams. <em>Deliberately.</em></h2>
        <p>Misaligned work wastes everyone's time, so here is exactly who I am for and who I am not.</p>
      </div>
      <div class="fit-grid">
        <div class="fit fit--yes reveal">
          <h3>A strong fit</h3>
          <ul>
            <li>Tourism associations and trade bodies under 15 staff</li>
            <li>Single property hotels, lodges, and boutique stays</li>
            <li>DMCs and tour operators growing from 2 to 20 people</li>
            <li>Founders doing their own marketing at midnight</li>
          </ul>
        </div>
        <div class="fit fit--no reveal" data-d="1">
          <h3>Probably not</h3>
          <ul>
            <li>Chains and boards with an agency of record</li>
            <li>Teams that already have three in house marketers</li>
            <li>Brands chasing overnight virality</li>
            <li>Anyone who wants ten platforms covered by next week</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

${P.testimonials()}
${P.ctaBand()}`;
}

/* ---------- services index ---------- */
function servicesIndex() {
  const rows = SERVICES.map(
    (s) => `        <a class="svc-row reveal" href="/services/${s.slug}" style="text-decoration:none">
          <h3>${s.title}</h3>
          <div class="svc-body">
            <p>${s.blurb}</p>
            <p class="svc-proof">Read the full page &#8594;</p>
          </div>
        </a>`
  ).join("\n");

  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "Services" }])}
      <p class="eyebrow">Services</p>
      <h1>Five things, done properly, <em>instead of twenty done thinly.</em></h1>
      <p class="lead">Social media, email, websites, written audits, and the event and partner work most teams never find time for. Every one of them run personally, not handed to a junior you never meet.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="svc-list">
${rows}
      </div>
    </div>
  </section>

${P.marquee()}
${P.ctaBand()}`;
}

/* ---------- individual service pages ---------- */
const SERVICE_BODIES = {
  "social-media": {
    h1: "Your entire social media team. <em>One person</em>, every deliverable.",
    lead:
      "Strategy, writing, design direction, video, scheduling, community replies, and the monthly report. You approve, I run it.",
    body: `          <p>Most travel brands do not have a social media problem. They have a consistency problem. Someone posts three times in a good week, nothing for a fortnight, and then a carousel appears with no obvious reason for existing. The account looks alive and converts nothing.</p>
          <p>What I run instead is one calendar, built a month ahead, where every post has a job. Some posts exist to reach a cold audience. Some exist to convince a warm one. Some exist purely to make an existing member feel seen. When the whole month is planned against those roles, the engagement lift takes care of itself.</p>
          <h3>What I actually do each month</h3>
          <p>I build the calendar and share it for approval, write every caption, direct or make the creative with my design and video bench, schedule everything, and stay on top of comments and DMs so nothing sits unanswered. At the end of the month you get a short report that says what worked, what did not, and what changes next month.</p>
          <h3>The voice question</h3>
          <p>Travel writing goes wrong in a predictable way. It becomes brochure language, or it becomes a generic quote over a stock sunset. I write in the register your audience already uses, which for associations means peer to peer and slightly technical, and for operators means specific about the trip rather than lyrical about the destination.</p>
          <div class="pullnote">This is the work Murray Bartholomew brought me in for at ATTA, restarting their social from zero during a brand relaunch. It reached the goals we set quickly and kept reaching them.</div>`,
    panel: [
      "Monthly content calendar, approved before anything goes live",
      "Captions written by me, never templated",
      "Statics and video handled by my design bench",
      "Scheduling across every channel you run",
      "Comment and DM cover so nothing sits unanswered",
      "A monthly report in plain English"
    ]
  },
  "email-and-newsletters": {
    h1: "Email and member newsletters <em>people actually open.</em>",
    lead:
      "Setup, segmentation, automations, and campaigns written like a person wrote them, because one did.",
    body: `          <p>Email is the only channel you own. Every follower you have on a social platform is rented from a company that can change the rules on a Tuesday. Your list cannot be taken away, which is why it deserves more care than it usually gets.</p>
          <p>For associations, the newsletter is often the single most important member touchpoint of the month, and it is usually the thing nobody has time to do well. For operators, email is where a browsing visitor turns into a booking three weeks later.</p>
          <h3>Where I start</h3>
          <p>Usually with the boring half. List hygiene, sender authentication so your mail lands in the inbox rather than the promotions tab, and a segment structure that reflects how your audience actually differs. Then the automations that should have been running for years, welcome sequences, enquiry follow ups, renewal reminders, post trip nudges.</p>
          <h3>Then the writing</h3>
          <p>Short, useful, and specific. No forty word preamble before the point. Subject lines that describe rather than tease. Open rates follow honesty more reliably than they follow cleverness.</p>`,
    panel: [
      "Platform setup or migration",
      "Sender authentication so mail lands properly",
      "Segments that match how your audience differs",
      "Welcome, enquiry, and renewal automations",
      "Campaign writing and build",
      "Reporting on opens, clicks, and replies"
    ]
  },
  websites: {
    h1: "Websites where every page <em>points at an enquiry.</em>",
    lead:
      "Built from scratch or reworked, and included inside my retainers, along with domain and hosting setup so you never touch the technical side.",
    body: `          <p>A travel website usually fails in one of two ways. Either it is beautiful and says nothing a visitor can act on, or it is a decade old and loads slowly enough that people leave before it finishes. Both problems are fixable in weeks rather than months.</p>
          <p>I build fast, clear sites with a small number of pages that each do one job. Speed matters more than almost anything else, because most of your traffic arrives on a phone from a LinkedIn post or an email signature, on a connection you cannot control.</p>
          <h3>What is included</h3>
          <p>Structure and copy, build, mobile testing, page speed, basic on page SEO, analytics, and the domain and hosting setup handled for you. If you are on a platform that is costing you money for no reason, I will tell you and move you off it.</p>
          <div class="pullnote">I moved the World Food Travel Association academy site off LearnWorlds, reorganised the content, and handed their in house team the playbook they still run today.</div>
          <h3>What happens after launch</h3>
          <p>Inside a retainer, the site stays mine to maintain. Content updates, new pages, fixes, and speed checks are part of the monthly work rather than a separate invoice every time something needs changing.</p>`,
    panel: [
      "Structure, copy, and build",
      "Domain and hosting set up for you",
      "Mobile first, tested on real screens",
      "Page speed and on page SEO",
      "Analytics and event tracking",
      "Ongoing updates inside a retainer"
    ]
  },
  "digital-audits": {
    h1: "A written audit of your digital presence. <em>The first one is free.</em>",
    lead:
      "Website, social, SEO, content, and email reviewed properly, with three quick wins and a 90 day playbook you can run without me.",
    body: `          <p>The audit is how most of my client relationships have started. Someone reads it, we talk, and the work follows. It is also how a fair number of people have taken the document, done the work themselves, and never spoken to me again. That is a fine outcome. It still costs me nothing to be useful.</p>
          <h3>What is inside</h3>
          <p>An executive summary that says what I found and why it matters. A section by section review of every channel that is relevant to you, with real observations from your actual presence rather than generic advice. A scorecard rating each area. A 90 day playbook split into three phases so you know what to do first, second, and third.</p>
          <h3>What is not inside</h3>
          <p>No pricing page. No section about why you should hire me. The document is either useful on its own or it is not, and padding it with a pitch would only make it worse.</p>
          <h3>How long it takes</h3>
          <p>A few days from the moment you send me your links. It is written by hand, so the queue is real, but it has never taken more than a week.</p>`,
    panel: [
      "Executive summary of what I found",
      "Channel by channel analysis",
      "Scorecard rating every area",
      "Three quick wins for this month",
      "A phased 90 day playbook",
      "Delivered as a document you keep"
    ]
  },
  "events-and-partnerships": {
    h1: "Event promotion and partner marketing, <em>done quietly and properly.</em>",
    lead:
      "Event campaigns, partner outreach, sponsorship decks, and onboarding flows. The unglamorous digital work most teams never find time for.",
    body: `          <p>Associations and operators both run on things that do not fit neatly into a channel. A conference that needs filling. A sponsor that needs a deck. A new member who needs a welcome that does not feel automated. This work rarely has an owner, so it drifts to whoever has a free afternoon, which means it is always late and never good.</p>
          <h3>Event campaigns</h3>
          <p>A campaign arc from announcement to last call, across email and social, with speaker and sponsor assets that people are actually willing to share. Registration pages that load fast and ask for as little as possible.</p>
          <h3>Partner and sponsorship material</h3>
          <p>Decks that lead with what the partner gets rather than what you have built. Outreach sequences that read like a person wrote them to one recipient, because they were.</p>
          <h3>Onboarding and lifecycle</h3>
          <p>The first thirty days after someone joins decides whether they renew. I build that sequence and the assets around it.</p>`,
    panel: [
      "Full event campaign arcs",
      "Speaker and sponsor assets",
      "Registration page builds",
      "Sponsorship and partner decks",
      "Outreach sequences",
      "Member and guest onboarding flows"
    ]
  }
};

function servicePage(svc) {
  const b = SERVICE_BODIES[svc.slug];
  const panelItems = b.panel.map((x) => `            <li>${x}</li>`).join("\n");
  const others = SERVICES.filter((s) => s.slug !== svc.slug)
    .map(
      (s) => `        <a class="nextlink reveal" href="/services/${s.slug}">
          <div class="k">Service</div>
          <strong>${s.nav}</strong>
        </a>`
    )
    .join("\n");

  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: svc.nav }
  ])}
      <p class="eyebrow">${svc.nav}</p>
      <h1>${b.h1}</h1>
      <p class="lead">${b.lead}</p>
      <div class="pagehero__cluster">
        <a class="btn btn--primary" href="/audit">Request a free audit</a>
        <a class="btn btn--ghost" href="${SITE.booking}" target="_blank" rel="noopener">Book a 30 minute call</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="detail">
        <div class="reveal prose">
${b.body}
        </div>
        <aside class="panel reveal" data-d="1">
          <h3>What is included</h3>
          <ul>
${panelItems}
          </ul>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="wrap">
      <div class="head reveal" style="max-width:56ch">
        <h2>Everything else <em>I run.</em></h2>
      </div>
      <div class="nextrow">
${others}
      </div>
    </div>
  </section>

${P.ctaBand({ tint: false })}`;
}

/* ---------- work index ---------- */
function workIndex() {
  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "Work" }])}
      <p class="eyebrow">Work</p>
      <h1>Case studies and pitches, written the way I would <em>brief a client.</em></h1>
      <p class="lead">Client work I am allowed to name, plus written pitches for organisations I would like to work with next. Everything else stays private, the way yours would.</p>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="head reveal">
        <h2>Where I have actually <em>done the job.</em></h2>
      </div>
      <div class="cards">
        <a class="card reveal" href="/work/pata">
          <span class="card__tag">PATA</span>
          <h3>Three months inside Asia's oldest travel association</h3>
          <p>Content strategy and channel level execution during my internship, and the industry event in Delhi where I met the CEO.</p>
          <span class="card__go">Read the case study &#8594;</span>
        </a>
        <a class="card reveal" data-d="1" href="/work/atta">
          <span class="card__tag">ATTA</span>
          <h3>How I spent 11 months as ATTA's first Indian intern</h3>
          <p>A three month role extended to eleven because of the output. The work behind the extension.</p>
          <span class="card__go">Read the case study &#8594;</span>
        </a>
        <a class="card reveal" data-d="2" href="/work/wfta">
          <span class="card__tag">WFTA</span>
          <h3>How I migrated WFTA's academy site off LearnWorlds</h3>
          <p>A platform migration, a content reorganisation, and a playbook their in house team still runs.</p>
          <span class="card__go">Read the case study &#8594;</span>
        </a>
        <a class="card card--soft reveal" data-d="3" href="/contact">
          <span class="card__tag">And more, privately</span>
          <h3>Other client work stays confidential</h3>
          <p>Several clients prefer not to be named publicly. I respect that by default, and I would do the same for you.</p>
          <span class="card__go">Ask me about it &#8594;</span>
        </a>
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="wrap">
      <div class="head reveal">
        <h2>Work I have not been paid for, <em>written anyway.</em></h2>
        <p>Unprompted 90 day plans for organisations I admire. Nobody asked for these. They are the clearest evidence of how I think.</p>
      </div>
      <div class="cards">
        <a class="card reveal" href="https://www.notion.so/How-I-d-help-ACOTUR-reach-international-audiences-in-90-days-367a6af1fb0a80de9e94e3a35feb3527?source=copy_link" target="_blank" rel="noopener">
          <span class="card__tag">ACOTUR, pitch</span>
          <h3>How I would help ACOTUR reach international audiences in 90 days</h3>
          <p>A community tourism network in Colombia, and the fastest route to an international audience.</p>
          <span class="card__go">Read on Notion &#8594;</span>
        </a>
        <a class="card reveal" data-d="1" href="https://www.notion.so/How-I-d-help-USTOA-in-90-days-367a6af1fb0a80faa896f4959ddd8598?source=copy_link" target="_blank" rel="noopener">
          <span class="card__tag">USTOA, pitch</span>
          <h3>How I would help USTOA in 90 days</h3>
          <p>A member facing plan for one of the strongest tour operator associations in the United States.</p>
          <span class="card__go">Read on Notion &#8594;</span>
        </a>
        <a class="card reveal" data-d="2" href="https://www.notion.so/How-I-d-help-Tourism-Alliance-simplify-their-day-to-day-367a6af1fb0a804eb950fd1028b64713?source=copy_link" target="_blank" rel="noopener">
          <span class="card__tag">Tourism Alliance, pitch</span>
          <h3>How I would help Tourism Alliance simplify their day to day</h3>
          <p>Less noise, fewer tools, and a clearer weekly rhythm for a small policy team.</p>
          <span class="card__go">Read on Notion &#8594;</span>
        </a>
        <a class="card reveal" href="https://www.notion.so/How-I-d-help-Portugal-Nature-Trails-367a6af1fb0a80ad8081d819e3ab0695?source=copy_link" target="_blank" rel="noopener">
          <span class="card__tag">Portugal Nature Trails, pitch</span>
          <h3>How I would help Portugal Nature Trails</h3>
          <p>A small operator with a strong product and a quiet digital presence.</p>
          <span class="card__go">Read on Notion &#8594;</span>
        </a>
        <a class="card reveal" data-d="1" href="https://www.notion.so/How-I-d-market-Walking-Mentorship-367a6af1fb0a80eab89bd4370283f259?source=copy_link" target="_blank" rel="noopener">
          <span class="card__tag">Walking Mentorship, pitch</span>
          <h3>How I would market Walking Mentorship</h3>
          <p>A niche experience with a clear audience that is not being reached yet.</p>
          <span class="card__go">Read on Notion &#8594;</span>
        </a>
        <a class="card card--soft reveal" data-d="2" href="/contact">
          <span class="card__tag">Pitch your org</span>
          <h3>Want a pitch written for your organisation?</h3>
          <p>Ask, and I will write one. It costs you nothing and it is the fastest way to see how I think.</p>
          <span class="card__go">Ask for one &#8594;</span>
        </a>
      </div>
    </div>
  </section>

${P.ctaBand({ tint: false })}`;
}

/* ---------- case studies ---------- */
const CASES = {
  pata: {
    tag: "PATA",
    title: "Three months inside Asia's oldest travel association",
    description:
      "How Pratim Narayan Moitra worked on content strategy and channel execution during a PATA internship, as the only candidate selected from north India that cycle.",
    lead:
      "The Pacific Asia Travel Association has been shaping travel in this region since 1951. I got three months inside it, as the only candidate selected from north India that cycle.",
    notion:
      "https://www.notion.so/Three-months-inside-Asia-s-oldest-travel-association-367a6af1fb0a802fa8c7c60df38d24da?source=copy_link",
    body: `        <h2>Why this internship mattered</h2>
        <p>Almost everyone who works in tourism marketing learns it from the outside, at an agency, guessing at how the industry runs. PATA is the industry. Sitting inside an association means watching how destinations, operators, and boards actually talk to each other, what they care about, and what language moves them.</p>
        <p>I was the only candidate selected from north India that cycle. That fact matters less than what it bought me, which was access to how a global travel body plans and publishes.</p>

        <h2>What I worked on</h2>
        <ul>
          <li>Content strategy across the association's channels, planned rather than reactive</li>
          <li>Channel level execution, writing and scheduling the work rather than only advising on it</li>
          <li>Audience research on what members and the wider trade actually engaged with</li>
          <li>Support on event and industry communications</li>
        </ul>

        <h2>The Delhi event</h2>
        <p>During my time there I met CEO Noor Ahmad Hamid at an industry event in Delhi. He later posted publicly about our conversation. I mention it because it is verifiable and because it happened, not because it is an endorsement of my work. It was a conversation at an event, and I am careful about the difference.</p>

        <h2>What I took away</h2>
        <p>Association audiences are not consumers. They are professionals who can smell marketing language from a distance and who reward specificity. Writing for them broke a lot of habits I had picked up reading consumer travel content, and it is the reason my work for associations reads the way it does now.</p>
        <div class="pullnote">This is the training that shows up in every association account I run today, including GBTA and the World Food Travel Association.</div>`
  },
  atta: {
    tag: "ATTA",
    title: "How I spent 11 months as ATTA's first Indian intern",
    description:
      "A three month internship at the Adventure Travel Trade Association that ran for eleven, restarting social media from zero during a brand relaunch.",
    lead:
      "The Adventure Travel Trade Association had never brought on an Indian intern before. The role was scoped for three months. It ran for eleven.",
    notion:
      "https://www.notion.so/How-I-spent-11-months-as-ATTA-s-first-Indian-intern-367a6af1fb0a800ea39cf845c9834630?source=copy_link",
    body: `        <h2>The brief</h2>
        <p>ATTA was running a brand relaunch for a consumer travel website aimed at travel planners in the United States. The social channels for it were effectively starting from zero. I was brought in by Murray Bartholomew to restart them, with the objective of growing audience reach and engagement.</p>
        <p>Starting from zero sounds harder than it is. What is actually hard is the month after, when the initial curiosity fades and the account has to earn attention on the strength of the posts alone.</p>

        <h2>What I ran</h2>
        <ul>
          <li>The full social media restart, from strategy through to publishing</li>
          <li>Content planning against audience lifecycle rather than a posting quota</li>
          <li>Writing and creative direction, working alongside Diego Arellano on the marketing team</li>
          <li>Reporting on reach and engagement against the goals we had set together</li>
        </ul>

        <h2>Why three months became eleven</h2>
        <p>The role kept getting extended because the output kept earning it. There was no conversation about a permanent role or a grand plan. Each extension was a decision made on the work in front of them, which is the only kind of extension worth having.</p>

        <h2>In Murray's words</h2>
        <div class="pullnote">Owning the process and results, Pratim creatively and collaboratively led the social media marketing which quickly and consistently achieved the results we were looking for. I can definitely recommend him for other organizations needing digital marketing services.<br /><br /><strong>Murray Bartholomew</strong>, then Director at ATTA</div>

        <h2>What I took away</h2>
        <p>Eleven months is long enough to see a channel through a full cycle, including the flat stretch in the middle that most freelancers never stay around for. It taught me that consistency beats cleverness, and that the account which posts well every week for a year will out perform the one that goes viral twice.</p>`
  },
  wfta: {
    tag: "WFTA",
    title: "How I migrated WFTA's academy site off LearnWorlds",
    description:
      "A platform migration and content reorganisation for the World Food Travel Association academy, handed over with a playbook their in house team still runs.",
    lead:
      "The World Food Travel Association had an academy running on LearnWorlds. My job was to get it off, reorganise what was inside it, and leave the team able to run it without me.",
    notion:
      "https://www.notion.so/How-I-migrated-WFTA-s-academy-site-off-LearnWorlds-367a6af1fb0a80b29c35df4d0bb96bc0?source=copy_link",
    body: `        <h2>The situation</h2>
        <p>Platform decisions made three years ago tend to outlive their usefulness quietly. The costs keep going out, the structure keeps getting more awkward to work with, and nobody has the time to unpick it. That is roughly where the academy site was.</p>

        <h2>What the work involved</h2>
        <ul>
          <li>Migrating the academy off LearnWorlds without losing content or breaking access</li>
          <li>Reorganising the content structure so the material was findable rather than merely present</li>
          <li>Rebuilding the pages for speed and clarity</li>
          <li>Writing a handover playbook for the in house team</li>
        </ul>

        <h2>The handover</h2>
        <p>The part I am most pleased with is the least visible. The team at WFTA still run the site from the playbook I wrote. A migration that leaves an organisation dependent on the person who did it is only half finished.</p>
        <div class="pullnote">Websites are included inside my retainers for exactly this reason. The site should not become a separate invoice every time it needs a change.</div>

        <h2>What I took away</h2>
        <p>Most website projects in this industry are not design problems. They are structure problems wearing a design problem as a disguise. Fix what goes where, and the visual work gets much easier.</p>`
  }
};

function casePage(slug) {
  const c = CASES[slug];
  const siblings = Object.keys(CASES)
    .filter((k) => k !== slug)
    .map(
      (k) => `        <a class="nextlink reveal" href="/work/${k}">
          <div class="k">${CASES[k].tag}</div>
          <strong>${CASES[k].title}</strong>
        </a>`
    )
    .join("\n");

  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: c.tag }
  ])}
      <p class="eyebrow">${c.tag}</p>
      <h1>${c.title}</h1>
      <p class="lead">${c.lead}</p>
    </div>
  </section>

  <section class="section" style="padding-top:2rem">
    <div class="wrap">
      <div class="prose reveal">
${c.body}
        <p style="margin-top:2.4rem"><a href="${c.notion}" target="_blank" rel="noopener" style="color:var(--terracotta)">Read the longer version on Notion &#8594;</a></p>
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="wrap">
      <div class="head reveal" style="max-width:56ch">
        <h2>The other <em>case studies.</em></h2>
      </div>
      <div class="nextrow">
${siblings}
      </div>
    </div>
  </section>

${P.ctaBand({ tint: false })}`;
}

/* ---------- pricing ---------- */
function pricing() {
  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "Pricing" }])}
      <p class="eyebrow">Pricing</p>
      <h1>The numbers, in the open, <em>so you never have to ask.</em></h1>
      <p class="lead">Most small travel brands assume a consultant is out of budget and quietly leave. So here it is. I am early in my career and priced like it. The work is not.</p>
    </div>
  </section>

  <section class="section" style="padding-top:2rem">
    <div class="wrap">
      <div class="price-grid">
        <div class="price reveal">
          <div class="price__tier">Presence</div>
          <div class="price__amt">$200</div>
          <div class="price__per">USD per month</div>
          <ul>
            <li>One static post and one video every week</li>
            <li>Your website built from scratch, included</li>
            <li>Domain and hosting set up for you</li>
            <li>A short performance note every month</li>
          </ul>
          <a class="btn btn--ghost btn--block" href="/contact">Start with a trial month</a>
        </div>
        <div class="price price--feature reveal" data-d="1">
          <span class="price__badge">Most complete</span>
          <div class="price__tier">Growth</div>
          <div class="price__amt">$400</div>
          <div class="price__per">USD per month</div>
          <ul>
            <li>Five posts every week, four statics and one video</li>
            <li>Website rework or full rebuild, included</li>
            <li>Email and newsletter support</li>
            <li>Monthly reporting and a quarterly plan</li>
          </ul>
          <a class="btn btn--light btn--block" href="/contact">Start with a trial month</a>
        </div>
        <div class="price reveal" data-d="2">
          <div class="price__tier">Projects</div>
          <div class="price__amt">$15</div>
          <div class="price__per">USD per hour</div>
          <ul>
            <li>For defined, one off pieces of work</li>
            <li>Site builds, campaigns, audits, decks</li>
            <li>Scoped and estimated before we start</li>
            <li>No retainer needed</li>
          </ul>
          <a class="btn btn--ghost btn--block" href="/contact">Scope a project</a>
        </div>
      </div>
      <p class="price-note reveal">Every retainer begins with a trial month. Every month after is yours to cancel. You keep everything I make, including the website.</p>
    </div>
  </section>

${faqBlock(FAQ_ITEMS)}
${P.ctaBand()}`;
}

/* ---------- audit page ---------- */
function auditPage() {
  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "Free audit" }])}
      <p class="eyebrow">Free audit</p>
      <h1>Start with the audit. <em>Decide after.</em></h1>
      <p class="lead">Send me your website, socials, and newsletter. Within a few days you get a written audit with quick wins and a 90 day playbook. Free, no deck, no upsell. If it is useful, we talk. If not, you keep the playbook.</p>
    </div>
  </section>

  <section class="section section--tint" style="padding-top:2.5rem">
    <div class="wrap audit-grid">
      <div class="reveal">
        <h2>A real document, <em>not a lead magnet.</em></h2>
        <ul class="checklist">
          <li>Website and SEO hygiene</li>
          <li>Social channels and posting cadence</li>
          <li>Email and newsletter setup</li>
          <li>Member or guest journey gaps</li>
          <li>A scorecard rating every area</li>
          <li>Three quick wins to ship this month</li>
          <li>A 90 day playbook to follow after</li>
          <li>No pricing page, no pitch section</li>
        </ul>
        <p style="margin-top:2rem;color:var(--ink-mid)">Every audit is written by hand from your actual digital presence. There is no template, which is why it takes a few days rather than a few minutes.</p>
      </div>
${AUDIT_FORM}
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <div class="head reveal">
        <h2>Four stops from first hello <em>to running your marketing.</em></h2>
      </div>
${JOURNEY}
    </div>
  </section>

${P.testimonials()}`;
}

/* ---------- contact ---------- */
function contact() {
  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "Contact" }])}
      <p class="eyebrow">Contact</p>
      <h1>Tell me about your <em>organisation.</em></h1>
      <p class="lead">Send a message below or reach me on any channel. I read everything myself and reply within 24 hours.</p>
    </div>
  </section>

  <section class="section" style="padding-top:2rem">
    <div class="wrap">
      <div class="contact-grid">
        <form class="reveal" id="contactForm" method="POST" action="https://formspree.io/f/mwvzowbe">
          <div class="field"><label for="cName">Your name</label><input id="cName" name="name" type="text" required /></div>
          <div class="field"><label for="cOrg">Organisation</label><input id="cOrg" name="organisation" type="text" /></div>
          <div class="field"><label for="cEmail">Email</label><input id="cEmail" name="email" type="email" required /></div>
          <div class="field">
            <label for="cWant">What are you looking for?</label>
            <select id="cWant" name="looking_for">
              <option>Free audit</option>
              <option>Presence retainer, $200 per month</option>
              <option>Growth retainer, $400 per month</option>
              <option>Hourly project work</option>
              <option>Full time or internship</option>
              <option>Just exploring</option>
            </select>
          </div>
          <div class="field"><label for="cMsg">A few words on what you need</label><textarea id="cMsg" name="message" required></textarea></div>
          <button class="btn btn--primary" type="submit">Send it across &#8594;</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
        <aside class="contact-aside reveal" data-d="1">
          <div class="fact"><div class="k">Email</div><div class="v"><a href="mailto:${SITE.email}">${SITE.email}</a></div></div>
          <div class="fact"><div class="k">LinkedIn</div><div class="v"><a href="${SITE.linkedin}" target="_blank" rel="noopener">linkedin.com/in/pratimnarayan</a></div></div>
          <div class="fact"><div class="k">Book a call</div><div class="v"><a href="${SITE.booking}" target="_blank" rel="noopener">A 30 minute discovery call</a></div></div>
          <div class="fact"><div class="k">Open to</div><div class="v">Retainers, projects, part time, full time, and paid internships</div></div>
          <div class="fact"><div class="k">Based in</div><div class="v">India, works worldwide on IST</div></div>
        </aside>
      </div>
    </div>
  </section>

  <section class="section section--tint" id="book">
    <div class="wrap">
      <div class="head reveal">
        <h2>Ready to talk now? <em>Pick a time.</em></h2>
        <p>A relaxed 30 minutes to hear what you are working on and whether I am the right fit. No slides, no pitch. If a form feels slow, this is the shortcut.</p>
      </div>
      <div class="booking reveal">
        <iframe id="bookingFrame" class="booking__frame" title="Book a 30 minute call" loading="lazy"></iframe>
        <div id="bookingNote" class="booking__note">
          <p>The live calendar is not switched on yet. Use the form above, reach me by email at <a href="mailto:${SITE.email}">${SITE.email}</a>, or send a quick WhatsApp.</p>
        </div>
      </div>
    </div>
  </section>
`;
}

/* ---------- privacy ---------- */
function privacy() {
  return `  <section class="pagehero">
    <div class="wrap reveal">
${P.crumb([{ name: "Home", href: "/" }, { name: "Privacy" }])}
      <p class="eyebrow">Privacy</p>
      <h1>What I collect, and <em>what I do with it.</em></h1>
      <p class="lead">Short version. I collect what you type into a form, I use analytics to see which pages get read, and I do not sell anything to anyone.</p>
    </div>
  </section>

  <section class="section" style="padding-top:2rem">
    <div class="wrap">
      <div class="prose reveal">
        <h2>Forms</h2>
        <p>The contact, audit, and checklist forms on this site are handled by Formspree, which forwards what you submit to my email. I keep those messages in my inbox and use them to reply to you and to send the thing you asked for. Nothing more.</p>

        <h2>Analytics</h2>
        <p>This site uses Google Analytics to count visits and see which pages people read. That involves cookies set by Google. I look at it in aggregate. I do not attempt to identify individual visitors, and I have no interest in doing so.</p>

        <h2>Embeds</h2>
        <p>The booking section loads a Cal.com scheduling page inside a frame. If you book a call, Cal.com collects what you enter there under their own privacy policy.</p>

        <h2>What I never do</h2>
        <ul>
          <li>Sell, rent, or share your details with anyone</li>
          <li>Add you to a mailing list without you asking</li>
          <li>Run retargeting or advertising pixels</li>
        </ul>

        <h2>Your choices</h2>
        <p>Email me at <a href="mailto:${SITE.email}" style="color:var(--terracotta)">${SITE.email}</a> and I will delete anything you have sent me. You can block analytics cookies in your browser and the site will work exactly the same.</p>

        <h2>Changes</h2>
        <p>If this policy changes, the updated version appears on this page. This version was last reviewed in August 2026.</p>
      </div>
    </div>
  </section>
`;
}

/* ============================================================
   PAGE REGISTRY
   ============================================================ */

const pages = [
  {
    path: "/",
    file: "index.html",
    title: "Pratim Narayan Moitra, Tourism Marketing Consultant",
    ogTitle: "Pratim Narayan Moitra, Tourism Marketing Consultant",
    description:
      "Your entire social media team in one person. Tourism marketing consultant trained inside PATA and ATTA, working with GBTA and WFTA. Free written audit.",
    body: home,
    extraSchema: [faqSchema]
  },
  {
    path: "/about",
    file: "about/index.html",
    title: "About Pratim Narayan Moitra, Tourism Marketing Consultant",
    description:
      "Trained inside PATA as the only pick from north India, and ATTA as their first Indian intern over eleven months. Now working with GBTA, WFTA, and travel brands worldwide.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "About", href: "/about" }],
    body: about
  },
  {
    path: "/why-work-with-me",
    file: "why-work-with-me/index.html",
    title: "Why Work With Me, Pratim Narayan Moitra",
    description:
      "One consultant running your social media end to end, in your timezone, for roughly a fifth of what the same scope costs in house. Compared honestly against a hire and an agency.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "Why work with me", href: "/why-work-with-me" }],
    body: whyPage,
    extraSchema: [faqSchema]
  },
  {
    path: "/services",
    file: "services/index.html",
    title: "Tourism Marketing Services, Pratim Narayan Moitra",
    description:
      "Social media, email and newsletters, websites, written digital audits, and event and partner marketing for travel associations, DMCs, hotels, and operators.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "Services", href: "/services" }],
    body: servicesIndex
  },
  {
    path: "/work",
    file: "work/index.html",
    title: "Work and Case Studies, Pratim Narayan Moitra",
    description:
      "Case studies from PATA, ATTA, and the World Food Travel Association, plus written 90 day pitches for organisations I would like to work with next.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "Work", href: "/work" }],
    body: workIndex
  },
  {
    path: "/pricing",
    file: "pricing/index.html",
    title: "Pricing, Pratim Narayan Moitra Tourism Marketing",
    description:
      "Retainers from 200 USD a month, growth from 400 USD a month, and project work at an hourly rate. Every retainer starts with a trial month you can cancel.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "Pricing", href: "/pricing" }],
    body: pricing,
    extraSchema: [faqSchema]
  },
  {
    path: "/audit",
    file: "audit/index.html",
    title: "Free Tourism Marketing Audit, Pratim Narayan Moitra",
    description:
      "A free written audit of your website, social, SEO, content, and email, with a scorecard, three quick wins, and a phased 90 day playbook you keep either way.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "Free audit", href: "/audit" }],
    body: auditPage
  },
  {
    path: "/contact",
    file: "contact/index.html",
    title: "Contact Pratim Narayan Moitra, Tourism Marketing Consultant",
    description:
      "Send a message, book a 30 minute discovery call, or email pratimxnarayan@gmail.com. Every enquiry is read personally and answered within 24 hours.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "Contact", href: "/contact" }],
    body: contact
  },
  {
    path: "/privacy",
    file: "privacy/index.html",
    title: "Privacy, Pratim Narayan Moitra",
    description:
      "What this site collects through its forms and analytics, what happens to it, and how to have it deleted.",
    breadcrumb: [{ name: "Home", href: "/" }, { name: "Privacy", href: "/privacy" }],
    body: privacy,
    noModal: true
  }
];

/* service pages */
SERVICES.forEach((s) => {
  pages.push({
    path: "/services/" + s.slug,
    file: "services/" + s.slug + "/index.html",
    title: s.title + ", Pratim Narayan Moitra",
    description: s.blurb,
    breadcrumb: [
      { name: "Home", href: "/" },
      { name: "Services", href: "/services" },
      { name: s.nav, href: "/services/" + s.slug }
    ],
    extraSchema: [
      {
        "@type": "Service",
        "@id": SITE.origin + "/services/" + s.slug + "#service",
        name: s.title,
        description: s.blurb,
        provider: { "@id": SITE.origin + "/#practice" },
        areaServed: "Worldwide",
        serviceType: s.nav,
        url: SITE.origin + "/services/" + s.slug
      }
    ],
    body: () => servicePage(s)
  });
});

/* case study pages */
Object.keys(CASES).forEach((slug) => {
  const c = CASES[slug];
  pages.push({
    path: "/work/" + slug,
    file: "work/" + slug + "/index.html",
    title: c.title + ", Pratim Narayan Moitra",
    description: c.description,
    breadcrumb: [
      { name: "Home", href: "/" },
      { name: "Work", href: "/work" },
      { name: c.tag, href: "/work/" + slug }
    ],
    extraSchema: [
      {
        "@type": "Article",
        "@id": SITE.origin + "/work/" + slug + "#article",
        headline: c.title,
        description: c.description,
        author: { "@id": SITE.origin + "/#pratim" },
        publisher: { "@id": SITE.origin + "/#pratim" },
        mainEntityOfPage: SITE.origin + "/work/" + slug,
        inLanguage: "en"
      }
    ],
    body: () => casePage(slug)
  });
});

/* ============================================================
   WRITE
   ============================================================ */

function write() {
  pages.forEach((p) => {
    const html = P.head(p) + P.nav(p.path) + p.body() + P.footer({ noModal: p.noModal });
    const out = path.join(ROOT, p.file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html, "utf8");
    console.log("wrote", p.file);
  });

  /* sitemap */
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((p) => {
      const pri = p.path === "/" ? "1.0" : p.path.split("/").length > 2 ? "0.6" : "0.8";
      return `  <url><loc>${SITE.origin}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${
        p.path === "/" ? "weekly" : "monthly"
      }</changefreq><priority>${pri}</priority></url>`;
    })
    .join("\n");
  fs.writeFileSync(
    path.join(ROOT, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    "utf8"
  );
  console.log("wrote sitemap.xml with " + pages.length + " urls");
}

write();
