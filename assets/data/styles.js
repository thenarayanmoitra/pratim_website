/* ============================================================
   The eleven visual styles from the social media style library
   (Social Media Moodboard, October 2026), plus the photo poster
   lane that most tourism accounts post in today. Each What If
   episode names the style it tests and why. The remake slides
   are drawn in that style by src/svg/whatif.js.
   ============================================================ */
module.exports = {
  quietlux: {
    number: "01", name: "Quiet luxury",
    line: "Calm frames with few or no people, where space and light do the selling.",
    looks: "Empty corridors, still water, one object on a table, muted colour and wide margins.",
    bestFor: "Luxury resorts and heritage hotels, wellness retreats and private villas.",
    takes: "A photographer who understands light, a stylist for the frames with objects, and the restraint to post less.",
    watch: "Without a human story the feed goes cold. One face every ten posts keeps it warm.",
    dials: { polish: "High", colour: "Muted", pace: "Slow", density: "Empty", people: "Few" }
  },
  editorial: {
    number: "02", name: "Editorial glamour",
    line: "Art directed scenes with styled people, shot like a fashion or travel magazine.",
    looks: "Talent in costume or uniform, period interiors, film grain and rich warm tones. Every frame feels planned down to the props.",
    bestFor: "Heritage hotels and palaces, luxury trains and cruises, airlines with a cabin story and fashion led stays.",
    takes: "A stylist, models or trained staff, a location day and someone directing. The most expensive style in this library.",
    watch: "Generic styling dates fast. Keep one recurring character or uniform so the look stays yours.",
    dials: { polish: "Very high", colour: "Rich, warm", pace: "Slow", density: "Styled", people: "Styled talent" }
  },
  epic: {
    number: "03", name: "Epic scenery",
    line: "Big views at golden hour, from the air or the edge, with a person for scale at most.",
    looks: "Drone shots, wide frames, saturated colour and dramatic light. The place is the hero of every post.",
    bestFor: "Tourism boards, trekking operators, adventure brands and DMCs selling mountains or coastline.",
    takes: "A drone pilot, golden hour scheduling and a steady flow of credited guest photos, which can fill half the grid.",
    watch: "This is the most crowded lane in travel. Every destination looks alike at sunset, so pair it with a hook or a human story.",
    dials: { polish: "High", colour: "Saturated", pace: "Slow sweep", density: "Wide", people: "Small, for scale" }
  },
  moody: {
    number: "04", name: "Moody atmosphere",
    line: "Weather as a feature. Mist, rain, night skies and low light sell how the place feels.",
    looks: "Low saturation, deep shadows, fog, auroras and dusk. Quiet frames with a lot of sky and very little colour.",
    bestFor: "Himalayan and Northeast India destinations, monsoon campaigns, cabins and nature lodges, and slow travel brands.",
    takes: "Shooting in the weather everyone else waits out, and a grade that keeps the shadows deep.",
    watch: "Too much darkness in a row reads as sad. Break it with one bright frame a week.",
    dials: { polish: "High", colour: "Muted, dark", pace: "Slow", density: "Sparse", people: "Few" }
  },
  documentary: {
    number: "05", name: "Documentary and wildlife",
    line: "Real moments caught as they happen, from wildlife sightings to guides and locals at work.",
    looks: "Natural light, honest colour, close encounters and captions written like field notes from the person who took the shot.",
    bestFor: "Safari lodges, expedition cruises, cultural and community tourism, responsible travel brands and associations.",
    takes: "Real access and a patient photographer with time in the field. Captions carry the story, so a good writer matters as much as the camera.",
    watch: "Staged documentary reads fake straight away. If the access is not real, pick another style.",
    dials: { polish: "Medium", colour: "Natural", pace: "Still", density: "Medium", people: "Real people, animals" }
  },
  warm: {
    number: "06", name: "Warm lifestyle",
    line: "People enjoying the place in warm light, candid but polished.",
    looks: "Golden tones, food on the table, friends mid laugh and rooms that look lived in. Close, inviting frames.",
    bestFor: "Lifestyle and boutique hotels, resorts, restaurants and hotel food and drink, and group tour operators.",
    takes: "A lifestyle shoot with real guests or friends instead of models, plus some food styling. Mid budget.",
    watch: "Without a real story it slides into stock photography. Shoot actual moments, then edit hard.",
    dials: { polish: "Medium high", colour: "Warm", pace: "Medium", density: "Medium", people: "Guests enjoying" }
  },
  creator: {
    number: "07", name: "Creator led",
    line: "A face talking to camera, or a phone held up in the moment.",
    looks: "Selfie angles, POV clips, street interviews, burned in captions and unpolished light. It feels like a friend posted it.",
    bestFor: "Hostels, OTAs, youth and group tour operators, and destinations working with creators.",
    takes: "One consistent face on camera, either staff or a creator on retainer, and fast turnaround. Low cost per post, high frequency.",
    watch: "The account is only as good as its presenter, and brand control drops. Agree on guardrails before the first shoot.",
    dials: { polish: "Low", colour: "Natural", pace: "Fast", density: "Busy", people: "Face led" }
  },
  texthook: {
    number: "08", name: "Text hook overlay",
    line: "Real footage with one line of text on top that makes people stop scrolling.",
    looks: "A question, a promise or a number in big type over a photo or clip, with the answer in the next slide or the caption.",
    bestFor: "Tourism boards chasing reach, OTAs, tour operators with lists and tips, and any account that needs saves.",
    takes: "A writer who can land a hook in eight words, and a library of footage to put it on. Low cost and fast once the template exists.",
    watch: "Clickbait hooks with weak payoffs burn trust. The slide after the hook has to deliver.",
    dials: { polish: "Medium", colour: "Natural", pace: "Fast", density: "One line", people: "Optional" }
  },
  boldgraphic: {
    number: "09", name: "Bold graphic",
    line: "Designed posts where typography and brand colour lead.",
    looks: "Lists, guides, badges, rankings, announcements and infographics, all built on a fixed template so the grid stays consistent.",
    bestFor: "Associations and trade bodies, OTAs, publishers, award news, itineraries and B2B travel.",
    takes: "A designer builds the template system once, then anyone can produce posts in Canva or Figma. Low cost per post.",
    watch: "Text heavy posts earn saves but travel less on their own. Keep a photo or one big number as the hero of each frame.",
    dials: { polish: "Designed", colour: "Brand palette", pace: "Still", density: "Text heavy", people: "Optional" }
  },
  meme: {
    number: "10", name: "Meme and pop culture",
    line: "Humour and culture moments, posted while they are still fresh.",
    looks: "Meme formats, mascots and CGI characters, film and music references, celebrity tie ins and loud colour.",
    bestFor: "Indian state boards, budget airlines, hostels, youth brands and any client with a bold voice.",
    takes: "A writer with a clear voice and an approval path that turns posts around within 24 hours. Speed beats polish.",
    watch: "Risky for luxury, and jokes age quickly. Write a tone guide with clear no go topics before the first post.",
    dials: { polish: "Low", colour: "Loud", pace: "Fast", density: "Busy", people: "Characters, celebrities" }
  },
  signature: {
    number: "11", name: "Signature colour and retro",
    line: "One strict visual rule repeated until the feed is recognisable at a glance.",
    looks: "Symmetry and pastels, a single brand colour, film flash, archive photos, collage or surreal sets. The rule matters more than the subject.",
    bestFor: "Boutique and design hotels, cafes, heritage brands with archives and any client that needs to stand out in a crowded grid.",
    takes: "Choosing the rule, then the discipline to repeat it for years. Props and colour styling add cost to each shoot.",
    watch: "A rule that is too narrow wears thin. Pick one you can feed every single week.",
    dials: { polish: "High", colour: "Signature, pastel", pace: "Still", density: "Composed", people: "Varies" }
  },
  photoposter: {
    number: "12", name: "Photo poster",
    line: "A photo with the brand logo and a headline, the format most tourism accounts post every day.",
    looks: "Logo top, headline in the middle, a colour band or box, dates and a call to action. Done well it looks like a magazine cover. Done badly it looks like a notice board.",
    bestFor: "Event announcements, offers and anything with a date, when the photo is strong and the text is short.",
    takes: "One clean template, a photo editor who crops for the headline, and the discipline to leave most of the frame empty.",
    watch: "Three fonts, two logos and a sponsor strip turn a poster into noise. One headline, one logo, one action.",
    dials: { polish: "Medium", colour: "Brand palette", pace: "Still", density: "Varies", people: "Optional" }
  }
};
