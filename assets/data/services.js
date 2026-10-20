/* Service pages, /services/<slug>/. The main product plus four add ons. */
module.exports = {
  main: {
    slug: "social",
    label: "Social media management",
    short: "Monthly social media for tourism brands, end to end. Strategy, the calendar, carousels, Reels, captions, posting, replies and a one page report every month, with a growth target agreed in week one.",
    subhead: "Monthly social media for tourism brands, end to end, with a growth target agreed in week one.",
    ships: [
      { name: "Carousels and photo posters", text: "Designed in your brand, planned a month ahead and approved by you before anything goes live." },
      { name: "Reels and short video", text: "Planned, scripted and edited from your footage or a shoot with your team, with the posting dates set in the calendar." },
      { name: "Captions and hashtags", text: "Written for the people you sell to, in the words your team already uses." },
      { name: "A content calendar", text: "Shared by the 25th of each month, built around your season and your event dates." },
      { name: "Community replies", text: "Comments and messages answered within one working day, on Social takeover and Full marketing." },
      { name: "The one page report", text: "Three numbers that moved, what drove them and what changes next month, on the first working day." }
    ],
    description: "Monthly social media for tourism associations, DMCs, hotels and boards. Carousels, captions, replies and a one page report, with a growth target agreed in week one."
  },
  /* the end to end list, shown on the homepage and the social page */
  endToEnd: {
    title: "From the first idea to the posted Reel.",
    intro: "End to end means the whole channel comes off your desk. I work out what goes where and when, make it, post it, answer the comments and show you the numbers. You approve, and you see the value in the report every month.",
    steps: [
      { name: "Strategy", short: "Who, what and why", text: "Who we are talking to, what we want them to do and the three pillars every post comes from." },
      { name: "The calendar", short: "Planned a month ahead", text: "Dates, times and formats for the month, built around your season, shared by the 25th." },
      { name: "Design", short: "Carousels and posters", text: "Carousels and photo posters in your brand, with your photos or licensed stock." },
      { name: "Video", short: "Reels, scripted and cut", text: "Reels planned, scripted, shot with your team or cut from your footage, and edited." },
      { name: "Captions", short: "In your own voice", text: "Written for the people you sell to, in the words your team already uses, with the hashtags that still work." },
      { name: "Posting", short: "At the hour that works", text: "Scheduled and published at the times your audience is actually online, on every platform you run." },
      { name: "Replies", short: "Within one working day", text: "Comments and messages answered within one working day, in your voice." },
      { name: "The report", short: "One page, every month", text: "One page a month. Three numbers that moved, what drove them and what changes next." }
    ],
    promise: "If the numbers we agree in week one have not moved by day 90, month four is free."
  },
  addons: [
    {
      slug: "video",
      label: "Video and Reels",
      card: "Reels and short videos, planned, scripted, shot and edited.",
      headline: "Reels and short video, planned and posted for you.",
      paras: [
        "Short video reaches more people than any other format on Instagram, Facebook and LinkedIn, and most tourism teams skip it because nobody has the time. I plan the Reels around your calendar, write the scripts, shoot with your team or cut them from the footage you already have, and edit them in your brand.",
        "Every Reel has a date, a time and a job, a departure to sell, a property to show or a question to answer. You approve each one before it goes live, and the report shows what it reached and what it brought in."
      ],
      deliverables: [
        "A monthly Reels plan tied to your calendar, with dates and times",
        "Scripts and shot lists your team can film on a phone",
        "Editing, captions and cover frames in your brand",
        "A shoot day with your team when the plan needs one",
        "Reach and enquiries per Reel in the monthly report"
      ],
      title: "Reels and short video for tourism brands",
      description: "Reels and short video for tourism associations, DMCs, hotels and boards. Planned, scripted, shot with your team and edited, by Pratim Narayan Moitra."
    },
    {
      slug: "email",
      label: "Email marketing",
      card: "Newsletters and automated emails that bring people back.",
      headline: "Email that brings past guests and members back.",
      paras: [
        "Social builds attention and email is where people act. I write and send a monthly newsletter in your voice, and set up the automated emails that greet new subscribers, remind members about an event or follow up with past guests before their season.",
        "Every email carries tracked links, so you can see which one led to a booking, a registration or a renewal. The list stays yours, in your own account, and I only email people who asked to hear from you."
      ],
      deliverables: [
        "A monthly newsletter, written, designed and sent",
        "A welcome series for new subscribers",
        "Event or season reminder sequences",
        "Signup forms placed where people actually sign up",
        "Tracked links on every email and a line in the monthly report"
      ],
      title: "Email marketing for tourism brands",
      description: "Email marketing for tourism associations, DMCs and hotels. Newsletters, welcome series and tracked reminders that bring members and past guests back."
    },
    {
      slug: "ads",
      label: "Paid ads",
      card: "Meta and Google campaigns for launches and peak season.",
      headline: "Paid ads for launches and peak season.",
      paras: [
        "Ads make sense when there is something specific to sell and a date to sell it by. A new departure, an event with a registration deadline or a low season offer. I run Meta and Google campaigns for those moments and switch them off when the moment passes.",
        "Every campaign starts with a landing page that can convert, a tracking setup that counts enquiries and a budget we agree in writing. You see what each campaign cost and what it brought in, in the same one page report as everything else."
      ],
      deliverables: [
        "Campaign plan with audiences, dates and budget agreed up front",
        "Ad creative made from your own photos and posts",
        "Meta and Google campaign setup and daily checks",
        "Conversion tracking on enquiries, bookings or registrations",
        "A results line in the monthly report, with spend against outcome"
      ],
      title: "Paid ads for tourism brands",
      description: "Meta and Google ads for tourism launches and peak season. Campaigns with agreed budgets, tracked enquiries and honest reporting, from Pratim Narayan Moitra."
    },
    {
      slug: "websites",
      label: "Websites",
      card: "Small sites and landing pages that turn visits into enquiries.",
      headline: "Small websites that turn visits into enquiries.",
      paras: [
        "A tourism website has one job, to turn a visit into an enquiry or a booking. I build small, fast sites and landing pages that load quickly on a phone, say what you sell in the first screen and make the enquiry form short enough to finish.",
        "Most of the sites I build are a handful of pages with a clear path to one form. If your current site is fine and only the enquiry path needs fixing, I'll say so and fix that instead."
      ],
      deliverables: [
        "A small site or landing page, usually one to eight pages",
        "Built to load fast on a phone over mobile data",
        "A short enquiry form that goes straight to your inbox",
        "Tracking so you know which post or email sent each visitor",
        "Titles and descriptions written so Google can tell your pages apart"
      ],
      title: "Websites and landing pages for tourism brands",
      description: "Small websites and landing pages for tourism brands. Fast on a phone, clear in the first screen, with a short enquiry form that converts, from Pratim Narayan Moitra."
    },
    {
      slug: "coordination",
      label: "Marketing coordination",
      card: "Calendars, vendors and event promotion, run as one plan.",
      headline: "Marketing coordination, run as one plan.",
      paras: [
        "Small tourism teams have a designer here, a photographer there, an event agency and a printer, and nobody holding the calendar. I hold it. One plan for the year, one calendar for the month and one person who knows what is due and who is doing it.",
        "This works best alongside social media management, because the posts, the emails and the event promotion all come from the same plan. You get fewer surprises, fewer last minute requests and one place to look."
      ],
      deliverables: [
        "A yearly marketing plan built around your season and events",
        "A monthly calendar across social, email, print and events",
        "Briefs and deadlines for your designers, photographers and vendors",
        "Event promotion run from announcement to follow up",
        "A short weekly note on what is due and what has shipped"
      ],
      title: "Marketing coordination for tourism teams",
      description: "Marketing coordination for small tourism teams. One yearly plan, one monthly calendar and one person holding vendors and event promotion together."
    }
  ]
};
