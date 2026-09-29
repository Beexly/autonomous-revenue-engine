/**
 * Charcuterie Chick — Single-Pass WebGL Fluid Displacement & Caustics Engine
 * Architecture: Zero FBOs, zero 3D primitives, zero readPixels calls.
 * Native 60fps single-pass fragment shader with dynamic video cross-fading,
 * velocity-injected fluid ripples, and 2400K cursor point lighting.
 */

(function () {
  'use strict';

  // --- Performance & Environment Guards ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function getClampedDPR() {
    const dpr = window.devicePixelRatio || 1;
    return window.innerWidth < 900 ? Math.min(dpr, 1.15) : Math.min(dpr, 1.5);
  }

  // Act-to-Video Mapping (using verified repo assets)
  const ACT_VIDEOS = {
    'prologue': 'img/micro-seed-720p.mp4',
    'act1':     'img/micro-seed-720p.mp4',
    'act2':     '', // Handled by 320vw DOM video in .table-run
    'act3':     'img/cart-cinematic-720p.mp4',
    'epilogue': ''
  };

  // Lighting & Substrate Presets per Act
  const ACT_LIGHTS = {
    'prologue': { lightIntensity: 0.85, tint: [0.05, 0.04, 0.05] }, // 3000K dark kitchen
    'act1':     { lightIntensity: 0.00, tint: [0.98, 0.96, 0.94] }, // 5600K flat daylight (light turns off)
    'act2':     { lightIntensity: 0.65, tint: [0.09, 0.07, 0.06] }, // Dusk festoon
    'act3':     { lightIntensity: 1.00, tint: [0.05, 0.04, 0.05] }, // 2700K Edison bulbs (maximum warmth)
    'epilogue': { lightIntensity: 0.00, tint: [0.91, 0.92, 0.93] }  // 5000K morning cool-gray
  };

  const canvas = document.getElementById('layer-webgl');
  if (!canvas) {
    console.warn('[ShaderEngine] Canvas #layer-webgl not found.');
    return;
  }

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false
  });

  if (!gl) {
    console.warn('[ShaderEngine] WebGL unsupported. Falling back to CSS media layer.');
    return;
  }

  // --- GLSL Shaders ---
  const vsSource = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    varying vec2 v_uv;

    uniform vec2 u_resolution;
    uniform vec2 u_video_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_light_intensity;
    uniform vec3 u_ambient_tint;

    // Up to 8 active ripple drops (x, y, birthTime, strength)
    uniform vec4 u_drops[8];
    uniform int u_drop_count;

    uniform sampler2D u_tex_current;
    uniform sampler2D u_tex_prev;
    uniform float u_crossfade;
    uniform float u_has_video;
    uniform float u_video_opacity;

    void main() {
      // 1. Aspect Ratio Correction (Cover fit)
      vec2 st = gl_FragCoord.xy / u_resolution;
      float screenAspect = u_resolution.x / u_resolution.y;
      float videoAspect = (u_video_resolution.x > 0.0) ? (u_video_resolution.x / u_video_resolution.y) : (16.0 / 9.0);
      
      vec2 uv = st;
      if (screenAspect > videoAspect) {
        float scale = videoAspect / screenAspect;
        uv.y = (st.y - 0.5) * scale + 0.5;
      } else {
        float scale = screenAspect / videoAspect;
        uv.x = (st.x - 0.5) * scale + 0.5;
      }
      uv.y = 1.0 - uv.y; // Flip Y for WebGL texture orientation

      // 2. Fluid Displacement Waves & Caustic Highlights
      vec2 displacement = vec2(0.0);
      float caustic = 0.0;

      for (int i = 0; i < 8; i++) {
        if (i >= u_drop_count) break;
        vec4 drop = u_drops[i];
        float age = u_time - drop.z;
        if (age >= 0.0 && age < 1.8) {
          vec2 toFrag = (st - drop.xy);
          toFrag.x *= screenAspect;
          float d = length(toFrag);
          
          // Sinusoidal propagating ring
          float waveRadius = age * 0.65;
          float distToWave = abs(d - waveRadius);
          
          if (distToWave < 0.25) {
            float envelope = exp(-distToWave * 18.0) * exp(-age * 2.2) * drop.w;
            float wave = sin(distToWave * 45.0 - age * 12.0) * envelope;
            vec2 dir = normalize(toFrag + vec2(0.0001));
            displacement += dir * wave * 0.035;
            caustic += max(0.0, wave * 2.5);
          }
        }
      }

      vec2 distortedUV = clamp(uv + displacement, 0.0, 1.0);

      // 3. Texture Sampling with Cross-fade
      vec4 colCurrent = texture2D(u_tex_current, distortedUV);
      vec4 colPrev = texture2D(u_tex_prev, distortedUV);
      vec4 baseColor = mix(colPrev, colCurrent, u_crossfade);

      if (u_has_video < 0.5) {
        baseColor = vec4(u_ambient_tint, 1.0);
      } else {
        // Blend dynamically with ambient substrate tint based on u_video_opacity
        float op = clamp(u_video_opacity, 0.0, 1.0);
        baseColor.rgb = mix(u_ambient_tint, baseColor.rgb, op * 0.88);
      }

      // 4. Amber Caustic Light Sheen on Ripple Crests
      vec3 amberCaustic = vec3(1.0, 0.82, 0.45) * caustic * 0.45;
      baseColor.rgb += amberCaustic;

      // 5. 2400K Warm Cursor Point Light (on dark grounds)
      if (u_light_intensity > 0.01) {
        vec2 mouseCoord = u_mouse / u_resolution;
        vec2 toLight = (st - mouseCoord);
        toLight.x *= screenAspect;
        float lightDist = length(toLight);
        float atten = exp(-lightDist * lightDist * 3.5) * u_light_intensity;
        vec3 pointLightColor = vec3(1.0, 0.54, 0.14) * atten * 0.42;
        baseColor.rgb += pointLightColor;
      }

      gl_FragColor = vec4(baseColor.rgb, 1.0);
    }
  `;

  // Shader Compiler
  function createShader(gl, type, source) {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[ShaderEngine] Shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('[ShaderEngine] Program link error:', gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Full-screen Quad Buffer
  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1
  ]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniform Locations
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uVidRes = gl.getUniformLocation(program, 'u_video_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uLightIntensity = gl.getUniformLocation(program, 'u_light_intensity');
  const uAmbientTint = gl.getUniformLocation(program, 'u_ambient_tint');
  const uDropCount = gl.getUniformLocation(program, 'u_drop_count');
  const uCrossfade = gl.getUniformLocation(program, 'u_crossfade');
  const uHasVideo = gl.getUniformLocation(program, 'u_has_video');
  const uTexCurrent = gl.getUniformLocation(program, 'u_tex_current');
  const uTexPrev = gl.getUniformLocation(program, 'u_tex_prev');
  const uVideoOpacity = gl.getUniformLocation(program, 'u_video_opacity');

  const uDropLocs = [];
  for (let i = 0; i < 8; i++) {
    uDropLocs.push(gl.getUniformLocation(program, `u_drops[${i}]`));
  }

  // --- Video Texture Management ---
  const videoElements = {};
  const videoTextures = {};

  function initVideo(key, src) {
    if (!src) return null;
    if (videoElements[key]) return videoElements[key];

    const v = document.createElement('video');
    v.src = src;
    v.crossOrigin = 'anonymous';
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.preload = 'auto';

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Initial 1x1 black placeholder
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([13, 11, 12, 255]));

    v.addEventListener('canplay', () => {
      v.play().catch(() => {});
    });

    videoElements[key] = v;
    videoTextures[key] = tex;
    return v;
  }

  // Preload video loops
  Object.keys(ACT_VIDEOS).forEach(k => {
    if (ACT_VIDEOS[k]) initVideo(k, ACT_VIDEOS[k]);
  });

  // State Management
  let currentAct = document.documentElement.getAttribute('data-act') || 'prologue';
  let prevAct = currentAct;
  let crossfadeStartTime = 0;
  const CROSSFADE_DURATION = 900; // ms

  let currentLight = ACT_LIGHTS[currentAct]?.lightIntensity ?? 0.85;
  let targetLight = currentLight;
  let currentTint = ACT_LIGHTS[currentAct]?.tint ?? [0.05, 0.04, 0.05];
  let targetTint = [...currentTint];

  // Mouse & Fluid Drops
  let mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
  let targetMouse = { x: mouse.x, y: mouse.y };
  let lastMouse = { x: mouse.x, y: mouse.y };
  let lastMoveTime = performance.now();

  const drops = []; // max 8 drops: [normX, normY, birthTimeSec, strength]

  function addDrop(nx, ny, strength) {
    if (prefersReducedMotion) return;
    const nowSec = (performance.now() - startTime) * 0.001;
    drops.unshift([nx, ny, nowSec, Math.min(strength, 1.0)]);
    if (drops.length > 8) drops.pop();
  }

  window.addEventListener('pointermove', (e) => {
    targetMouse.x = e.clientX;
    targetMouse.y = e.clientY;

    const now = performance.now();
    const dt = now - lastMoveTime;
    if (dt > 35) { // Throttle drop injection to ~28Hz
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      if (speed > 12) {
        const nx = e.clientX / window.innerWidth;
        const ny = 1.0 - (e.clientY / window.innerHeight);
        addDrop(nx, ny, Math.min(speed / 60.0, 1.0));
      }
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
      lastMoveTime = now;
    }
  }, { passive: true });

  // Handle data-act changes via MutationObserver
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.attributeName === 'data-act') {
        const newAct = document.documentElement.getAttribute('data-act') || 'prologue';
        if (newAct !== currentAct) {
          prevAct = currentAct;
          currentAct = newAct;
          crossfadeStartTime = performance.now();

          // Sync lighting target
          targetLight = ACT_LIGHTS[currentAct]?.lightIntensity ?? 0.0;
          targetTint = ACT_LIGHTS[currentAct]?.tint ?? [0.05, 0.04, 0.05];

          // Ensure video plays
          if (videoElements[currentAct]) {
            videoElements[currentAct].play().catch(() => {});
          }
        }
      }
    }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-act'] });

  // Resize Handler with Clamped DPR
  function resize() {
    const dpr = getClampedDPR();
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Lifecycle & Animation Loop
  let isRunning = true;
  let startTime = performance.now();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      Object.values(videoElements).forEach(v => v.pause());
    } else {
      isRunning = true;
      if (videoElements[currentAct]) videoElements[currentAct].play().catch(() => {});
      requestAnimationFrame(render);
    }
  });

  function render(now) {
    if (!isRunning) return;

    const t = (now - startTime) * 0.001;

    // Smooth cursor interpolation
    mouse.x += (targetMouse.x - mouse.x) * 0.12;
    mouse.y += (targetMouse.y - mouse.y) * 0.12;

    // Smooth lighting transition
    currentLight += (targetLight - currentLight) * 0.05;
    currentTint[0] += (targetTint[0] - currentTint[0]) * 0.05;
    currentTint[1] += (targetTint[1] - currentTint[1]) * 0.05;
    currentTint[2] += (targetTint[2] - currentTint[2]) * 0.05;

    // Cross-fade calculation
    let cf = 1.0;
    if (crossfadeStartTime > 0) {
      cf = Math.min((now - crossfadeStartTime) / CROSSFADE_DURATION, 1.0);
    }

    gl.useProgram(program);

    // Update Uniforms
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    const dpr = getClampedDPR();
    gl.uniform2f(uMouse, mouse.x * dpr, (window.innerHeight - mouse.y) * dpr);
    gl.uniform1f(uLightIntensity, currentLight);
    gl.uniform3fv(uAmbientTint, currentTint);
    gl.uniform1f(uCrossfade, cf);

    // Active Video Resolution
    const curVid = videoElements[currentAct];
    const prevVid = videoElements[prevAct];
    const hasVid = (curVid && ACT_VIDEOS[currentAct]) ? 1.0 : 0.0;
    gl.uniform1f(uHasVideo, hasVid);

    // Read act scroll progress and update video opacity & scrubbing
    const pVal = parseFloat(document.documentElement.style.getPropertyValue('--p')) || 0;

    let videoOp = 1.0;
    if (currentAct === 'act1') {
      // Camera lifts out of fig seed and fades cleanly into unbleached linen paper
      videoOp = Math.max(0.0, 1.0 - Math.min(1.0, Math.max(0.0, (pVal - 0.12) / 0.42)));
    }
    gl.uniform1f(uVideoOpacity, videoOp);

    // Scrub active video on scroll for Prologue and Act 3
    if (curVid && curVid.duration && !curVid.seeking && (currentAct === 'prologue' || currentAct === 'act3')) {
      const targetTime = curVid.duration * pVal;
      if (Math.abs(curVid.currentTime - targetTime) > 0.08) {
        curVid.currentTime = targetTime;
      }
    }

    if (curVid && curVid.videoWidth > 0) {
      gl.uniform2f(uVidRes, curVid.videoWidth, curVid.videoHeight);
    } else {
      gl.uniform2f(uVidRes, 1280, 720);
    }

    // Update Video Texture Units
    gl.activeTexture(gl.TEXTURE0);
    if (curVid && curVid.readyState >= 2) {
      gl.bindTexture(gl.TEXTURE_2D, videoTextures[currentAct]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, curVid);
    }
    gl.uniform1i(uTexCurrent, 0);

    gl.activeTexture(gl.TEXTURE1);
    if (prevVid && prevVid.readyState >= 2 && cf < 1.0) {
      gl.bindTexture(gl.TEXTURE_2D, videoTextures[prevAct]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, prevVid);
    }
    gl.uniform1i(uTexPrev, 1);

    // Upload Fluid Drops
    gl.uniform1i(uDropCount, drops.length);
    for (let i = 0; i < drops.length; i++) {
      gl.uniform4f(uDropLocs[i], drops[i][0], drops[i][1], drops[i][2], drops[i][3]);
    }

    // Draw Single Quad
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  // Start Engine
  requestAnimationFrame(render);
  console.log('[ShaderEngine] High-performance 2.5D displacement shader active (60fps clamped).');
})();
