(function () {
  var hasDebugFlag = /[?&]overflow-debug=1(?:&|$)/.test(window.location.search)
    || window.localStorage.getItem("overflow-debug") === "1";

  if (!hasDebugFlag) {
    return;
  }

  var MARKER_ATTR = "data-overflow-debug";
  var STYLE_ID = "overflow-debug-style";

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = "[" + MARKER_ATTR + "]{outline:2px solid #ef4444 !important;outline-offset:1px !important;}";
    document.head.appendChild(style);
  }

  function clearMarks() {
    var marked = document.querySelectorAll("[" + MARKER_ATTR + "]");
    marked.forEach(function (el) {
      el.removeAttribute(MARKER_ATTR);
    });
  }

  function scanOverflow() {
    ensureStyle();
    clearMarks();

    var viewportWidth = document.documentElement.clientWidth;
    var all = document.body ? document.body.querySelectorAll("*") : [];
    var offenders = [];

    all.forEach(function (el) {
      if (!(el instanceof HTMLElement)) {
        return;
      }

      if (el.offsetParent === null && getComputedStyle(el).position !== "fixed") {
        return;
      }

      var rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      var overflowLeft = rect.left < -1;
      var overflowRight = rect.right > viewportWidth + 1;

      if (!overflowLeft && !overflowRight) {
        return;
      }

      el.setAttribute(MARKER_ATTR, "1");
      offenders.push({
        tag: el.tagName.toLowerCase(),
        className: el.className || "",
        id: el.id || "",
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        width: Math.round(rect.width)
      });
    });

    if (offenders.length) {
      console.group("Overflow debug: elements exceeding viewport");
      console.table(offenders);
      console.groupEnd();
    } else {
      console.info("Overflow debug: no elements exceeding viewport");
    }
  }

  window.__overflowDebugScan = scanOverflow;
  window.addEventListener("load", scanOverflow);
  window.addEventListener("resize", scanOverflow);
})();
