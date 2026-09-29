# pratimnarayan.com

One page, one offer: get a tourism decision maker to request a free audit.
Plain HTML, CSS and JavaScript. No framework and no build step.

## Structure

    index.html                    the page
    hire/index.html               full time, part time and CV request, for job outreach only
    privacy/index.html            privacy policy
    404.html                      not found page
    assets/styles.css             all styles, brand tokens at the top
    assets/main.js                audit form, self check, poster viewer, booking popup, email forms
    assets/img/                   portrait and testimonial photos
    assets/logos/                 PATA, ATTA, GBTA, WFTA, Adventure.travel
    assets/work/                  engagement screenshots for the results section
    assets/concepts/              the concept poster carousels, 560 and 1080 wide
    files/a061df1a899f/           the CV and the 40 point checklist PDF, only reachable from the emailed link
    og-image-2026.jpg             the preview image for shared links
    netlify/functions/send-file.mjs emails the CV or checklist to visitors
    netlify.toml                    publish folder, old URL redirects, headers

## Page order

1. Hero with the promise, who it is for, and the audit button
2. Logo strip, the associations I've worked with
3. Results, follower count up, bars, engagement, Murray's quote, certifications
4. Concept posters, a sideways strip that opens each full carousel
5. Three problems, consistency, conversion and proof
6. The free audit, five sample pages, then the four field request form
7. How it works in two steps, the monthly cycle, three ways to work, the one page report
8. Diego's testimonial in its own dark band
9. Questions
10. The final ask, then the seven question self check and the checklist

## One label per intent

    Request a free audit    the main ask, always this wording, always goes to #request
    Book a call             the secondary ask, always opens Cal.com

The hire page is the one exception. Recruiters get Book a call and the CV.
It is not linked from the homepage and carries noindex. Share it as
pratimnarayan.com/hire or pratimnarayan.com/cv in job outreach.

## The audit request

Four fields, name, work email, website and what kind of organisation.
It posts to the same Formspree form as everything else, with the subject
"Audit request from <name>, <website>". If the visitor took the self check
first, their score comes along as selfcheck_score. The page promises the
written report within 3 working days, so that is the clock once it lands.

## Concept posters

Every card and the full viewer say concept, and the intro says the brands
are made up. Keep it that way. To add a set, export the slides at 1080 by 1350,
save them as assets/concepts/<name>-<n>-1080.webp and -560.webp (plus a
-1-560.jpg cover), then copy one of the li.poster blocks in index.html and
change data-set, data-count and data-title.

## The PDFs

    files/a061df1a899f/pratim-narayan-moitra-cv.pdf
    files/a061df1a899f/tourism-social-media-checklist.pdf

The folder name is random so nobody can guess the link. Nothing on the site
links to it directly. Visitors only get the link inside the email.

To update the CV, replace the file and keep the exact same name. The
checklist is designed in `checklist/checklist.html`, kept outside the site
folder so it is never published. Edit that and print it again to PDF.

## Before going live, two jobs

### 1. Switch on automatic email delivery (about 10 minutes)

Until this is done the forms still work. Every request lands in your inbox
through Formspree, and the visitor is told you will email the file personally.

1. Create a free account at resend.com
2. Domains, add `pratimnarayan.com`, then add the DNS records Resend shows
   you wherever your domain's DNS lives. Wait for it to say Verified.
3. API Keys, create one with sending access
4. In Netlify, Site configuration, Environment variables, add
   `RESEND_API_KEY` with that key, and
   `FROM_EMAIL` as `Pratim Narayan Moitra <pratim@pratimnarayan.com>`
5. Trigger a new deploy, then request your own CV on the live site to test

Optional `REPLY_TO_EMAIL` changes where replies go. It defaults to
pratimxnarayan@gmail.com.

### 2. Rename the Cal.com event

The booking popup currently shows "30 min meeting". Rename the event in
Cal.com to "Call" or "Intro call" so it matches the Book a call button.
The link `cal.com/pratimnarayan/discovery-call` must stay the same.

## Editing

Copy lives directly in `index.html`. House rules for visible copy:
no hyphens, no colons, no em dashes, straight quotes, first person, and no
prices anywhere.

`styles.css` and `main.js` are cached for a year. After changing either one,
bump `?v=2026-09-29a` to a new value in `index.html`, `hire/index.html`,
`privacy/index.html` and `404.html`, or returning visitors keep the old file.

Booking link, Formspree endpoint and email address sit in the CONFIG block
at the top of `assets/main.js`. The sample monthly report numbers live in
REPORTS in the same file, and the self check questions live in index.html.

## Tracking

Google Analytics (G-5T8Y684KF6) receives these events

    audit_cta_click     which Request a free audit button was clicked
    generate_lead       audit, CV or checklist request
    book_call_click     which Book a call button was clicked
    selfcheck_start     someone answered the first self check question
    selfcheck_complete  the score they got
    audit_sample_tab    which sample audit page they opened
    report_type         which client type they looked at in the sample report
    concept_open        which concept carousel they opened
    engagement_select   full time, part time or project, on the hire page

## Old URLs

Every page from the old multi page site redirects to the matching section
of the new page, so shared links keep working. /audit and /contact go
straight to the audit form.

## Preview locally

    python3 -m http.server 4455

The email function only runs on Netlify, so locally the forms fall back to
the "I'll send it personally" message.
