/* toasts.js
 * ---------------------------------------------------------------------------
 * Themed, non-generic toast animations that celebrate interactions with the
 * site (feature toggles, theme changes, back navigation, diagram tabs, drags).
 *
 * Five hand-drawn SVG characters — the Barista, the Monkey, the Hard-hat,
 * the Sprout and the Bookworm — are picked at random for every toast, pop in
 * for 2–5 seconds, then leave. The whole feature can be switched off from the
 * coffee button in the header cluster (persisted in localStorage).
 *
 * This file also renders the small hover "state" tooltips on the header
 * toggles (e.g. "Navigation: hidden"), so students can see what is selected.
 * ------------------------------------------------------------------------- */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var body = document.body;
    var ENABLED_KEY = "md-toasts";

    /* ---- enable / disable state ---------------------------------------- */
    function toastsEnabled() {
      try { return localStorage.getItem(ENABLED_KEY) !== "0"; } catch (e) { return true; }
    }
    function setToastsEnabled(on) {
      try { localStorage.setItem(ENABLED_KEY, on ? "1" : "0"); } catch (e) {}
      body.classList.toggle("md-toasts-off", !on);
    }

    var toastBtn = document.querySelector('[data-md-component="toasts"]');
    function syncToastToggle() {
      if (toastBtn) body.classList.toggle("md-toasts-off", !toastsEnabled());
    }
    if (toastBtn) {
      toastBtn.addEventListener("click", function () {
        var on = !toastsEnabled();
        setToastsEnabled(on);
        if (on) showToast(randomOf(MESSAGES["toasts-on"]), null, "brew");
      });
    }
    syncToastToggle();

    /* ---- toast container ------------------------------------------------ */
    var container = document.createElement("div");
    container.className = "md-toasts";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);

    /* ---- the five characters (inline SVG, theme variables) -------------- */
    var CHARACTERS = {
      barista: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g class="tch-pop">
            <path d="M16 26 h30 l-3 22 h-24 z" fill="var(--md-primary-fg-color)"/>
            <rect x="15" y="23" width="32" height="4" rx="1" fill="var(--md-primary-fg-color--dark)"/>
            <path d="M46 29 h4 a5 5 0 0 1 0 10 h-4 z" fill="var(--md-primary-fg-color--light)"/>
            <ellipse cx="31" cy="27" rx="15" ry="4.5" fill="var(--md-accent-fg-color)"/>
            <path d="M25 43 q6 4 12 0" stroke="var(--md-default-bg-color)" stroke-width="2" fill="none" stroke-linecap="round"/>
            <path class="tch-steam" d="M22 14 q3 -5 0 -9" stroke="var(--md-default-fg-color--lightest)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
            <path class="tch-steam tch-steam--2" d="M40 16 q3 -5 0 -9" stroke="var(--md-default-fg-color--lightest)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          </g>
        </svg>`,
      monkey: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g class="tch-pop">
            <circle cx="17" cy="28" r="9" fill="var(--md-default-fg-color--lighter)"/>
            <circle cx="47" cy="28" r="9" fill="var(--md-default-fg-color--lighter)"/>
            <circle cx="32" cy="33" r="19" fill="#8a6d1f"/>
            <ellipse cx="32" cy="40" rx="9" ry="7" fill="var(--md-diagram-bg)"/>
            <circle class="tch-blink" cx="25" cy="30" r="2.6" fill="var(--md-default-fg-color)"/>
            <circle class="tch-blink" cx="39" cy="30" r="2.6" fill="var(--md-default-fg-color)"/>
            <path d="M27 46 q5 4 10 0" stroke="var(--md-default-fg-color)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          </g>
        </svg>`,
      dude: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g class="tch-pop">
            <path d="M13 34 h38 v4 h-38 z" fill="var(--md-primary-fg-color--dark)"/>
            <path class="tch-tip" d="M18 34 h28 a14 9 0 0 0 -28 0 z" fill="var(--md-primary-fg-color)"/>
            <circle cx="32" cy="42" r="11.5" fill="var(--md-diagram-bg)"/>
            <circle cx="27.5" cy="41" r="1.7" fill="var(--md-default-fg-color)"/>
            <circle cx="36.5" cy="41" r="1.7" fill="var(--md-default-fg-color)"/>
            <path d="M28 47 q4 3 8 0" stroke="var(--md-default-fg-color)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
          </g>
        </svg>`,
      sprout: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g class="tch-pop">
            <path d="M21 50 h22 l-2 -26 h-18 z" fill="var(--md-primary-fg-color)"/>
            <rect x="19" y="48" width="26" height="4" rx="1" fill="var(--md-accent-fg-color)"/>
            <g class="tch-grow">
              <path d="M32 46 v-18" stroke="var(--md-primary-fg-color--light)" stroke-width="2.6" fill="none" stroke-linecap="round"/>
              <path d="M32 30 q-10 -4 -8 -15 q10 -1 8 15" fill="var(--md-primary-fg-color--light)"/>
              <path d="M32 35 q10 -4 8 -15 q-10 -1 -8 15" fill="#4a8a70"/>
            </g>
          </g>
        </svg>`,
      bookworm: `
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <g class="tch-pop">
            <g class="tch-open">
              <path d="M32 24 q-9 -7 -19 -5 v22 q10 -2 19 4 z" fill="var(--md-diagram-bg)" stroke="var(--md-primary-fg-color)" stroke-width="1.6"/>
              <path d="M32 24 q9 -7 19 -5 v22 q-10 -2 -19 4 z" fill="var(--md-diagram-bg)" stroke="var(--md-primary-fg-color)" stroke-width="1.6"/>
              <path d="M32 24 v21" stroke="var(--md-accent-fg-color)" stroke-width="1.6"/>
            </g>
            <circle class="tch-blink" cx="26" cy="22" r="2.2" fill="var(--md-default-fg-color)"/>
            <circle class="tch-blink" cx="38" cy="22" r="2.2" fill="var(--md-default-fg-color)"/>
          </g>
        </svg>`
    };
    var CHARACTER_KEYS = ["barista", "monkey", "dude", "sprout", "bookworm"];

    /* ---- message pools per action --------------------------------------- */
    var MESSAGES = {
      nav: ["Navigation filed away", "Sidebar stowed — back to the reading desk", "Chapters tucked in"],
      toc: ["Contents tucked in", "The map is folded away", "Table of contents stowed"],
      theme: ["Freshly brewed reading surface", "Roasted a new palette for you", "New blend, same beans"],
      back: ["Stepping back in time", "Rewinding the reel"],
      fullguide: ["The full menu, coming up", "Opening the whole guide"],
      view: ["Fresh angle on the architecture", "Rotating the blueprint", "New view, same pipes"],
      drag: ["Smooth moves, engineer", "Pulling levers like a pro", "Drag it like you mean it"],
      "toasts-on": ["Fresh brew — toasts on!"]
    };
    var EYEBROWS = {
      nav: "navigation", toc: "contents", theme: "theme", back: "history",
      fullguide: "guide", view: "diagram", drag: "motion", "toasts-on": "brew"
    };

    function randomOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function showToast(message, character, group) {
      if (!toastsEnabled()) return;
      var key = character || randomOf(CHARACTER_KEYS);
      var duration = 2000 + Math.floor(Math.random() * 3000); // 2–5 s
      var card = document.createElement("div");
      card.className = "md-toast md-toast--in";
      card.innerHTML =
        '<div class="md-toast__art">' + CHARACTERS[key] + "</div>" +
        '<div class="md-toast__body">' +
          '<div class="md-toast__eyebrow">' + (EYEBROWS[group] || "notice") + "</div>" +
          '<div class="md-toast__msg">' + message + "</div>" +
        "</div>" +
        '<button class="md-toast__close" type="button" aria-label="Dismiss">&times;</button>';
      container.appendChild(card);
      while (container.children.length > 3) container.firstChild.remove();

      var timer = null;
      card.querySelector(".md-toast__close").addEventListener("click", function () { dismiss(); });
      timer = setTimeout(dismiss, duration);
      function dismiss() {
        clearTimeout(timer);
        if (!card.isConnected) return;
        card.classList.remove("md-toast--in");
        card.classList.add("md-toast--out");
        setTimeout(function () { if (card.isConnected) card.remove(); }, 320);
      }
    }

    /* ---- triggers ------------------------------------------------------- */
    document.addEventListener("click", function (ev) {
      var t = ev.target.closest ? ev.target.closest('[data-md-toggle="nav"]') : null;
      if (t) return showToast(randomOf(MESSAGES.nav), null, "nav");
      t = ev.target.closest ? ev.target.closest('[data-md-toggle="toc"]') : null;
      if (t) return showToast(randomOf(MESSAGES.toc), null, "toc");
      t = ev.target.closest ? ev.target.closest('[data-md-component="back"]') : null;
      if (t) return showToast(randomOf(MESSAGES.back), null, "back");
      t = ev.target.closest ? ev.target.closest('.md-header__controls a') : null;
      if (t) return showToast(randomOf(MESSAGES.fullguide), null, "fullguide");
      t = ev.target.closest ? ev.target.closest(".tabbed-set label") : null;
      if (t) return showToast(randomOf(MESSAGES.view), null, "view");
    });

    // theme (palette) change — but not the one Material fires on page load
    var readyAt = Date.now() + 700;
    document.querySelectorAll('input[name="__palette"]').forEach(function (input) {
      input.addEventListener("change", function () {
        if (input.checked && Date.now() > readyAt) showToast(randomOf(MESSAGES.theme), null, "theme");
      });
    });

    // drag gesture, throttled so it never spams
    var dragStart = null;
    var lastDragToast = 0;
    document.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0) return;
      dragStart = { x: ev.clientX, y: ev.clientY };
    });
    document.addEventListener("pointerup", function (ev) {
      if (!dragStart) return;
      var dist = Math.hypot(ev.clientX - dragStart.x, ev.clientY - dragStart.y);
      dragStart = null;
      var now = Date.now();
      if (dist > 60 && now - lastDragToast > 8000) {
        lastDragToast = now;
        showToast(randomOf(MESSAGES.drag), null, "drag");
      }
    });

    /* ---- hover state tooltips on the header toggles ---------------------- */
    var tip = document.createElement("div");
    tip.className = "md-hover-tip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);

    function showTip(text, anchor) {
      tip.textContent = text;
      tip.classList.add("md-hover-tip--show");
      var r = anchor.getBoundingClientRect();
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var x = Math.min(Math.max(r.left + r.width / 2 - tw / 2, 8), window.innerWidth - tw - 8);
      var y = r.bottom + 9;
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    }
    function hideTip() { tip.classList.remove("md-hover-tip--show"); }
    function bindStateTip(anchor, getText) {
      if (!anchor) return;
      anchor.addEventListener("mouseenter", function () { showTip(getText(), anchor); });
      anchor.addEventListener("mouseleave", hideTip);
      anchor.addEventListener("focus", function () { showTip(getText(), anchor); });
      anchor.addEventListener("blur", hideTip);
    }

    var SCHEME_NAMES = ["Ivory", "Paper", "Slate", "Grey"];
    bindStateTip(document.querySelector('[data-md-toggle="nav"]'), function () {
      return "Navigation: " + (body.classList.contains("md-hide-nav") ? "hidden" : "shown");
    });
    bindStateTip(document.querySelector('[data-md-toggle="toc"]'), function () {
      return "Table of contents: " + (body.classList.contains("md-hide-toc") ? "hidden" : "shown");
    });
    bindStateTip(document.querySelector('[data-md-component="toasts"]'), function () {
      return "Toasts: " + (toastsEnabled() ? "on" : "off");
    });
    var paletteForm = document.querySelector('.md-header__controls [data-md-component="palette"]');
    var paletteLabel = paletteForm ? paletteForm.querySelector("label") : null;
    bindStateTip(paletteLabel, function () {
      var checked = document.querySelector('input[name="__palette"]:checked');
      var idx = checked ? parseInt(String(checked.id).split("_")[2] || "0", 10) : 0;
      return "Theme: " + (SCHEME_NAMES[idx] || "Ivory");
    });

    window.addEventListener("resize", hideTip);
    window.addEventListener("scroll", hideTip, { passive: true });
  });
})();
