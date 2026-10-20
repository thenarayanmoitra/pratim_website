/* JSON LD builders. Every entity uses the same name, photo and one line
   description as the visible text, and the Person has one stable id. */
"use strict";
const site = require("../../assets/data/site.js");

const PERSON_ID = site.url + "/about/#person";
const WEBSITE_ID = site.url + "/#website";
const BUSINESS_ID = site.url + "/#business";

const profiles = () => site.socialProfiles.filter((p) => p.url).map((p) => p.url);

function personStub() {
  return { "@type": "Person", "@id": PERSON_ID, name: site.name, url: site.url + "/about/", image: site.url + site.photo };
}

function personFull() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.name,
    alternateName: site.shortNames,
    jobTitle: site.jobTitle,
    description: site.summary,
    image: site.url + site.photo,
    email: "mailto:" + site.email,
    url: site.url + "/about/",
    homeLocation: { "@type": "Country", name: "India" },
    alumniOf: [{ "@type": "CollegeOrUniversity", name: "Amity University" }],
    affiliation: [{ "@type": "Organization", name: "World Food Travel Association" }],
    knowsAbout: ["Tourism marketing", "Social media marketing", "Destination marketing", "Email marketing", "Instagram carousels", "Short form video"],
    worksFor: { "@type": "Organization", name: "World Food Travel Association" },
    hasOccupation: { "@type": "Occupation", name: "Social media marketer", occupationLocation: { "@type": "Country", name: "India" } },
    sameAs: profiles()
  };
}

function website() {
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: site.url + "/", name: site.name, alternateName: "pratimnarayan.com", description: site.oneLine, inLanguage: site.lang, publisher: { "@id": PERSON_ID } };
}

function business() {
  return {
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: site.name + ", social media for tourism brands",
    url: site.url + "/",
    image: site.url + site.photo,
    description: site.oneLine,
    email: site.email,
    founder: { "@id": PERSON_ID },
    areaServed: "Worldwide",
    sameAs: profiles(),
    knowsAbout: ["Tourism marketing", "Social media marketing", "Destination marketing", "Email marketing", "Short form video"],
    makesOffer: [
      { "@type": "Offer", name: "Free week. 5 finished posts with captions in 7 days", url: site.url + "/freeweek/" },
      { "@type": "Offer", name: "Free written audit of website, social, email and search in 3 working days", url: site.url + "/audit/" },
      { "@type": "Offer", name: site.productName + ", monthly social media management for tourism brands", url: site.url + "/services/social/" }
    ]
  };
}

function faqPage(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
  };
}

function breadcrumbs(list) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: list.map((b, i) => ({ "@type": "ListItem", position: i + 1, name: b.name, item: site.url + b.url }))
  };
}

function profilePage(dateModified) {
  return { "@type": "ProfilePage", "@id": site.url + "/about/#page", dateModified, mainEntity: personFull() };
}

function article({ url, headline, description, image, datePublished, dateModified, about, keywords, articleSection }) {
  const node = {
    "@type": "Article",
    "@id": site.url + url + "#article",
    headline,
    description,
    image: site.url + image,
    url: site.url + url,
    datePublished,
    dateModified,
    inLanguage: site.lang,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    mainEntityOfPage: site.url + url,
    isPartOf: { "@id": WEBSITE_ID }
  };
  if (about) node.about = about;
  if (keywords) node.keywords = keywords;
  if (articleSection) node.articleSection = articleSection;
  return node;
}

/* a remake image with its photo credit, so the licence is visible to machines too */
function imageObject({ url, name, caption, creditText, creator, width, height }) {
  return {
    "@type": "ImageObject",
    "@id": site.url + url,
    contentUrl: site.url + url,
    url: site.url + url,
    name,
    caption,
    creditText,
    creator: { "@type": "Person", name: creator },
    copyrightNotice: creditText,
    width, height,
    author: { "@id": PERSON_ID }
  };
}

/* the homepage, as a page the assistants can quote from */
function webPage({ url, name, description, dateModified, speakable }) {
  const node = { "@type": "WebPage", "@id": site.url + url + "#webpage", url: site.url + url, name, description, dateModified, inLanguage: site.lang, isPartOf: { "@id": WEBSITE_ID }, about: { "@id": PERSON_ID }, primaryImageOfPage: { "@type": "ImageObject", url: site.url + site.ogImage } };
  if (speakable) node.speakable = { "@type": "SpeakableSpecification", cssSelector: speakable };
  return node;
}

function videoObject() {
  const f = site.film;
  if (!f || !f.src) return null;
  return {
    "@type": "VideoObject",
    "@id": site.url + "/#film",
    name: f.title,
    description: f.description,
    thumbnailUrl: site.url + f.poster,
    contentUrl: site.url + f.src,
    uploadDate: f.uploadDate,
    duration: f.duration,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID }
  };
}

function itemList(name, items) {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: site.url + it.url }))
  };
}

function graph(nodes) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

module.exports = { PERSON_ID, personStub, personFull, website, business, faqPage, breadcrumbs, profilePage, article, imageObject, webPage, videoObject, itemList, graph };
