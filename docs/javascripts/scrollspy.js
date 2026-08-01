/* scrollspy.js
 * Highlights the section currently being read in both the table of contents
 * (right sidebar) and the left navigation's guide links. Adds the class
 * `md-nav__link--current` to the matching anchors; the styling lives in
 * stylesheets/extra.css so it follows the active reading scheme.
 *
 * Notes:
 *  - Material's `toc.follow` lazily renders the TOC, so the anchor links are
 *    re-queried on every update and a MutationObserver re-applies the
 *    highlight whenever Material swaps the TOC nodes.
 *  - Sub-sections highlight their parent lecture in the left navigation.
 */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var ACTIVE_OFFSET = 110; // px from the top of the viewport
    var current = null;
    var ticking = false;

    function collectLinks() {
      var links = [];
      document.querySelectorAll(".md-sidebar--primary, .md-sidebar--secondary")
        .forEach(function (nav) {
          nav.querySelectorAll('a.md-nav__link[href*="#"]').forEach(function (a) {
            var href = a.getAttribute("href") || "";
            var id = href.split("#").pop();
            // only keep anchors that actually exist on this page
            if (id && document.getElementById(id)) {
              links.push({ id: id, el: a });
            }
          });
        });
      return links;
    }

    function update() {
      var headings = document.querySelectorAll(
        ".md-content h1[id], .md-content h2[id], .md-content h3[id]"
      );

      // the last heading that has scrolled past the offset line
      var activeId = null;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= ACTIVE_OFFSET) {
          activeId = headings[i].id;
        } else {
          break;
        }
      }

      // parent lecture (nearest preceding h1) so sub-sections light up their
      // lecture in the left navigation
      var parentId = null;
      var lastH1 = null;
      if (activeId) {
        for (var j = 0; j < headings.length; j++) {
          var h = headings[j];
          if (h.tagName === "H1" && h.id) lastH1 = h.id;
          if (h.id === activeId) {
            parentId = h.tagName === "H1" ? h.id : lastH1;
            break;
          }
        }
      }

      if (activeId !== current) {
        current = activeId;
        var links = collectLinks();
        links.forEach(function (l) {
          var inToc = !!l.el.closest(".md-sidebar--secondary");
          var isActive = l.id === activeId;
          var isParent = l.id === parentId;
          if (inToc) {
            // Table of contents: strong highlight on the exact section,
            // subtle breadcrumb on the containing lecture.
            l.el.classList.toggle("md-nav__link--current", isActive);
            l.el.classList.toggle("md-nav__link--parent", isParent && !isActive);
          } else {
            // Left navigation: strong highlight on the current lecture.
            l.el.classList.toggle("md-nav__link--current", isParent);
          }
        });
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { update(); });

    // Material's toc.follow swaps TOC nodes as you scroll — re-apply after
    // any such change so the highlight survives.
    var observer = new MutationObserver(function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });
    document.querySelectorAll(".md-sidebar--primary .md-nav, .md-sidebar--secondary .md-nav")
      .forEach(function (nav) {
        observer.observe(nav, { childList: true, subtree: true });
      });

    update();
  });
})();

