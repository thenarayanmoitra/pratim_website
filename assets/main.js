/* pratimnarayan.com — interactions. No dependencies. */
(function () {
  "use strict";

  /* ============================================================
     EDIT THESE TWO LINES ONLY. Everything else runs on its own.
     bookingUrl     your Cal.com or Calendly scheduling link
     whatsappNumber your number in full international form,
                    digits only, no plus sign, no spaces
     ============================================================ */
  var CONFIG = {
    bookingUrl: "https://cal.com/pratimnarayan/discovery-call",
    whatsappNumber: "916294278034",
    whatsappMessage: "Hi Pratim, I saw your site and would like to talk about my tourism marketing."
  };
  function isSet(v){ return typeof v === "string" && v.indexOf("REPLACE-ME") === -1 && v.trim() !== ""; }

  /* current year */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* nav border on scroll + back to top */
  var nav = document.querySelector(".nav");
  var totop = document.getElementById("totop");
  function onScroll() {
    var y = window.scrollY || 0;
    if (nav) nav.classList.toggle("scrolled", y > 20);
    if (totop) totop.classList.toggle("show", y > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (totop) {
    totop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* mobile nav */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.innerHTML = open ? "&#10005;" : "&#9776;";
      document.body.classList.toggle("nav-open", open);
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = "&#9776;";
        document.body.classList.remove("nav-open");
      }
    });
  }

  /* scroll reveals */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* journey line draw */
  var journey = document.querySelector(".journey");
  if (journey && "IntersectionObserver" in window) {
    var jo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            journey.classList.add("drawn");
            jo.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    jo.observe(journey);
  } else if (journey) {
    journey.classList.add("drawn");
  }

  /* ajax form submits (Formspree) */
  function wireForm(form, okMsg) {
    if (!form) return;
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      if (status) status.textContent = "Sending…";
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            if (status) status.textContent = okMsg;
          } else {
            if (status) status.textContent = "Something went wrong. Email me directly at pratimxnarayan@gmail.com";
          }
        })
        .catch(function () {
          if (status) status.textContent = "Something went wrong. Email me directly at pratimxnarayan@gmail.com";
        })
        .finally(function () {
          if (btn) btn.disabled = false;
        });
    });
  }

  wireForm(
    document.getElementById("contactForm"),
    "Got it, your message reached me. I will email you within 24 hours, either with a question or a next step. Please keep an eye on your inbox and your spam folder."
  );
  wireForm(
    document.getElementById("auditForm"),
    "Received. I read every request myself, so within a few days you will get your written audit by email. Please check your spam folder too, in case it lands there."
  );
  wireForm(
    document.getElementById("checklistForm"),
    "On its way. Watch your inbox over the next day for the 90 day checklist, and please look in your spam folder if you do not see it."
  );

  /* ============================================================
     Booking embed. Loads your calendar into the Book a call
     section once bookingUrl is set. Until then it shows a note.
     ============================================================ */
  (function booking(){
    var frame = document.getElementById("bookingFrame");
    var note = document.getElementById("bookingNote");
    if (!frame) return;
    if (isSet(CONFIG.bookingUrl)) {
      frame.src = CONFIG.bookingUrl;
      frame.style.display = "block";
      if (note) note.style.display = "none";
    } else {
      frame.style.display = "none";
      if (note) note.style.display = "block";
    }
    /* wire any Book a call buttons to the same link */
    var links = document.querySelectorAll("[data-book]");
    links.forEach(function(a){
      if (isSet(CONFIG.bookingUrl)) {
        a.setAttribute("href", CONFIG.bookingUrl);
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      } else {
        a.setAttribute("href", "#book");
      }
    });
  })();

  /* ============================================================
     Floating WhatsApp button. A labelled pill so it is obvious
     what it does. Appears only once a number is set.
     ============================================================ */
  (function whatsapp(){
    if (!isSet(CONFIG.whatsappNumber)) return;
    var href = "https://wa.me/" + CONFIG.whatsappNumber +
               "?text=" + encodeURIComponent(CONFIG.whatsappMessage || "");
    var a = document.createElement("a");
    a.className = "wa-fab";
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Chat with Pratim on WhatsApp");
    a.innerHTML =
      '<span class="wa-fab__icon" aria-hidden="true">' +
      '<svg viewBox="0 0 32 32" width="24" height="24">' +
      '<path fill="currentColor" d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.9 3.6 1.4 5.7 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.9 1 1-4.8-.2-.4c-1-1.6-1.5-3.4-1.5-5.3C5 9.5 9.9 4.6 16 4.6S27 9.5 27 15.6 22.1 24.8 16 24.8zm6.1-7.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2s-.9 1.1-1.1 1.3c-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.4-.6.1-.2 0-.5 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.6h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.2-.6-.4z"/>' +
      '</svg></span>' +
      '<span class="wa-fab__text">Chat on WhatsApp</span>';
    document.body.appendChild(a);
    /* one gentle nudge so the eye finds it, then it settles */
    setTimeout(function(){ a.classList.add("wa-fab--nudge"); }, 2600);
    setTimeout(function(){ a.classList.remove("wa-fab--nudge"); }, 5200);
  })();

  /* ============================================================
     Scroll progress bar. A thin terracotta line that tracks how
     far down the page you are. Quiet, but it makes the page feel
     alive and responsive.
     ============================================================ */
  (function progress(){
    var bar = document.createElement("div");
    bar.className = "scrollbar";
    document.body.appendChild(bar);
    var ticking = false;
    function update(){
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) : 0;
      bar.style.transform = "scaleX(" + pct + ")";
      ticking = false;
    }
    window.addEventListener("scroll", function(){
      if (!ticking){ window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ============================================================
     Active section in the nav. The current section's link lights
     up as you scroll, so people always know where they are.
     ============================================================ */
  (function activeNav(){
    var linkEls = Array.prototype.slice.call(
      document.querySelectorAll('.nav__links a[href^="#"]')
    );
    if (!linkEls.length || !("IntersectionObserver" in window)) return;
    var map = {};
    linkEls.forEach(function(a){
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) map[id] = a;
    });
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          linkEls.forEach(function(a){ a.classList.remove("active"); });
          var a = map[en.target.id];
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    Object.keys(map).forEach(function(id){
      obs.observe(document.getElementById(id));
    });
  })();
  (function exitIntent(){
    var modal = document.getElementById("exitModal");
    if (!modal) return;
    var KEY = "pnm_exit_seen";
    var shown = false;

    function seenRecently(){
      try {
        var t = window.localStorage.getItem(KEY);
        if (!t) return false;
        return (Date.now() - parseInt(t, 10)) < 30 * 24 * 60 * 60 * 1000;
      } catch (e) { return false; }
    }
    function mark(){
      try { window.localStorage.setItem(KEY, String(Date.now())); } catch (e) {}
    }
    function open(){
      if (shown || seenRecently()) return;
      shown = true;
      mark();
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      var f = modal.querySelector("input[type=email]");
      if (f) setTimeout(function(){ f.focus(); }, 120);
    }
    function close(){
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }

    /* desktop, cursor leaves toward the top */
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget && e.clientY <= 4) open();
    });
    /* touch fallback, one calm nudge after real engagement */
    var fired = false;
    window.addEventListener("scroll", function () {
      if (fired) return;
      var h = document.documentElement;
      var depth = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      if (depth > 0.55) { fired = true; setTimeout(open, 800); }
    }, { passive: true });

    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.hasAttribute("data-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();
})();
