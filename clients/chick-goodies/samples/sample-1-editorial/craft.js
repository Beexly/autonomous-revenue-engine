/* Unseen-consensus craft: custom cursor, click-and-hold, tracked type. */
(function (w, d) {
  function preferReduce() {
    return w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function space(el) {
    if (!el) return;
    var t = el.textContent.trim();
    el.innerHTML = t
      .split("")
      .map(function (ch) {
        if (ch === " ") return '<span class="sp">&nbsp;</span>';
        return "<span>" + ch + "</span>";
      })
      .join("");
  }

  function cursor() {
    if (preferReduce()) return;
    if (!w.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var el = d.createElement("div");
    el.className = "cur";
    el.setAttribute("aria-hidden", "true");
    d.body.appendChild(el);
    d.documentElement.classList.add("has-cur");
    var x = 0, y = 0, tx = 0, ty = 0;
    w.addEventListener(
      "pointermove",
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
      },
      { passive: true }
    );
    (function loop() {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = "translate(" + x + "px," + y + "px)";
      requestAnimationFrame(loop);
    })();
    d.addEventListener("pointerdown", function () {
      el.classList.add("down");
    });
    d.addEventListener("pointerup", function () {
      el.classList.remove("down");
    });
  }

  function hold(btn, onDone) {
    if (!btn) return;
    var ms = 900;
    var t = null;
    var start = 0;
    var ring = btn.querySelector("[data-ring]");
    function set(p) {
      if (ring) ring.style.strokeDashoffset = String((1 - p) * 88);
    }
    function stop() {
      if (t) cancelAnimationFrame(t);
      t = null;
      set(0);
    }
    function tick(now) {
      var p = Math.min(1, (now - start) / ms);
      set(p);
      if (p >= 1) {
        stop();
        onDone();
        return;
      }
      t = requestAnimationFrame(tick);
    }
    function begin(e) {
      if (e.button && e.button !== 0) return;
      start = performance.now();
      t = requestAnimationFrame(tick);
    }
    btn.addEventListener("pointerdown", begin);
    btn.addEventListener("pointerup", stop);
    btn.addEventListener("pointerleave", stop);
    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onDone();
      }
    });
    if (preferReduce()) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        onDone();
      });
    }
  }

  w.CRAFT = { space: space, cursor: cursor, hold: hold, preferReduce: preferReduce };
})(window, document);
