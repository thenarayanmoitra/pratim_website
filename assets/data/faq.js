/* The questions. homepage holds the six on the homepage. home holds the older,
   longer list, which the text file for assistants still carries. */
const costAnswer = "It depends on how many posts and platforms you need. Plans are built around your budget, so tell me what you have in mind and I'll suggest a scope that fits. The free week and the audit cost nothing.";

module.exports = {
  /* the six questions on the homepage, word for word from the approved design */
  homepage: [
    { q: "Do you do the posting, or only advise?", a: "I do the work. I plan, design, write, publish and reply. You approve each week before it goes live." },
    { q: "Are you an agency?", a: "No. I'm one freelancer. You work with me directly, and I take a small number of tourism brands at a time." },
    { q: "Do you only do social media?", a: "Most brands start there. I also write and send email newsletters, create content, edit video and help with day to day marketing, and I can look after small website updates once we work together." },
    { q: "You're in India and we're in the US or Europe. Will that work?", a: "ATTA is in the US and PATA is in Bangkok, and I worked remotely with both. WFTA's network spans more than 150 countries. I plan around your working hours and reply within one working day." },
    { q: "What does it cost?", a: "It depends on how many posts and platforms you need. Tell me the budget you have in mind and I'll shape the scope to fit. The free week costs nothing." },
    { q: "What happens after the free week?", a: "You get the 5 posts, a short walkthrough video and a one page plan for the next 90 days. If you want me to keep going, we start the next month. If not, the posts are yours." }
  ],
  home: [
    { q: "What's in the free audit?", a: "Your website, social media, email and search, each scored out of 10 and explained in plain English. Then the three fixes worth doing first. It's written, so you can forward it to your board or owner without me in the room." },
    { q: "Is it really free? What's the catch?", a: "It's free. Some people read it and ask me to do the fixes. Plenty don't, and that's fine. You won't be added to a list or chased." },
    { q: "Is it only social media?", a: "No. Social builds attention, but email is where people actually book, register and join. I run both, and connect them with tracked links so you can see which posts lead to real enquiries." },
    { q: "How will I show my board it's working?", a: "With one page a month. For associations that means member signups, event registrations and newsletter growth. For DMCs and operators, enquiries and bookings traced from posts and emails. For hotels, direct booking clicks against the OTAs, plus revenue from email offers." },
    { q: "What does it cost to work together?", a: costAnswer },
    { q: "You're in India and we're in the US or Europe. Will that work?", a: "ATTA is in the US and PATA is in Bangkok, and I worked remotely with both. WFTA's network spans more than 150 countries. I plan around your working hours and reply within one working day." },
    { q: "Is it really just you?", a: "Yes. I write your audit, plan the calendar, make the posts and walk you through the numbers myself, every month." },
    { q: "Is it safe to hire a marketer based in India?", a: "PATA, ATTA and the World Food Travel Association have trusted me with their work. Every project starts with a free week or a free audit, so you see the work before you pay, and paid work runs on a signed agreement." },
    { q: "How do time zones work with my team?", a: "I work from India. For US clients, posts and replies are ready before your morning. For European clients, our afternoons overlap, and that's when we talk." },
    { q: "What happens after my free week?", a: "You get the 5 posts, a short walkthrough video and a one page plan for the next 90 days. If you want me to keep going, we start the next month. If not, the posts are yours." },
    { q: "Will I approve every post before it goes live?", a: "Yes. You see each week's posts before they're scheduled, and nothing goes live without your approval." },
    { q: "Can I pause in my low season?", a: "Yes. Tell me 15 days ahead and we pause until your season starts again." }
  ],
  freeweek: [
    { q: "Do I keep the posts?", a: "Yes. The 5 posts and their captions are yours whether or not we work together, in files you can upload to your own accounts." },
    { q: "What happens after the free week?", a: "You get the posts, a short walkthrough video and a one page plan for the next 90 days. If you want me to keep going, we start the next month. If not, the posts are yours and we part as friends." },
    { q: "Who does the work?", a: "I do. I plan and design every post myself, write the captions and record the walkthrough. Nothing is handed to someone else or to a tool you haven't met." }
  ]
};
