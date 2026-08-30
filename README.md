# pratimnarayan.com

Static site for Pratim Narayan Moitra, tourism marketing consultant.
No framework, no build tooling to install, no dependencies.

## Structure

Every HTML file in this repo is generated. Do not hand edit them, because
the next build will overwrite your changes.

    tools/partials.js    head, schema, nav, footer, marquee, testimonials, CTA band
    tools/build.js       page content and the page registry
    assets/styles.css    the whole stylesheet
    assets/main.js       all interactions
    assets/img/          headshot and testimonial crops, webp with jpg fallback
    assets/logos/        PATA, ATTA, GBTA, WFTA, Adventure.travel marks

## Editing content

Open tools/build.js, change the copy, then run

    node tools/build.js

That rewrites all 16 pages and regenerates sitemap.xml. Commit everything,
including the generated HTML, since Netlify publishes the repo as is.

## Pages

    /                             home
    /about                        about and how it works
    /why-work-with-me             the case against a hire and an agency
    /services                     services index
    /services/social-media
    /services/email-and-newsletters
    /services/websites
    /services/digital-audits
    /services/events-and-partnerships
    /work                         case studies and pitches
    /work/pata
    /work/atta
    /work/wfta
    /pricing
    /audit                        free audit request
    /contact
    /privacy

## Things worth knowing

Person schema sits on every page. The sameAs array in tools/partials.js is
what tells Google that the LinkedIn profile, the site, and every other
mention are the same person. Add Instagram and YouTube there when they exist.

The name Pratim Narayan Moitra is used in full in every title tag, byline,
and schema block. The lowercase wordmark is visual only.

One primary call to action everywhere, request a free audit, pointing at
/audit. Book a call is the quiet secondary.

Booking link and WhatsApp number live at the top of assets/main.js.
Formspree endpoint is set on each form in tools/build.js.
