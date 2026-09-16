/* Photo fade + quote math hook. No cursor theater. */
(function () {
  var slides = document.querySelectorAll("[data-slides] img");
  if (slides.length > 1) {
    var i = 0;
    setInterval(function () {
      slides[i].classList.remove("on");
      i = (i + 1) % slides.length;
      slides[i].classList.add("on");
    }, 4200);
  }
  window.CHICK_FORM = function () {
    if (!window.CHICK) return;
    var $ = function (id) { return document.getElementById(id); };
    var t = $("t"), g = $("g"), out = $("est");
    function state() {
      return {
        tableId: t && t.value,
        guests: g && g.value,
        name: $("n") && $("n").value,
        phone: $("p") && $("p").value,
        date: $("d") && $("d").value,
        note: $("m") && $("m").value
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
    if (t) t.addEventListener("input", paint);
    if (g) g.addEventListener("input", paint);
    paint();
    if ($("smsBtn")) $("smsBtn").onclick = function () { CHICK.sendSms(state()); };
    if ($("emailBtn")) $("emailBtn").onclick = function () { CHICK.sendMail(state()); };
    if ($("copyBtn")) $("copyBtn").onclick = function () {
      CHICK.copy(state()).then(function () {
        if ($("hint")) $("hint").textContent = "Copied.";
      });
    };
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", CHICK_FORM);
  else CHICK_FORM();
})();
