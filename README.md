# Pratim N. Moitra — Tourism Marketing Consultant

A minimal 2-page static site. Pure HTML/CSS, no build step, no framework.

## File structure

```
pratim-site/
├── index.html    Homepage (hero, about, services, work preview, audit, thinking, contact)
├── work.html     Case studies — 2-column card grid linking to Notion
├── style.css     Shared stylesheet
└── README.md     This file
```

## ⚠️ Before launch — replace the Notion URLs

The case study cards in `work.html` each have `href="REPLACE_WITH_NOTION_URL"` as a placeholder.

For every card, replace that placeholder with the actual Notion link to that case study.

**Tip:** to share a Notion page publicly, open it → click "Share" in the top right → toggle "Share to web" → copy the link. Paste that link into the `href` attribute of the matching card.

Currently there are **10 Notion URL placeholders** in `work.html`:
- 5 real client cards (PATA, ATTA, WFTA, Druk Asia, Kipling India)
- 5 hypothetical pitch cards (ACTOUR, USTOA, Tourism Alliance, Regional tourism board, Boutique hotel group)

The "More coming" and "Pitch your org" cards link to the contact section instead — leave those as-is.

## How to add a new case study card

This is the workflow Pratim will use weekly. Open `work.html`, find the section you want to add to (real or hypothetical), copy one of the existing card blocks, and paste it. Then change four things:

```html
<a href="YOUR_NOTION_URL_HERE" target="_blank" rel="noopener" class="case-card">
  <div class="case-card-client">CLIENT NAME</div>
  <div class="case-card-title">YOUR CASE STUDY TITLE</div>
  <p class="case-card-desc">ONE-LINE DESCRIPTION.</p>
  <div class="case-card-footer">
    <span class="case-card-link">Read on Notion</span>
    <span class="case-card-arrow">→</span>
  </div>
</a>
```

For hypothetical pitches, add `hyp` to the class: `class="case-card hyp"`. This gives it the dashed border and muted client label.

## How to deploy

Zero build step. Three options:

1. **Drag-and-drop on Netlify** (simplest, recommended for first deploy)
   - Go to https://app.netlify.com/drop
   - Drag the `pratim-site` folder onto the page
   - Done. Custom domain configurable in dashboard.

2. **GitHub + Netlify/Vercel/Cloudflare Pages** (better for ongoing edits)
   - Push the folder to a GitHub repo
   - Connect repo to Netlify/Vercel/Cloudflare Pages
   - Auto-deploys on every commit. You can edit `work.html` directly in GitHub's web editor to add new cards.

3. **Any static host** (S3 + CloudFront, GitHub Pages, etc.)

## What else to wire before launch

### 1. The contact form (`index.html`)
Currently has a placeholder `onsubmit` showing an alert. Replace with one of:

**Easiest — Netlify Forms:**
```html
<form class="contact-form" name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  ...rest of the form...
</form>
```
Submissions appear in the Netlify dashboard. Free up to 100/month.

**Or Formspree:**
```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### 2. Email forwarding
Set up `hello@pratimmoitra.com` to forward to a real inbox via:
- **Cloudflare Email Routing** (free, recommended)
- **ImprovMX** (free, 25 forwards)

### 3. Real LinkedIn URL
Update `linkedin.com/in/pratimmoitra` in `index.html` (currently a placeholder).

### 4. Analytics
Drop in a tracker before the closing `</body>` tag in both files:
- Plausible (privacy-friendly, ~₹400/mo)
- Google Analytics 4 (free)

### 5. Favicon
Add a `favicon.ico` in the root and link in `<head>`:
```html
<link rel="icon" href="favicon.ico">
```

### 6. Open Graph tags (link previews on social/messengers)
Add to each page's `<head>`:
```html
<meta property="og:title" content="Pratim Narayan Moitra — Tourism Marketing">
<meta property="og:description" content="Tourism marketing help, without the agency price tag.">
<meta property="og:image" content="https://yourdomain.com/og-image.jpg">
<meta property="og:url" content="https://yourdomain.com">
```

## Design system

All design tokens are CSS custom properties at the top of `style.css`. To rebrand:

```css
--terracotta: #9C6B2F;        /* Primary accent */
--terracotta-light: #C49A5C;  /* Accent on dark backgrounds */
--cream: #FAF6EF;             /* Page background */
--cream-deep: #F4EDDF;        /* Alt section background */
--ink: #1F1409;               /* Headings, dark sections */
--ink-soft: #2C1E0E;          /* Body text */
--ink-mid: #5C4A33;           /* Secondary text */
```

Fonts: **Fraunces** (serif) + **Inter** (sans), both from Google Fonts.

## Responsive breakpoints

| Width | What changes |
|-------|--------------|
| ≤880px | Nav collapses to hamburger; hero & about stack |
| ≤800px | Case study card grid collapses to single column |
| ≤700px | Services collapse to single column |

## Performance

- No JS dependencies
- One CSS file (~16KB)
- Two Google Font requests
- Total page weight: <80KB

## Suggested launch order

1. Deploy to Netlify (10 min)
2. Wire contact form to Netlify Forms (5 min)
3. Set up email forwarding (10 min)
4. Buy and connect domain (15 min)
5. Replace placeholder Notion URLs as case studies get written (ongoing)
6. Add favicon, OG tags, analytics (15 min)

Total time to first live version: ~1 hour. Notion case studies can fill in over time.
