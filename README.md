# pratimnarayan.com

One page, one goal: get a tourism decision maker to book a free call.
Plain HTML, CSS and JavaScript. No framework and no build step.

## Structure

Everything sits at the top level of the repo, the same as before.

    index.html                    the page
    privacy/index.html            privacy policy
    404.html                      not found page
    assets/styles.css             all styles, brand tokens at the top
    assets/main.js                booking popup, hire picker, email forms
    assets/img/                   portrait and testimonial photos
    assets/logos/                 PATA, ATTA, GBTA, WFTA, Adventure.travel
    assets/work/                  ATTA posts and engagement screenshots
    files/a061df1a899f/           the CV and checklist PDFs (see below)
    og-image-2026.jpg             the preview image for shared links
    netlify/functions/send-file.mjs emails the CV or checklist to visitors
    netlify.toml                    publish folder, old URL redirects, headers

## Page order

Follows the "page that converts" wireframe.

1. Hero with the promise, who it is for, and one button
2. Who I've worked with, association logos with a short bio of each
3. Sound familiar, six moments in the hiring team's own words
4. What you get, the plan, make, read, scale cycle
5. Results, follower growth and engagement before and after (NDA note)
6. Posts from the ATTA marketing team, with Diego's quote
7. How it works in three numbered steps, button again
8. Packed and ready for day one, 46 tools in 13 areas plus certifications
9. Ways to hire (full time, part time, project) plus the CV request
10. Questions people ask before they book
11. The final ask, repeated in the same words, plus the free checklist

The one ask is always "Book a free call", in the same words, everywhere.

## Before going live, three jobs

### 1. Drop in the two PDFs

Put these exact filenames in `files/a061df1a899f/`

    pratim-narayan-moitra-cv.pdf
    tourism-social-media-checklist.pdf

The folder name is random so nobody can guess the link. Nothing on the site
links to it directly. Visitors only get the link inside the email.

### 2. Switch on automatic email delivery (about 10 minutes)

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

### 3. Rename the Cal.com event

The booking popup currently shows "30 min meeting". Rename the event in
Cal.com to "Free call" so it matches the button people just clicked.
The link `cal.com/pratimnarayan/discovery-call` must stay the same.

## Editing

Copy lives directly in `index.html`. House rules for visible copy:
no hyphens, no colons, no em dashes, straight quotes, first person, and no
prices anywhere.

`styles.css` and `main.js` are cached for a year. After changing either one,
bump `?v=2026-09-16b` to a new value in `index.html`, `privacy/index.html`
and `404.html`, or returning visitors keep the old file.

Booking link, Formspree endpoint and email address sit in the CONFIG block
at the top of `assets/main.js`.

## Tracking

Google Analytics (G-5T8Y684KF6) receives these events

    book_call_click     which button was clicked, and any hire option picked
    engagement_select   full time, part time or project
    generate_lead       CV or checklist request, and whether it was auto sent

## Old URLs

Every page from the old multi page site redirects to the matching section
of the new page, so shared links keep working.

## Preview locally

    python3 -m http.server 4455

The email function only runs on Netlify, so locally the forms fall back to
the "I'll send it personally" message.
