/* pratimnarayan.com, interactions. No dependencies. */
(function () {
  "use strict";

  /* ============================================================
     SETTINGS. The only lines you should ever need to change.
     ============================================================ */
  var CONFIG = {
    calLink: "pratimnarayan/discovery-call",       // cal.com/<this>
    calOrigin: "https://cal.com",
    formspree: "https://formspree.io/f/mwvzowbe",   // records every email request
    sendFileEndpoint: "/api/send-file",             // emails the CV or checklist
    email: "pratimxnarayan@gmail.com"
  };

  var root = document.documentElement;
  root.classList.remove("no-js");
  var hasIO = "IntersectionObserver" in window;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function track(name, params) {
    try { if (typeof window.gtag === "function") window.gtag("event", name, params || {}); } catch (e) {}
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- nav hairline once the page moves ---------- */
  var nav = document.getElementById("nav");
  if (nav && hasIO) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:0;left:0;width:1px;height:12px;pointer-events:none";
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  } else if (nav) {
    nav.classList.add("scrolled");
  }

  /* ---------- scroll reveals, one shot ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (hasIO && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- the three step line draws in ---------- */
  var steps = document.querySelector(".steps");
  if (steps && hasIO && !reduceMotion) {
    var so = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { steps.classList.add("drawn"); so.disconnect(); }
    }, { threshold: 0.3 });
    so.observe(steps);
  } else if (steps) {
    steps.classList.add("drawn");
  }

  /* ---------- skills counters count up once ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && hasIO && !reduceMotion) {
    counters.forEach(function (el) { el.textContent = "0"; });
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target, target = parseInt(el.getAttribute("data-count"), 10), start = null;
        var step = function (t) {
          if (start === null) start = t;
          var k = Math.min((t - start) / 1200, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- a soft light follows the pointer across cards ---------- */
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    document.addEventListener("pointermove", function (e) {
      var card = e.target.closest && e.target.closest(".kit__card, .local__plate");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---------- mobile booking dock ----------
     Shows once the hero button has scrolled away, hides again when
     the final ask is on screen so the same button never shows twice. */
  var dock = document.getElementById("dock");
  var hero = document.getElementById("top");
  var finalAsk = document.getElementById("book");
  if (dock && hero && finalAsk && hasIO) {
    var pastHero = false, atFinal = false;
    var setDock = function () {
      var show = pastHero && !atFinal;
      dock.classList.toggle("show", show);
      document.body.classList.toggle("dock-on", show);
      dock.setAttribute("aria-hidden", show ? "false" : "true");
      var a = dock.querySelector("a");
      if (a) a.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (e) { pastHero = !e[0].isIntersecting; setDock(); }).observe(hero);
    new IntersectionObserver(function (e) { atFinal = e[0].isIntersecting; setDock(); }, { threshold: 0.15 }).observe(finalAsk);
  }

  /* ============================================================
     BOOKING
     Every "Book a free call" button is a plain link to cal.com, so it
     works with no JavaScript at all. Once the Cal embed has loaded,
     clicks open the calendar in a popup instead and the visitor never
     leaves the page. Until then, the link opens in a new tab.
     ============================================================ */
  var NS = "discovery-call";
  var calReady = false;
  var calRequested = false;

  function loadCal() {
    if (calRequested) return;
    calRequested = true;
    (function (C, A, L) {
      var p = function (a, ar) { a.q.push(ar); };
      var d = C.document;
      C.Cal = C.Cal || function () {
        var cal = C.Cal, ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          var s = d.createElement("script");
          s.src = A; s.async = true;
          s.onload = function () { calReady = true; };
          d.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          var api = function () { p(api, arguments); };
          var namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else { p(cal, ar); }
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", NS, { origin: CONFIG.calOrigin });
    window.Cal.ns[NS]("ui", {
      cssVarsPerTheme: { light: { "cal-brand": "#16241C" }, dark: { "cal-brand": "#E8B25C" } },
      hideEventTypeDetails: false,
      layout: "month_view"
    });
  }

  /* Warm the embed up on the first sign of intent, or after the page
     has settled, so the hero never waits on a third party script. */
  ["pointerover", "touchstart", "focusin"].forEach(function (type) {
    document.addEventListener(type, function onIntent(e) {
      if (e.target.closest && e.target.closest("[data-book]")) {
        loadCal();
        document.removeEventListener(type, onIntent, true);
      }
    }, { capture: true, passive: true });
  });
  window.addEventListener("load", function () {
    var later = window.requestIdleCallback || function (fn) { return setTimeout(fn, 2500); };
    later(loadCal, { timeout: 4000 });
  });

  var selectedEngagement = "";

  function bookingNotes() {
    var phrases = { "Full time": "full time work", "Part time": "part time work", "A project": "a project" };
    return selectedEngagement ? "Interested in " + (phrases[selectedEngagement] || selectedEngagement.toLowerCase()) : "";
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-book]");
    if (!a) return;
    var placement = a.getAttribute("data-book");
    track("book_call_click", { placement: placement, engagement: selectedEngagement || "none" });

    /* modifier clicks keep normal link behaviour */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    if (!calReady || !window.Cal || !window.Cal.ns || !window.Cal.ns[NS]) return;

    e.preventDefault();
    var config = { layout: "month_view" };
    var notes = placement === "hire" ? bookingNotes() : "";
    if (notes) config.notes = notes;
    window.Cal.ns[NS]("modal", { calLink: CONFIG.calLink, config: config });
  });

  /* ---------- hire options feed the booking ---------- */
  var hireBook = document.getElementById("hireBook");
  var hireNote = document.getElementById("hireNote");
  document.querySelectorAll('input[name="engagement"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (!radio.checked) return;
      selectedEngagement = radio.value;
      track("engagement_select", { engagement: selectedEngagement });
      if (hireBook) {
        hireBook.href = "https://cal.com/" + CONFIG.calLink + "?notes=" + encodeURIComponent(bookingNotes());
      }
      if (hireNote) {
        hireNote.textContent = selectedEngagement + " it is. That goes into your booking, so we start in the right place.";
      }
    });
  });

  /* ============================================================
     EMAIL CAPTURE, for the CV and the checklist
     Two requests go out together. Formspree records the lead in your
     inbox no matter what. The Netlify function emails the file to the
     visitor. If the function is not set up yet, the visitor is told
     you will send it personally, and the Formspree email reminds you.
     ============================================================ */
  var COPY = {
    cv: {
      sent: "Sent. My CV is on its way to your inbox. If you don't see it in a couple of minutes, check your spam or promotions folder.",
      manual: "Got it. I'll email you my CV personally within one working day.",
      subject: "CV request from pratimnarayan.com"
    },
    guide: {
      sent: "Sent. The checklist is on its way to your inbox. If you don't see it in a couple of minutes, check your spam or promotions folder.",
      manual: "Got it. I'll email you the checklist personally within one working day.",
      subject: "Checklist request from pratimnarayan.com"
    }
  };
  var EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

  document.querySelectorAll("form.capture").forEach(function (form) {
    var kind = form.getAttribute("data-kind");
    var copy = COPY[kind];
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector(".capture__status");
    var btn = form.querySelector('button[type="submit"]');
    var honeypot = form.querySelector(".hp");
    if (!copy || !input) return;

    input.addEventListener("input", function () {
      input.removeAttribute("aria-invalid");
      if (status && !form.classList.contains("is-done")) status.textContent = "";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = input.value.trim();

      if (!EMAIL_RE.test(email)) {
        input.setAttribute("aria-invalid", "true");
        status.textContent = "That email doesn't look quite right. Check it and try again.";
        input.focus();
        return;
      }
      if (honeypot && honeypot.value) {
        form.classList.add("is-done");
        status.textContent = copy.sent;
        return;
      }

      btn.disabled = true;
      status.textContent = "Sending…";

      var fd = new FormData();
      fd.append("email", email);
      fd.append("request", kind === "cv" ? "CV" : "Checklist");
      if (selectedEngagement) fd.append("engagement", selectedEngagement);
      fd.append("_subject", copy.subject);

      var recorded = fetch(CONFIG.formspree, {
        method: "POST", body: fd, headers: { Accept: "application/json" }
      }).then(function (r) { return r.ok; }).catch(function () { return false; });

      var delivered = fetch(CONFIG.sendFileEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: kind, email: email, engagement: selectedEngagement })
      }).then(function (r) { return r.ok; }).catch(function () { return false; });

      Promise.all([recorded, delivered]).then(function (res) {
        var wasRecorded = res[0], wasDelivered = res[1];
        if (wasDelivered || wasRecorded) {
          form.classList.add("is-done");
          status.textContent = wasDelivered ? copy.sent : copy.manual;
          track("generate_lead", { lead_type: kind, delivered: wasDelivered });
        } else {
          btn.disabled = false;
          status.innerHTML = "";
          status.appendChild(document.createTextNode("That didn't go through. Email me at "));
          var link = document.createElement("a");
          link.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent(copy.subject);
          link.textContent = CONFIG.email;
          status.appendChild(link);
          status.appendChild(document.createTextNode(" and I'll send it straight over."));
        }
      });
    });
  });
})();
