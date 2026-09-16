/* Kit Motif craft: dual cursor, reveal, quote form. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(pointer: fine)").matches;

  $$("[data-reveal]").forEach(function (el) {
    if (reduced) { el.classList.add("in"); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
  });

  if (fine && !reduced) {
    document.body.classList.add("has-cursor");
    var dot = $("#cdot"), ring = $("#cring");
    if (dot && ring) {
      var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      addEventListener("mousemove", function (e) {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = "translate(" + (mx - 4) + "px," + (my - 4) + "px)";
      });
      (function follow() {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.transform = "translate(" + (rx - ring.offsetWidth / 2) + "px," + (ry - ring.offsetHeight / 2) + "px)";
        requestAnimationFrame(follow);
      })();
      document.addEventListener("mouseover", function (e) {
        if (e.target.closest("a,button,summary,label,.row,.card")) ring.classList.add("big");
        else ring.classList.remove("big");
      });
    }
  }

  window.CHICK_FORM = function () {
    if (!window.CHICK) return;
    var n = $("#n"), p = $("#p"), d = $("#d"), g = $("#g"), t = $("#t"), m = $("#m");
    var out = $("#est");
    function state() {
      return {
        tableId: t && t.value,
        guests: g && g.value,
        name: n && n.value,
        phone: p && p.value,
        date: d && d.value,
        note: m && m.value
      };
    }
    function paint() {
      if (!out || !t) return;
      var q = CHICK.compute(t.value, g && g.value);
      if (!q.ok) { out.textContent = q.reason || ""; return; }
      out.innerHTML = q.lines.map(function (l) {
        return "<div><span>" + l[0] + "</span><b>" + l[1] + "</b></div>";
      }).join("");
    }
    [t, g].forEach(function (el) { if (el) el.addEventListener("input", paint); });
    paint();
    var sms = $("#smsBtn"), mail = $("#emailBtn"), copy = $("#copyBtn"), hint = $("#hint");
    if (sms) sms.onclick = function () { CHICK.sendSms(state()); };
    if (mail) mail.onclick = function () { CHICK.sendMail(state()); };
    if (copy) copy.onclick = function () {
      CHICK.copy(state()).then(function () { if (hint) hint.textContent = "Copied."; });
    };
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", CHICK_FORM);
  else CHICK_FORM();
})();
