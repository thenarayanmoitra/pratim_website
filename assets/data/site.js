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
  role: "Freelance social media and email manager",
  jobTitle: "Freelance social media and email manager",
  basedIn: "India",
  oneLine: "Pratim Narayan Moitra. Social media and email for tourism brands.",
  summary: "Pratim Narayan Moitra is a freelance social media and email manager based in India. He runs social media and email for tourism brands, including tourism associations, DMCs, hotels and tourism boards, and helps with content, video editing and day to day marketing. He has worked with PATA, ATTA, the World Food Travel Association and GBTA, and holds a Masters in Tourism Management from Amity University.",

  /* ---- THE REBRAND SETTINGS, November 2026. Change any of these and run
     node build.js. Every page reads them from here.
     label           the small line above the headline, and the job title
     line            the headline of the homepage, and the first line everywhere
     lineUnderline   the words of the line that carry the red pen underline
     primaryOffer    the offer behind the one button, also sent with the form
     secondaryOffer  the quiet link under the button, also sent with the form */
  label: "Freelance social media and email manager",
  line: "I run social media and email for tourism brands.",
  lineUnderline: "tourism brands",
  primaryOffer: "5 free posts in 7 days",
  secondaryOffer: "free audit in 3 working days",

  /* ---- THE POP UP AND THE COOKIE NOTICE ----
     popup          true shows a small card with the offer and the button, once a
                    visit, after half the page or 40 seconds. It never covers the
                    page, and it stays away once it is closed or a form is sent.
     popupDays      how many days it stays away after someone closes it
     consentNotice  true asks visitors in Europe before Google Analytics may use
                    cookies. Everyone can change the choice from Cookies in the footer. */
  popup: true,
  popupDays: 14,
  consentNotice: true,

  /* ---- THE POSTS ON THE HOMEPAGE ----
     heroPosts   three images for the fan in the hero, left, front and right
     homePosts   six images for the grid under What I do
     Each has src (the 560 wide WebP. A JPEG of the same name beside it is
     used as the fallback), alt and kind. kind is client, remake or concept.
     While any image is not client, the captions say the brands shown are
     not clients. When every image is client, those lines are left out.
     To swap in a real client post, save it at 560 by 700 as WebP and JPEG,
     put its path in src, describe it in alt and set kind to client. */
  heroPosts: [
    { src: "/assets/whatif/belize/remake-560.webp", alt: "Remake of a Belize Tourism Board post announcing a new Frankfurt route", kind: "remake" },
    { src: "/assets/concepts/everest-1-560.webp", alt: "Concept post about the Everest base camp trek", kind: "concept" },
    { src: "/assets/whatif/parkroyal/remake-560.webp", alt: "Remake of a PARKROYAL spa offer post", kind: "remake" }
  ],
  homePosts: [
    { src: "/assets/whatif/aurora/remake-560.webp", alt: "Remake of an Aurora Expeditions kelp restoration post", kind: "remake" },
    { src: "/assets/concepts/bhutan-1-560.webp", alt: "Concept carousel cover on three valleys in Bhutan", kind: "concept" },
    { src: "/assets/whatif/gstc/remake-560.webp", alt: "Remake of a GSTC accessibility training post", kind: "remake" },
    { src: "/assets/concepts/kathmandu-1-560.webp", alt: "Concept poster for a Himalayan travel exchange", kind: "concept" },
    { src: "/assets/concepts/srilanka-1-560.webp", alt: "Concept poster for a train journey in Sri Lanka", kind: "concept" },
    { src: "/assets/whatif/belize/remake-560.webp", alt: "Remake of a Belize Tourism Board route post", kind: "remake" }
  ],
  email: "pratimxnarayan@gmail.com",
  linkedin: "https://www.linkedin.com/in/pratimnarayan",
  photo: "/assets/img/pratim-720x900.jpg",
  photoAlt: "Pratim Narayan Moitra watching the sunrise, in a cap and a dark jacket, with an orange sky behind him",
  /* the second portrait, used on the about page */
  photoProfileAlt: "Pratim Narayan Moitra in profile at sunrise, looking out over the hills",
  /* the portrait beside the note at the foot of the homepage, and the note itself */
  notePhoto: "/assets/img/pratim-taktsang-720x900",
  notePhotoAlt: "Pratim Narayan Moitra at Taktsang in Bhutan, smiling with two thumbs up",
  note: "I started inside two travel associations, PATA and ATTA. In most tourism teams I have worked with since, social media belongs to whoever has a spare hour, so good work waits weeks to be posted. I became the person who owns it. That is still the whole job. You run the organisation. I plan, make and post, and each month you get one page that shows what changed.",
  noteWho: "Pratim Narayan Moitra, working from India with tourism brands worldwide",

  /* the 45 second film on the about page, made with Brag on 23 November 2026.
     The master and the editable project are in Desktop/Pratim Narayan/Brag videos/
     brag-output-2026-11-23-red-pen. The site carries the 16:9 cut with music, at
     Pratim's choice on 23 November 2026. The licence of the bundled track (Happy
     Beats Business Moves volume 10 by ende.app) is not confirmed. If it ever needs
     to go, raw-16x9-no-music.mp4 in that folder is the same cut. Swap the two files
     in assets/video to update it, and keep transcript in step with what the film
     shows, since the film has no speech and the transcript is its text version. */
  film: {
    src: "/assets/video/intro.mp4",
    poster: "/assets/video/intro-poster.jpg",
    title: "I run social media and email for tourism brands",
    caption: "What I take off your desk, the results behind me and the free week, in 45 seconds. With music, and every word on screen.",
    description: "A 45 second film by Pratim Narayan Moitra. What he takes off a tourism brand's desk, from the monthly plan to email, video and day to day marketing, where he has worked, three results and one client quote, then the free week of 5 posts.",
    duration: "PT45S",
    uploadDate: "2026-11-23",
    width: 1920,
    height: 1080,
    transcript: [
      "\u201CNobody really owns our marketing.\u201D",
      "I run social media and email for tourism brands. Working from India with tourism brands worldwide.",
      "What I take off your desk. Plan. Make. Post and reply. Report. Concept posts and remakes from my What If series.",
      "Email, video and day to day marketing. Social media management, video and Reels, email marketing, paid ads, websites and marketing coordination.",
      "Where I've worked. PATA, the only candidate selected from north India. ATTA, first Indian intern, kept on from 3 to 11 months. Masters in Tourism Management.",
      "Worked with PATA, the Adventure Travel Trade Association, GBTA, the World Food Travel Association and Adventure.travel, and many more brands.",
      "+82% followers in under 90 days, one tourism brand, four platforms. 25× the likes on a single post, one tourism brand, Instagram. +25% summit registrations for PATA. LinkedIn doubled.",
      "\u201COwning the process and results, Pratim creatively and collaboratively led the social media marketing which quickly and consistently achieved the results we were looking for.\u201D Murray Bartholomew, then Director at the Adventure Travel Trade Association.",
      "Your next 5 posts are on me. 5 posts in 7 days. Yours to keep. Get my 5 free posts. pratimnarayan.com"
    ]
  },

  /* ---- THE NUMBERS. Edit these two blocks and run node build.js. ----
     headline     the three results under the hero and beside the forms, each with one source line
     results      the three cards on the results board, with the bars. short is the
                  line on the homepage card, pen the handwritten note on the first one
     Only numbers with a named or described account behind them appear on the site. */
  headline: [
    { value: "+82%", label: "followers in under 90 days", source: "One tourism brand, four platforms", href: "/#results" },
    { value: "25×", label: "the likes on a single post", source: "One tourism brand, Instagram", href: "/#results" }, /* from around 20 to 502 on the best post */
    { value: "+25%", label: "summit registrations", source: "PATA, the Pacific Asia Travel Association", href: "/#results" }
  ],
  /* the results board under the hero. Each has the before and after the
     bars are drawn from, the label under each bar and a line of context.
     No case study pages exist, so this is the whole story on the page. */
  results: [
    { value: "+82%", label: "followers in under 90 days", time: "Under 90 days", who: "One tourism brand, four platforms", context: "13.02K to 23.68K followers across LinkedIn, Facebook, Instagram and YouTube. LinkedIn doubled, YouTube grew from 104 to 590 subscribers from a standing start.", short: "Across LinkedIn, Facebook, Instagram and YouTube. YouTube grew from 104 to 590 subscribers.", pen: "LinkedIn doubled", unit: "followers", before: 13.02, after: 23.68, bl: "13.02K", al: "23.68K" },
    { value: "25×", label: "the likes on a single post", time: "After the takeover", who: "One tourism brand, Instagram", context: "Posts that used to get around 20 likes settled above 200, with 502 on the best one, from an account that had never passed 30.", short: "Posts that used to get around 20 likes settled above 200, with 502 on the best one.", before: 20, after: 502, bl: "20", al: "502" },
    { value: "+25%", label: "summit registrations for PATA", time: "One summit", who: "PATA, the Pacific Asia Travel Association", context: "The promotion I ran for the summit lifted registrations by a quarter on the period before it, with speaker posts members reshared themselves.", short: "Speaker posts that members reshared themselves.", before: 100, after: 125, bl: "Before", al: "+25%" }
  ],
  /* ---- WHO I HAVE WORKED WITH ----
     Only partners with a logo file are shown, in the proof row under the hero. Add a logo by dropping <logo>.png in assets/logos and
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
  whatifLive: ["belize", "aurora", "parkroyal", "gstc"],

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
  postsPerMonth: { support: "", takeover: "", full: "" },
  markMostChosen: false,
  mostChosenTier: "takeover",
  openSpots: "",

  /* WhatsApp. International format with no spaces or plus sign, for example 919876543210.
     Leave empty and every WhatsApp element stays hidden. */
  whatsappNumber: "",
  whatsappMessage: "Hi Pratim, I'd like the free week of posts for my tourism brand.",

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
  lastUpdated: "2026-11-23",

  /* the checklist and quiz */
  checklistName: "The 40 point social checklist for tourism associations and DMCs"
};
