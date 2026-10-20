# pratimnarayan.com

Social media for tourism brands. Plain HTML, CSS and vanilla JavaScript,
built from partials and data files by one Node script, deployed to Netlify
as static files. No framework, no CSS library, no runtime dependencies.

## Build

    node build.js              build every page, the What If artwork, sitemap.xml,
                               robots.txt, llms.txt and the IndexNow key file, then
                               export images through Chrome if any SVG changed
    node build.js --no-images  skip the image export
    node build.js --images     force the image export

The generated HTML is committed, so Netlify keeps serving plain files with
no change to its build settings. Run the build, then commit everything it
changed. Node 22 or newer. The image export needs Google Chrome on the
machine (set `CHROME_PATH` if it is somewhere unusual).

## Preview

    node scripts/serve.js      http://localhost:4455

Every page also opens straight from the folder. Double click any
`index.html` and the styles, images, links and fonts all work, because the
build writes every path relative to the page and loads the fonts from
`assets/fonts/inline.css` when a page is opened as a file. Links between
pages carry `index.html` for that reason, and `netlify.toml` sends those to
the clean folder URL on the live site, so visitors only ever see
`pratimnarayan.com/freeweek/`. The 404 page keeps root paths because Netlify
serves it at any address.

## Structure

    build.js                   the build
    assets/data/site.js        config, every optional value, section 20 of the brief
    assets/data/whatif.js      loads the episodes in assets/data/episodes/
    assets/data/episodes/      one file per What If episode
    assets/data/styles.js      the twelve visual styles the episodes test
    src/whatif-src/            the brands' own posts, read at build time only
    src/fonts/                 display fonts for the remake slides, build time only
    assets/video/              the intro film and its poster
    assets/data/*.js           client types, services, concepts, FAQ, compare, testimonials
    src/lib.js                 helpers
    src/partials/layout.js     head, top bar, header, menu sheet, footer, bottom bar
    src/partials/components.js buttons, chips, cards, forms, plans, viewers, quiz
    src/partials/schema.js     JSON LD builders
    src/svg/contour.js         the topographic contour motif
    src/svg/whatif.js          covers, remake slides, the before mock, the Open Graph image
    src/pages/*.js             one module per page family
    assets/styles.css          every style, brand tokens at the top
    assets/main.js             every interaction
    assets/fonts/              self hosted woff2, two variable fonts and two statics
    assets/whatif/<slug>/      generated artwork per episode, SVG plus WebP and JPEG
    assets/img/contour.svg     the motif behind dark sections
    scripts/                   checks and tools, see below
    netlify/functions/         emails the CV or the checklist (unchanged)
    files/                     the CV and checklist PDFs (unchanged)

Generated and committed: every `index.html`, `404.html`, `sitemap.xml`
(with the images), `robots.txt`, `llms.txt`, `llms-full.txt`,
`whatif/feed.xml` (RSS for the series), `assets/whatif/`,
`assets/img/contour.svg` and the IndexNow key file. Edit the sources, not
the output.

## Adding a What If episode

Every episode is one file in `assets/data/episodes/`, and the brand's own
post sits beside it as `src/whatif-src/<slug>.jpg`. Only the slugs listed
in `whatifLive` in `assets/data/site.js` are published. The others stay
saved and unbuilt, and the build removes their pages. The build numbers the
published episodes from the oldest `publishDate` (same day, in the order of
`whatifLive`), so the newest is always the highest number, and draws the
cover and the Open Graph image (the post as it was behind, the remake in
front, the drawn arrow between them), the before image and the remake
from the data.

There are two kinds of episode.

**A single image remake** (round two, October 2026). The finished post is a
1080 by 1350 PNG you made elsewhere, saved as
`src/whatif-src/<slug>-remake.png`. The episode file adds a `remake` block
with `headline`, `line`, `photo` (`what`, `by`, `source`, `url`, shown as
the credit on the page and in the ImageObject schema) and `changed`, three
`{ name, text }` notes on what the remake changed. `remakeSlides` holds one
entry describing the image. The page shows the drag, the remake beside the
three notes, and the gap meter.

**A six slide carousel** (round one and the 36 saved episodes). The build
draws the slides from `remakeSlides` in the style named in `style`, and
the page shows the slide row. The steps below describe this kind.

1. Copy any file in `assets/data/episodes/` to `<slug>.js`. The slug is
   lowercase letters and digits only, no hyphens.
2. Save the post image as `src/whatif-src/<slug>.jpg`, the full post as it
   appears on Instagram, 1080 wide if you can. It is only read at build
   time and never served.
3. Fill every field. `brand` holds the handle, the brand colour, the
   follower count, the engagement, the post type, the post link, the words
   on the post and a one line description of what it looks like.
4. Pick the `style` from the twelve keys in `assets/data/styles.js` and
   write `styleWhy` in two or three sentences. `inspiredBy` names the brand
   from the inspirations list and what it does well.
5. Write the three `observations`, the `strategy` block, six `remakeSlides`
   (each with `headline`, and optionally `kicker`, `line`, `items`, `stat`
   and `photo: true` to put the brand's photo on that slide), the
   `caption`, three `monthOne` actions, and `names`, the proper nouns the
   copy lint should allow in headings.
6. Tell the build how to crop the photo. `photoTreat` is `sharp` for a real
   photo or `soft` for a designed poster with no clean region, which turns
   the post into a colour field under the type. `photoCrop` is the clean
   region as fractions of the source, for example
   `{"x":0,"y":0.4,"w":1,"h":0.6}` for the bottom sixty percent. The crop
   is what keeps the brand's own headline out of the remake.
7. Add the slug to `whatifLive` in `assets/data/site.js`.
8. Run `node build.js` and look at `assets/whatif/<slug>/slide-1-560.jpg`.
   Adjust the crop if any of the original text shows, and run it again.
9. Commit.

To remove an episode, delete its file, its source image and its folder in
`assets/whatif/`, and run the build. The ten original sample episodes are
kept in `assets/data/whatif-samples.js` for reference and are not built.

## The numbers, the partners and the film

The three results under the hero, the three cards on the results board
and the four figures under them live in `assets/data/site.js` as
`headline`, `results` and `numbers`. There are no case study pages any
more, so each results card carries its own before and after and one line
of context. Every What If page also works out followers per reaction from
the brand's counts (`gapOf` in src/partials/components.js), which is the
number under every cover, on the index chart and in the meter on each
episode.
`partners` lists everyone in the band under the hero. The five with a
logo file show as logos, the rest as names. Add a logo by dropping
`<name>.png` into `assets/logos/` and filling `logo`, `w`, `h` and `hh`.
The intro film is `assets/video/intro.mp4` with its poster beside it, and
`film` in the config holds the title, description and dates for the
VideoObject structured data. Replace the two files to update it.

The remake slides use six open licence display fonts in `src/fonts/`
(Fraunces, Instrument Serif, Anton, Bebas Neue and Caveat) at build time
only. `src/` is never served, so they add nothing to the site.

## Config values, assets/data/site.js

Every optional value hides its element when empty. See the comments in the
file. Search the repository for `PLACEHOLDER` to find the values still to
fill. The ones that matter most: `whatsappNumber`, the Instagram profile
URL in `socialProfiles`, `searchVerification`, `openSpots`, `postsPerMonth`,
`compareCosts`, `showStartingPrice` and `promiseText`.

## Checks

    node scripts/lint-copy.js   copy rules on the visible text of every page
    node scripts/contrast.js    WCAG contrast for every colour pairing
    node scripts/validate.js    structured data, titles, images, sitemap and robots.txt
    node scripts/qa.js          loads every page in headless Chrome at 360 and 1440,
                                reports console errors and horizontal overflow
    node scripts/qa.js --shots / /freeweek/ --out qa   screenshots too
    node scripts/qa.js --reduced-motion                 with reduced motion on
    node scripts/qa.js --no-js                          with JavaScript off
    node scripts/indexnow.js    tell search engines the sitemap URLs changed, after a deploy

## Copy rules

No hyphens, colons, dashes or semicolons in visible text. Times use a dot.
Sentence case everywhere. First person, short sentences, no filler words,
no invented numbers, no prices. `scripts/lint-copy.js` enforces it.

## Old links

Outreach emails link to `/#request`, `/#audit`, `/#results`, `/#work` and
`/#questions`. All five still land on the right section of the homepage.
The old case study addresses under `/work/` go to `/#results`.
`netlify.toml` keeps the older redirects and sends `www` and `http` to
`https://pratimnarayan.com`.

## Search engines and assistants

`robots.txt` names every search, preview and AI crawler and allows all of
them everywhere except the 404 page. `llms.txt` is the short summary for
assistants, `llms-full.txt` the same plus every episode in full, the
questions and the twelve styles. `sitemap.xml` lists the covers, remakes
and portraits as images. `whatif/feed.xml` is the RSS feed for the series
and every page links to it. Episode pages carry Article, ImageObject (with
the photo credit) and BreadcrumbList schema, the homepage WebSite, WebPage
(speakable), ProfessionalService and FAQPage.

## Tracking

Google Analytics (G-5T8Y684KF6) receives

    cta_click            location and offer of every main button
    form_submit          offer and page
    whatsapp_click       which WhatsApp link
    whatif_episode_view  which episode
    whatif_cta_click     which offer on an episode page
    before_after_drag    the first drag on a before and after, with which one
    film_play, film_complete  the intro film
    generate_lead        every form that went through
    book_call_click, concept_open, audit_sample_tab, report_type,
    selfcheck_start, selfcheck_complete, engagement_select

## Before going live

1. Fill the config values above, run the build, commit.
2. Verify the site in Google Search Console and Bing Webmaster Tools and
   submit `https://pratimnarayan.com/sitemap.xml`.
3. After each deploy, run `node scripts/indexnow.js`.
4. The email function needs `RESEND_API_KEY` and `FROM_EMAIL` in Netlify,
   as before. Until then the forms still work through Formspree.
