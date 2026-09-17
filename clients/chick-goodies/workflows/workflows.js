/* Workflows leave-behind: the timeline and the arithmetic.
 * No dependencies. Every number the page prints is either dragged by the
 * viewer or taken from Tricia's own listings — nothing is invented here. */
(function(){
  'use strict';

  /* ---------------- the timeline ---------------- */
  var track  = document.getElementById('trackFill');
  var items  = [].slice.call(document.querySelectorAll('#events li'));
  var play   = document.getElementById('play');
  var reset  = document.getElementById('reset');
  var label  = document.getElementById('dayLabel');
  var reduced = matchMedia('(prefers-reduced-motion: reduce)');

  var LABELS = [
    'Day 0 — the enquiry arrives',
    'Four hours later — has it been answered?',
    'The quote, the booking, the party',
    'Two days after — thank you, with a photo',
    'Three days after — the review ask',
    'Thirty days after — a reason to come back'
  ];

  var pos = 0, timer = 0, running = false;

  function paint(){
    track.style.width = pos + '%';
    var live = -1;
    items.forEach(function(li, i){
      var at = +li.dataset.at;
      li.classList.toggle('done', pos > at);
      var isLive = pos >= at && (i === items.length - 1 || pos < +items[i+1].dataset.at);
      li.classList.toggle('live', isLive);
      if (isLive) live = i;
    });
    if (live >= 0) label.textContent = LABELS[live];
  }

  function stop(){
    running = false;
    clearInterval(timer); timer = 0;
    play.textContent = 'Play the timeline';
  }

  function step(){
    pos += 1;
    if (pos >= 100){ pos = 100; paint(); stop(); play.textContent = 'Play it again'; return; }
    paint();
  }

  play.addEventListener('click', function(){
    if (running){ stop(); return; }
    if (pos >= 100) pos = 0;
    if (reduced.matches){            // no animation: land on the finished state
      pos = 100; paint(); play.textContent = 'Play it again'; return;
    }
    running = true;
    play.textContent = 'Pause';
    timer = setInterval(step, 62);
  });

  reset.addEventListener('click', function(){ stop(); pos = 0; paint(); });

  paint();

  /* ---------------- the arithmetic ---------------- */
  /* The only hard-coded figure is her own published average. Everything else
     comes off a slider, so the page argues with its own assumptions. */
  var AVG_COUPLE_SPEND = 2350;   // The Knot, "couples usually spend" — FACTS.md

  var evts = document.getElementById('evts');
  var rate = document.getElementById('rate');
  var lost = document.getElementById('lost');
  var conv = document.getElementById('conv');

  var evtsOut = document.getElementById('evtsOut');
  var rateOut = document.getElementById('rateOut');
  var lostOut = document.getElementById('lostOut');
  var convOut = document.getElementById('convOut');

  var revYear   = document.getElementById('revYear');
  var recovered = document.getElementById('recovered');
  var value     = document.getElementById('value');

  var money = new Intl.NumberFormat('en-US', {
    style:'currency', currency:'USD', maximumFractionDigits:0
  });

  function run(){
    var e = +evts.value, r = +rate.value / 100, l = +lost.value, c = +conv.value / 100;

    evtsOut.textContent = e;
    rateOut.textContent = Math.round(r * 100) + '%';
    lostOut.textContent = l;
    convOut.textContent = Math.round(c * 100) + '%';

    var reviews = Math.round(e * r * 12);
    var books   = Math.round(l * c * 12);

    revYear.textContent   = reviews;
    recovered.textContent = books;
    value.textContent     = money.format(books * AVG_COUPLE_SPEND);

    // a recovered booking is a real booking; say so in the singular when it is one
    document.querySelector('#recovered + .out-l').textContent =
      (books === 1 ? 'Booking' : 'Bookings') +
      ' a year recovered from enquiries that already exist';
  }

  [evts, rate, lost, conv].forEach(function(el){
    el.addEventListener('input', run);
  });
  run();
})();
