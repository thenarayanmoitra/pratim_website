# pratimnarayan.com

Static site. No build step. Push to GitHub, Netlify auto deploys.

Files
  index.html         home
  work.html          case studies
  privacy.html       privacy policy
  assets/styles.css  all styling, design tokens at the top
  assets/main.js     nav, reveals, journey line, ajax forms, booking, WhatsApp, exit popup
  assets/logos/      drop official partner logos here only if you have the right to use them

TWO THINGS TO SET before you deploy
  Open assets/main.js and edit the CONFIG block at the very top.
    bookingUrl      your Cal.com or Calendly scheduling link
    whatsappNumber  your number in full international form, digits only, no plus, no spaces
  Until bookingUrl is set, the Book a call section shows a short note instead of the calendar.
  Until whatsappNumber is set, the floating WhatsApp button stays hidden.

Forms
  Three Formspree forms, all posting to https://formspree.io/f/mwvzowbe
    contact form, audit request, and the exit popup checklist request.
  Each carries a hidden form-type field so you can tell them apart in your inbox.
  They submit by ajax so visitors stay on the page.

Exit popup
  Offers the 90 day checklist, a different thing from the free audit.
  You need to have that one page checklist ready to send when someone asks.
  It shows once per visitor, then stays quiet for 30 days.

Analytics
  GA4 is wired with the live ID G-5T8Y684KF6 on all pages.

Editing prices or copy
  Pricing lives in index.html under the PRICING comment. Plain HTML, edit and push.
