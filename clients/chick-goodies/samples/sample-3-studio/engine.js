/* Shared facts + quote math. Each sample mounts this differently. */
(function (w) {
  var TEL = "18324588180";
  var MAIL = "charcuteriechick@outlook.com";
  var SETUP = 229;
  var TAX = 0.18;

  var TABLES = [
    {
      id: "holy",
      kind: "table",
      n: "01",
      name: "Holy Grail of Grazing",
      priceLabel: "$2,000 / $3,500",
      unit: "75 or 150 guests",
      img: "img/knot-hero.jpg",
      w: 945,
      h: 720,
      include:
        "Two sliders (50 of each), five cheeses, five meats, two salads, three dips, two hummus, two nuts, guacamole, pico, seasonal fruit, chips.",
    },
    {
      id: "grand",
      kind: "table",
      n: "02",
      name: "Grand Graze",
      pp: 38,
      priceLabel: "$38",
      unit: "per person · 50 minimum",
      img: "img/knot-2.jpg",
      w: 945,
      h: 720,
      include:
        "Five sliders, four salads, three dips, two hummus, two nuts, chips, mini pudding cups (Oreo, butterscotch, banana).",
    },
    {
      id: "super",
      kind: "table",
      n: "03",
      name: "Super Graze",
      pp: 30,
      priceLabel: "$30",
      unit: "per person · 50 minimum",
      img: "img/knot-3.jpg",
      w: 945,
      h: 720,
      include:
        "Three sliders (25 each), three salads, three dips, two hummus, nuts, chips, full vegetable spread.",
    },
    {
      id: "standard",
      kind: "table",
      n: "04",
      name: "Grazing Standard",
      pp: 26,
      priceLabel: "$26",
      unit: "per person · 50 minimum",
      img: "img/table-01.jpg",
      w: 480,
      h: 640,
      include:
        "Graze Me, plus a second hummus, two dips, pasta salad, potato / sweet-potato / tortilla chips.",
    },
    {
      id: "graze",
      kind: "table",
      n: "05",
      name: "Graze Me, Craze Me",
      pp: 24,
      priceLabel: "$24",
      unit: "per person · 50 minimum",
      img: "img/wide-640.jpg",
      w: 640,
      h: 452,
      include:
        "Two sliders (30 of each), meat and cheese, seasonal fruit, hummus, almonds, two salads, roasted and raw vegetables, one dip.",
    },
    {
      id: "taco",
      kind: "cart",
      n: "06",
      name: "Taco Cart",
      priceLabel: "$26.95",
      unit: "as published",
      img: "img/cart-640.jpg",
      w: 640,
      h: 480,
      include: "Houston’s largest charcuterie cart, her words. One party at a time.",
    },
    {
      id: "carts",
      kind: "cart",
      n: "07",
      name: "Carts",
      priceLabel: "$24.50",
      unit: "as published",
      img: "img/knot-4.jpg",
      w: 945,
      h: 720,
      include: "Travels 100 miles from Tomball.",
    },
    {
      id: "slider",
      kind: "cart",
      n: "08",
      name: "Slider Menu",
      priceLabel: "$2.95",
      unit: "as published",
      img: "img/graze-01.jpg",
      w: 480,
      h: 640,
      include: "Eleven slider choices. Counts depend on the table.",
    },
    {
      id: "cakes",
      kind: "sweet",
      n: "09",
      name: "Cakes and Shakes",
      priceLabel: "$9.50",
      unit: "as published",
      img: "img/sweets-01.jpg",
      w: 480,
      h: 640,
      include: "Cups. Ask for the count.",
    },
    {
      id: "candy",
      kind: "sweet",
      n: "10",
      name: "Candy Bar Chick",
      priceLabel: "$5.00",
      unit: "as published",
      img: "img/candy-01.jpg",
      w: 480,
      h: 640,
      include: "Candy bar station.",
    },
    {
      id: "zeppole",
      kind: "sweet",
      n: "11",
      name: "Zeppole Beignet Chick",
      priceLabel: "$4.50",
      unit: "as published",
      img: "img/board-01.jpg",
      w: 480,
      h: 640,
      include: "Beignets.",
    },
    {
      id: "bloody",
      kind: "sip",
      n: "12",
      name: "Bloody Mary Chick",
      priceLabel: "$6.50",
      unit: "as published",
      img: "img/sips-01.jpg",
      w: 480,
      h: 640,
      include: "Sip station.",
    },
    {
      id: "mimosa",
      kind: "sip",
      n: "13",
      name: "Mimosa Chick",
      priceLabel: "$4.00",
      unit: "as published",
      img: "img/sips-02.jpg",
      w: 480,
      h: 640,
      include: "Sip station.",
    },
    {
      id: "easy",
      kind: "board",
      n: "14",
      name: "Easy order boards",
      priceLabel: "Ask",
      unit: "",
      ask: true,
      img: "img/boards-01.jpg",
      w: 480,
      h: 640,
      include: "Live Shopify lists this at $0.00. We do not reprint that.",
    },
    {
      id: "board",
      kind: "board",
      n: "15",
      name: "Charcuterie Chick board",
      priceLabel: "Ask",
      unit: "",
      ask: true,
      img: "img/board-02.jpg",
      w: 480,
      h: 640,
      include: "Price on request.",
    },
  ];

  function money(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function compute(id, guests) {
    var t = TABLES.filter(function (x) {
      return x.id === id;
    })[0];
    if (!t) return null;
    guests = parseInt(guests, 10) || 0;
    var out = {
      table: t,
      guests: guests,
      food: null,
      setup: null,
      tax: null,
      total: null,
      note: "",
      ok: false,
    };
    if (t.ask) {
      out.note = "Price on request. Tell Tricia the date and the count.";
      return out;
    }
    if (t.kind !== "table") {
      out.note = t.priceLabel + " as published. She prices the full event by hand.";
      return out;
    }
    if (t.id === "holy") {
      if (guests >= 150) {
        out.food = 3500;
        out.guests = 150;
        out.note = "Published price for 150 guests.";
      } else {
        out.food = 2000;
        out.guests = Math.max(guests, 75);
        out.note = "Published price for 75 guests.";
      }
      out.setup = SETUP;
      out.tax = Math.round((out.food + out.setup) * TAX);
      out.total = out.food + out.setup + out.tax;
      out.ok = true;
      return out;
    }
    if (guests && guests < 50) {
      out.note = "Tables have a 50-guest minimum.";
      out.ok = false;
      return out;
    }
    if (!guests) {
      out.note = "Enter a guest count to see food + $229 setup + 18% tax.";
      return out;
    }
    out.food = t.pp * guests;
    out.setup = SETUP;
    out.tax = Math.round((out.food + out.setup) * TAX);
    out.total = out.food + out.setup + out.tax;
    out.ok = true;
    out.note = "90 minutes. Extra half hour is $3 per person.";
    return out;
  }

  function buildMessage(state) {
    var lines = ["Hi Tricia — quote request from the Charcuterie Chick website."];
    if (state.name) lines.push("Name: " + state.name);
    if (state.phone) lines.push("Phone: " + state.phone);
    if (state.date) lines.push("Event date: " + state.date);
    if (state.guests) lines.push("Guests: " + state.guests);
    if (state.table) lines.push("Looking at: " + state.table.name);
    var q = state.table ? compute(state.table.id, state.guests) : null;
    if (q && q.ok) {
      lines.push(
        "Estimate: food " +
          money(q.food) +
          " + setup " +
          money(q.setup) +
          " + tax " +
          money(q.tax) +
          " = " +
          money(q.total) +
          " (not a booking)."
      );
    }
    if (state.details) lines.push("Details: " + state.details);
    return lines.join("\n");
  }

  function sms(state) {
    w.location.href = "sms:" + TEL + "?&body=" + encodeURIComponent(buildMessage(state));
  }
  function email(state) {
    w.location.href =
      "mailto:" +
      MAIL +
      "?subject=" +
      encodeURIComponent("Quote request") +
      "&body=" +
      encodeURIComponent(buildMessage(state));
  }
  function copy(state, hint) {
    var txt = buildMessage(state);
    var done = function () {
      if (hint) hint.textContent = "Copied — paste it into a text or email.";
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () {});
    } else {
      var ta = document.createElement("textarea");
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {}
      ta.remove();
    }
  }

  w.CHICK = {
    TEL: TEL,
    MAIL: MAIL,
    TABLES: TABLES,
    money: money,
    compute: compute,
    buildMessage: buildMessage,
    sms: sms,
    email: email,
    copy: copy,
    byId: function (id) {
      return TABLES.filter(function (t) {
        return t.id === id;
      })[0];
    },
  };
})(window);
