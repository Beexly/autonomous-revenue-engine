/* Runway: pointer-tilt 3D + snap carousel. No libraries. */
(function () {
  function tilt(el) {
    var fig = el.querySelector(".stage");
    if (!fig) return;
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      fig.style.transform =
        "rotateY(" + (x * 18) + "deg) rotateX(" + (-y * 10) + "deg) translateZ(24px)";
    });
    el.addEventListener("pointerleave", function () {
      fig.style.transform = "";
    });
  }

  function card(look, i) {
    var a = document.createElement("article");
    a.className = "look";
    a.dataset.house = look.house;
    a.innerHTML =
      '<div class="stage">' +
        '<div class="plinth" aria-hidden="true"></div>' +
        '<figure>' +
          '<img src="' + look.img + '" alt="' + look.name + ' — Charcuterie Chick" width="640" height="640" loading="' + (i < 3 ? "eager" : "lazy") + '" decoding="async">' +
        '</figure>' +
      '</div>' +
      '<div class="meta">' +
        '<p class="look-n">Look ' + look.n + ' · ' + look.house + '</p>' +
        '<h3>' + look.name + '</h3>' +
        '<p class="price">' + look.price + (look.unit ? ' <small>' + look.unit + '</small>' : '') + '</p>' +
        '<p class="note">' + look.note + '</p>' +
      '</div>';
    tilt(a);
    return a;
  }

  function mount(sel) {
    var root = document.querySelector(sel);
    if (!root || !window.CHICK_LOOKS) return;
    var looks = window.CHICK_LOOKS;
    var houses = [];
    looks.forEach(function (l) {
      if (houses.indexOf(l.house) < 0) houses.push(l.house);
    });
    var bar = document.createElement("div");
    bar.className = "look-bar";
    bar.innerHTML =
      '<p class="look-count"><span id="lookNow">01</span> / ' + looks.length + '</p>' +
      '<nav class="look-houses" aria-label="Houses">' +
        houses.map(function (h) {
          return '<button type="button" data-house="' + h + '">' + h + '</button>';
        }).join("") +
      '</nav>';
    var track = document.createElement("div");
    track.className = "runway";
    track.setAttribute("tabindex", "0");
    looks.forEach(function (l, i) { track.appendChild(card(l, i)); });
    root.appendChild(bar);
    root.appendChild(track);

    var now = bar.querySelector("#lookNow");
    function update() {
      var cards = track.querySelectorAll(".look");
      var mid = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestD = 1e9;
      cards.forEach(function (c, i) {
        var d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      now.textContent = looks[best].n;
    }
    track.addEventListener("scroll", update, { passive: true });

    bar.querySelectorAll("[data-house]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var first = track.querySelector('.look[data-house="' + btn.dataset.house + '"]');
        if (first) first.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    });
  }

  window.mountRunway = mount;

  var TEL = "18324588180";
  window.wireQuote = function () {
    var $ = function (id) { return document.getElementById(id); };
    if (!$("smsBtn")) return;
    function build() {
      var p = ["Hi Tricia — quote request from the Charcuterie Chick website."];
      ["n", "p", "d", "g", "t", "m"].forEach(function (id) {
        var el = $(id);
        if (!el) return;
        var v = el.value && el.value.trim();
        if (v) p.push(el.previousElementSibling ? el.previousElementSibling.textContent + ": " + v : v);
      });
      var n = $("n") && $("n").value.trim();
      var ph = $("p") && $("p").value.trim();
      var d = $("d") && $("d").value;
      var g = $("g") && $("g").value.trim();
      var t = $("t") && $("t").value;
      var m = $("m") && $("m").value.trim();
      var parts = ["Hi Tricia — quote request from the Charcuterie Chick website."];
      if (n) parts.push("Name: " + n);
      if (ph) parts.push("Phone: " + ph);
      if (d) parts.push("Event date: " + d);
      if (g) parts.push("Guests: " + g);
      if (t) parts.push("Looking at: " + t);
      if (m) parts.push("Details: " + m);
      return parts.join("\n");
    }
    $("smsBtn").addEventListener("click", function () {
      window.location.href = "sms:" + TEL + "?&body=" + encodeURIComponent(build());
    });
    if ($("emailBtn")) {
      $("emailBtn").addEventListener("click", function () {
        window.location.href = "mailto:charcuteriechick@outlook.com?subject=" + encodeURIComponent("Quote request") + "&body=" + encodeURIComponent(build());
      });
    }
    $("copyBtn").addEventListener("click", function () {
      var txt = build();
      var done = function () { $("hint").textContent = "Copied — paste it into a text or email."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = txt; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        ta.remove();
      }
    });
  };
})();
