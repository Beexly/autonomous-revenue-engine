/* Midnight Supper. Native navigation first; no storage, tracking or auto-send. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = $('.motion');
  let motion = !reduce.matches;
  function setMotion(enabled) {
    motion = enabled && !reduce.matches;
    document.documentElement.classList.toggle('motion-on', motion);
    document.documentElement.classList.toggle('motion-off', !motion);
    motionButton.textContent = motion ? 'Motion: on' : 'Motion: off';
    motionButton.setAttribute('aria-pressed', String(!motion));
    motionButton.setAttribute('aria-label', reduce.matches ? 'Motion off: reduced motion preference respected' : (motion ? 'Pause decorative motion' : 'Enable decorative motion'));
    if (!motion) $$('.spotlight').forEach(stage => { stage.style.removeProperty('--spot-x'); stage.style.removeProperty('--spot-y'); stage.style.removeProperty('--scene-progress'); });
  }
  motionButton.hidden = false;
  motionButton.addEventListener('click', () => setMotion(!motion));
  reduce.addEventListener('change', () => setMotion(!reduce.matches));
  setMotion(motion);
  const stages = $$('.spotlight');
  stages.forEach(stage => {
    let pending = false, x = 65, y = 45;
    stage.addEventListener('pointermove', event => {
      if (!motion || document.hidden || event.pointerType === 'touch') return;
      const box = stage.getBoundingClientRect();
      x = (event.clientX - box.left) / box.width * 100;
      y = (event.clientY - box.top) / box.height * 100;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          if (!motion || document.hidden) return;
          stage.style.setProperty('--spot-x', `${x}%`);
          stage.style.setProperty('--spot-y', `${y}%`);
        });
      }
    }, {passive:true});
  });
  let scrollPending = false;
  window.addEventListener('scroll', () => {
    if (!motion || document.hidden || scrollPending) return;
    scrollPending = true;
    requestAnimationFrame(() => {
      scrollPending = false;
      if (!motion || document.hidden) return;
      stages.forEach(stage => {
        const box = stage.getBoundingClientRect();
        if (box.bottom <= 0 || box.top >= innerHeight) return;
        stage.style.setProperty('--scene-progress', String(Math.min(1,Math.max(0,-box.top / box.height))));
      });
    });
  }, {passive:true});
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.08});
    $$('.reveal').forEach(el => observer.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('is-visible'));

  const menuLinks = $$('[data-menu]');
  if (menuLinks.length) {
    function selectMenu(id) {
      if (!menuLinks.some(link => link.dataset.menu === id)) id = menuLinks[0].dataset.menu;
      $$('.menu-panel').forEach(panel => { panel.hidden = panel.id !== id; });
      menuLinks.forEach(link => { link.setAttribute('aria-current', String(link.dataset.menu === id)); });
    }
    selectMenu(location.hash.slice(1));
    menuLinks.forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      const id = link.dataset.menu;
      history.pushState(null, '', `#${id}`);
      selectMenu(id);
    }));
    window.addEventListener('popstate', () => selectMenu(location.hash.slice(1)));
    window.addEventListener('hashchange', () => selectMenu(location.hash.slice(1)));
    $('.menu-selector').addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let index = menuLinks.indexOf(document.activeElement);
      if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = menuLinks.length - 1;
      else index = (index + (event.key === 'ArrowRight' ? 1 : -1) + menuLinks.length) % menuLinks.length;
      menuLinks[index].focus(); menuLinks[index].click();
    });
  }

  const strip = $('.filmstrip');
  if (strip) {
    $('.film-buttons').hidden = false;
    $$('[data-film]').forEach(button => button.addEventListener('click', () => {
      strip.scrollBy({left:Number(button.dataset.film) * strip.clientWidth * .75,behavior:motion ? 'smooth' : 'instant'});
    }));
    const dialog = $('#lightbox');
    let opener;
    if (typeof dialog.showModal === 'function') {
      $$('[data-lightbox]').forEach(link => link.addEventListener('click', event => {
        event.preventDefault(); opener = link;
        const source = $('img', link), target = $('#lightbox-image');
        target.src = source.src; target.alt = source.alt;
        target.width = source.naturalWidth; target.height = source.naturalHeight;
        target.style.maxWidth = `min(100%, ${source.naturalWidth}px)`;
        $('#lightbox-caption').textContent = link.dataset.caption;
        dialog.showModal();
      }));
      $('.close-lightbox').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
      dialog.addEventListener('close', () => opener?.focus());
    }
  }

  const planner = $('#planner');
  if (!planner) return;
  const menu = $('#menu-choice'), guests = $('#guests'), time = $('#extra-time');
  const estimate = $('#estimate'), draft = $('#draft-text');
  const money = cents => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(cents / 100);
  function calculate() {
    const count = Number(guests.value), intervals = Number(time.value);
    if (guests.value.trim() === '' || !Number.isSafeInteger(count) || count < 1 || count > 10000) return {error:'Enter a whole guest count between 1 and 10,000, or request a custom quote.'};
    if (!Number.isInteger(intervals) || intervals < 0 || intervals > 4) return {error:'Please choose an available extra-time option.'};
    let food;
    if (menu.value === 'holy') {
      if (![75,150].includes(count)) return {error:'Holy Grail is published for exactly 75 or 150 guests. Request a custom quote for another count.'};
      food = count === 75 ? 200000 : 350000;
    } else {
      const rates = {grand:3800, super:3000, standard:2600, graze:2400};
      if (!rates[menu.value]) return {error:'Please choose a published menu.'};
      if (count < 50) return {error:'Per-person tables have a 50-guest minimum. Request a custom quote for a smaller occasion.'};
      food = rates[menu.value] * count;
    }
    const setup = 22900, extra = count * 300 * intervals;
    const tax = Math.round((food + setup + extra) * 18 / 100);
    return {count,food,setup,extra,tax,total:food+setup+extra+tax};
  }
  function updateEstimate() {
    const quote = calculate();
    estimate.replaceChildren();
    if (quote.error) {
      const error = document.createElement('p'); error.className = 'invalid'; error.textContent = quote.error; estimate.append(error);
    } else {
      const label = document.createElement('p'); label.className='eyebrow'; label.textContent='Estimated published costs';
      const total = document.createElement('p'); total.className='estimate-total'; total.textContent=money(quote.total);
      const rows = document.createElement('dl');
      [['Food',quote.food],['Setup',quote.setup],['Extra time',quote.extra],['18% tax · assumed base',quote.tax]].forEach(([name,value]) => {
        const row=document.createElement('div'), term=document.createElement('dt'), definition=document.createElement('dd');
        term.textContent=name; definition.textContent=money(value); row.append(term,definition); rows.append(row);
      });
      estimate.append(label,total,rows);
    }
    return quote;
  }
  const requested = new URLSearchParams(location.search).get('menu');
  if ([...menu.options].some(option => option.value === requested)) { menu.value = requested; if(requested !== 'holy') guests.value='50'; }
  [menu, guests, time].forEach(input => input.addEventListener('input', updateEstimate));
  planner.addEventListener('submit', event => event.preventDefault());
  updateEstimate();
  let recipient = $('#open-email').getAttribute('href').slice(7);
  function emailLink() {
    $('#open-email').href = `mailto:${recipient}?subject=${encodeURIComponent('An occasion with The Chick Goodies')}&body=${encodeURIComponent(draft.value)}`;
  }
  draft.addEventListener('input', emailLink);
  $('.draft-button').hidden = false;
  $('.draft-button').addEventListener('click', () => {
    const quote = updateEstimate();
    const lines = ['Hello Tricia,', '', 'I would like to enquire about an occasion.', `Starting menu: ${menu.selectedOptions[0].textContent}`, `Guests: ${guests.value || 'To discuss'}`, `Extra service time: ${time.selectedOptions[0].textContent}`];
    if ($('#event-date').value) lines.push(`Date: ${$('#event-date').value}`);
    if ($('#occasion').value) lines.push(`Occasion: ${$('#occasion').value}`);
    if (quote.error) lines.push('Please provide a custom quote. '+quote.error);
    else lines.push(`Estimated published costs: ${money(quote.total)} (food ${money(quote.food)}, setup ${money(quote.setup)}, extra time ${money(quote.extra)}, assumed tax ${money(quote.tax)}).`);
    lines.push('The estimate assumes the published 18% tax applies to food, setup and extra time. Please confirm the tax base, final pricing, contents, dietary requirements and availability. This is an enquiry, not a booking.');
    if ($('#event-notes').value.trim()) lines.push('', 'My ideas: '+$('#event-notes').value.trim());
    draft.value = lines.join('\n'); emailLink();
    $('#draft-review').hidden = false;
    draft.focus({preventScroll:true});
    $('#draft-review').scrollIntoView({behavior:motion ? 'smooth' : 'instant',block:'start'});
  });
  $('#copy-draft').addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draft.value);
      $('#draft-status').textContent = 'Draft copied. No message has been sent.';
    } catch {
      draft.focus(); draft.select();
      $('#draft-status').textContent = 'Automatic copying is unavailable. Your draft is selected: copy it manually. No message has been sent.';
    }
  });
})();
