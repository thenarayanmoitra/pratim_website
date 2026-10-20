/* ============================================================
   Site configuration for pratimnarayan.com
   Everything optional lives here. Leave a value empty ("") and
   the matching element is left out of the generated HTML.
   Run `node build.js` after any change.
   ============================================================ */
module.exports = {
  url: "https://pratimnarayan.com",
  host: "pratimnarayan.com",
  lang: "en-GB",

  /* identity, section 3 of the brief */
  name: "Pratim Narayan Moitra",
  shortNames: ["Pratim Narayan", "Pratim N. Moitra"],
  role: "Tourism social media marketer",
  jobTitle: "Tourism social media marketer",
  basedIn: "India",
  oneLine: "Pratim Narayan Moitra. Social media for tourism associations, DMCs, hotels and tourism boards.",
  summary: "Pratim Narayan Moitra is a tourism social media marketer based in India. He runs social media, email and paid campaigns for tourism associations, DMCs, hotels and tourism boards. He has worked with PATA, ATTA, the World Food Travel Association and GBTA, and holds a Masters in Tourism Management from Amity University.",
  email: "pratimxnarayan@gmail.com",
  linkedin: "https://www.linkedin.com/in/pratimnarayan",
  photo: "/assets/img/pratim-720x900.jpg",
  photoAlt: "Pratim Narayan Moitra watching the sunrise, in a cap and a dark jacket, with an orange sky behind him",
  /* the second portrait, used on the about page */
  photoProfileAlt: "Pratim Narayan Moitra in profile at sunrise, looking out over the hills",

  /* the 30 second intro film. Swap the files in assets/video to update it. */
  film: {
    src: "/assets/video/intro.mp4",
    poster: "/assets/video/intro-poster.jpg",
    title: "What if I ran your social media? 30 seconds",
    description: "A 30 second film by Pratim Narayan Moitra. A real hotel post that got 3 likes from 13,000 followers, why it went nowhere, the same post rebuilt, the results behind him and the free week of posts.",
    duration: "PT31S",
    uploadDate: "2026-10-21",
    width: 1280,
    height: 720
  },

  /* ---- THE NUMBERS. Edit these four blocks and run node build.js. ----
     headline     the three results under the hero and beside the forms
     numbers      the four figures in the band under the results section
     results      the three cards on the results board, with the bars
     The four numbers were confirmed by Pratim on 16 October 2026. */
  headline: [
    { value: "+82%", label: "followers in under 90 days", href: "/#results" },
    { value: "25×", label: "the likes on a single post", href: "/#results" }, /* from around 20 to 502 on the best post */
    { value: "+25%", label: "summit registrations for PATA", href: "/#results" }
  ],
  /* the results board under the hero. Each has the before and after the
     bars are drawn from, the label under each bar and a line of context.
     No case study pages exist, so this is the whole story on the page. */
  results: [
    { value: "+82%", label: "followers in under 90 days", time: "Under 90 days", who: "One tourism brand, four platforms", context: "13.02K to 23.68K followers across LinkedIn, Facebook, Instagram and YouTube. LinkedIn doubled, YouTube grew from 104 to 590 subscribers from a standing start.", before: 13.02, after: 23.68, bl: "13.02K", al: "23.68K" },
    { value: "25×", label: "the likes on a single post", time: "After the takeover", who: "One tourism brand, Instagram", context: "Posts that used to get around 20 likes settled above 200, with 502 on the best one, from an account that had never passed 30.", before: 20, after: 502, bl: "20", al: "502" },
    { value: "+25%", label: "summit registrations for PATA", time: "One summit", who: "PATA, the Pacific Asia Travel Association", context: "The promotion I ran for the summit lifted registrations by a quarter on the period before it, with speaker posts members reshared themselves.", before: 100, after: 125, bl: "Before", al: "+25%" }
  ],
  numbers: [
    { value: "45%", label: "average rise in reach in the first 90 days" },
    { value: "30%", label: "more enquiries from social by month three" },
    { value: "1,700+", label: "posts planned, designed and published" },
    { value: "2,500+", label: "comments and messages answered for clients" }
  ],
  numbersNote: "Across the tourism accounts I have run. Figures are rounded and updated every quarter.",

  /* ---- WHO I HAVE WORKED WITH ----
     Only partners with a logo file are shown, in the scrolling band, followed
     by partnersMore. Add a logo by dropping <logo>.png in assets/logos and
     setting logo, w, h and hh (the displayed height). */
  partners: [
    { name: "PATA", logo: "pata", w: 190, h: 96, hh: "48px", alt: "PATA, Pacific Asia Travel Association" },
    { name: "ATTA", logo: "atta", w: 417, h: 96, hh: "38px", alt: "Adventure Travel Trade Association" },
    { name: "GBTA", logo: "gbta", w: 420, h: 67, hh: "28px", alt: "GBTA, Global Business Travel Association" },
    { name: "World Food Travel Association", logo: "wfta", w: 373, h: 96, hh: "44px", alt: "World Food Travel Association" },
    { name: "Adventure.travel", logo: "adventure-travel", w: 96, h: 96, hh: "38px", alt: "", mark: true }
  ],
  partnersMore: "and many more brands",

  /* ---- THE WHAT IF SERIES ----
     The episodes that are published, by slug. Every other file in
     assets/data/episodes/ stays saved and unbuilt. Add a slug here and run
     node build.js to publish it. Episodes are numbered among these only. */
  whatifLive: ["belize", "aurora", "parkroyal", "gstc", "ibtm"],

  /* the things the brief says to keep and reuse */
  bookingUrl: "https://cal.com/pratimnarayan/discovery-call",
  calLink: "pratimnarayan/discovery-call",
  formspree: "https://formspree.io/f/mwvzowbe",
  sendFileEndpoint: "/api/send-file",
  gaId: "G-5T8Y684KF6",
  ogImage: "/og-image-2026.jpg",

  /* offers */
  productName: "The 90 Day Feed",
  promiseText: "The 90 day growth promise. In week one we agree two targets from your own starting numbers, for example reach and enquiries from social. If we miss them at day 90, month four is free.",
  showStartingPrice: false,
  startingPriceText: "Plans start from USD 250 a month.",
  postsPerMonth: { support: "", takeover: "", full: "" },
  markMostChosen: false,
  mostChosenTier: "takeover",
  openSpots: "",

  /* WhatsApp. International format with no spaces or plus sign, for example 919876543210.
     Leave empty and every WhatsApp element stays hidden. */
  whatsappNumber: "",
  whatsappMessage: "Hi Pratim, I'd like the free week of posts for my tourism brand.",

  /* compare page, typical monthly cost per column. All four empty hides the row. */
  compareCosts: { pratim: "", agency: "", inhouse: "", marketplace: "" },
  compareCostNote: "Costs are typical monthly figures from public rate cards and job listings at the time of writing, rounded, and will vary by market and scope.",

  /* profiles, used for sameAs and the footer. Empty URLs are skipped. */
  socialProfiles: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/pratimnarayan" },
    { name: "Instagram", url: "" /* [PLACEHOLDER Instagram profile URL] */ },
    { name: "Facebook", url: "" /* [PLACEHOLDER Facebook page URL, optional] */ },
    { name: "YouTube", url: "" /* [PLACEHOLDER YouTube channel URL, optional] */ }
  ],

  /* verification codes, printed as meta tags when set */
  searchVerification: {
    google: "" /* [PLACEHOLDER Google Search Console verification code] */,
    bing: "" /* [PLACEHOLDER Bing Webmaster Tools verification code] */
  },

  /* IndexNow. The key file is written to the site root by the build. */
  indexNowKey: "7c2f9a4e1b8d4f6a9e3c5b7d2a1f8e6c",

  /* dates shown as "Last updated" and used in the sitemap */
  lastUpdated: "2026-10-21",

  /* the checklist and quiz */
  checklistName: "The 40 point social checklist for tourism associations and DMCs"
};
