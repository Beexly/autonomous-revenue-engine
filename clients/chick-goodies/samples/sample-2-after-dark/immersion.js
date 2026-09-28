/* ==========================================================================
   CHARCUTERIE CHICK — Lusion-Class Immersion Layer
   Full-screen WebGL transition warp · Dimensional portal system · Scroll snap
   ========================================================================== */
(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────────────────────
  // 1. FULLSCREEN WARP TRANSITION CANVAS (sits between WebGL world and HUD)
  // ──────────────────────────────────────────────────────────────────────────
  const warpCanvas = document.createElement('canvas');
  warpCanvas.id = 'warp-canvas';
  warpCanvas.setAttribute('aria-hidden', 'true');
  warpCanvas.style.cssText = `
    position: fixed; inset: 0; width: 100%; height: 100%;
    z-index: 5; pointer-events: none; display: block;
  `;
  document.body.appendChild(warpCanvas);

  const gl = warpCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) return;

  // ──────────────────────────────────────────────────────────────────────────
  // 2. WARP SHADER PROGRAMS
  //    A: Radial chromatic aberration + vortex lens warp (station transitions)
  //    B: Ambient particle duster (always-on subtle depth)
  // ──────────────────────────────────────────────────────────────────────────
  function compileShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function createProgram(vsSrc, fsSrc) {
    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(prog);
    return prog;
  }

  const QUAD_VS = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
  `;

  // Radial vortex warp — fires on station changes
  const WARP_FS = `
    precision highp float;
    uniform float uProgress;  // 0→1 transition
    uniform float uTime;
    uniform vec2  uResolution;
    uniform vec3  uColorA;    // from-station tint
    uniform vec3  uColorB;    // to-station tint
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5, 0.5);
      vec2 delta = uv - center;
      float dist = length(delta);

      // Warp progress curve — ease in/out
      float p = uProgress;
      float ease = p < 0.5 ? 4.0 * p * p * p : 1.0 - pow(-2.0 * p + 2.0, 3.0) / 2.0;

      // Phase 0→0.5: implosion toward center
      // Phase 0.5→1.0: explosion outward from center
      float phase = ease < 0.5 ? ease * 2.0 : (ease - 0.5) * 2.0;
      float direction = ease < 0.5 ? -1.0 : 1.0;

      // Vortex spin
      float angle = atan(delta.y, delta.x);
      float spin = direction * phase * 3.14159 * 2.5 * (1.0 - dist * 1.4);
      float distWarp = dist + direction * phase * (1.0 - dist) * 0.6;

      // Chromatic aberration ring at warp peak
      float peakNear = 1.0 - abs(ease - 0.5) * 2.0;
      float chromaR = 0.0 + peakNear * 0.018;
      float chromaB = 0.0 - peakNear * 0.012;

      // Film grain
      float grain = (hash(uv + vec2(uTime * 0.1)) - 0.5) * 0.04;

      // Luminous warp ring
      float ring = exp(-pow((dist - 0.5 * peakNear) * 6.0, 2.0)) * peakNear;
      vec3 ringColor = mix(uColorA, uColorB, ease) * 2.2;

      // Alpha: peak brightness at mid-transition, fade out at edges
      float alpha = ring * 0.82 + peakNear * (1.0 - dist * 1.6) * 0.45 + grain * peakNear;
      alpha = clamp(alpha, 0.0, 0.95);

      vec3 col = ringColor + grain;
      gl_FragColor = vec4(col, alpha);
    }
  `;

  // Ambient drift particles (separate tiny program, always running)
  const PARTICLE_VS = `
    attribute float aIndex;
    attribute float aPhase;
    attribute float aSize;
    uniform float uTime;
    uniform vec2 uResolution;
    varying float vAlpha;
    varying vec3 vColor;

    float hash(float n) { return fract(sin(n) * 43758.5453); }

    void main() {
      float idx = aIndex;
      float spd = 0.04 + hash(idx * 7.3) * 0.06;
      float x = hash(idx * 3.7) * 2.0 - 1.0;
      float yBase = hash(idx * 5.1) * 2.0 - 1.0;
      float y = yBase + mod(uTime * spd + aPhase, 2.0) - 1.0;

      // Drift sideways slightly
      x += sin(uTime * 0.3 + aPhase * 6.28) * 0.08;

      gl_Position = vec4(x, y, 0.0, 1.0);
      gl_PointSize = aSize;

      float lifeCycle = mod(uTime * spd + aPhase, 1.0);
      vAlpha = smoothstep(0.0, 0.15, lifeCycle) * smoothstep(1.0, 0.8, lifeCycle) * 0.45;

      // Warm palette: amber, gold, champagne
      float c = hash(idx * 2.1);
      if (c < 0.33) vColor = vec3(1.0, 0.56, 0.15);
      else if (c < 0.66) vColor = vec3(1.0, 0.78, 0.3);
      else vColor = vec3(1.0, 0.93, 0.62);
    }
  `;

  const PARTICLE_FS = `
    precision mediump float;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
      float r = length(gl_PointCoord - vec2(0.5));
      if (r > 0.5) discard;
      float a = smoothstep(0.5, 0.1, r) * vAlpha;
      gl_FragColor = vec4(vColor * 1.4, a);
    }
  `;

  const warpProg = createProgram(QUAD_VS, WARP_FS);
  const particleProg = createProgram(PARTICLE_VS, PARTICLE_FS);

  // Quad buffer (covers full screen)
  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  // Warp uniforms
  const uW = {
    progress:    gl.getUniformLocation(warpProg, 'uProgress'),
    time:        gl.getUniformLocation(warpProg, 'uTime'),
    resolution:  gl.getUniformLocation(warpProg, 'uResolution'),
    colorA:      gl.getUniformLocation(warpProg, 'uColorA'),
    colorB:      gl.getUniformLocation(warpProg, 'uColorB'),
  };
  const aWPos = gl.getAttribLocation(warpProg, 'aPos');

  // Station color palette (warm amber tints per station)
  const STATION_COLORS = [
    [1.0, 0.60, 0.18], // Seed    — honey gold
    [0.88, 0.52, 0.30], // Board   — aged wood
    [1.0, 0.72, 0.15], // Banquet — candlelight
    [0.6,  0.20, 0.05], // Cart    — deep ember
    [0.78, 0.48, 0.28], // Chef    — copper
    [0.94, 0.80, 0.55], // Quote   — champagne
  ];

  // ── Ambient particle setup ──────────────────────────────────────────────
  const PARTICLE_COUNT = 180;
  const pIndexArr  = new Float32Array(PARTICLE_COUNT);
  const pPhaseArr  = new Float32Array(PARTICLE_COUNT);
  const pSizeArr   = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pIndexArr[i]  = i;
    pPhaseArr[i]  = Math.random();
    pSizeArr[i]   = 1.0 + Math.random() * 2.5;
  }
  function makeBuf(arr) {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
    return b;
  }
  const pIdxBuf  = makeBuf(pIndexArr);
  const pPhsBuf  = makeBuf(pPhaseArr);
  const pSzBuf   = makeBuf(pSizeArr);

  const pUniforms = {
    time:       gl.getUniformLocation(particleProg, 'uTime'),
    resolution: gl.getUniformLocation(particleProg, 'uResolution'),
  };
  const aIdx  = gl.getAttribLocation(particleProg, 'aIndex');
  const aPhs  = gl.getAttribLocation(particleProg, 'aPhase');
  const aSz   = gl.getAttribLocation(particleProg, 'aSize');

  // ──────────────────────────────────────────────────────────────────────────
  // 3. TRANSITION STATE MACHINE
  // ──────────────────────────────────────────────────────────────────────────
  let warpProgress   = 1.0;  // 1 = idle (transparent)
  let warpDuration   = 750;  // ms
  let warpStart      = 0;
  let fromStation    = 0;
  let toStation      = 0;
  let isTransitioning = false;

  function triggerWarp(from, to, durationMs = 750) {
    fromStation    = from;
    toStation      = to;
    warpDuration   = durationMs;
    warpStart      = performance.now();
    warpProgress   = 0.0;
    isTransitioning = true;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. RESIZE
  // ──────────────────────────────────────────────────────────────────────────
  function resize() {
    warpCanvas.width  = window.innerWidth  * (window.devicePixelRatio || 1);
    warpCanvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    warpCanvas.style.width  = window.innerWidth  + 'px';
    warpCanvas.style.height = window.innerHeight + 'px';
    gl.viewport(0, 0, warpCanvas.width, warpCanvas.height);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. RENDER LOOP
  // ──────────────────────────────────────────────────────────────────────────
  function draw(ts) {
    requestAnimationFrame(draw);

    const t = ts * 0.001;
    const w = warpCanvas.width;
    const h = warpCanvas.height;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);  // additive blending for glow

    // ── A: Ambient particle drift (always on, subtle) ────────────────────
    gl.useProgram(particleProg);
    gl.uniform1f(pUniforms.time, t);
    gl.uniform2f(pUniforms.resolution, w, h);

    function bindAttr(buf, loc, size) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    bindAttr(pIdxBuf, aIdx, 1);
    bindAttr(pPhsBuf, aPhs, 1);
    bindAttr(pSzBuf,  aSz,  1);
    gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);

    // ── B: Warp transition overlay (only during transitions) ─────────────
    if (isTransitioning) {
      const elapsed = performance.now() - warpStart;
      warpProgress = Math.min(elapsed / warpDuration, 1.0);
      if (warpProgress >= 1.0) {
        isTransitioning = false;
        return;
      }

      gl.useProgram(warpProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(aWPos);
      gl.vertexAttribPointer(aWPos, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(uW.progress, warpProgress);
      gl.uniform1f(uW.time, t);
      gl.uniform2f(uW.resolution, w, h);

      const cA = STATION_COLORS[fromStation] || STATION_COLORS[0];
      const cB = STATION_COLORS[toStation]   || STATION_COLORS[0];
      gl.uniform3fv(uW.colorA, cA);
      gl.uniform3fv(uW.colorB, cB);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
  requestAnimationFrame(draw);

  // ──────────────────────────────────────────────────────────────────────────
  // 6. SCROLL SNAP + KINETIC WHEEL PHYSICS
  //    Intercepts raw wheel events, converts to smooth station snapping
  //    with over-travel bounce and velocity decay.
  // ──────────────────────────────────────────────────────────────────────────
  const TOTAL_STATIONS = 6;
  let snapStation      = 0;
  let snapTarget       = 0;
  let snapVelocity     = 0;
  let snapProgress     = 0;   // 0→1 interpolated within a snap
  let snapLocked       = false;
  let snapLockTimer    = null;
  let lastStation      = 0;

  // Intercept scroll before experience.js handles it to co-ordinate transitions
  window.addEventListener('wheel', (e) => {
    const delta = Math.sign(e.deltaY);
    if (snapLocked) return;

    const candidate = snapStation + delta;
    if (candidate < 0 || candidate >= TOTAL_STATIONS) return;

    // Accumulate velocity; only snap when threshold crossed
    snapVelocity += delta * 0.4;
    scheduleSnap();
  }, { passive: true, capture: true });

  function scheduleSnap() {
    if (snapLockTimer) clearTimeout(snapLockTimer);
    snapLockTimer = setTimeout(() => {
      const direction = Math.sign(snapVelocity);
      if (Math.abs(snapVelocity) > 0.25) {
        snapTo(snapStation + direction);
      }
      snapVelocity = 0;
    }, 80);
  }

  function snapTo(idx) {
    idx = Math.max(0, Math.min(TOTAL_STATIONS - 1, idx));
    if (idx === snapStation) return;

    const prevStation = snapStation;
    snapStation = idx;

    // Fire portal warp on the immersion layer
    triggerWarp(prevStation, idx, 700);

    // Notify the 3D engine (experience.js exposes window.ScrollytellingEngine)
    const engine = window.ScrollytellingEngine || window.TableState;
    if (engine && engine.goTo) {
      engine.goTo(idx);
    }

    // Lock scrolling briefly so multi-wheel events don't stack
    snapLocked = true;
    setTimeout(() => { snapLocked = false; }, 900);
  }

  // Listen to the engine's own chapter change events (nav clicks, CTA links)
  window.addEventListener('chapterChange', (e) => {
    const idx = e.detail && e.detail.chapterIndex;
    if (typeof idx === 'number' && idx !== snapStation) {
      triggerWarp(snapStation, idx, 700);
      snapStation = idx;
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. CURSOR DISTORTION RING (SVG overlay that warps near pointer)
  // ──────────────────────────────────────────────────────────────────────────
  const cursorSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  cursorSvg.setAttribute('aria-hidden', 'true');
  cursorSvg.style.cssText = `
    position: fixed; inset: 0; width: 100%; height: 100%;
    z-index: 6; pointer-events: none; overflow: visible;
  `;
  const cursorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  cursorCircle.setAttribute('r', '22');
  cursorCircle.setAttribute('fill', 'none');
  cursorCircle.setAttribute('stroke', 'rgba(226,167,126,0.55)');
  cursorCircle.setAttribute('stroke-width', '1.2');
  const cursorInner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  cursorInner.setAttribute('r', '3');
  cursorInner.setAttribute('fill', 'rgba(226,167,126,0.9)');
  cursorSvg.appendChild(cursorCircle);
  cursorSvg.appendChild(cursorInner);
  document.body.appendChild(cursorSvg);

  let curX = -100, curY = -100, tarX = -100, tarY = -100;
  let curScale = 1.0, tarScale = 1.0;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      tarX = e.clientX;
      tarY = e.clientY;
    }, { passive: true });

    window.addEventListener('pointerdown', () => { tarScale = 0.55; });
    window.addEventListener('pointerup',   () => { tarScale = 1.0; });

    // Cursor expand on interactive elements
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest('button, a, input, label, .tier-pill, .tier-card')) {
        tarScale = 1.8;
      }
    });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest('button, a, input, label, .tier-pill, .tier-card')) {
        tarScale = 1.0;
      }
    });

    function animateCursor() {
      requestAnimationFrame(animateCursor);
      curX += (tarX - curX) * 0.12;
      curY += (tarY - curY) * 0.12;
      curScale += (tarScale - curScale) * 0.15;

      const cx = curX.toFixed(1), cy = curY.toFixed(1);
      cursorCircle.setAttribute('cx', cx);
      cursorCircle.setAttribute('cy', cy);
      cursorCircle.setAttribute('transform', `scale(${curScale})`);
      cursorCircle.setAttribute('transform-origin', `${cx} ${cy}`);
      cursorInner.setAttribute('cx', cx);
      cursorInner.setAttribute('cy', cy);
    }
    animateCursor();
  } else {
    // Touch — hide cursor SVG
    cursorSvg.style.display = 'none';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8. HOLD-TO-ENTER PORTAL MECHANIC (Station 0 "Watch It Grow" CTA)
  // ──────────────────────────────────────────────────────────────────────────
  // Visual: SVG ring fills around the button while held.
  // Physics: engine scales stage0 toward camera (holdPortalActive flag).
  // Completion: warp fires automatically after 850ms hold.
  function setupHoldPortal() {
    // The first CTA in ch-0 — "Watch It Grow / EXPLORE ↗"
    const cta = document.querySelector('#ch-0 .cta-ticket');
    if (!cta) return;

    // Build SVG ring overlay inside the button
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = `
      position:absolute;inset:0;width:100%;height:100%;
      pointer-events:none;overflow:visible;
    `;
    const circPath = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circPath.setAttribute('cx', '50%');
    circPath.setAttribute('cy', '50%');
    circPath.setAttribute('r', '46%');
    circPath.setAttribute('fill', 'none');
    circPath.setAttribute('stroke', 'rgba(255,255,255,0.25)');
    circPath.setAttribute('stroke-width', '2');
    const circFill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circFill.setAttribute('cx', '50%');
    circFill.setAttribute('cy', '50%');
    circFill.setAttribute('r', '46%');
    circFill.setAttribute('fill', 'none');
    circFill.setAttribute('stroke', '#fdf8f0');
    circFill.setAttribute('stroke-width', '2.5');
    circFill.setAttribute('stroke-linecap', 'round');
    // Will be animated via stroke-dasharray
    svg.appendChild(circPath);
    svg.appendChild(circFill);
    cta.style.position = 'relative';
    cta.style.overflow = 'visible';
    cta.appendChild(svg);

    // Compute circumference dynamically after layout
    let circumference = 1;
    let rafId = null;
    let holdStart = null;
    const HOLD_DURATION = 850;

    function getCircumference() {
      const r = circFill.getAttribute('r');
      const rect = cta.getBoundingClientRect();
      const radius = (parseFloat(r) / 100) * Math.min(rect.width, rect.height) / 2;
      return 2 * Math.PI * radius;
    }

    function setRingProgress(p) {
      if (circumference === 1) circumference = getCircumference();
      const offset = circumference * (1 - p);
      circFill.setAttribute('stroke-dasharray', circumference);
      circFill.setAttribute('stroke-dashoffset', offset);
      circFill.setAttribute('transform',
        `rotate(-90, ${cta.getBoundingClientRect().width/2}, ${cta.getBoundingClientRect().height/2})`);
    }

    function tickHold(ts) {
      if (!holdStart) return;
      const elapsed = ts - holdStart;
      const p = Math.min(elapsed / HOLD_DURATION, 1.0);
      setRingProgress(p);

      const eng = window.ScrollytellingEngine || window.TableState;
      if (p >= 1.0) {
        // Completed — fire portal warp
        cancelHold();
        if (eng && eng.stopHoldPortal) eng.stopHoldPortal();
        if (window.ImmersionLayer) {
          window.ImmersionLayer.triggerWarp(0, 1, 650);
          window.ImmersionLayer.snapTo(1);
        }
        return;
      }
      rafId = requestAnimationFrame(tickHold);
    }

    function beginHold() {
      if (snapStation !== 0) return;
      holdStart = performance.now();
      circumference = getCircumference();
      const eng = window.ScrollytellingEngine || window.TableState;
      if (eng && eng.startHoldPortal) eng.startHoldPortal();
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tickHold);
    }

    function cancelHold() {
      holdStart = null;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      setRingProgress(0);
      const eng = window.ScrollytellingEngine || window.TableState;
      if (eng && eng.stopHoldPortal) eng.stopHoldPortal();
    }

    cta.addEventListener('pointerdown', beginHold);
    cta.addEventListener('pointerup',   cancelHold);
    cta.addEventListener('pointerleave',cancelHold);
    // Prevent default data-goto click from interfering while held
    cta.addEventListener('click', (e) => {
      if (holdStart !== null) { e.stopImmediatePropagation(); }
    }, true);
  }

  // Wait for engine to be ready, then wire up
  setTimeout(setupHoldPortal, 600);

  // ──────────────────────────────────────────────────────────────────────────
  // 9. QUOTE COUNT-UP REVEAL (Station 5)
  //    When chapter 5 becomes active, all dollar values count up from $0
  //    with a cinematic elastic easing curve.
  // ──────────────────────────────────────────────────────────────────────────
  const COUNT_UP_TARGETS = [
    { id: 'rcpt-tier-subtotal', prefix: '$', decimals: 2 },
    { id: 'rcpt-addons-subtotal', prefix: '$', decimals: 2 },
    { id: 'rcpt-tax',   prefix: '$', decimals: 2 },
    { id: 'rcpt-total', prefix: '$', decimals: 2 },
  ];

  function parseValue(el) {
    if (!el) return 0;
    const raw = el.textContent.replace(/[^0-9.]/g, '');
    return parseFloat(raw) || 0;
  }

  function easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  function countUpEl(el, endVal, duration, prefix, decimals) {
    if (!el) return;
    const start = performance.now();
    function tick(ts) {
      const p = Math.min((ts - start) / duration, 1.0);
      const eased = easeOutElastic(p);
      const cur = eased * endVal;
      el.textContent = prefix + cur.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      if (p < 1.0) requestAnimationFrame(tick);
      else el.textContent = prefix + endVal.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
    requestAnimationFrame(tick);
  }

  function triggerQuoteCountUp() {
    const DURATION = 1400;
    COUNT_UP_TARGETS.forEach(({ id, prefix, decimals }, i) => {
      const el = document.getElementById(id);
      if (!el || el.closest('[style*="display:none"]')) return;
      const endVal = parseValue(el);
      setTimeout(() => countUpEl(el, endVal, DURATION, prefix, decimals), i * 80);
    });
    // Also animate the total value with a big dramatic reveal
    const totalEl = document.getElementById('rcpt-total');
    if (totalEl) {
      const endVal = parseValue(totalEl);
      totalEl.style.transform = 'scale(1.0)';
      totalEl.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => {
        countUpEl(totalEl, endVal, DURATION + 200, '$', 2);
        totalEl.style.transform = 'scale(1.04)';
        setTimeout(() => { totalEl.style.transform = 'scale(1.0)'; }, 700);
      }, 300);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 10. ENTRANCE ANIMATION — chapter text slides up, chapters bloom in
  // ──────────────────────────────────────────────────────────────────────────
  // Add stagger entrance class helper — called by experience.js chapter change
  function entranceChapter(idx) {
    const chapters = document.querySelectorAll('.chapter');
    const ch = chapters[idx];
    if (!ch) return;
    ch.classList.remove('ch-entering');
    void ch.offsetWidth; // force reflow
    ch.classList.add('ch-entering');
  }

  window.addEventListener('chapterChange', (e) => {
    if (e.detail && typeof e.detail.chapterIndex === 'number') {
      const idx = e.detail.chapterIndex;
      setTimeout(() => entranceChapter(idx), 200);
      // Station 5: fire cinematic quote count-up
      if (idx === 5) {
        setTimeout(triggerQuoteCountUp, 520);
      }
    }
  });

  // Expose public API
  window.ImmersionLayer = { triggerWarp, snapTo };
})();
