/* sidebar-toggle.js
 * Toggles the navigation sidebar (left) and table of contents (right) so
 * students can focus on the content. Toggles `md-hide-nav` / `md-hide-toc`
 * classes on <body> and persists the preference in localStorage.
 * The matching CSS lives in stylesheets/extra.css.
 */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var body = document.body;
    var navBtn = document.querySelector('[data-md-toggle="nav"]');
    var tocBtn = document.querySelector('[data-md-toggle="toc"]');

    function restore() {
      try {
        if (localStorage.getItem("md-hide-nav") === "1") body.classList.add("md-hide-nav");
        // Table of contents is hidden by default; only shown when the user
        // explicitly turns it on.
        if (localStorage.getItem("md-hide-toc") !== "0") body.classList.add("md-hide-toc");
      } catch (e) { /* localStorage unavailable — ignore */ }
    }

    if (navBtn) {
      navBtn.addEventListener("click", function () {
        var hidden = body.classList.toggle("md-hide-nav");
        try { localStorage.setItem("md-hide-nav", hidden ? "1" : "0"); } catch (e) {}
      });
    }
    if (tocBtn) {
      tocBtn.addEventListener("click", function () {
        var hidden = body.classList.toggle("md-hide-toc");
        try { localStorage.setItem("md-hide-toc", hidden ? "1" : "0"); } catch (e) {}
      });
    }

    // Back button: return to the previous page in one click (falls back home).
    var backBtn = document.querySelector('[data-md-component="back"]');
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          var home = document.querySelector('a.md-logo');
          window.location.href = home ? home.getAttribute("href") : "/";
        }
      });
    }

    restore();
  });
})();
