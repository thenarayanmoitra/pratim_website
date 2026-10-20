/* ============================================================
   The What If series.
   One object per episode. The build generates /whatif/, one page
   per episode, the homepage row, the covers and the slide images
   from this file. Newest publishDate comes first everywhere.

   To add a real episode, copy a sample object, set sample to false,
   replace brandName and every line of text, drop the screenshot
   and slide images into assets/whatif/<slug>/ and run `node build.js`.
   See README.md for the exact steps.

   Fields
     slug          lowercase letters and digits only, no hyphens
     sample        true for a sample with a made up archetype, false for a real brand
     brandName     for samples the archetype, for example "a Bhutan DMC"
     clientType    Tourism association, DMC or tour operator, Hotel or resort,
                   Tourism board, Travel academy, Other travel brand
     region        shown as a chip
     platform      the main platform the remake is made for
     publishDate   YYYY-MM-DD
     coverLine     the heading on the cover and the page
     storyTitle    the subhead
     bigIdea       one sentence, with the brand that inspired it
     beforeCaption the typical post's caption, drawn into the mock for samples
     beforeAlt     alt text for the before post
     beforeImage   real brands only, path to the screenshot
     beforeCredit  real brands only, who to credit for the screenshot
     observations  three short lines, the first one on what works
     strategy      audience, pillars (three), rhythm, target
     remakeSlides  each with headline, optional line, optional image
     monthOne      three actions
     linkedinUrl   optional, the LinkedIn post for this episode
   ============================================================ */
module.exports = [
  {
    slug: "sampleassociation",
    sample: true,
    brandName: "a tourism association",
    clientType: "Tourism association",
    region: "Asia Pacific",
    platform: "LinkedIn",
    publishDate: "2026-10-11",
    coverLine: "What if a tourism association posted like this?",
    storyTitle: "How one carousel could fill a summit hall",
    bigIdea: "A speaker countdown that members share themselves, borrowed from how strong conference brands turn every speaker into a reason to register.",
    beforeCaption: "Join us at our Annual Summit 2027! Dates announced. Register now. #tourism #summit",
    beforeAlt: "A typical tourism association post. A grey photo block with the caption Join us at our Annual Summit 2027! Dates announced. Register now.",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The event photo is strong and the logo is easy to spot.",
      "The caption leads with the date instead of a reason to attend.",
      "No speaker, session or member appears, so nobody has a reason to share it."
    ],
    strategy: {
      audience: "Marketing heads at member DMCs, hotels and tourism boards, and the delegates they bring.",
      pillars: [
        "Speaker of the week, one person and one takeaway.",
        "Member spotlights that members reshare themselves.",
        "Behind the summit, from the venue to the agenda taking shape."
      ],
      rhythm: "Three LinkedIn posts a week and one Instagram carousel, with a tracked registration link on every speaker post.",
      target: "Registrations that come from social, tracked with UTM links, aiming to double their share by summit week."
    },
    remakeSlides: [
      { headline: "Next March, the region's tourism leaders meet in one room." },
      { headline: "Here's what you'll take home." },
      { headline: "Session one. How small DMCs are winning direct bookings." },
      { headline: "Session two. What travellers will pay more for in 2027." },
      { headline: "Session three. Turning members into your best marketers." },
      { headline: "Early bird closes soon.", line: "Register through the link in the comments." }
    ],
    monthOne: [
      "Map every speaker and give each one a post date.",
      "Turn last year's best photos into a credited member gallery.",
      "Add tracked links to every post so registrations can be counted."
    ],
    linkedinUrl: ""
  },
  {
    slug: "samplebhutandmc",
    sample: true,
    brandName: "a Bhutan DMC",
    clientType: "DMC or tour operator",
    region: "Bhutan",
    platform: "Instagram",
    publishDate: "2026-10-04",
    coverLine: "What if a Bhutan DMC posted like this?",
    storyTitle: "How a Bhutan DMC could turn followers into enquiries",
    bigIdea: "Split Bhutan into named regions with their own look, the way Destination British Columbia gives each region a sub brand, and turn comments into enquiries with a keyword that sends the route.",
    beforeCaption: "Tiger's Nest. Book your Bhutan tour with us today! DM for details.",
    beforeAlt: "A typical Bhutan DMC post. A grey photo block with the caption Tiger's Nest. Book your Bhutan tour with us today! DM for details.",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The photo of Paro Taktsang is beautiful and well framed.",
      "It looks like every other Bhutan account, because every Bhutan account posts the same monastery.",
      "DM for details asks for effort and gives the traveller no reason to make it."
    ],
    strategy: {
      audience: "Couples and small groups in the US, UK and India planning a first Bhutan trip in the next 6 to 12 months.",
      pillars: [
        "Beyond Paro, one valley at a time, west, central and east.",
        "Meet your guide, the faces travellers will travel with.",
        "Plan it right, short answers on permits, the SDF and seasons."
      ],
      rhythm: "Three posts a week, two carousels and one Reel, with a comment keyword that sends the matching route by DM.",
      target: "Enquiries from Instagram, counted through the DM keyword and a short form, aiming to double the monthly baseline."
    },
    remakeSlides: [
      { headline: "Three valleys most Bhutan trips skip." },
      { headline: "Haa.", line: "One road in, and almost no other travellers." },
      { headline: "Bumthang.", line: "Old temples and farmhouse stays." },
      { headline: "Phobjikha.", line: "Black necked cranes every winter." },
      { headline: "Add one of them to your route.", line: "Two extra days, a very different Bhutan." },
      { headline: "Comment VALLEY and we'll send you the route." }
    ],
    monthOne: [
      "Build a photo set for each valley.",
      "Set up the comment keyword with an automatic reply.",
      "Introduce your guides in a pinned carousel."
    ],
    linkedinUrl: ""
  },
  {
    slug: "samplenepaltrek",
    sample: true,
    brandName: "a Nepal trekking company",
    clientType: "DMC or tour operator",
    region: "Nepal",
    platform: "Instagram",
    publishDate: "2026-09-27",
    coverLine: "What if a trekking company posted like this?",
    storyTitle: "How an operator could sell a departure in one carousel",
    bigIdea: "Sell one dated departure at a time with honest seats left, and make one guide a recurring face, a low budget version of how Switzerland Tourism builds a running series around one person.",
    beforeCaption: "Everest Base Camp Trek, 14 days. Spring and autumn departures available. Contact us!",
    beforeAlt: "A typical trekking company post. A grey photo block with the caption Everest Base Camp Trek, 14 days. Spring and autumn departures available. Contact us!",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The product is clear and the mountain photo is strong.",
      "There are no dates, no group size and no idea of cost, so nobody can decide.",
      "The same post appears every month, so followers have learned to scroll past it."
    ],
    strategy: {
      audience: "First time trekkers aged 25 to 45 in the UK, US and Australia who have the time but worry about altitude.",
      pillars: [
        "Departure of the month, with dates, group size and what's included.",
        "Can I do this, honest answers on fitness and altitude.",
        "Your guide, one recurring face from day one to base camp."
      ],
      rhythm: "Two carousels and two Reels a week, with every departure post ending on how many seats are open.",
      target: "Departure enquiries from Instagram and WhatsApp, aiming to fill one extra group each season from social."
    },
    remakeSlides: [
      { headline: "One spring departure. 12 seats. Here's the whole trip." },
      { headline: "Days 1 to 3.", line: "Kathmandu to Phakding, slow and easy." },
      { headline: "Days 4 to 8.", line: "Namche and acclimatisation, where most trips go wrong." },
      { headline: "Days 9 to 12.", line: "Base camp, then the long walk home." },
      { headline: "What's included, and what isn't." },
      { headline: "Seats are open.", line: "Message us on WhatsApp for the full plan." }
    ],
    monthOne: [
      "Pick the next two departures and publish their dates.",
      "Film the guide answering the five questions people ask most.",
      "Add a WhatsApp link to the bio with a prefilled message."
    ],
    linkedinUrl: ""
  },
  {
    slug: "sampleheritagehotel",
    sample: true,
    brandName: "a heritage hotel",
    clientType: "Hotel or resort",
    region: "India",
    platform: "Instagram",
    publishDate: "2026-09-20",
    coverLine: "What if a heritage hotel posted like this?",
    storyTitle: "How a heritage hotel could sell the stay before the booking page",
    bigIdea: "Show a day at the hotel hour by hour, the lived in feel The Hoxton is known for, with the slow, natural sound video that Belmond uses.",
    beforeCaption: "Experience royal luxury at our heritage property. Book now for the best rates!",
    beforeAlt: "A typical heritage hotel post. A grey photo block with the caption Experience royal luxury at our heritage property. Book now for the best rates!",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The courtyard photo shows real character.",
      "Royal luxury is a phrase every palace hotel uses.",
      "The post sells rooms and never shows what a day here feels like."
    ],
    strategy: {
      audience: "Couples and families from India and Europe planning a special trip, comparing three or four hotels before they book.",
      pillars: [
        "A day here, hour by hour.",
        "The people, from the chef to the family behind the house.",
        "The city from our door, one local tip in every post."
      ],
      rhythm: "Three posts a week, one slow Reel with natural sound, and guest photos reshared with credit.",
      target: "Direct booking enquiries from Instagram, tracked through a link in bio form, aiming for a steady rise each month."
    },
    remakeSlides: [
      { headline: "24 hours inside our haveli." },
      { headline: "7 am.", line: "Chai on the roof as the city wakes up." },
      { headline: "11 am.", line: "A cooking class with our chef." },
      { headline: "4 pm.", line: "The old city, a short walk from the gate." },
      { headline: "8 pm.", line: "Dinner in the courtyard by lamplight." },
      { headline: "Save this for your trip.", line: "Book direct through the link in our bio." }
    ],
    monthOne: [
      "Shoot one full day at the hotel in a single session.",
      "Ask the last twenty guests for photos you can credit.",
      "Write a one page local guide to link from the bio."
    ],
    linkedinUrl: ""
  },
  {
    slug: "sampleecolodge",
    sample: true,
    brandName: "a Himalayan eco lodge",
    clientType: "Hotel or resort",
    region: "India",
    platform: "Instagram",
    publishDate: "2026-09-13",
    coverLine: "What if an eco lodge posted like this?",
    storyTitle: "How an eco lodge could fill its monsoon months",
    bigIdea: "Own the weather instead of hiding it, the way VisitScotland sells mist and rain as atmosphere.",
    beforeCaption: "Escape to nature. Peaceful stay in the hills. Book your getaway!",
    beforeAlt: "A typical eco lodge post. A grey photo block with the caption Escape to nature. Peaceful stay in the hills. Book your getaway!",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The setting is beautiful and the light is soft.",
      "Posting stops in the monsoon, which is when the lodge most needs bookings.",
      "Sustainability claims appear with nothing to back them up."
    ],
    strategy: {
      audience: "Slow travellers and remote workers from Indian cities who want quiet and can travel on flexible dates.",
      pillars: [
        "The rains are the season, with mist, waterfalls and no crowds.",
        "How we run the lodge, with proof on water, food and local staff.",
        "Stay longer, working from the hills with the wifi speed shown."
      ],
      rhythm: "Three posts a week all year, with the monsoon series starting six weeks before the rains.",
      target: "Enquiries for the monsoon months, aiming to fill more quiet weeks than last year."
    },
    remakeSlides: [
      { headline: "The rains are our favourite season. Here's why." },
      { headline: "The waterfalls only run like this from June to September." },
      { headline: "Mornings above the clouds." },
      { headline: "Quiet trails, lower rates, longer stays." },
      { headline: "What we do with the rain we collect." },
      { headline: "Plan a monsoon week.", line: "Link in bio." }
    ],
    monthOne: [
      "Shoot the property in the first heavy rain.",
      "Write down three sustainability practices you can prove.",
      "Build a monsoon stay offer for remote workers."
    ],
    linkedinUrl: ""
  },
  {
    slug: "sampleislandboard",
    sample: true,
    brandName: "an island tourism board",
    clientType: "Tourism board",
    region: "Indian Ocean",
    platform: "Instagram",
    publishDate: "2026-09-06",
    coverLine: "What if a tourism board posted like this?",
    storyTitle: "How a small tourism board could give every island its own story",
    bigIdea: "Monthly ranked lists that every featured place reposts, the way Lonely Planet's yearly list gets reshared by everyone on it.",
    beforeCaption: "Discover the hidden paradise of our islands. #VisitParadise",
    beforeAlt: "A typical island tourism board post. A grey photo block with the caption Discover the hidden paradise of our islands.",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The beach photography is high quality.",
      "Every post says paradise, so none of them is memorable.",
      "Local businesses rarely appear, so they have no reason to reshare."
    ],
    strategy: {
      audience: "Repeat travellers and travel media in key source markets, plus local operators who can amplify every post.",
      pillars: [
        "One island, one story, each with its own name and look.",
        "Ranked lists that locals and operators reshare.",
        "Locals as hosts, with credited photos from residents and guests."
      ],
      rhythm: "Four posts a week on Instagram and Facebook, with one ranked list each month made for resharing.",
      target: "Shares, saves and reposts by local operators, aiming to grow all three every month."
    },
    remakeSlides: [
      { headline: "The 7 best sunrise spots, ranked by the people who live here." },
      { headline: "No. 7.", line: "The old jetty at first light." },
      { headline: "No. 5.", line: "The hill above the fishing village." },
      { headline: "No. 3.", line: "The lagoon before the boats go out." },
      { headline: "No. 1.", line: "You'll have to come and see." },
      { headline: "Tag the friend you'd watch it with." }
    ],
    monthOne: [
      "Ask residents to vote on the first ranked list.",
      "Tag and notify every business featured.",
      "Give each island a name, a colour and a cover style."
    ],
    linkedinUrl: ""
  },
  {
    slug: "sampleacademy",
    sample: true,
    brandName: "a hospitality academy",
    clientType: "Travel academy",
    region: "South Asia",
    platform: "Instagram",
    publishDate: "2026-08-30",
    coverLine: "What if a hospitality academy posted like this?",
    storyTitle: "How an academy could fill its next intake from Instagram",
    bigIdea: "Let graduates be the proof, one alumnus per post, and answer parents directly, because parents often decide and pay.",
    beforeCaption: "Admissions open for 2027! Apply now for our hotel management program.",
    beforeAlt: "A typical hospitality academy post. A grey photo block with the caption Admissions open for 2027! Apply now for our hotel management program.",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The deadline is clear and easy to find.",
      "It talks to students and ignores the parents who often decide.",
      "There is no proof of where graduates end up."
    ],
    strategy: {
      audience: "Students aged 17 to 22 and their parents in India, Nepal and Bhutan comparing hotel schools.",
      pillars: [
        "Where our graduates work now, one alumnus per post.",
        "A day in the training kitchen and at the front desk.",
        "Questions parents ask, answered by faculty."
      ],
      rhythm: "Three posts a week and one student made Reel, with the application link in every alumni post.",
      target: "Applications started from Instagram, tracked by link, aiming to double them before the intake closes."
    },
    remakeSlides: [
      { headline: "Where our last graduating class works today." },
      { headline: "Front office.", line: "An international hotel group." },
      { headline: "Pastry.", line: "A cruise line kitchen." },
      { headline: "Events.", line: "A beach resort." },
      { headline: "Your path starts with one form." },
      { headline: "Applications close soon.", line: "Link in bio." }
    ],
    monthOne: [
      "Collect permission and photos from ten recent graduates.",
      "Record faculty answering the five questions parents ask most.",
      "Add a short application starter form to the bio."
    ],
    linkedinUrl: ""
  },
  {
    slug: "samplefoodtour",
    sample: true,
    brandName: "a food tour company",
    clientType: "DMC or tour operator",
    region: "India",
    platform: "Instagram",
    publishDate: "2026-08-23",
    coverLine: "What if a food tour company posted like this?",
    storyTitle: "How a food tour could turn one dish into bookings",
    bigIdea: "A numbered dish series that gives people a reason to follow for the next episode, the way Zostel's numbered series keeps viewers coming back.",
    beforeCaption: "Join our Old Delhi food walk! Taste the best street food. Book now.",
    beforeAlt: "A typical food tour company post. A grey photo block with the caption Join our Old Delhi food walk! Taste the best street food. Book now.",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The food looks good and the colours are warm.",
      "The post lists the tour and tells no story about any dish.",
      "Reviews are strong but never shown."
    ],
    strategy: {
      audience: "International visitors planning a city stay, and locals hosting guests from abroad.",
      pillars: [
        "One dish, one story, who makes it and how.",
        "Our guide's favourites, one recurring face.",
        "Guest moments, reviews and reactions reshared with credit."
      ],
      rhythm: "Four short Reels and one carousel a week, numbered so people follow the series.",
      target: "Booking clicks from Instagram, aiming to make social a steady second source after review sites."
    },
    remakeSlides: [
      { headline: "Dish 12 of 50.", line: "The breakfast our guide eats every Sunday." },
      { headline: "Who makes it." },
      { headline: "How to order it like a local." },
      { headline: "What to drink with it." },
      { headline: "It's stop four on our morning walk." },
      { headline: "Follow for dish 13.", line: "Book the walk through the link in bio." }
    ],
    monthOne: [
      "List fifty dishes and the stories behind them.",
      "Film the first ten dishes in two shoots.",
      "Screenshot your best reviews and get permission to share them."
    ],
    linkedinUrl: ""
  },
  {
    slug: "sampleconvention",
    sample: true,
    brandName: "a convention bureau",
    clientType: "Tourism board",
    region: "Europe and Asia",
    platform: "LinkedIn",
    publishDate: "2026-08-16",
    coverLine: "What if a convention bureau posted like this?",
    storyTitle: "How a convention bureau could win meeting planners on LinkedIn",
    bigIdea: "Answer the meeting planner's checklist one post at a time, and borrow authority from organisers who already hosted events in the city, the way Lindblad borrows National Geographic's.",
    beforeCaption: "Host your next event in our world class city. Contact us for MICE solutions.",
    beforeAlt: "A typical convention bureau post. A grey photo block with the caption Host your next event in our world class city. Contact us for MICE solutions.",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The skyline photo is professional.",
      "World class and MICE solutions are words planners scroll past.",
      "Planners want proof on flights, venues and costs, and none of it appears."
    ],
    strategy: {
      audience: "Association and corporate meeting planners in Europe and Asia shortlisting host cities.",
      pillars: [
        "The planner's checklist, one logistics answer per post.",
        "Events we hosted, told by their organisers.",
        "Venue walk throughs in under a minute."
      ],
      rhythm: "Three LinkedIn posts a week from the bureau and its staff, with a downloadable planner guide.",
      target: "Planner guide downloads and proposal requests, aiming to grow both every quarter."
    },
    remakeSlides: [
      { headline: "Planning a 500 person congress? Here's the honest checklist." },
      { headline: "Getting here.", line: "Direct flights from your hub." },
      { headline: "Venues.", line: "Halls that seat your full plenary." },
      { headline: "Budget.", line: "What a delegate day usually includes." },
      { headline: "Support.", line: "What we do for you at no cost." },
      { headline: "Download the full planner guide.", line: "Link in the comments." }
    ],
    monthOne: [
      "Write the planner guide as a short PDF.",
      "Interview two past organisers on camera.",
      "Move the bureau team's own profiles into the posting plan."
    ],
    linkedinUrl: ""
  },
  {
    slug: "sampletravelagency",
    sample: true,
    brandName: "a travel agency",
    clientType: "Other travel brand",
    region: "India",
    platform: "Instagram",
    publishDate: "2026-08-09",
    coverLine: "What if a travel agency posted like this?",
    storyTitle: "How a travel agency could get booked from its own feed",
    bigIdea: "Make the advisor the product and sell the outcome, the way Flash Pack sells friendship rather than destinations, with a comment keyword that sends a sample itinerary.",
    beforeCaption: "Dream holidays at unbeatable prices! Maldives, Bali, Europe packages. DM now.",
    beforeAlt: "A typical travel agency post. A grey photo block with the caption Dream holidays at unbeatable prices! Maldives, Bali, Europe packages. DM now.",
    beforeImage: "",
    beforeCredit: "",
    observations: [
      "The destinations are popular and the photos are bright.",
      "Unbeatable prices invites price shopping, which a small agency loses.",
      "The agency's own people and know how never appear."
    ],
    strategy: {
      audience: "Busy professionals and families in Indian cities who value a well planned trip over the lowest price.",
      pillars: [
        "Trips we planned, real itineraries with the thinking behind them.",
        "Advisor tips, the mistakes we save clients from.",
        "Client stories, photos and messages from their trips."
      ],
      rhythm: "Three posts a week, with a comment keyword that sends a sample itinerary.",
      target: "Discovery call bookings from Instagram, aiming to double them in 90 days."
    },
    remakeSlides: [
      { headline: "We planned 10 days in Japan for a family of four. Here's every decision." },
      { headline: "Why we skipped the obvious hotel." },
      { headline: "The one day we kept empty on purpose." },
      { headline: "What it cost, and where we saved." },
      { headline: "What they said when they got back." },
      { headline: "Comment PLAN for a sample itinerary." }
    ],
    monthOne: [
      "Pick three past trips you can tell in full.",
      "Ask those clients for photos and a short message.",
      "Set up the PLAN keyword with an automatic reply."
    ],
    linkedinUrl: ""
  }
];
