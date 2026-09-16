/* Quote path: opens SMS or mailto with the form filled in. Never fakes a send. */
(function () {
  var TEL = "18324588180";
  var MAIL = "charcuteriechick@outlook.com";

  function val(id) {
    var el = document.getElementById(id);
    return el && el.value ? el.value.trim() : "";
  }

  function build() {
    var parts = ["Hi Tricia — quote request from the Charcuterie Chick website."];
    var n = val("n"), ph = val("p"), d = val("d"), g = val("g"), t = val("t"), m = val("m");
    if (n) parts.push("Name: " + n);
    if (ph) parts.push("Phone: " + ph);
    if (d) parts.push("Event date: " + d);
    if (g) parts.push("Guests: " + g);
    if (t) parts.push("Looking at: " + t);
    if (m) parts.push("Details: " + m);
    return parts.join("\n");
  }

  function hint(msg) {
    var h = document.getElementById("hint");
    if (h) h.textContent = msg;
  }

  window.wireQuote = function () {
    var sms = document.getElementById("smsBtn");
    if (!sms) return;
    sms.addEventListener("click", function () {
      window.location.href = "sms:" + TEL + "?&body=" + encodeURIComponent(build());
    });
    var em = document.getElementById("emailBtn");
    if (em) {
      em.addEventListener("click", function () {
        window.location.href =
          "mailto:" + MAIL +
          "?subject=" + encodeURIComponent("Quote request") +
          "&body=" + encodeURIComponent(build());
      });
    }
    var cp = document.getElementById("copyBtn");
    if (cp) {
      cp.addEventListener("click", function () {
        var txt = build();
        var done = function () { hint("Copied — paste it into a text or email."); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).then(done, function () { hint(txt); });
        } else {
          hint(txt);
        }
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.wireQuote);
  } else {
    window.wireQuote();
  }
})();
