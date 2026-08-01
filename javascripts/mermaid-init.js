/* mermaid-init.js
 * ---------------------------------------------------------------------------
 * Extends Material for MkDocs' built-in Mermaid integration with:
 *   1. Uniform node sizing  — a guaranteed minimum box size for every node,
 *      so diagrams look balanced (boxes expand only when labels need more room).
 *   2. Flowing-edge animation — subtle "data in motion" effect on arrows
 *      (respects prefers-reduced-motion).
 *   3. Muted industrial palette — for diagram types Material does not theme
 *      (pie charts, timelines), matching the Starbucks/Anthropic palette.
 *
 * Material renders Mermaid itself into isolated shadow DOMs and themes it via
 * --md-mermaid-* CSS variables. We do NOT take over rendering; we hook
 * `mermaid.initialize` so that whenever Material initializes Mermaid, our
 * extra theme CSS and config are merged in while Material's own theming
 * (including dark-mode awareness) is preserved.
 * ------------------------------------------------------------------------- */
(function () {
  if (typeof mermaid === "undefined") return;

  /* Appended to Material's injected theme CSS (lives inside each diagram). */
  var EXTRA_THEME_CSS = [
    /* Uniform node sizing: every shape gets a comfortable minimum box. */
    ".node rect,.node polygon,.node path,.node ellipse,.node circle{",
    "  min-width:120px;min-height:44px;",
    "}",
    /* Flowing edges: dashed strokes that march along the arrow path. */
    ".edgePath .path,.flowchart-link{",
    "  stroke-dasharray:7 6;",
    "  animation:mdEdgeFlow 1.1s linear infinite;",
    "}",
    "@keyframes mdEdgeFlow{to{stroke-dashoffset:-13}}",
    "@media (prefers-reduced-motion: reduce){",
    "  .edgePath .path,.flowchart-link{animation:none;stroke-dasharray:none}",
    "}",
    /* Keep edge labels legible above the animated strokes. */
    ".edgeLabel .label,.edgeLabel{background-color:var(--md-mermaid-label-bg-color)}",
    /* Serif type everywhere (timeline, pie, sequence text, etc.). */
    "text{font-family:var(--md-mermaid-font-family),sans-serif}"
  ].join("\n");

  var EXTRA_CONFIG = {
    /* Allow <br/> and simple HTML in labels. */
    securityLevel: "loose",
    flowchart: {
      curve: "basis",
      padding: 14,
      nodeSpacing: 40,
      rankSpacing: 55,
      htmlLabels: true
    },
    themeVariables: {
      /* Muted industrial palette for diagrams Material does not theme
         (pie, timeline, misc scales) — forest greens, copper, warm greys. */
      pie1: "#1f4e3d",
      pie2: "#3d7a5f",
      pie3: "#c46a4a",
      pie4: "#8a6d1f",
      pie5: "#6f675a",
      pie6: "#938a7a",
      pie7: "#a3522f",
      pieTitleTextSize: "18px",
      pieSectionTextSize: "13px",
      pieLegendTextSize: "13px",
      cScale0: "#1f4e3d",
      cScale1: "#c46a4a",
      cScale2: "#6f675a",
      cScale3: "#3d7a5f",
      cScale4: "#8a6d1f",
      cScale5: "#938a7a"
    }
  };

  var origInit = mermaid.initialize.bind(mermaid);
  mermaid.initialize = function (cfg) {
    var merged = Object.assign({}, cfg || {}, EXTRA_CONFIG, {
      themeCSS: (cfg && cfg.themeCSS ? cfg.themeCSS : "") + EXTRA_THEME_CSS
    });
    return origInit(merged);
  };
})();
