/* Garden Atelier — scroll/cursor-reactive WebGL caustic surface (decorative).
   Local, framework-free. Respects reduced motion, pause button, hidden-tab,
   and WebGL context-loss fallback. All interactive behaviour is additive. */
(() => {
  'use strict';
  const isReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('reduced-motion');

  function createCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    const grow = document.createElement('span');
    grow.className = 'cursor-grow';
    grow.style.cssText = 'position:absolute;top:50%;left:50%;width:32px;height:32px;border:1px solid var(--garden-ink);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%) scale(0);mix-blend-mode:multiply;opacity:0;transition:opacity .2s ease';
    cursor.appendChild(grow);

    // The native pointer is never hidden, so the ring has to sit ON it --
    // easing the ring reads as a fault, not as polish. Only the halo trails,
    // and it is driven by rAF rather than by mousemove: the previous
    // per-event easing advanced 15% of the remaining gap per event, so it
    // froze wherever the last event left it and never caught up.
    // Both transforms end in translate(-50%,-50%) because writing
    // element.style.transform replaces the rule in garden.css that centred
    // them -- without it the ring hangs 11px down and right of the pointer.
    // The halo sits inside #cursor, which is already at the pointer, so it
    // gets the trailing DELTA; absolute coordinates there doubled the offset.
    let px = 0, py = 0;   // pointer, exact
    let hx = 0, hy = 0;   // halo, trailing
    let placed = false, running = false;

    const place = (el, x, y, scale) =>
      el.style.transform =
        'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)' +
        (scale ? ' scale(' + scale + ')' : '');

    const frame = () => {
      const ease = isReducedMotion() ? 1 : 0.3;
      const dx = px - hx, dy = py - hy;
      hx += dx * ease; hy += dy * ease;
      if (Math.abs(px - hx) < 0.1 && Math.abs(py - hy) < 0.1) {
        hx = px; hy = py; running = false;
      }
      place(grow, hx - px, hy - py, 3.6);
      if (running) requestAnimationFrame(frame);
    };

    document.addEventListener('mousemove', (ev) => {
      px = ev.clientX; py = ev.clientY;
      if (!placed) { hx = px; hy = py; placed = true; grow.style.opacity = '.55'; }
      place(cursor, px, py);
      if (!running) { running = true; requestAnimationFrame(frame); }
    }, { passive: true });

    document.addEventListener('mouseenter', () => document.documentElement.classList.add('cursor-on'));
    document.addEventListener('mouseleave', () => document.documentElement.classList.remove('cursor-on'));
  }

  function createCaustics() {
    const canvas = document.getElementById('caustics');
    if (!canvas || !canvas.getContext) return null;

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) { canvas.style.display = 'none'; return null; }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    }
    resize();

    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main(){ vUv = (aPos + 1.0)/2.0; gl_Position = vec4(aPos, 0.0, 1.0); }
    `); gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uRes;
      vec2 r2(vec2 p){ return fract(sin(vec2(dot(p,p),dot(p,p*0.9337))) * 43758.545); }
      void main(){
        vec2 uv = vUv;
        float wave = sin(uv.x*12.0 + uTime*1.9) * cos(uv.y*9.0 + uTime*.89);
        float w2 = sin((uv.x+uv.y)*6.0 - uTime*1.1);
        float d = length(uv - uMouse/uRes);
        float glow = 0.032 / (d + 0.04);
        float noise = r2(uv*90.0 + vec2(uTime*0.05)).x * 0.03;
        float caustic = wave*0.12 + w2*0.1 + glow*0.35 + noise;
        gl_FragColor = vec4(vec3(0.06,0.025,0.18) + caustic*0.9, 1.0);
      }
    `); gl.compileShader(fs);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS) || !gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      canvas.style.display = 'none'; return null;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return null; }
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uRes = gl.getUniformLocation(prog, 'uRes');
    gl.uniform2f(uRes, canvas.width, canvas.height);

    let time = 0;
    let mx = canvas.width / 2, my = canvas.height / 2;
    let visible = true, raf = 0;
    let docHidden = () => document.hidden;

    const onMove = (ev) => {
      const r = canvas.getBoundingClientRect();
      mx = (ev.clientX - r.left) * (canvas.width / r.width);
      my = (ev.clientY - r.top) * (canvas.height / r.height);
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    const render = () => {
      raf = requestAnimationFrame(render);
      if (docHidden()) { time += 0.02; return; }
      if (!visible) return;
      time += 0.016;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, isReducedMotion() ? 0 : time);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    canvas.addEventListener('webglcontextlost', (ev) => { ev.preventDefault(); canvas.style.display = 'none'; });
    canvas.addEventListener('webglcontextrestored', () => {
      canvas.style.display = '';
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
    });

    return {
      pause() { visible = false; },
      resume() { visible = true; },
      destroy() { cancelAnimationFrame(raf); }
    };
  }

  // Motion toggle button in the utility strip (declared by each page)
  function setupMotionToggle() {
    const btn = document.getElementById('motion');
    if (!btn) return;
    const update = () => {
      const reduced = isReducedMotion();
      btn.setAttribute('aria-pressed', reduced ? 'true' : 'false');
      btn.hidden = !reduced;
      document.documentElement.classList.toggle('reduced-motion', reduced);
    };
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', update);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const enabling = !document.documentElement.classList.contains('reduced-motion');
      document.documentElement.classList.toggle('reduced-motion', !enabling);
      btn.setAttribute('aria-pressed', enabling ? 'false' : 'true');
    });
    update();
  }

  // Menu tab switcher (declared by menu.html)
  function setupMenuTabs() {
    const tabs = document.querySelectorAll('[data-menu]');
    if (!tabs.length) return;
    const first = tabs[0].closest('.menu-tabs');
    tabs.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      const id = t.dataset.menu;
      document.querySelector(`[data-current="true"]`)?.removeAttribute('data-current');
      t.setAttribute('data-current', 'true');
      document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(id);
      if (panel) panel.classList.add('active');
    }));
  }

  // Gallery lightbox (declared by gallery.html)
  function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const items = Array.from(document.querySelectorAll('[data-lightbox]'));
    if (!items.length) return;
    let index = 0;
    const img = document.getElementById('lightbox-image');
    const cap = document.getElementById('lightbox-caption');
    const count = document.getElementById('lightbox-count');

    const openAt = (i) => {
      index = i;
      const a = items[i];
      img.src = a.href;
      img.alt = a.firstElementChild.alt;
      cap.textContent = a.dataset.caption || a.firstElementChild.alt;
      count.textContent = `${i + 1} / ${items.length}`;
      lightbox.classList.add('open');
      document.getElementById('lightbox-close').focus();
    };
    document.getElementById('lightbox-close').addEventListener('click', () => { lightbox.classList.remove('open'); });
    document.getElementById('lightbox-prev').addEventListener('click', () => { index = (index - 1 + items.length) % items.length; update(); });
    document.getElementById('lightbox-next').addEventListener('click', () => { index = (index + 1) % items.length; update(); });

    const update = () => { const a = items[index]; img.src = a.href; img.alt = a.firstElementChild.alt; cap.textContent = a.dataset.caption || a.firstElementChild.alt; count.textContent = `${index+1}/${items.length}`; };

    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') { lightbox.classList.remove('open'); }
      if (e.key === 'ArrowLeft') { index = (index - 1 + items.length) % items.length; update(); }
      if (e.key === 'ArrowRight') { index = (index + 1) % items.length; update(); }
    });
    items.forEach((a, i) => a.addEventListener('click', (e) => { e.preventDefault(); openAt(i); }));
  }

  // Enquiry draft composer (declared by enquire.html)
  function setupEnquiry() {
    const form = document.getElementById('enquiry-form');
    if (!form) return;
    form.hidden = false;
    const params = new URLSearchParams(location.search);
    const menu = form.elements.menu, occasion = form.elements.occasion;
    const occasionMap = {wedding:'A wedding', party:'A party', work:'A work event'};
    const requested = params.get('menu') || params.get('table');
    if (occasionMap[params.get('occasion')]) occasion.value = occasionMap[params.get('occasion')];
    if ([...menu.options].some(option => option.value === requested)) menu.value = requested;
    else if (params.get('occasion') === 'wedding') menu.value = 'holy';
    else menu.value = 'undecided';
    occasion.addEventListener('change', () => {
      if (occasion.value === 'A wedding' && menu.value === 'undecided') menu.value = 'holy';
    });
    const menuNames = { holy:'Holy Grail of Grazing', grand:'Grand Graze', super:'Super Graze', standard:'Grazing Standard', graze:'Graze Me, Craze Me', other:'Carts/boards/sweets/catering' };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(form);
      const lines = [
        'Hi Tricia,', '',
        `I'd like a quote for ${d.get('occasion').toLowerCase()} on ${d.get('date') || 'a date to be decided'}.`,
        `Guests: ${d.get('guests') || 'to be decided'}. Venue: ${d.get('location') || 'to be decided'}.`,
        `Menu interest: ${menuNames[d.get('menu')] || d.get('menu')}.`, ''
      ];
      const notes = d.get('notes');
      if (notes) lines.push(`Notes: ${notes}`,'');
      lines.push('Please confirm the date, tax and final price. This is a quote request, not a booking.', '', d.get('name') || '');
      const text = lines.join('\n');
      const email = form.dataset.email;
      const phone = form.dataset.phone;
      const subject = encodeURIComponent(`Gathering enquiry from ${d.get('name') || 'a friend'}`);
      const body = encodeURIComponent(text);
      const result = document.getElementById('draft-result');
      result.hidden = false;
      document.getElementById('draft-preview').value = text;
      document.getElementById('draft-email').href = `mailto:${email}?subject=${subject}&body=${body}`;
      document.getElementById('draft-sms').href = `sms:${phone}?body=${subject} — ${encodeURIComponent(text)}`;
      document.getElementById('draft-copy').onclick = () => {
        navigator.clipboard.writeText(text).then(() => {
          const status = document.getElementById('draft-status');
          status.textContent = 'Draft copied to clipboard.';
          setTimeout(() => status.textContent = '', 2500);
        });
      };
    });
  }

  // Init
  const reduce = isReducedMotion();
  let caustics = null;
  if ('WebGLRenderingContext' in window && !reduce && canvasSupported()) {
    caustics = createCaustics();
    if (caustics && 'IntersectionObserver' in window) {
      observeAndPause(caustics);
    }
  }
  createCursor();
  setupMotionToggle();
  setupMenuTabs();
  setupLightbox();
  setupEnquiry();

  function canvasSupported() {
    const c = document.getElementById('caustics');
    return !!(c && c.getContext);
  }
  function observeAndPause(inst) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { inst[ e.isIntersecting ? 'resume' : 'pause' ](); });
    }, { threshold: 0.1 });
    observer.observe(document.getElementById('caustics'));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) inst.pause(); else inst.resume();
    });
  }
})();
