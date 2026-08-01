/* scroll-end.js
 * Hides the page scrollbar (see extra.css) and adds a mobile-style "you have
 * reached the end" indicator: a small semi-circular bump at the bottom of the
 * viewport that stretches as the reader approaches the very end of the page.
 * Only enabled on fine-pointer (non-touch) devices, so it never double-fires
 * alongside native mobile overscroll effects.
 */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    var el = document.createElement("div");
    el.className = "md-scroll-end";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);

    var THRESHOLD = 180;      // px from the bottom where the bump starts
    var MAX_HEIGHT = 26;      // px fully stretched at the exact end
    var ticking = false;

    function update() {
      var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      var dist = maxScroll - window.scrollY;
      var p = Math.max(0, Math.min(1, 1 - dist / THRESHOLD));
      if (p > 0) {
        el.style.height = Math.round(4 + (MAX_HEIGHT - 4) * p) + "px";
        el.style.opacity = String(0.35 + 0.65 * p);
      } else {
        el.style.height = "0px";
        el.style.opacity = "0";
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
})();
