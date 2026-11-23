# pratimnarayan.com

Social media and email for tourism brands. Plain HTML, CSS and vanilla
JavaScript, built from partials and data files by one Node script, deployed
to Netlify as static files. No framework, no CSS library, no runtime
dependencies.

The look is the red pen system of November 2026. It is described under
"The red pen system" below.

## Build

    node build.js              build every page, the What If artwork, sitemap.xml,
                               robots.txt, llms.txt and the IndexNow key file, then
                               export images through Chrome if any SVG changed
    node build.js --no-images  skip the image export
    node build.js --images     force the image export
    node build.js --only=brand export only the favicon, the app icons and the
                               share image, and leave the What If artwork alone
    node build.js --only=cover.svg,og.svg
                               export only the What If covers and their share
                               previews. Any words can be listed with commas

The generated HTML is committed, so Netlify keeps serving plain files with
no change to its build settings. Run the build, then commit everything it
changed. Node 22 or newer. The image export needs Google Chrome on the
machine (set `CHROME_PATH` if it is somewhere unusual).

Two things to know about the image export. The What If SVG files hold the
full path of the folder they were built in, so on another machine, or in
another folder, a plain `node build.js` sees them as changed and exports
all the artwork again. Use `--no-images`, or `--only=brand`, unless you
mean to do that. And the artwork's font rules in `scripts/export-images.js`
do not load when the folder path has a space in it, so the artwork then
falls back to system fonts. The site's own fonts for the favicon and the
share image are quoted and do load. Look at an exported cover before you
commit new artwork.

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
    assets/data/site.js        config. The rebrand settings, the numbers, the posts
    assets/data/whatif.js      loads the episodes in assets/data/episodes/
    assets/data/episodes/      one file per What If episode
    assets/data/styles.js      the twelve visual styles the episodes test
    src/whatif-src/            the brands' own posts, read at build time only
    src/fonts/                 fonts for the What If artwork, build time only
    assets/video/              the intro film and its poster
    assets/data/*.js           client types, services, FAQ, compare, testimonials
    src/lib.js                 helpers, the pen drawings, image sizes
    src/partials/layout.js     head, header, menu sheet, footer, the bar on a phone
    src/partials/components.js the button, the two field form, the closing band,
                               cards, plans, viewers, quiz
    src/partials/schema.js     JSON LD builders
    src/svg/brand.js           the favicon, the app icons and the share image
    src/svg/contour.js         the contour drawing inside the What If artwork
    src/svg/whatif.js          covers, remake slides, the before mock, episode share images
    src/pages/*.js             one module per page family
    assets/styles.css          every style, the tokens at the top
    assets/main.js             every interaction
    assets/fonts/              self hosted variable woff2. Newsreader, roman and
                               italic, Google Sans Flex and Caveat
    assets/whatif/<slug>/      generated artwork per episode, SVG plus WebP and JPEG
    scripts/                   checks and tools, see below
    netlify/functions/         emails the CV or the checklist (unchanged)
    files/                     the CV and checklist PDFs (unchanged)

Generated and committed: every `index.html`, `404.html`, `sitemap.xml`
(with the images), `robots.txt`, `llms.txt`, `llms-full.txt`,
`whatif/feed.xml` (RSS for the series), `assets/whatif/`, the favicon
files, the app icons, the share image and the IndexNow key file. Edit the
sources, not the output.

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

## The red pen system

A white page, charcoal type and one red. Every colour is a swatch in Gmail's
compose colour grid, plus Gmail's default text colour, so the site, the
email highlight and the email signature match. Never adjust a hex.

    --paper           #FFFFFF   page background
    --paper-alt       #F3F3F3   alternate band
    --line-soft       #EEEEEE   quiet dividers
    --line            #CCCCCC   rules and card borders
    --ink             #222222   headings and body
    --ink-mid         #444444   secondary text
    --ink-soft        #666666   labels, captions, input borders
    --accent          #CC0000   pen marks, links, the button
    --accent-deep     #990000   hover and pressed
    --accent-tint     #F4CCCC   highlighter behind a phrase
    --accent-on-dark  #EA9999   pen marks and links on the dark band only
    --dark            #222222   the one dark band, with white text

Headlines are Newsreader 500, body and interface Google Sans Flex, pen notes
and the signature Caveat 700, the wordmark Newsreader italic. Newsreader is
the file with the optical size axis, and Caveat is the current release from
Google Fonts. The older Caveat in `src/fonts` draws wider and belongs to
the What If artwork only.

The device is an editor's red pen, in three forms. An underline under the
key phrase of an H1 (`penLine` in `src/lib.js`), a highlighter behind one
phrase (`.hl`) and a short note in Caveat, sometimes with an arrow
(`.pen`). At most three pen marks on one screen. The pen only writes what
a buyer says or what they get.

There is one button (`.btn`). A second action beside it is a text link, and
`C.btn` writes one when its kind is ghost. There is one radius, 4 pixels.
There is one dark band a page, the closing band (`C.closeBand`), always
last, with the id `request`. The header button, the bar on a phone and the
P key all go to it.

Motion is three moments, once each, on first view. The hero posts settle
into the fan, the H1 underline draws itself and the hero arrow draws itself.
Nothing moves with reduced motion or without JavaScript.

## The settings, the numbers and the posts

At the top of `assets/data/site.js`:

    label            the small line above the headline, and the job title
    line             the headline of the homepage
    lineUnderline    the words of the line that carry the pen underline
    primaryOffer     the offer behind the one button, sent with the form
    secondaryOffer   the quiet link under the button, sent with the form
    heroPosts        three images for the fan in the hero
    homePosts        six images for the grid under What I do

Each post has `src`, `alt` and `kind`, which is client, remake or
concept. While any post is not a client post, the captions say the brands
shown are not clients. When every post is a client post, those lines are
left out. To swap in a real client post, save it at 560 by 700 as WebP with
a JPEG of the same name beside it, and edit the list.

`headline` holds the three figures in the proof row, each with a source
line, and `results` the three cards under Results, with the before and
after the bars are drawn from. Only numbers with a named or described
account behind them appear. `partners` lists the logos in the proof row.
The two testimonials are in `assets/data/testimonials.js`, quoted exactly.
The six homepage questions are `homepage` in `assets/data/faq.js`.

The film is `assets/video/intro.mp4` with its poster beside it, on the
about page and on a page of its own at `/film/`. `/video` redirects there,
so `pratimnarayan.com/video` is the short link. It is the 45 second Brag film
of 23 November 2026, the 16:9 cut with music. The licence of the bundled
track is not confirmed. If it has to go, `raw-16x9-no-music.mp4` in the Brag
folder is the same cut without it.

For an email signature, `film-thumb.jpg` at the root is the film's poster
with a play bar, drawn in `src/svg/brand.js` and exported with
`node build.js --only=brand`. It sits at the root, not under `/assets`, so
the long asset cache never holds back a new version. The ready signature is
`email-signature-v3-film.html` in the Website kit folder, and it links to
`/film/` with `utm_source=signature`. A Copy the link button on the about
page and the film page copies the film's address. The master, both cuts and the editable project are in
`Desktop/Pratim Narayan/Brag videos/brag-output-2026-11-23-red-pen`, never in
this folder, because Netlify publishes the whole folder. `film` in the config
holds the title, caption, description, dates and `transcript`, the text of
everything the film shows. The film has no speech, so the transcript is its
text version on the page and in the VideoObject. Keep it in step with the film.

Every What If page works out followers per reaction from the brand's counts
(`gapOf` in src/partials/components.js).

The What If covers and their share previews are drawn in the red pen
system, in the site's own fonts (`cover` and `og` in src/svg/whatif.js).
The remake slides of a six slide episode are still drawn in the fonts in
`src/fonts/` (Space Grotesk, Manrope, Space Mono, Fraunces, Instrument
Serif, Anton, Bebas Neue and the older Caveat) at build time only. `src/`
is never served, so they add nothing to the site.

## The pop up, the call to the form and the cookie notice

Three settings in `assets/data/site.js`:

    popup          true shows a small card with the offer and the button
    popupDays      how many days it stays away after someone closes it
    consentNotice  true asks visitors in Europe before Google Analytics
                   may use cookies

The pop up is a dialog in the middle of the screen over a blurred page, on
pages that have the form. It carries the offer and the same two field form
as the rest of the site, so a lead from it arrives like any other, with
`placement` set to popup. It opens once a visit, after half the page or 40
seconds, or when the pointer leaves for the tab bar on a computer. It stays
away while the form is on screen, while someone is typing or watching the
film, once a form is sent, and for `popupDays` after it is closed. Escape,
the close button and a tap outside it close it, focus starts on its heading
and goes back where it was, and the page behind cannot scroll.

Whenever something sends a visitor to the form (the P key, the header
button, the bar on a phone, the pop up, or an address ending in
`#request`), the white box lifts a little and shows a ring.

The cookie notice follows Google's consent mode. Advertising storage is
always denied. Analytics storage is denied for visitors in the European
Economic Area, the UK and Switzerland until they choose Allow, and granted
elsewhere. The two choices in the notice carry the same weight, the choice
is kept in the browser, and the Cookies button in the footer reopens the
notice for anyone. Set `consentNotice` to false to remove all of it.

## The form

One form, `C.quickForm`, in the hero, in every closing band and so on
every page that has one. Two fields with visible labels, "Your website or
Instagram handle" and "Work email", and a hidden field naming the offer. It
posts to the Formspree endpoint in the config and works without JavaScript.
Once sent, one line replaces it and three optional questions are offered as
a second submission: the type of organisation, the country and an open box
for the budget in mind. The quiet link under the button, and the address
`/#audit`, switch every copy of the form on the page to the audit offer.

## Config values, assets/data/site.js

Every optional value hides its element when empty. See the comments in the
file. Search the repository for `PLACEHOLDER` to find the values still to
fill. The ones that matter most: the Instagram profile URL in
`socialProfiles`, `searchVerification`, `postsPerMonth` and
`promiseText`. There is no price setting. No price, price band or currency
appears on any page.

## Checks

    node scripts/lint-copy.js   copy rules on the visible text of every page
    node scripts/contrast.js    WCAG contrast for every colour pairing
    node scripts/validate.js    structured data, titles, images, sitemap and robots.txt
    node scripts/qa.js          loads every page in headless Chrome at 360 and 1440,
                                reports console errors and horizontal overflow
    node scripts/qa.js --out qa --shots / /freeweek/   screenshots too. Put
                                --out before --shots, and name a folder that
                                is not also a page
    node scripts/qa.js --reduced-motion                 with reduced motion on
    node scripts/qa.js --no-js                          with JavaScript off
    node scripts/indexnow.js    tell search engines the sitemap URLs changed, after a deploy

## Copy rules

No hyphens, colons, dashes or semicolons in visible text. Times use a dot.
Sentence case everywhere. First person, short sentences, no filler words,
no invented numbers, no prices. `scripts/lint-copy.js` enforces it.

Since November 2026 the lint also holds three rules. Pratim is never
described as a consultant, a specialist, a junior or an expert. The word
agency appears only where he says he is not one. No price, price band or
currency appears on any page. `/hire/` is exempt from the first two.

Never name a client that is not in `partners`, and never invent a client,
a number, a quote or a logo. Where proof is missing, write a visible
placeholder that reads `[NEEDED, what, from whom]`.

## Old links

Outreach emails link to `/#request`, `/#audit`, `/#results`, `/#work` and
`/#questions`. All five still land on the right section of the homepage.
`/#request` is the closing band with the form, and `/#audit` is the same
form with the audit offer chosen. An episode that is taken out of
`whatifLive` needs a redirect in `netlify.toml`, as `/whatif/ibtm/` has.

Every page in the sitemap has to be reachable by a link. The header only
points at the homepage's sections, so Services and About are linked from
the footer, the client type pages from the about page, and the add on
services from the services page.
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
(speakable), ProfessionalService and FAQPage. The about page carries the
ProfilePage and the VideoObject for the film.

## Tracking

Google Analytics (G-5T8Y684KF6) receives

    cta_click            location and offer of every main button. The
                         locations include header, hero, sticky_bar, close
                         and key_p
    form_start           the first focus of a field in a form
    popup_view, popup_close  the pop up, with what triggered it
    copy_link            the Copy the link button
    form_submit          offer and page
    whatsapp_click       which WhatsApp link
    whatif_episode_view  which episode
    whatif_cta_click     which offer on an episode page
    before_after_drag    the first drag on a before and after, with which one
    film_play, film_complete  the intro film
    generate_lead        every form that went through
    book_call_click, audit_sample_tab, report_type,
    selfcheck_start, selfcheck_complete, engagement_select

## Before going live

1. Fill the config values above, run the build, commit.
2. Verify the site in Google Search Console and Bing Webmaster Tools and
   submit `https://pratimnarayan.com/sitemap.xml`.
3. After each deploy, run `node scripts/indexnow.js`.
4. The email function needs `RESEND_API_KEY` and `FROM_EMAIL` in Netlify,
   as before. Until then the forms still work through Formspree.
