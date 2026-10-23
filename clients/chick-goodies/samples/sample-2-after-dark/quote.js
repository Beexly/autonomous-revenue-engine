/* One quote. Cents. Both calculators call quote(). No second formula. */
(function (w) {
  var SETUP_CENTS = 22900;
  var GRAZE_CENTS = 2400;
  var HOLY_FOOD_CENTS = 200000;
  var EXTRA_HALF_CENTS = 300;

  function quote(table, guests, extraHalfHours) {
    var count = parseInt(guests, 10);
    var halves = parseInt(extraHalfHours, 10) || 0;
    if (halves < 0) halves = 0;
    var base = {
      ok: false,
      table: table,
      guests: count,
      extraHalfHours: halves,
      foodCents: 0,
      setupCents: SETUP_CENTS,
      extraCents: 0,
      taxableCents: 0,
      taxCents: 0,
      totalCents: 0,
      note: "",
    };
    if (table === "holy") {
      if (count !== 75) {
        base.note = "Holy Grail is 75 guests only.";
        return base;
      }
      base.foodCents = HOLY_FOOD_CENTS;
    } else if (table === "graze") {
      if (!count || count < 50) {
        base.note = "50 guest minimum.";
        return base;
      }
      base.foodCents = GRAZE_CENTS * count;
    } else {
      base.note = "UNKNOWN";
      return base;
    }
    base.extraCents = EXTRA_HALF_CENTS * count * halves;
    base.taxableCents = base.foodCents + base.setupCents + base.extraCents;
    base.taxCents = Math.round((base.taxableCents * 18) / 100);
    base.totalCents = base.taxableCents + base.taxCents;
    base.ok = true;
    base.note = halves
      ? "90 minutes, plus extra half hours at $3 a person."
      : "90 minutes. Extra half hour is $3 a person.";
    return base;
  }

  function formatMoney(cents) {
    var abs = Math.abs(cents);
    var dollars = Math.floor(abs / 100);
    var rem = String(abs % 100).padStart(2, "0");
    return (cents < 0 ? "-$" : "$") + dollars.toLocaleString("en-US") + "." + rem;
  }

  function paint(root) {
    var result = quote(
      root.getAttribute("data-table"),
      root.querySelector("[name=guests]").value,
      root.querySelector("[name=halves]").value
    );
    var out = root.querySelector("[data-out]");
    if (!result.ok) {
      out.textContent = result.note;
      return;
    }
    out.textContent =
      "Food " +
      formatMoney(result.foodCents) +
      ". Setup " +
      formatMoney(result.setupCents) +
      ". Extra " +
      formatMoney(result.extraCents) +
      ". Tax " +
      formatMoney(result.taxCents) +
      ". Total " +
      formatMoney(result.totalCents) +
      ".";
  }

  function bind(root) {
    root.querySelector("[name=guests]").addEventListener("input", function () {
      paint(root);
    });
    root.querySelector("[name=halves]").addEventListener("input", function () {
      paint(root);
    });
    paint(root);
  }

  w.quote = quote;
  w.formatMoney = formatMoney;
  w.bindCalculators = function () {
    var nodes = document.querySelectorAll("[data-calculator]");
    for (var i = 0; i < nodes.length; i++) bind(nodes[i]);
  };
})(window);
