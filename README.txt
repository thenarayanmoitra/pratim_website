PRATIMNARAYAN.COM  rebuild
==========================

WHAT THIS IS
A from scratch rebuild of your site. Same palette and typography as before
(terracotta, cream, espresso, Fraunces, Inter), with a lot more for visitors
to do so they stay longer instead of bouncing in 20 seconds.

THE BIG NEW THING
A live "60 second audit" on the home page. Visitors answer six quick questions
and watch a scorecard build across the same areas your real audits cover, then
get a grade plus their two weakest areas, then a prompt to claim the full
written audit by email. It captures leads straight into your pipeline.

FILES
  index.html        home page
  work.html         work page, every Notion link wired exactly as before
  assets/styles.css all styling
  assets/main.js    all interactions and the audit logic
  netlify.toml      publish settings, /work clean url redirect, caching
  robots.txt        crawl rules
  sitemap.xml       two urls

DEPLOY (your existing GitHub to Netlify flow)
  1. Replace the old files in your repo with these (keep the same structure).
  2. Commit and push. Netlify auto deploys.
  3. The contact, scorecard, and audit-request forms appear in
     Netlify dashboard under Forms after the first deploy.

THREE THINGS TO CUSTOMISE BEFORE GOING LIVE
  1. GA4 ID. Search both html files for G-XXXXXXXXXX and paste your real one.
  2. LinkedIn. I used linkedin.com/in/pratimnarayan everywhere. Your old live
     site showed linkedin.com/in/pratimmoitra in the link text. Confirm which
     handle is correct and fix if needed (search both html files).
  3. og-image.png. The meta tags point to your existing og-image.png. Keep that
     file in the site root so social previews still work.

NETLIFY FORMS
  Three forms, three names: contact, scorecard, audit-request. They submit by
  ajax so the visitor stays on the page. After deploy, set up email
  notifications per form in Netlify under Forms, Settings, Notifications.

NOTE ON COPY
  I kept your voice and stripped colons and hyphens from the visible copy per
  your preference. The original site used em dashes in places. If you want the
  dashes back anywhere, they are easy to add.
