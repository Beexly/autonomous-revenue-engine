/* Charcuterie Chick — Haute Couture 3D Scrollytelling Experience
 * Milestone 1: Core WebGL Engine, Custom GLSL Shaders & Dual-Kawase Bloom
 * Three.js r170 ESM. Zero-build static architecture.
 */

import * as THREE from './vendor/three.module.js';
import { DualKawaseBloom } from './vendor/DualKawaseBloom.js';

(function () {
  'use strict';

  // --- Clamped DPR Helper (F10) ---
  function getClampedDPR() {
    const dpr = window.devicePixelRatio || 1;
    const isMobile = window.innerWidth < 900;
    return isMobile ? Math.min(dpr, 1.15) : Math.min(dpr, 1.5);
  }

  // --- DOM Elements ---
  const canvas = document.getElementById('webgl-canvas');
  const chapters = Array.from(document.querySelectorAll('.chapter'));
  const navBtns = Array.from(document.querySelectorAll('.nav-station'));
  const railBar = document.getElementById('rail-bar');
  const railText = document.getElementById('rail-text');
  const btnAudio = document.getElementById('btn-audio');

  // 3D Spatial HUD Elements
  const hudTooltip = document.getElementById('hud-tooltip');
  const hudTitle = document.getElementById('hud-title');
  const hudDesc = document.getElementById('hud-desc');
  const hudBadge = document.getElementById('hud-badge');
  const hudLine = document.getElementById('hud-line');
  const hudReticle = document.getElementById('hud-reticle');

  if (!canvas) {
    console.error('[CharcuterieChick Engine] WebGL canvas not found');
    return;
  }

  // =========================================================================
  // 1. VIDEO TEXTURE LIFECYCLE MANAGER & IN-SHADER BLEND (F09)
  // =========================================================================
  class VideoTextureManager {
    constructor() {
      this.videoElements = {};
      this.videoTextures = {};
      this.currentKey = null;
      this.targetKey = null;
      this.transitionProgress = 1.0;
      this.startTime = 0;
      this.duration = 1000;
    }

    loadStream(key, url) {
      if (this.videoElements[key]) return this.videoTextures[key];

      const video = document.createElement('video');
      video.src = url;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';

      video.play().catch(() => {});

      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;

      this.videoElements[key] = video;
      this.videoTextures[key] = texture;
      return texture;
    }

    getTexture(key) {
      return this.videoTextures[key] || null;
    }

    transitionTo(targetKey, durationMs = 1100) {
      if (this.currentKey === targetKey && this.transitionProgress >= 1.0) return;
      if (!this.currentKey) {
        this.currentKey = targetKey;
        this.targetKey = targetKey;
        this.transitionProgress = 1.0;
        if (this.videoElements[targetKey]) {
          this.videoElements[targetKey].play().catch(() => {});
        }
        return;
      }
      this.targetKey = targetKey;
      if (this.videoElements[targetKey]) {
        this.videoElements[targetKey].play().catch(() => {});
      }
      this.transitionProgress = 0.0;
      this.startTime = performance.now();
      this.duration = durationMs;
    }

    update() {
      if (this.transitionProgress < 1.0) {
        const now = performance.now();
        this.transitionProgress = Math.min(1.0, (now - this.startTime) / this.duration);
        if (this.transitionProgress >= 1.0) {
          this.currentKey = this.targetKey;
        }
      }
      return this.transitionProgress;
    }

    wakeAll() {
      Object.values(this.videoElements).forEach(v => {
        if (v && v.paused) v.play().catch(() => {});
      });
    }
  }

  function createVideoBlendMaterial(texA, texB) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexA: { value: texA },
        uTexB: { value: texB },
        uProgress: { value: 0.0 },
        uTime: { value: 0.0 },
        uVignetteStrength: { value: 0.42 }
      },
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z -= pow(uv.x - 0.5, 2.0) * 1.8;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uTexA;
        uniform sampler2D uTexB;
        uniform float uProgress;
        uniform float uTime;
        uniform float uVignetteStrength;
        varying vec2 vUv;

        void main() {
          float chromaOffset = sin(uProgress * 3.14159265) * 0.012;
          vec2 uvR = vUv + vec2(chromaOffset, 0.0);
          vec2 uvB = vUv - vec2(chromaOffset, 0.0);

          vec4 colA = vec4(
            texture2D(uTexA, uvR).r,
            texture2D(uTexA, vUv).g,
            texture2D(uTexA, uvB).b,
            1.0
          );

          vec4 colB = vec4(
            texture2D(uTexB, uvR).r,
            texture2D(uTexB, vUv).g,
            texture2D(uTexB, uvB).b,
            1.0
          );

          float lumB = dot(colB.rgb, vec3(0.299, 0.587, 0.114));
          float threshold = uProgress * 1.3 - 0.15;
          float mask = smoothstep(threshold - 0.15, threshold + 0.15, lumB + (vUv.x * 0.2 - 0.1));

          float edge = exp(-pow((lumB - threshold) * 8.0, 2.0));
          vec3 edgeGlow = vec3(1.0, 0.68, 0.18) * edge * 2.2 * sin(uProgress * 3.14159265);

          vec3 mixedColor = mix(colA.rgb, colB.rgb, mask) + edgeGlow;

          float vig = 1.0 - length(vUv - 0.5) * uVignetteStrength;
          vec3 graded = mix(vec3(0.08, 0.04, 0.03), mixedColor, clamp(vig, 0.0, 1.0));

          gl_FragColor = vec4(graded, 1.0);
        }
      `
    });
  }

  // =========================================================================
  // 2. KINETIC MESH DEFORMATION SHADERS (F05)
  // =========================================================================

  // A. Texas Wildflower Honey Viscosity & Micro-Droplet Material
  function createHoneyViscosityMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHoneyColor: { value: new THREE.Color(0xfba818) },
        uDeepAmber: { value: new THREE.Color(0x5a2004) },
        uRimColor: { value: new THREE.Color(0xffe89e) },
        uLightPos: { value: new THREE.Vector3(5.0, 12.0, 8.0) },
        uCursorLightPos: { value: new THREE.Vector3(0, 0, 3) },
        uViscosity: { value: 1.0 },
        uRoughness: { value: 0.12 },
        uRefractionIndex: { value: 1.53 }
      },
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uViscosity;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise2D(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          float rippleA = sin(pos.x * 6.5 + uTime * 1.4) * cos(pos.z * 6.5 + uTime * 1.1);
          float rippleB = noise2D(pos.xz * 4.0 + vec2(uTime * 0.25, uTime * 0.18)) - 0.5;
          float displacement = (rippleA * 0.02 + rippleB * 0.04) * uViscosity;

          pos += normal * displacement;

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * normal);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uHoneyColor;
        uniform vec3 uDeepAmber;
        uniform vec3 uRimColor;
        uniform vec3 uLightPos;
        uniform vec3 uCursorLightPos;
        uniform float uRoughness;
        uniform float uRefractionIndex;
        uniform float uTime;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);

          vec3 L = normalize(uLightPos - vWorldPosition);
          vec3 H = normalize(L + V);

          vec3 L_cursor = normalize(uCursorLightPos - vWorldPosition);
          vec3 H_cursor = normalize(L_cursor + V);
          float distCursor = length(uCursorLightPos - vWorldPosition);
          float cursorAtten = 1.0 / (1.0 + 0.18 * distCursor * distCursor);

          float F0 = pow((uRefractionIndex - 1.0) / (uRefractionIndex + 1.0), 2.0);
          float NdotV = clamp(dot(N, V), 0.0, 1.0);
          float fresnel = F0 + (1.0 - F0) * pow(1.0 - NdotV, 4.5);

          float NdotH = max(dot(N, H), 0.0);
          float specKey = pow(NdotH, 140.0) * 3.2;

          float NdotH_cur = max(dot(N, H_cursor), 0.0);
          float specCursor = pow(NdotH_cur, 90.0) * 2.5 * cursorAtten;

          float opticalDepth = smoothstep(0.0, 1.0, 1.0 - abs(dot(N, vec3(0.0, 1.0, 0.0))));
          vec3 absorption = mix(uHoneyColor, uDeepAmber, opticalDepth * 0.88);

          float backScatter = pow(max(dot(V, -L), 0.0), 2.5) * 0.7;
          vec3 sssColor = uHoneyColor * (backScatter + 0.35);

          vec3 baseColor = absorption + sssColor;
          vec3 specularHighlights = (vec3(specKey) + vec3(specCursor) * vec3(1.0, 0.85, 0.6)) * uRimColor;
          vec3 finalColor = mix(baseColor, uRimColor, fresnel * 0.65) + specularHighlights;

          gl_FragColor = vec4(finalColor, 0.94);
        }
      `
    });
  }

  // B. Prosciutto Ribbon Kinetic Undulation Material
  function createProsciuttoRibbonMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollSpeed: { value: 0 },
        uLeanColor: { value: new THREE.Color(0xb82e38) },
        uFatColor: { value: new THREE.Color(0xf5eedc) },
        uSheenColor: { value: new THREE.Color(0xffd1ba) },
        uLightPos: { value: new THREE.Vector3(5.0, 12.0, 8.0) }
      },
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uScrollSpeed;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float wavePhase = uv.x * 7.5 + uTime * 1.5 + uScrollSpeed * 12.0;
          float ribbonFoldZ = sin(wavePhase) * 0.085 + cos(uv.y * 5.2 - uTime * 0.7) * 0.045;
          float ribbonFoldY = cos(wavePhase * 0.6) * 0.03;

          pos.z += ribbonFoldZ;
          pos.y += ribbonFoldY;

          float dZdx = cos(wavePhase) * 7.5 * 0.085;
          vec3 tangent = normalize(vec3(1.0, 0.0, dZdx));
          vec3 bitangent = vec3(0.0, 1.0, 0.0);
          vec3 calculatedNormal = normalize(cross(tangent, bitangent));

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * calculatedNormal);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uLeanColor;
        uniform vec3 uFatColor;
        uniform vec3 uSheenColor;
        uniform vec3 uLightPos;
        uniform float uTime;

        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        varying vec2 vUv;

        float hash1(vec2 p) {
          return fract(sin(dot(p, vec2(41.1, 289.7))) * 45758.5453);
        }

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewPosition);
          vec3 L = normalize(uLightPos - vWorldPosition);

          float striation = sin(vUv.x * 48.0 + sin(vUv.y * 18.0) * 3.5);
          float microGrain = hash1(floor(vUv * vec2(280.0, 40.0))) * 0.12;
          float fatMask = smoothstep(0.35, 0.65, striation + microGrain);

          vec3 albedo = mix(uLeanColor, uFatColor, fatMask);

          vec3 fiberTangent = normalize(vec3(1.0, 0.0, 0.0));
          vec3 H = normalize(L + V);
          float dotTH = dot(fiberTangent, H);
          float anisoSin = sqrt(max(0.0, 1.0 - dotTH * dotTH));
          float anisoSpec = pow(anisoSin, 24.0) * 1.8;

          float backScatter = pow(max(dot(V, -L), 0.0), 3.0) * 0.55;
          vec3 diffuse = albedo * (max(dot(N, L), 0.0) + 0.32) + (uLeanColor * backScatter);

          vec3 color = diffuse + uSheenColor * anisoSpec;
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
  }

  // C. Kinetic Relief Portal Material (Centerpiece Displays)
  function createReliefPortalMaterial(texture, opts = {}) {
    return new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: texture },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uScrollSpeed: { value: 0 },
        uLightPos: { value: new THREE.Vector3(5.0, 12.0, 8.0) },
        uCursorLightPos: { value: new THREE.Vector3(0, 0, 3) },
        uReliefScale: { value: opts.reliefScale || 0.06 }
      },
      vertexShader: /* glsl */ `
        uniform vec2 uPointer;
        uniform float uScrollSpeed;
        uniform float uReliefScale;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float dome = (1.0 - 4.0 * pow(uv.x - 0.5, 2.0)) * (1.0 - 4.0 * pow(uv.y - 0.5, 2.0));
          pos.z += max(0.0, dome) * uReliefScale;

          vec2 pDist = uv - (uPointer * 0.5 + 0.5);
          pos.z -= length(pDist) * 0.035;

          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          vec4 mvPosition = viewMatrix * worldPos;
          vViewPosition = -mvPosition.xyz;
          vNormal = normalize(normalMatrix * normal);

          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D uMap;
        uniform vec3 uLightPos;
        uniform vec3 uCursorLightPos;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          float texel = 1.0 / 1024.0;
          float lumL = dot(texture2D(uMap, vUv - vec2(texel, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
          float lumR = dot(texture2D(uMap, vUv + vec2(texel, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
          float lumD = dot(texture2D(uMap, vUv - vec2(0.0, texel)).rgb, vec3(0.299, 0.587, 0.114));
          float lumU = dot(texture2D(uMap, vUv + vec2(0.0, texel)).rgb, vec3(0.299, 0.587, 0.114));

          vec3 bumpNormal = normalize(vec3((lumL - lumR) * 2.2, (lumD - lumU) * 2.2, 1.0));
          vec3 N = normalize(vNormal + bumpNormal * 0.35);

          vec3 V = normalize(vViewPosition);
          vec3 L = normalize(uLightPos - vWorldPosition);
          vec3 L_cursor = normalize(uCursorLightPos - vWorldPosition);

          vec4 texColor = texture2D(uMap, vUv);

          float diff = max(dot(N, L), 0.0) * 0.85 + 0.35;
          float diffCursor = max(dot(N, L_cursor), 0.0) * 0.65;

          vec3 H = normalize(L + V);
          float spec = pow(max(dot(N, H), 0.0), 32.0) * 0.28;

          vec3 finalColor = texColor.rgb * (diff + diffCursor) + vec3(spec);
          gl_FragColor = vec4(finalColor, texColor.a);
        }
      `
    });
  }

  // =========================================================================
  // 3. GPU CURL-NOISE EMBER FIELD (F04, F22)
  // =========================================================================
  function createGpuEmberField(count = 320) {
    const geo = new THREE.BufferGeometry();
    const basePos = new Float32Array(count * 3);
    const velocity = new Float32Array(count * 3);
    const scale = new Float32Array(count);
    const color = new Float32Array(count * 3);

    const PALETTE = [
      new THREE.Color(0xff8a24), // amber
      new THREE.Color(0xffbe55), // warm gold
      new THREE.Color(0xff5511), // copper
      new THREE.Color(0xffe6a3)  // champagne
    ];

    for (let i = 0; i < count; i++) {
      basePos[i * 3 + 0] = (Math.random() - 0.1) * 54.0;
      basePos[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
      basePos[i * 3 + 2] = (Math.random() - 0.5) * 12.0;

      velocity[i * 3 + 0] = (Math.random() - 0.5) * 0.3;
      velocity[i * 3 + 1] = 0.25 + Math.random() * 0.45;
      velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      scale[i] = 0.035 + Math.random() * 0.045;

      const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      color[i * 3 + 0] = col.r;
      color[i * 3 + 1] = col.g;
      color[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(basePos, 3));
    geo.setAttribute('aVelocity', new THREE.BufferAttribute(velocity, 3));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollSpeed: { value: 0 },
        uPointer: { value: new THREE.Vector3(0, 0, 0) },
        uRepulsionRadius: { value: 2.8 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uScrollSpeed;
        uniform vec3 uPointer;
        uniform float uRepulsionRadius;

        attribute vec3 aVelocity;
        attribute float aScale;
        attribute vec3 aColor;

        varying vec3 vColor;
        varying float vAlpha;

        vec3 curlNoise(vec3 p) {
          const float e = 0.08;
          float x = (sin(p.y + e) - sin(p.y - e)) - (cos(p.z + e) - cos(p.z - e));
          float y = (sin(p.z + e) - sin(p.z - e)) - (cos(p.x + e) - cos(p.x - e));
          float z = (sin(p.x + e) - sin(p.x - e)) - (cos(p.y + e) - cos(p.y - e));
          return normalize(vec3(x, y, z));
        }

        void main() {
          vec3 pos = position;

          float loopY = mod(pos.y + uTime * aVelocity.y, 8.0) - 4.0;
          pos.y = loopY;

          vec3 curl = curlNoise(pos * 0.12 + vec3(0.0, uTime * 0.1, 0.0));
          pos += curl * (0.35 + abs(uScrollSpeed) * 1.5);

          vec3 delta = pos - uPointer;
          float dist = length(delta);
          if (dist < uRepulsionRadius) {
            pos += (delta / max(dist, 0.01)) * (uRepulsionRadius - dist) * 0.45;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float pSize = aScale * (220.0 / -mvPosition.z) * (1.0 + abs(uScrollSpeed) * 0.7);
          gl_PointSize = clamp(pSize, 1.0, 64.0);
          gl_Position = projectionMatrix * mvPosition;

          vColor = aColor;
          vAlpha = smoothstep(-mvPosition.z, 0.5, 9.0) * 0.85;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;

          float alpha = smoothstep(0.5, 0.04, r) * vAlpha;
          gl_FragColor = vec4(vColor * 1.6, alpha);
        }
      `
    });

    return new THREE.Points(geo, mat);
  }

  // =========================================================================
  // 4. MULTI-STATION SHADER COMPILATION WARMUP
  // =========================================================================
  function warmupAllStations(scene, camera, renderer, stations) {
    const startTime = performance.now();
    const originalPos = camera.position.clone();
    const originalRot = camera.rotation.clone();
    const originalAspect = camera.aspect;

    stations.forEach((st) => {
      camera.position.set(...st.camPos);
      camera.lookAt(...st.lookAt);
      camera.updateMatrixWorld(true);
      renderer.compile(scene, camera);
    });

    camera.position.set(25.0, 15.0, 30.0);
    camera.lookAt(25.0, 0.0, 0.0);
    camera.updateMatrixWorld(true);
    renderer.compile(scene, camera);

    renderer.render(scene, camera);

    camera.position.copy(originalPos);
    camera.rotation.copy(originalRot);
    camera.aspect = originalAspect;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);

    const duration = (performance.now() - startTime).toFixed(1);
    console.log(`[CharcuterieChick Engine] Shader compilation warmup completed in ${duration}ms (${stations.length} stations cached).`);
  }

  // =========================================================================
  // 5. WEB AUDIO PROCEDURAL AMBIANCE & SPATIAL SOUND EFFECTS (F23)
  // =========================================================================
  let audioCtx = null;
  let isAudioPlaying = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  function toggleAudio() {
    initAudio();
    if (!isAudioPlaying) {
      startFireplaceAmbiance();
      isAudioPlaying = true;
      if (btnAudio) {
        btnAudio.textContent = 'Ambiance: On';
        btnAudio.classList.add('is-active');
        btnAudio.setAttribute('aria-pressed', 'true');
      }
    } else {
      stopFireplaceAmbiance();
      isAudioPlaying = false;
      if (btnAudio) {
        btnAudio.textContent = 'Candle Ambiance';
        btnAudio.classList.remove('is-active');
        btnAudio.setAttribute('aria-pressed', 'false');
      }
    }
  }

  let ambianceSource = null;
  function startFireplaceAmbiance() {
    if (!audioCtx || ambianceSource) return;
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.95 * b1 + white * 0.05;
      b2 = 0.85 * b2 + white * 0.05;
      let brown = (b0 + b1 + b2) * 0.16;
      if (Math.random() < 0.0018) brown += (Math.random() - 0.5) * 0.55;
      output[i] = brown * 0.24;
    }

    const whiteNoise = audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, audioCtx.currentTime);

    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.25, audioCtx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    whiteNoise.start(0);
    ambianceSource = { whiteNoise, gainNode };
  }

  function stopFireplaceAmbiance() {
    if (ambianceSource) {
      try {
        ambianceSource.whiteNoise.stop();
        ambianceSource.whiteNoise.disconnect();
      } catch (e) {}
      ambianceSource = null;
    }
  }

  function playSingingBowl(freq = 523.25) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc2.start();
      osc.stop(audioCtx.currentTime + 1.25);
      osc2.stop(audioCtx.currentTime + 1.25);
    } catch (e) {}
  }

  function playCrystalChime(freq = 880) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.42);
    } catch (e) {}
  }

  function playSugarPuff() {
    if (!audioCtx || audioCtx.state !== 'running') return;
    try {
      const bufferSize = audioCtx.sampleRate * 0.35;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioCtx.sampleRate * 0.08));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, audioCtx.currentTime);
      filter.Q.setValueAtTime(3.0, audioCtx.currentTime);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    } catch (e) {}
  }

  if (btnAudio) {
    btnAudio.addEventListener('click', toggleAudio);
  }

  // =========================================================================
  // 6. THREE.JS INITIALIZATION & POST-PROCESSING BLOOM PIPELINE (F01, F08)
  // =========================================================================
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
    alpha: true
  });

  const initialDPR = getClampedDPR();
  renderer.setPixelRatio(initialDPR);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping; // Delegated to DualKawaseBloom
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x100608, 0.014);  // warmer tint, less density

  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);

  // Standalone Dual-Kawase Selective Bloom Pass
  const bloomPipeline = new DualKawaseBloom(
    renderer,
    window.innerWidth * initialDPR,
    window.innerHeight * initialDPR,
    {
      threshold: 0.62,
      knee: 0.22,
      bloomIntensity: 1.45,
      exposure: 1.55
    }
  );
  window.PostProcessingComposer = bloomPipeline;

  // =========================================================================
  // 7. RADIANT LIGHTING MODEL & TONE MAPPING CALIBRATION (F06, F07)
  // =========================================================================
  const ambientLight = new THREE.AmbientLight(0x3d2418, 3.5);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffead0, 5.2);
  keyLight.position.set(5, 12, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // Cool blue-lavender rim for sculptural depth contrast
  const coolRim = new THREE.DirectionalLight(0x3a5472, 1.8);
  coolRim.position.set(-8, 6, -8);
  scene.add(coolRim);

  // Warm table-bounce fill light (candlelight reflected up from surface)
  const bounceFill = new THREE.DirectionalLight(0xff8a20, 1.4);
  bounceFill.position.set(0, -6, 4);
  scene.add(bounceFill);

  const cursorLight = new THREE.PointLight(0xff9d47, 6.5, 11, 2);
  cursorLight.position.set(0, 0, 3);
  scene.add(cursorLight);

  // 6 Radiant Amber Candle Flames — higher intensity range
  const candleLights = [];
  const CANDLE_COORDS = [
    { pos: [ 0.8, 0.6, 0.5], color: 0xff8a24, intensity: 10.0 },
    { pos: [ 9.2, 0.6, 0.5], color: 0xff9933, intensity: 11.0 },
    { pos: [20.8, 0.6, 0.5], color: 0xff8820, intensity: 12.0 },
    { pos: [29.2, 0.6, 0.5], color: 0xff9429, intensity: 11.0 },
    { pos: [40.8, 0.6, 0.5], color: 0xff8a24, intensity: 10.0 },
    { pos: [50.0, 0.8, 0.5], color: 0xff9a38, intensity: 12.0 }
  ];

  const flameGeo = new THREE.ConeGeometry(0.038, 0.12, 16);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });

  CANDLE_COORDS.forEach((c) => {
    const pl = new THREE.PointLight(c.color, c.intensity, 8, 2);
    pl.position.set(...c.pos);
    scene.add(pl);
    candleLights.push({ light: pl, baseIntensity: c.intensity, phase: Math.random() * 10 });

    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.set(c.pos[0], c.pos[1] + 0.05, c.pos[2]);
    scene.add(flame);
  });

  // =========================================================================
  // 8. LUXURY MATERIALS, TEXTURES & KINETIC CENTERPIECES
  // =========================================================================
  const textureLoader = new THREE.TextureLoader();
  function loadTexture(path) {
    const tex = textureLoader.load(path);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return tex;
  }

  const copperMaterial = new THREE.MeshStandardMaterial({
    color: 0xd47a3a, // Polished luxury copper
    roughness: 0.22,
    metalness: 0.88
  });

  const obsidianMaterial = new THREE.MeshStandardMaterial({
    color: 0x0c080a,
    roughness: 0.18,
    metalness: 0.25
  });

  const goldLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2be77,
    roughness: 0.18,
    metalness: 0.92
  });

  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x321a12, // Rich dark black walnut
    roughness: 0.38,
    metalness: 0.08
  });

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.98,
    ior: 1.54,
    roughness: 0.015,
    thickness: 0.18,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02
  });

  const beeswaxMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0c060, // Texas Wildflower amber beeswax
    emissive: 0x552805,
    emissiveIntensity: 0.35,
    roughness: 0.28,
    metalness: 0.06,
    transmission: 0.72,
    ior: 1.48,
    thickness: 0.55,
    attenuationColor: new THREE.Color(0xff9911),
    attenuationDistance: 0.4,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xedebe8, // White Calacatta marble slab
    roughness: 0.14,
    metalness: 0.05
  });

  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x141215, // Matte black wrought iron
    roughness: 0.58,
    metalness: 0.85
  });

  const pinOrbMaterial = new THREE.MeshStandardMaterial({
    color: 0xffbe55,
    roughness: 0.1,
    metalness: 0.9,
    emissive: new THREE.Color(0xff8811),
    emissiveIntensity: 1.2
  });

  const pinRingMaterial = new THREE.MeshBasicMaterial({
    color: 0xffbe55,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  });

  // Hotspot registry & Raycasting Cache (GC optimization)
  const interactiveHotspots = [];
  const rotatingRings = [];
  const cachedHotspotMeshes = [];

  function createLuxuryHotspot(parentGroup, x, y, z, info) {
    const pinGroup = new THREE.Group();
    pinGroup.position.set(x, y, z);

    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.042, 16, 16), pinOrbMaterial);
    pinGroup.add(orb);
    cachedHotspotMeshes.push(orb);

    const ring = new THREE.Mesh(new THREE.RingGeometry(0.065, 0.085, 32), pinRingMaterial);
    pinGroup.add(ring);
    rotatingRings.push(ring);
    cachedHotspotMeshes.push(ring);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.08, 8), copperMaterial);
    stem.position.z = -0.04;
    stem.rotation.x = Math.PI / 2;
    pinGroup.add(stem);
    cachedHotspotMeshes.push(stem);

    pinGroup.userData.isHotspot = true;
    pinGroup.userData.info = info;
    parentGroup.add(pinGroup);
    interactiveHotspots.push(pinGroup);
    return pinGroup;
  }

  // Relief Portal Materials tracked for animation updates (empty array for backward compatibility)
  const reliefPortalMaterials = [];

  // =========================================================================
  // 8B. PROCEDURAL 3D MESH GENERATORS (PHASES 0–5)
  // =========================================================================
  const honeyMat = createHoneyViscosityMaterial();
  const ribbonMat = createProsciuttoRibbonMaterial();
  const cached3DConsoleMeshes = [];

  // PHASE 0: Hexagonal Prism Honeycomb Lattice
  function createHoneycombLattice() {
    const group = new THREE.Group();
    const hexRadius = 0.16;
    const sqrt3 = Math.sqrt(3);

    // Beeswax Material
    const waxMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0c060,
      emissive: 0x442205,
      emissiveIntensity: 0.35,
      roughness: 0.28,
      metalness: 0.05,
      transmission: 0.76,
      ior: 1.48,
      thickness: 0.55,
      attenuationColor: new THREE.Color(0xff9911),
      attenuationDistance: 0.38,
      clearcoat: 0.92,
      clearcoatRoughness: 0.14
    });

    // Concentric hexagonal grid rings (R=2: 19 cells total)
    const R = 2;
    for (let q = -R; q <= R; q++) {
      const r1 = Math.max(-R, -q - R);
      const r2 = Math.min(R, -q + R);
      for (let r = r1; r <= r2; r++) {
        const cx = hexRadius * sqrt3 * (q + r / 2.0);
        const cz = hexRadius * 1.5 * r;
        const cyVar = 0.22 + 0.07 * Math.sin(q * 1.8 + r * 2.3) + 0.05 * Math.cos(r * 3.1);

        // Hexagonal prism cell
        const cellGeo = new THREE.CylinderGeometry(hexRadius * 0.94, hexRadius * 0.94, cyVar, 6);
        const cellMesh = new THREE.Mesh(cellGeo, waxMat);
        cellMesh.position.set(cx, cyVar * 0.5, cz);
        cellMesh.castShadow = true;
        cellMesh.receiveShadow = true;
        group.add(cellMesh);

        // Nectar puddles in alternating cells
        if ((q + r) % 2 === 0) {
          const puddleGeo = new THREE.CylinderGeometry(hexRadius * 0.72, hexRadius * 0.72, 0.02, 6);
          const puddleMat = new THREE.MeshStandardMaterial({
            color: 0xffaa11,
            roughness: 0.08,
            metalness: 0.1,
            emissive: 0x773300,
            emissiveIntensity: 0.6
          });
          const puddle = new THREE.Mesh(puddleGeo, puddleMat);
          puddle.position.set(cx, cyVar + 0.005, cz);
          group.add(puddle);
        }
      }
    }

    // Heavy Obsidian Foundation Slate
    const baseSlab = new THREE.Mesh(new THREE.CylinderGeometry(hexRadius * 5.2, hexRadius * 5.5, 0.06, 36), obsidianMaterial);
    baseSlab.position.y = -0.03;
    baseSlab.castShadow = true;
    baseSlab.receiveShadow = true;
    group.add(baseSlab);

    const baseRim = new THREE.Mesh(new THREE.TorusGeometry(hexRadius * 5.4, 0.016, 12, 48), copperMaterial);
    baseRim.rotation.x = Math.PI / 2;
    baseRim.position.y = -0.03;
    group.add(baseRim);

    group.rotation.x = 0.40;
    return group;
  }

  // PHASE 0: Raymarched/Refractive Viscous Honey Droplet Assembly
  function createHoneyDropletAssembly() {
    const group = new THREE.Group();

    // Primary Teardrop Droplet
    const dropGeo = new THREE.SphereGeometry(0.36, 48, 48);
    const pos = dropGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const taper = y > 0 ? (1.0 - 0.48 * (y / 0.36)) : 1.0;
      pos.setX(i, pos.getX(i) * taper);
      pos.setZ(i, pos.getZ(i) * taper);
      if (y < 0) pos.setY(i, y * 1.15);
    }
    dropGeo.computeVertexNormals();

    const primaryDrop = new THREE.Mesh(dropGeo, honeyMat);
    primaryDrop.position.set(0.38, -0.22, 0.22);
    primaryDrop.scale.set(0.55, 0.72, 0.55);
    primaryDrop.castShadow = true;
    group.add(primaryDrop);

    // Micro-droplet dripping below
    const microGeo = new THREE.SphereGeometry(0.12, 32, 32);
    const microDrop = new THREE.Mesh(microGeo, honeyMat);
    microDrop.position.set(0.38, -0.58, 0.22);
    microDrop.scale.set(0.65, 0.95, 0.65);
    group.add(microDrop);

    return { group, primaryDrop };
  }

  // PHASE 0: Parametric 3D Catmull-Rom Prosciutto Ribbon Floret
  function createProsciuttoRibbonFloret() {
    const group = new THREE.Group();

    const curvePoints = [
      new THREE.Vector3(-0.45, -0.22,  0.05),
      new THREE.Vector3(-0.32,  0.10,  0.22),
      new THREE.Vector3(-0.12,  0.28,  0.08),
      new THREE.Vector3( 0.10,  0.16, -0.10),
      new THREE.Vector3( 0.28, -0.06,  0.15),
      new THREE.Vector3( 0.40, -0.26,  0.04),
      new THREE.Vector3( 0.22, -0.34, -0.08),
      new THREE.Vector3(-0.02, -0.28,  0.02)
    ];
    const spline = new THREE.CatmullRomCurve3(curvePoints, true, 'centripetal');
    const tubeGeo = new THREE.TubeGeometry(spline, 72, 0.085, 12, true);
    const ribbonMesh = new THREE.Mesh(tubeGeo, ribbonMat);
    ribbonMesh.castShadow = true;
    group.add(ribbonMesh);

    const innerPoints = [
      new THREE.Vector3(-0.18, -0.12, 0.12),
      new THREE.Vector3(-0.06,  0.08, 0.18),
      new THREE.Vector3( 0.12,  0.05, 0.05),
      new THREE.Vector3( 0.04, -0.15, 0.08)
    ];
    const innerSpline = new THREE.CatmullRomCurve3(innerPoints, true, 'centripetal');
    const innerGeo = new THREE.TubeGeometry(innerSpline, 48, 0.055, 10, true);
    const innerMesh = new THREE.Mesh(innerGeo, ribbonMat);
    group.add(innerMesh);

    group.position.set(-0.22, -0.08, 0.18);
    group.rotation.set(0.18, 0.32, -0.12);
    return group;
  }

  // PHASE 0: 3D Rosemary Needle Geometry with SSS
  function createRosemarySprig() {
    const group = new THREE.Group();

    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.0, -0.45, 0.0),
      new THREE.Vector3(0.04, -0.15, 0.02),
      new THREE.Vector3(-0.02, 0.15, -0.02),
      new THREE.Vector3(0.02, 0.45, 0.01)
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 24, 0.016, 8, false);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x3d2516, roughness: 0.85 });
    group.add(new THREE.Mesh(stemGeo, stemMat));

    const needleMat = new THREE.MeshStandardMaterial({
      color: 0x2e5436,
      roughness: 0.35,
      metalness: 0.05,
      emissive: 0x0b2010,
      emissiveIntensity: 0.4
    });

    const needleCount = 68;
    const needleGeo = new THREE.ConeGeometry(0.014, 0.14, 6);
    needleGeo.translate(0, 0.07, 0);

    for (let k = 0; k < needleCount; k++) {
      const frac = k / needleCount;
      const pt = stemCurve.getPoint(frac);
      const needle = new THREE.Mesh(needleGeo, needleMat);
      needle.position.copy(pt);
      const theta = k * 2.39996;
      const outVec = new THREE.Vector3(Math.cos(theta), 0.35, Math.sin(theta)).normalize();
      needle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), outVec);
      group.add(needle);
    }

    group.position.set(0.48, 0.28, 0.15);
    group.rotation.set(-0.25, 0.45, -0.35);
    return group;
  }

  // PHASE 1: 3D Black Walnut Slab, Cheeses, Mission Figs, Wine Glass
  function createArtisanBoard3D() {
    const group = new THREE.Group();

    // 1. Black Walnut Live-Edge Slab
    const slabGeo = new THREE.BoxGeometry(2.4, 0.12, 1.8, 8, 2, 8);
    const slabMesh = new THREE.Mesh(slabGeo, walnutMat);
    slabMesh.position.y = -0.06;
    slabMesh.castShadow = true;
    slabMesh.receiveShadow = true;
    group.add(slabMesh);

    // Copper Handles
    [-1.24, 1.24].forEach((hx) => {
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.022, 12, 24, Math.PI), copperMaterial);
      handle.position.set(hx, -0.03, 0);
      handle.rotation.z = hx > 0 ? -Math.PI / 2 : Math.PI / 2;
      group.add(handle);
    });

    // 2. Pitted Spanish Manchego Wedge (D.O.P.)
    const manchegoGroup = new THREE.Group();
    const manchegoGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.24, 32, 1, false, 0, Math.PI / 3);
    const manchegoMat = new THREE.MeshStandardMaterial({
      color: 0xf5eed2,
      roughness: 0.46,
      metalness: 0.04
    });
    const manchegoRindMat = new THREE.MeshStandardMaterial({
      color: 0x5a3d24,
      roughness: 0.72,
      metalness: 0.08
    });
    const manchegoMesh = new THREE.Mesh(manchegoGeo, [manchegoMat, manchegoRindMat, manchegoMat]);
    manchegoMesh.castShadow = true;
    manchegoGroup.add(manchegoMesh);
    manchegoGroup.position.set(-0.52, 0.12, 0.28);
    manchegoGroup.rotation.y = 0.45;
    group.add(manchegoGroup);

    // 3. French Triple-Crème Brie Wheel with Bloomy Rind
    const brieGroup = new THREE.Group();
    const brieGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.18, 36, 1, false, 0, Math.PI * 1.72);
    const brieRindMat = new THREE.MeshStandardMaterial({
      color: 0xfcfaf4,
      roughness: 0.88,
      metalness: 0.02
    });
    const briePasteMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbe698,
      roughness: 0.20,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12
    });
    const brieMesh = new THREE.Mesh(brieGeo, [brieRindMat, briePasteMat, brieRindMat]);
    brieMesh.castShadow = true;
    brieGroup.add(brieMesh);

    const oozeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    oozeGeo.scale(1.8, 0.6, 1.2);
    const oozeMesh = new THREE.Mesh(oozeGeo, briePasteMat);
    oozeMesh.position.set(0.15, -0.06, 0.12);
    brieGroup.add(oozeMesh);

    brieGroup.position.set(-0.16, 0.09, 0.15);
    brieGroup.rotation.y = -0.65;
    group.add(brieGroup);

    // 4. Sliced Fresh Mission Figs with Seed Cavities
    const figGroup = new THREE.Group();
    const figSkinMat = new THREE.MeshStandardMaterial({ color: 0x2b1525, roughness: 0.62 });
    const figPulpMat = new THREE.MeshStandardMaterial({ color: 0xa82038, roughness: 0.38 });
    const figSeedMat = new THREE.MeshStandardMaterial({ color: 0xffbe55, roughness: 0.12, metalness: 0.2 });

    [-0.14, 0.14].forEach((fx, idx) => {
      const halfFig = new THREE.Group();
      const bodyGeo = new THREE.SphereGeometry(0.16, 24, 24, 0, Math.PI);
      bodyGeo.scale(1.0, 1.25, 0.85);
      halfFig.add(new THREE.Mesh(bodyGeo, figSkinMat));

      const pulpGeo = new THREE.CircleGeometry(0.15, 24);
      pulpGeo.scale(1.0, 1.25, 1.0);
      const pulpMesh = new THREE.Mesh(pulpGeo, figPulpMat);
      pulpMesh.rotation.y = Math.PI / 2;
      halfFig.add(pulpMesh);

      for (let s = 0; s < 18; s++) {
        const seed = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 8), figSeedMat);
        const sa = Math.random() * Math.PI * 2;
        const sr = Math.random() * 0.09;
        seed.position.set(0.01, Math.sin(sa) * sr * 1.2, Math.cos(sa) * sr);
        halfFig.add(seed);
      }

      halfFig.position.set(fx, 0.02, (idx === 0 ? -0.06 : 0.06));
      halfFig.rotation.set(Math.PI / 2, 0, idx * 0.85);
      figGroup.add(halfFig);
    });

    figGroup.position.set(0.18, 0.05, -0.12);
    group.add(figGroup);

    // 5. Refractive Crystal Wine Glass
    const glassGroup = new THREE.Group();
    const glassPoints = [
      new THREE.Vector2(0.0, 0.0),
      new THREE.Vector2(0.20, 0.01),
      new THREE.Vector2(0.18, 0.03),
      new THREE.Vector2(0.022, 0.04),
      new THREE.Vector2(0.016, 0.35),
      new THREE.Vector2(0.025, 0.38),
      new THREE.Vector2(0.24, 0.48),
      new THREE.Vector2(0.28, 0.65),
      new THREE.Vector2(0.21, 0.85),
      new THREE.Vector2(0.19, 0.85),
      new THREE.Vector2(0.26, 0.65),
      new THREE.Vector2(0.22, 0.50),
      new THREE.Vector2(0.02, 0.40),
      new THREE.Vector2(0.0, 0.40)
    ];
    const glassGeo = new THREE.LatheGeometry(glassPoints, 32);
    const glassMesh = new THREE.Mesh(glassGeo, crystalMat);
    glassMesh.castShadow = true;
    glassGroup.add(glassMesh);

    const wineGeo = new THREE.CylinderGeometry(0.23, 0.16, 0.20, 24);
    const wineMat = new THREE.MeshPhysicalMaterial({
      color: 0x480410,
      transmission: 0.75,
      ior: 1.34,
      roughness: 0.05
    });
    const wineMesh = new THREE.Mesh(wineGeo, wineMat);
    wineMesh.position.y = 0.56;
    glassGroup.add(wineMesh);

    glassGroup.position.set(0.58, 0.0, 0.32);
    glassGroup.scale.setScalar(0.72);
    group.add(glassGroup);

    return group;
  }

  // PHASE 2: Sweeping 12-Foot Banquet Table, Candles, Foliage & Tier Displays
  function createBanquetTable3D() {
    const group = new THREE.Group();
    const tableLength = 5.6;
    const tableWidth = 1.8;

    // Planks
    const plankGeo = new THREE.BoxGeometry(tableLength, 0.10, tableWidth, 16, 1, 4);
    const tableMesh = new THREE.Mesh(plankGeo, walnutMat);
    tableMesh.position.y = -0.05;
    tableMesh.castShadow = true;
    tableMesh.receiveShadow = true;
    group.add(tableMesh);

    // Trestle legs
    [-tableLength * 0.42, tableLength * 0.42].forEach(tx => {
      const legMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.85, tableWidth * 0.85), ironMat);
      legMesh.position.set(tx, -0.48, 0);
      legMesh.castShadow = true;
      group.add(legMesh);
    });

    // Brass Candle Stands
    [-1.6, 0.0, 1.6].forEach((cx, idx) => {
      const stand = new THREE.Group();
      stand.add(new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.04, 24), copperMaterial));
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.024, 0.32 + idx * 0.06, 16), copperMaterial);
      stem.position.y = 0.18 + idx * 0.03;
      stand.add(stem);
      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 16), beeswaxMat);
      candle.position.y = 0.42 + idx * 0.06;
      stand.add(candle);
      stand.position.set(cx, 0.0, -0.35 + (idx % 2) * 0.2);
      group.add(stand);
    });

    // Eucalyptus Foliage Runner
    const runnerGroup = new THREE.Group();
    const vineCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-tableLength * 0.46, 0.02, -0.15),
      new THREE.Vector3(-tableLength * 0.22, 0.03,  0.18),
      new THREE.Vector3( 0.0,                0.02, -0.12),
      new THREE.Vector3( tableLength * 0.22, 0.03,  0.15),
      new THREE.Vector3( tableLength * 0.46, 0.02, -0.08)
    ]);
    const vineGeo = new THREE.TubeGeometry(vineCurve, 36, 0.014, 8, false);
    const vineMat = new THREE.MeshStandardMaterial({ color: 0x3d3528, roughness: 0.85 });
    runnerGroup.add(new THREE.Mesh(vineGeo, vineMat));

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x54725e, roughness: 0.52, side: THREE.DoubleSide });
    const leafGeo = new THREE.CircleGeometry(0.055, 10);
    leafGeo.scale(1.0, 1.4, 1.0);
    for (let i = 0; i < 48; i++) {
      const u = i / 48;
      const pt = vineCurve.getPoint(u);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(pt.x + (Math.random() - 0.5) * 0.22, 0.035, pt.z + (Math.random() - 0.5) * 0.22);
      leaf.rotation.set(Math.PI / 2 + (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, Math.random() * Math.PI * 2);
      runnerGroup.add(leaf);
    }
    group.add(runnerGroup);

    // Multi-Tier Grazing Risers ($24, $26, $30, $38 Tiers)
    const tierDefs = [
      { x: -1.8, tiers: 2 },
      { x: -0.6, tiers: 2 },
      { x:  0.6, tiers: 3 },
      { x:  1.8, tiers: 4 }
    ];
    tierDefs.forEach(t => {
      const stand = new THREE.Group();
      for (let l = 0; l < t.tiers; l++) {
        const rad = 0.32 - l * 0.06;
        const pl = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.025, 24), walnutMat);
        pl.position.y = 0.05 + l * 0.12;
        pl.castShadow = true;
        stand.add(pl);

        const rm = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.008, 8, 24), copperMaterial);
        rm.rotation.x = Math.PI / 2;
        rm.position.y = 0.05 + l * 0.12;
        stand.add(rm);

        for (let f = 0; f < 3; f++) {
          const item = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), goldLeafMaterial);
          const ang = f * (Math.PI * 2 / 3);
          item.position.set(Math.cos(ang) * rad * 0.55, 0.075 + l * 0.12, Math.sin(ang) * rad * 0.55);
          stand.add(item);
        }
      }
      stand.position.set(t.x, 0.0, 0.25);
      group.add(stand);
    });

    return group;
  }

  // PHASE 3: 3D Mobile Cart, Canopy, Inverse-Square Edison Bulbs, Champagne Cascade & Holy Grail
  function createMobileCart3D() {
    const group = new THREE.Group();
    const cartWidth = 2.4;
    const cartDepth = 1.3;
    const cartHeight = 1.0;

    // Calacatta Marble Countertop
    const marbleTop = new THREE.Mesh(new THREE.BoxGeometry(cartWidth, 0.08, cartDepth), marbleMat);
    marbleTop.position.y = cartHeight;
    marbleTop.castShadow = true;
    marbleTop.receiveShadow = true;
    group.add(marbleTop);

    // Black Wrought-Iron Chassis Frame
    const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(cartWidth * 0.92, cartHeight * 0.85, cartDepth * 0.85), ironMat);
    frameMesh.position.y = cartHeight * 0.5;
    group.add(frameMesh);

    // 4 Spoke Carriage Wheels with Brass Rims
    const wheelRadius = 0.38;
    const wheelPositions = [
      [-cartWidth * 0.42, wheelRadius,  cartDepth * 0.46],
      [ cartWidth * 0.42, wheelRadius,  cartDepth * 0.46],
      [-cartWidth * 0.42, wheelRadius, -cartDepth * 0.46],
      [ cartWidth * 0.42, wheelRadius, -cartDepth * 0.46]
    ];
    wheelPositions.forEach(wp => {
      const wheel = new THREE.Group();
      wheel.add(new THREE.Mesh(new THREE.TorusGeometry(wheelRadius, 0.022, 12, 32), copperMaterial));
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 16), copperMaterial);
      hub.rotation.x = Math.PI / 2;
      wheel.add(hub);
      for (let s = 0; s < 8; s++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, wheelRadius * 2, 8), ironMat);
        spoke.rotation.z = s * (Math.PI / 8);
        wheel.add(spoke);
      }
      wheel.position.set(...wp);
      group.add(wheel);
    });

    // Canopy Pillars & Arched Roof
    [-cartWidth * 0.44, cartWidth * 0.44].forEach(px => {
      [-cartDepth * 0.44, cartDepth * 0.44].forEach(pz => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.4, 12), ironMat);
        col.position.set(px, cartHeight + 0.7, pz);
        group.add(col);
      });
    });

    const canopyRoof = new THREE.Mesh(new THREE.CylinderGeometry(cartDepth * 0.6, cartDepth * 0.6, cartWidth, 24, 1, false, 0, Math.PI), ironMat);
    canopyRoof.rotation.z = Math.PI / 2;
    canopyRoof.position.set(0, cartHeight + 1.4, 0);
    group.add(canopyRoof);

    // 3 Hanging Edison Bulbs with Real-Time Inverse-Square Illumination
    const edisonGroup = new THREE.Group();
    [-0.55, 0.0, 0.55].forEach(bx => {
      const bulbSub = new THREE.Group();
      const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.35, 8), ironMat);
      cord.position.y = 0.175;
      bulbSub.add(cord);

      const socket = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 12), copperMaterial);
      socket.position.y = 0.0;
      bulbSub.add(socket);

      const bulbGlass = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        ior: 1.5,
        roughness: 0.05
      }));
      bulbGlass.position.y = -0.07;
      bulbGlass.scale.set(1.0, 1.3, 1.0);
      bulbSub.add(bulbGlass);

      const filament = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 8, 16), new THREE.MeshBasicMaterial({ color: 0xffdf77 }));
      filament.position.y = -0.07;
      bulbSub.add(filament);

      const bulbLight = new THREE.PointLight(0xff9922, 4.5, 6, 2.0);
      bulbLight.position.y = -0.07;
      bulbSub.add(bulbLight);

      bulbSub.position.set(bx, cartHeight + 1.25, 0);
      edisonGroup.add(bulbSub);
    });
    group.add(edisonGroup);

    // 3-Tier Champagne Coupe Pyramid Cascade
    const champGroup = new THREE.Group();
    const coupeMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.96, ior: 1.52, roughness: 0.03 });
    const champLiquidMat = new THREE.MeshPhysicalMaterial({ color: 0xf7e2a4, transmission: 0.85, ior: 1.34, roughness: 0.08 });

    const coupeLayers = [
      { y: 0.0, pts: [[-0.12, -0.08], [0.12, -0.08], [0.0, 0.12]] },
      { y: 0.22, pts: [[-0.06, 0.0], [0.06, 0.0]] },
      { y: 0.44, pts: [[0.0, 0.0]] }
    ];
    coupeLayers.forEach(layer => {
      layer.pts.forEach(([cx, cz]) => {
        const coupe = new THREE.Group();
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.02, 0.07, 16), coupeMat);
        bowl.position.y = 0.14;
        coupe.add(bowl);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.14, 8), coupeMat);
        stem.position.y = 0.07;
        coupe.add(stem);
        coupe.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.01, 16), coupeMat));

        const liq = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.02, 0.05, 16), champLiquidMat);
        liq.position.y = 0.14;
        coupe.add(liq);

        coupe.position.set(cx, layer.y, cz);
        champGroup.add(coupe);
      });
    });
    champGroup.position.set(-0.55, cartHeight + 0.04, 0.15);
    champGroup.scale.setScalar(0.75);
    group.add(champGroup);

    // The $2,000 / $3,500 Holy Grail Multi-Tier Showpiece
    const grailGroup = new THREE.Group();
    for (let t = 0; t < 5; t++) {
      const rad = 0.42 - t * 0.07;
      const platter = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 0.03, 32), walnutMat);
      platter.position.y = t * 0.14;
      platter.castShadow = true;
      grailGroup.add(platter);

      const brassEdge = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.01, 8, 32), copperMaterial);
      brassEdge.rotation.x = Math.PI / 2;
      brassEdge.position.y = t * 0.14;
      grailGroup.add(brassEdge);

      for (let g = 0; g < 4; g++) {
        const berry = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), goldLeafMaterial);
        const ba = g * (Math.PI / 2) + t * 0.5;
        berry.position.set(Math.cos(ba) * rad * 0.65, t * 0.14 + 0.035, Math.sin(ba) * rad * 0.65);
        grailGroup.add(berry);
      }
    }
    grailGroup.position.set(0.48, cartHeight + 0.04, 0.0);
    group.add(grailGroup);

    group.position.y = -0.55;
    return group;
  }

  // PHASE 4: 3D Damascus Steel Chef Knife, End-Grain Butcher Block & Accolades
  function createHeritageStage3D() {
    const group = new THREE.Group();

    // 1. Butcher Block with Juice Groove
    const blockMesh = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.22, 1.3, 16, 2, 12), walnutMat);
    blockMesh.position.y = -0.11;
    blockMesh.castShadow = true;
    blockMesh.receiveShadow = true;
    group.add(blockMesh);

    const groove = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.015, 8, 4), copperMaterial);
    groove.rotation.x = Math.PI / 2;
    groove.scale.set(1.1, 0.75, 1.0);
    groove.position.y = 0.005;
    group.add(groove);

    // 2. 3D Damascus Steel Chef Knife
    const knifeGroup = new THREE.Group();
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.lineTo(0.95, 0.02);
    bladeShape.quadraticCurveTo(0.65, 0.18, 0, 0.22);
    bladeShape.lineTo(0, 0);
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, {
      depth: 0.014,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.006,
      bevelThickness: 0.006
    });

    const damascusMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uLightPos: { value: new THREE.Vector3(5, 12, 8) }
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPosition = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uLightPos;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 N = normalize(vNormal);
          vec3 L = normalize(uLightPos - vWorldPosition);
          float bands = sin(vWorldPosition.x * 48.0 + sin(vWorldPosition.y * 32.0) * 4.5);
          float pattern = smoothstep(-0.25, 0.25, bands);
          vec3 darkSteel = vec3(0.18, 0.20, 0.22);
          vec3 brightSteel = vec3(0.85, 0.88, 0.92);
          vec3 steelAlbedo = mix(darkSteel, brightSteel, pattern);
          float diff = max(dot(N, L), 0.0) * 0.85 + 0.35;
          vec3 V = normalize(-vWorldPosition);
          vec3 H = normalize(L + V);
          float spec = pow(max(dot(N, H), 0.0), 64.0) * 1.8;
          vec3 irid = vec3(1.0, 0.85, 0.65) * pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.6;
          gl_FragColor = vec4(steelAlbedo * diff + vec3(spec) + irid, 1.0);
        }
      `
    });

    const bladeMesh = new THREE.Mesh(bladeGeo, damascusMat);
    bladeMesh.castShadow = true;
    knifeGroup.add(bladeMesh);

    const bolster = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.23, 0.026), copperMaterial);
    bolster.position.set(-0.02, 0.11, 0.007);
    knifeGroup.add(bolster);

    const handleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.032), walnutMat);
    handleMesh.position.set(-0.21, 0.11, 0.007);
    knifeGroup.add(handleMesh);

    [-0.32, -0.21, -0.10].forEach(rx => {
      const rivet = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.035, 12), copperMaterial);
      rivet.rotation.x = Math.PI / 2;
      rivet.position.set(rx, 0.11, 0.007);
      knifeGroup.add(rivet);
    });

    knifeGroup.position.set(0.15, 0.02, 0.10);
    knifeGroup.rotation.set(-Math.PI / 2, 0, 0.42);
    knifeGroup.scale.setScalar(0.95);
    group.add(knifeGroup);

    // 3. 3D Embossed Metallic Accolade Badges (The Knot & WeddingWire 5.0)
    const accoladesGroup = new THREE.Group();

    // The Knot 5.0 Badge
    const knotBadge = new THREE.Group();
    const knotDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 32), goldLeafMaterial);
    knotDisc.rotation.x = Math.PI / 2;
    knotBadge.add(knotDisc);
    knotBadge.add(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.018, 12, 36), copperMaterial));
    for (let s = -2; s <= 2; s++) {
      const star = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.03, 5), copperMaterial);
      star.position.set(s * 0.09, -0.06, 0.025);
      knotBadge.add(star);
    }
    knotBadge.position.set(-0.48, 0.32, 0.15);
    accoladesGroup.add(knotBadge);

    // WeddingWire 5.0 Badge
    const wwBadge = new THREE.Group();
    const wwDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.04, 32), copperMaterial);
    wwDisc.rotation.x = Math.PI / 2;
    wwBadge.add(wwDisc);
    wwBadge.add(new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.018, 12, 36), goldLeafMaterial));
    for (let s = -2; s <= 2; s++) {
      const star = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.03, 5), goldLeafMaterial);
      star.position.set(s * 0.09, -0.06, 0.025);
      wwBadge.add(star);
    }
    wwBadge.position.set(0.0, 0.32, -0.15);
    accoladesGroup.add(wwBadge);

    group.add(accoladesGroup);
    return group;
  }

  // PHASE 5: 3D Spatial Interactive Control Surface Console
  function createSpatialConsole3D() {
    const group = new THREE.Group();
    const consoleWidth = 3.6;
    const consoleDepth = 2.2;

    const consoleMesh = new THREE.Mesh(new THREE.BoxGeometry(consoleWidth, 0.16, consoleDepth), obsidianMaterial);
    consoleMesh.castShadow = true;
    consoleMesh.receiveShadow = true;
    group.add(consoleMesh);

    const consoleRim = new THREE.Mesh(new THREE.BoxGeometry(consoleWidth + 0.08, 0.18, consoleDepth + 0.08), copperMaterial);
    consoleRim.position.y = -0.02;
    group.add(consoleRim);

    // 5 Tactile 3D Buttons ($24, $26, $30, $38, Holy Grail)
    const buttonConfigs = [
      { rate: '24', label: '$24 Graze Me', x: -1.4 },
      { rate: '26', label: '$26 Standard', x: -0.7 },
      { rate: '30', label: '$30 Super',    x:  0.0 },
      { rate: '38', label: '$38 Grand',    x:  0.7 },
      { rate: 'holy-grail', label: 'Holy Grail', x: 1.4 }
    ];

    const buttons = [];
    buttonConfigs.forEach(cfg => {
      const btnGroup = new THREE.Group();
      const btnMesh = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.35), new THREE.MeshStandardMaterial({
        color: 0x1f191c,
        roughness: 0.25,
        metalness: 0.65,
        emissive: 0x442200,
        emissiveIntensity: 0.2
      }));
      btnMesh.position.y = 0.09;
      btnGroup.add(btnMesh);

      const ring = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 0.38), new THREE.MeshBasicMaterial({
        color: 0xffaa22,
        transparent: true,
        opacity: 0.6
      }));
      ring.position.y = 0.07;
      btnGroup.add(ring);

      btnGroup.position.set(cfg.x, 0.0, -0.45);
      btnGroup.userData = { rate: cfg.rate, label: cfg.label, is3DButton: true, mesh: btnMesh };
      group.add(btnGroup);
      buttons.push(btnGroup);
      cached3DConsoleMeshes.push(btnMesh);
    });

    // 3D Slider Rail & Brass Puck
    const railSlot = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.03, 0.08), ironMat);
    railSlot.position.set(0, 0.09, 0.15);
    group.add(railSlot);

    const sliderPuck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 24), copperMaterial);
    sliderPuck.position.set(-0.8, 0.13, 0.15);
    group.add(sliderPuck);

    // Holographic Glass Receipt Slate
    const receiptGroup = new THREE.Group();
    receiptGroup.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.04), crystalMat));
    const slateRim = new THREE.Mesh(new THREE.BoxGeometry(2.66, 1.46, 0.03), copperMaterial);
    slateRim.position.z = -0.01;
    receiptGroup.add(slateRim);
    receiptGroup.position.set(0, 1.3, -0.85);
    receiptGroup.rotation.x = -0.22;
    group.add(receiptGroup);

    group.rotation.x = 0.42;
    return { consoleGroup: group, buttons, sliderPuck };
  }


  // =========================================================================
  // 9. SCENIC VIDEO TEXTURE BACKGROUND STAGE (F09)
  // =========================================================================
  const videoMgr = new VideoTextureManager();
  const texSeed = videoMgr.loadStream('micro', 'img/micro-seed-720p.mp4');
  const texFeast = videoMgr.loadStream('feast', 'img/feast-cinematic-720p.mp4');
  const texCart = videoMgr.loadStream('cart', 'img/cart-cinematic-720p.mp4');

  const STATION_VIDEO_KEYS = {
    0: 'micro',
    1: 'feast',
    2: 'feast',
    3: 'cart',
    4: 'feast',
    5: 'feast'
  };

  const videoBlendMat = createVideoBlendMaterial(texSeed, texSeed);
  const bgStageGeo = new THREE.PlaneGeometry(28, 16, 36, 18);
  const bgStageMesh = new THREE.Mesh(bgStageGeo, videoBlendMat);
  bgStageMesh.position.set(1.6, 0.5, -5.5);
  scene.add(bgStageMesh);

  let activeVideoKey = 'micro';
  function updateVideoBackdrop(stationIdx) {
    const targetKey = STATION_VIDEO_KEYS[stationIdx] || 'feast';
    if (targetKey === activeVideoKey) return;
    const prevTex = videoMgr.getTexture(activeVideoKey);
    const nextTex = videoMgr.getTexture(targetKey);
    if (prevTex && nextTex) {
      videoBlendMat.uniforms.uTexA.value = prevTex;
      videoBlendMat.uniforms.uTexB.value = nextTex;
      videoMgr.transitionTo(targetKey, 1100);
      activeVideoKey = targetKey;
    }
  }

  const stageGroups = [];

  // =========================================================================
  // STATION 0: THE SEED (Micro Scale · Prosciutto & Honey)
  // =========================================================================
  const stage0 = new THREE.Group();
  stage0.position.set(1.65, 0.05, 0.0);
  stage0.rotation.set(-0.04, -0.18, 0);

  // 1. Procedural 3D Hexagonal Honeycomb Lattice
  const honeycombLattice = createHoneycombLattice();
  stage0.add(honeycombLattice);

  // 2. Raymarched/Refractive Viscous Honey Droplet Assembly
  const { group: honeyDropGroup, primaryDrop: honeyMesh } = createHoneyDropletAssembly();
  stage0.add(honeyDropGroup);

  // 3. Parametric 3D Catmull-Rom Prosciutto Ribbon Floret
  const prosciuttoRibbonFloret = createProsciuttoRibbonFloret();
  stage0.add(prosciuttoRibbonFloret);

  // 4. 3D Rosemary Needle Geometry
  const rosemarySprig = createRosemarySprig();
  stage0.add(rosemarySprig);

  // ── Honey Drip Viscous Particle System (Stage 0) ─────────────────────────
  const HONEY_DROP_COUNT = 20;
  const honeyDropPos  = new Float32Array(HONEY_DROP_COUNT * 3);
  const honeyDropVelo = new Float32Array(HONEY_DROP_COUNT * 3);
  const honeyDropLife = new Float32Array(HONEY_DROP_COUNT);

  for (let i = 0; i < HONEY_DROP_COUNT; i++) {
    honeyDropPos[i * 3 + 1] = -10;  // park off-screen
    honeyDropLife[i] = 0;
  }

  const honeyDropGeo = new THREE.BufferGeometry();
  honeyDropGeo.setAttribute('position', new THREE.BufferAttribute(honeyDropPos, 3));
  const honeyDropLifeAttr = new THREE.BufferAttribute(honeyDropLife, 1);
  honeyDropGeo.setAttribute('aLife', honeyDropLifeAttr);

  const honeyDropMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float aLife;
      varying float vLife;
      void main() {
        vLife = aLife;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        float sz = (6.0 + aLife * 10.0) * (200.0 / -mvPos.z);
        gl_PointSize = clamp(sz, 2.0, 32.0);
        gl_Position  = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vLife;
      void main() {
        vec2 pc = gl_PointCoord - vec2(0.5);
        pc.y *= 0.70;  // squash to teardrop silhouette
        float r = length(pc);
        if (r > 0.5) discard;
        float alpha = smoothstep(0.5, 0.05, r) * vLife * 0.88;
        // Amber-gold gradient: darker core, bright rim
        vec3 amber = mix(vec3(0.80, 0.40, 0.02), vec3(1.0, 0.80, 0.18), smoothstep(0.0, 0.4, r));
        gl_FragColor = vec4(amber, alpha);
      }
    `
  });

  const honeyDropPoints = new THREE.Points(honeyDropGeo, honeyDropMat);
  stage0.add(honeyDropPoints);

  let honeyDropTimer    = 0;
  let nextHoneySpawnDelay = 0.45;

  // Luxury Hotspots on The Seed
  createLuxuryHotspot(stage0, 0.38, -0.22, 0.22, {
    title: "Raw Texas Wildflower Honey",
    desc: "Hand-cut raw comb from local Montgomery County apiaries. Golden viscosity and pure floral nectar.",
    badge: "Tasting Note",
    station: 0,
    onClick: () => playCrystalChime(932)
  });

  createLuxuryHotspot(stage0, 0.48, 0.32, 0.18, {
    title: "Organic Fresh Cut Rosemary",
    desc: "Aromatic garden rosemary releasing herbaceous pine notes that cut through rich cured fats.",
    badge: "Aromatic Herb",
    station: 0,
    onClick: () => playCrystalChime(880)
  });

  createLuxuryHotspot(stage0, -0.20, -0.10, 0.20, {
    title: "Folded Prosciutto Ribbon",
    desc: "Imported San Daniele cured ham shaved paper-thin and rolled by hand into an artisan floret.",
    badge: "Charcuterie Craft",
    station: 0,
    onClick: () => playCrystalChime(784)
  });

  scene.add(stage0);
  stageGroups.push(stage0);

  // =========================================================================
  // STATION 1: THE ARTISAN BOARD (Gathering Scale · 10–25 Guests)
  // =========================================================================
  const stage1 = new THREE.Group();
  stage1.position.set(8.35, 0.05, 0.0);
  stage1.rotation.set(-0.04, 0.18, 0);

  // Genuine 3D Black Walnut Slab, Cheeses, Mission Figs, Wine Glass
  const artisanBoard3D = createArtisanBoard3D();
  stage1.add(artisanBoard3D);

  createLuxuryHotspot(stage1, -0.42, 0.42, 0.18, {
    title: "Aged Spanish Manchego (D.O.P.)",
    desc: "12-month cave-aged sheep's milk from La Mancha. Firm, crystalline crunch with toasted hazelnut aromas.",
    badge: "Artisan Cheese",
    station: 1,
    onClick: () => playCrystalChime(659)
  });

  createLuxuryHotspot(stage1, -0.15, 0.18, 0.18, {
    title: "French Triple-Crème Brie",
    desc: "Isigny Sainte-Mère bloomy rind with decadent cultured cream and honeycomb drizzle.",
    badge: "Artisan Cheese",
    station: 1,
    onClick: () => playCrystalChime(784)
  });

  createLuxuryHotspot(stage1, 0.12, -0.15, 0.16, {
    title: "Fresh Black Mission Figs",
    desc: "Hand-picked ripe mission figs sliced open and paired with aged balsamic glaze.",
    badge: "Seasonal Harvest",
    station: 1,
    onClick: () => playCrystalChime(1046)
  });

  createLuxuryHotspot(stage1, 0.38, 0.38, 0.22, {
    title: "Crystal Sommelier Stemware",
    desc: "Designed to pair with crisp French Champagne or dry mineral Pinot Noir.",
    badge: "Beverage Pairing",
    station: 1,
    onClick: () => playCrystalChime(1174)
  });

  scene.add(stage1);
  stageGroups.push(stage1);

  // =========================================================================
  // STATION 2: THE BANQUET (Room Scale · 50–150+ Guests)
  // =========================================================================
  const stage2 = new THREE.Group();
  stage2.position.set(22.2, 0.05, 0.0);
  stage2.rotation.set(-0.04, -0.16, 0);

  // 12-Foot Sweeping Banquet Table, Candles, Eucalyptus Runner, Tier Displays
  const banquetTable3D = createBanquetTable3D();
  stage2.add(banquetTable3D);

  createLuxuryHotspot(stage2, -0.55, -0.15, 0.18, {
    title: "12-Foot Continuous Feast",
    desc: "Stretches across your ballroom or dining hall. Ninety minutes of non-stop grazing. No chafing dishes.",
    badge: "Signature Table",
    station: 2,
    onClick: () => playCrystalChime(659)
  });

  createLuxuryHotspot(stage2, 0.45, 0.25, 0.20, {
    title: "Curated Tiers ($24–$38/pp)",
    desc: "Four tiers featuring custom slider bars, house dips, and farm vegetable crudités.",
    badge: "Menu Tiers",
    station: 2,
    onClick: () => playCrystalChime(880)
  });

  scene.add(stage2);
  stageGroups.push(stage2);

  // =========================================================================
  // STATION 3: THE MIDNIGHT CART (Houston's Largest Cart & Sugar Burst)
  // =========================================================================
  const stage3 = new THREE.Group();
  stage3.position.set(28.35, 0.05, 0.0);
  stage3.rotation.set(-0.04, 0.18, 0);

  // Full 3D Mobile Cart, Canopy, Inverse-Square Edison Bulbs, Champagne & Holy Grail
  const mobileCart3D = createMobileCart3D();
  stage3.add(mobileCart3D);

  // 3D Powdered Sugar Particle System (140 particles)
  const SUGAR_COUNT = 140;
  const sugarGeo = new THREE.BufferGeometry();
  const sugarPos = new Float32Array(SUGAR_COUNT * 3);
  const sugarVelo = new Float32Array(SUGAR_COUNT * 3);
  for (let i = 0; i < SUGAR_COUNT; i++) {
    sugarPos[i * 3 + 0] = -0.45;
    sugarPos[i * 3 + 1] = 0.05;
    sugarPos[i * 3 + 2] = 0.15;
    sugarVelo[i * 3 + 1] = -100;
  }
  sugarGeo.setAttribute('position', new THREE.BufferAttribute(sugarPos, 3));
  const sugarMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.032,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });
  const sugarField = new THREE.Points(sugarGeo, sugarMat);
  stage3.add(sugarField);

  // ── Champagne Bubble Rising Simulation (Stage 3) ─────────────────────────
  const CHAMP_COUNT = 60;
  const champPos  = new Float32Array(CHAMP_COUNT * 3);
  const champVelo = new Float32Array(CHAMP_COUNT * 3);
  const champLife = new Float32Array(CHAMP_COUNT);
  const champPhase = new Float32Array(CHAMP_COUNT);

  for (let i = 0; i < CHAMP_COUNT; i++) {
    champPos[i * 3 + 1] = -10;
    champLife[i] = 0;
    champPhase[i] = Math.random() * 6.28;
  }

  const champGeo = new THREE.BufferGeometry();
  champGeo.setAttribute('position', new THREE.BufferAttribute(champPos, 3));
  const champLifeAttr = new THREE.BufferAttribute(champLife, 1);
  champGeo.setAttribute('aLife', champLifeAttr);

  const champMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aLife;
      varying float vLife;
      void main() {
        vLife = aLife;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        float sz = (5.0 + aLife * 8.0) * (160.0 / -mvPos.z);
        gl_PointSize = clamp(sz, 1.0, 22.0);
        gl_Position  = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vLife;
      void main() {
        vec2 pc  = gl_PointCoord - vec2(0.5);
        float r  = length(pc);
        if (r > 0.5) discard;
        // Ring halo — bright edge, transparent center
        float ring  = smoothstep(0.08, 0.0, abs(r - 0.38));
        float alpha = ring * vLife * 0.72;
        vec3  col   = vec3(0.96, 0.88, 0.60) * 1.6;  // warm champagne gold
        gl_FragColor = vec4(col, alpha);
      }
    `
  });

  const champPoints = new THREE.Points(champGeo, champMat);
  stage3.add(champPoints);

  let champTimer = 0;
  let nextChampDelay = 0.08;

  let isSugarSimActive = false;
  let sugarSimTimer = 0;

  function triggerSugarBurst() {
    playSugarPuff();
    for (let i = 0; i < SUGAR_COUNT; i++) {
      sugarPos[i * 3 + 0] = -0.45 + (Math.random() - 0.5) * 0.15;
      sugarPos[i * 3 + 1] = 0.05;
      sugarPos[i * 3 + 2] = 0.15 + (Math.random() - 0.5) * 0.15;

      sugarVelo[i * 3 + 0] = (Math.random() - 0.5) * 1.6;
      sugarVelo[i * 3 + 1] = 0.9 + Math.random() * 1.3;
      sugarVelo[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    sugarGeo.attributes.position.needsUpdate = true;
    isSugarSimActive = true;
    sugarSimTimer = 2.2;
  }

  createLuxuryHotspot(stage3, -0.45, 0.08, 0.18, {
    title: "Fresh Zeppole Beignets ($4.50/pp)",
    desc: "Warm Italian fried dough dusted on-site with powdered confectioners' sugar.",
    badge: "Click for Sugar Burst!",
    station: 3,
    onClick: triggerSugarBurst
  });

  createLuxuryHotspot(stage3, 0.0, 0.65, 0.16, {
    title: "Ambient Edison Filament Bulbs",
    desc: "Warm 2200K amber filament lighting creating the romantic Midnight Supper glow.",
    badge: "Lighting Atmosphere",
    station: 3,
    onClick: () => playCrystalChime(784)
  });

  createLuxuryHotspot(stage3, 0.42, 0.15, 0.18, {
    title: "The Holy Grail Centerpiece",
    desc: "$2,000 (75 guests) · $3,500 (150 guests). Cascading multi-tier boards, floral runners, and live chef service.",
    badge: "Flagship Showpiece",
    station: 3,
    onClick: () => playCrystalChime(987)
  });

  scene.add(stage3);
  stageGroups.push(stage3);

  // =========================================================================
  // STATION 4: CHEF TRICIA (Pedigree & Verified Awards)
  // =========================================================================
  const stage4 = new THREE.Group();
  stage4.position.set(41.65, 0.05, 0.0);
  stage4.rotation.set(-0.04, -0.18, 0);

  // 3D Damascus Steel Knife, Butcher Block, Accolade Badges
  const heritageStage3D = createHeritageStage3D();
  stage4.add(heritageStage3D);

  createLuxuryHotspot(stage4, -0.45, -0.22, 0.18, {
    title: "The Knot — Best of Weddings 2026",
    desc: "5.0 Stars (13 verified bride reviews). 'The single most complimented element of our entire wedding!'",
    badge: "Verified Trust",
    station: 4,
    onClick: () => playCrystalChime(880)
  });

  createLuxuryHotspot(stage4, 0.45, -0.12, 0.18, {
    title: "Thirty-Five Years Restaurant Pedigree",
    desc: "Tricia spent 35 years behind high-volume restaurant knife stations. Scratch breads, pickles, and preserves.",
    badge: "Culinary Discipline",
    station: 4,
    onClick: () => playCrystalChime(987)
  });

  createLuxuryHotspot(stage4, 0.0, -0.38, 0.18, {
    title: "WeddingWire — Couples' Choice 2026",
    desc: "5.0 Stars (11 verified couple reviews, 100% recommended). Houston's premier bespoke grazing tables.",
    badge: "Couples' Choice",
    station: 4,
    onClick: () => playCrystalChime(1046)
  });

  scene.add(stage4);
  stageGroups.push(stage4);

  // =========================================================================
  // STATION 5: 3D SPATIAL CONTROL SURFACE (Interactive Configurator)
  // =========================================================================
  const stage5 = new THREE.Group();
  stage5.position.set(50.0, 0.05, 0.0);
  stage5.rotation.set(-0.04, 0.0, 0);

  const { consoleGroup, buttons: console3DButtons, sliderPuck } = createSpatialConsole3D();
  stage5.add(consoleGroup);

  scene.add(stage5);
  stageGroups.push(stage5);

  // =========================================================================
  // 10. GPU CURL-NOISE VOLUMETRIC EMBER PARTICLE FIELD (F04, F22)
  // =========================================================================
  const emberPoints = createGpuEmberField(320);
  scene.add(emberPoints);

  // =========================================================================
  // 11. CAMERA SCROLLYTELLING TRAJECTORY (F02, F03)
  // =========================================================================
  const STATIONS = [
    { camPos: [ 0.0, 0.35, 3.4], lookAt: [ 0.8, 0.05, 0.0], label: '00 / THE SEED' },
    { camPos: [ 9.8, 0.35, 3.4], lookAt: [ 9.0, 0.05, 0.0], label: '01 / THE BOARD' },
    { camPos: [20.0, 0.35, 3.6], lookAt: [20.8, 0.05, 0.0], label: '02 / THE BANQUET' },
    { camPos: [29.8, 0.35, 3.4], lookAt: [29.0, 0.05, 0.0], label: '03 / THE CART' },
    { camPos: [40.0, 0.35, 3.4], lookAt: [40.8, 0.05, 0.0], label: '04 / THE CHEF' },
    { camPos: [50.0, 0.65, 5.5], lookAt: [50.0, 0.00, 0.0], label: '05 / INSTANT QUOTE' }
  ];

  // ── Dense 11-point 3D Arc Camera Path ─────────────────────────────────────
  // Stations land at even indices (0,2,4,6,8,10); odd indices are cinematic
  // arc control points that shape the Catmull-Rom curve into genuine 3D arcs.
  // Station→progress mapping is unchanged: t = stationIndex / (totalStations-1)
  // The spline simply has more control points shaping the curve between stops.
  const CAM_ARC_POINTS = [
    // idx  0 — Station 0: intimate ground-level macro view
    [  0.0,  0.05,  3.3],
    // idx  1 — Arc 0→1: crane UPWARD and BACK (stepping away to see the full board)
    [  4.8,  3.20,  8.8],
    // idx  2 — Station 1: high bird's-eye looking down over the artisan board
    [  9.8,  2.60,  7.8],
    // idx  3 — Arc 1→2: fast DESCENT — low-speed tracking shot alongside the feast
    [ 14.8, -0.25,  2.3],
    // idx  4 — Station 2: low tracking angle, close to the banquet table surface
    [ 20.0, -0.20,  2.5],
    // idx  5 — Arc 2→3: explosive CRANE UP — cart reveal from below
    [ 24.5,  4.00,  9.5],
    // idx  6 — Station 3: high reveal, looking down at the midnight cart
    [ 29.8,  2.40,  7.5],
    // idx  7 — Arc 3→4: graceful crane DESCENT to portrait eye-level
    [ 34.5,  0.60,  4.2],
    // idx  8 — Station 4: natural head-height portrait of Chef Tricia
    [ 40.0,  0.45,  3.5],
    // idx  9 — Arc 4→5: push in CLOSE then pull all the way back for reveal
    [ 44.8, -0.30,  2.0],
    // idx 10 — Station 5: elevated pullback, full-quote-calculator overview
    [ 50.0,  1.20,  6.2],
  ];

  const LOOK_ARC_POINTS = [
    // Mirrors the cam arc — lookAt pts for each arc position
    [  1.2,  0.10, 0.0],   // Station 0
    [  6.0,  0.20, 0.0],   // Arc 0→1
    [  8.2, -0.30, 0.0],   // Station 1  (camera high → look down on board)
    [ 16.0,  0.30, 0.0],   // Arc 1→2
    [ 21.5,  0.15, 0.0],   // Station 2
    [ 26.5,  0.00, 0.0],   // Arc 2→3
    [ 27.5, -0.20, 0.0],   // Station 3  (camera high → look down at cart)
    [ 38.0,  0.20, 0.0],   // Arc 3→4
    [ 41.5,  0.10, 0.0],   // Station 4
    [ 48.5,  0.50, 0.0],   // Arc 4→5
    [ 50.0,  0.00, 0.0],   // Station 5
  ];

  // Catmull-Rom Centripetal 3D Spline Evaluator (Smooth C1 Continuous Camera Trajectory)
  class CatmullRomSpline3 {
    constructor(points) {
      this.points = points.map(p => ({ x: p[0], y: p[1], z: p[2] }));
    }

    getPoint(t, target = { x: 0, y: 0, z: 0 }) {
      const pts = this.points;
      const l = pts.length;
      const clampedT = Math.max(0, Math.min(1, t));
      const p = (l - 1) * clampedT;
      const intPoint = Math.min(Math.floor(p), l - 2);
      const weight = p - intPoint;

      const p0 = pts[intPoint === 0 ? 0 : intPoint - 1];
      const p1 = pts[intPoint];
      const p2 = pts[intPoint + 1];
      const p3 = pts[intPoint + 2 >= l ? l - 1 : intPoint + 2];

      const w2 = weight * weight;
      const w3 = weight * w2;

      target.x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * weight + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * w2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * w3);
      target.y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * weight + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * w2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * w3);
      target.z = 0.5 * ((2 * p1.z) + (-p0.z + p2.z) * weight + (2 * p0.z - 5 * p1.z + 4 * p2.z - p3.z) * w2 + (-p0.z + 3 * p1.z - 3 * p2.z + p3.z) * w3);

      return target;
    }
  }

  // Use the dense arc path instead of the flat STATIONS array
  const cameraPathSpline = new CatmullRomSpline3(CAM_ARC_POINTS);
  const lookAtPathSpline  = new CatmullRomSpline3(LOOK_ARC_POINTS);

  let currentStation = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  const totalStations = STATIONS.length;

  let scrollVelocity = 0;
  let isDragging = false;
  let startX = 0, startY = 0;
  let orbitTiltX = 0, orbitTiltY = 0;

  // Hold-to-enter portal state (Station 0 CTA mechanic)
  let holdPortalActive   = false;
  let holdPortalProgress = 0.0;
  let holdPortalFired    = false;

  function setStation(idx, instant = false) {
    if (idx < 0 || idx >= totalStations) return;
    hideSpatialHUD();
    currentStation = idx;
    targetProgress = idx / (totalStations - 1);
    scrollVelocity = 0;
    if (instant) {
      currentProgress = targetProgress;
    }

    // Switch video stream to corresponding Higgsfield clip
    updateVideoBackdrop(idx);

    // Instant update of UI Plates
    chapters.forEach((ch, i) => {
      if (instant) ch.style.transition = 'none';
      ch.classList.toggle('active', i === idx);
      if (instant) {
        setTimeout(() => { ch.style.transition = ''; }, 40);
      }
    });

    // Update Nav Bar
    navBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === idx);
      if (i === idx) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });

    // Update Rail
    if (railBar) railBar.style.height = `${(idx / (totalStations - 1)) * 100}%`;
    if (railText) railText.textContent = STATIONS[idx].label;

    playSingingBowl(520 + idx * 45);
    hideSpatialHUD();

    // Dispatch interface event (PROJECT.md)
    window.dispatchEvent(new CustomEvent('chapterChange', { detail: { chapterIndex: idx, instant } }));
  }

  // --- Wheel & Drag Input Handlers ---
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    scrollVelocity += e.deltaY * 0.0006;
  }, { passive: false });

  let isSceneDrag = false;
  window.addEventListener('mousedown', (e) => {
    if (e.target.closest('input, button, a, label, .receipt-card, .plate')) return;
    isSceneDrag = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2;

    if (isSceneDrag) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = e.clientX;
      startY = e.clientY;
      orbitTiltX += dx * 0.004;
      orbitTiltY += dy * 0.004;
      orbitTiltY = Math.max(-0.4, Math.min(0.4, orbitTiltY));
    } else {
      checkHotspotRaycast(e.clientX, e.clientY);
    }
  });

  window.addEventListener('mouseup', () => { isSceneDrag = false; });

  // Touch Handlers
  window.addEventListener('touchstart', (e) => {
    if (e.target.closest('input, button, a, label, .receipt-card, .plate')) return;
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const dy = startY - e.touches[0].clientY;
    const dx = startX - e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;

    scrollVelocity += dy * 0.0022;
    orbitTiltX += dx * 0.003;
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });

  // Click on 3D hotspots & 3D tactile console
  window.addEventListener('click', (e) => {
    if (e.target.closest('input, button, a, label, .receipt-card, .plate')) return;
    initAudio();
    videoMgr.wakeAll();
    const hit = performHotspotRaycast(e.clientX, e.clientY);
    if (hit && hit.object.userData.info && hit.object.userData.info.station === currentStation) {
      showSpatialHUD(hit.object, hit.object.userData.info);
      if (hit.object.userData.info.onClick) {
        hit.object.userData.info.onClick();
      }
    } else if (currentStation === 5) {
      check3DConsoleClick(e.clientX, e.clientY);
    } else {
      hideSpatialHUD();
    }
  });

  // Nav Buttons Click
  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      initAudio();
      videoMgr.wakeAll();
      const idx = parseInt(btn.dataset.goto, 10);
      setStation(idx);
    });
  });

  // Link Ticket / CTA Clicks
  document.querySelectorAll('[data-goto]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      initAudio();
      videoMgr.wakeAll();
      const idx = parseInt(el.dataset.goto, 10);
      setStation(idx);
    });
  });

  // =========================================================================
  // 12. RAYCASTING & SPATIAL HUD (F19, F20)
  // =========================================================================
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const raycaster = new THREE.Raycaster();
  const rayMouse = new THREE.Vector2();

  function performHotspotRaycast(clientX, clientY) {
    rayMouse.x = (clientX / window.innerWidth) * 2 - 1;
    rayMouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(rayMouse, camera);

    const hits = raycaster.intersectObjects(cachedHotspotMeshes, false);
    if (hits.length > 0) {
      let p = hits[0].object;
      while (p && !p.userData.isHotspot && p.parent) p = p.parent;
      return p ? { object: p, point: hits[0].point } : null;
    }
    return null;
  }

  function check3DConsoleClick(clientX, clientY) {
    if (cached3DConsoleMeshes.length === 0) return;
    rayMouse.x = (clientX / window.innerWidth) * 2 - 1;
    rayMouse.y = -(clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(rayMouse, camera);

    const hits = raycaster.intersectObjects(cached3DConsoleMeshes, false);
    if (hits.length > 0) {
      let p = hits[0].object;
      while (p && !p.userData.is3DButton && p.parent) p = p.parent;
      if (p && p.userData.is3DButton) {
        p.position.y -= 0.02;
        setTimeout(() => { p.position.y += 0.02; }, 180);
        playCrystalChime(980);
        const rate = p.userData.rate;
        const pill = tierPills.find(el => el.dataset.rate === rate);
        if (pill) {
          pill.click();
        } else {
          activeTierRate = rate === 'holy-grail' ? 'holy-grail' : Number(rate);
          updateQuote();
        }
      }
    }
  }

  let activeSpatialHotspot = null;
  const screenVector = new THREE.Vector3();

  function updateSpatialHUDCoordinates() {
    if (!activeSpatialHotspot || !hudTooltip || !hudTooltip.classList.contains('is-active')) return;
    activeSpatialHotspot.getWorldPosition(screenVector);
    screenVector.project(camera);

    if (screenVector.z > 1) {
      hudTooltip.style.opacity = '0';
      if (hudLine) {
        hudLine.setAttribute('x1', '0');
        hudLine.setAttribute('y1', '0');
        hudLine.setAttribute('x2', '0');
        hudLine.setAttribute('y2', '0');
      }
      return;
    } else {
      hudTooltip.style.opacity = '1';
    }

    const x = (screenVector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-screenVector.y * 0.5 + 0.5) * window.innerHeight;

    const tipX = Math.min(window.innerWidth - 300, Math.max(20, x + 35));
    const tipY = Math.min(window.innerHeight - 160, Math.max(85, y - 50));

    hudTooltip.style.left = `${tipX}px`;
    hudTooltip.style.top = `${tipY}px`;

    if (hudReticle) {
      hudReticle.setAttribute('cx', x);
      hudReticle.setAttribute('cy', y);
    }
    if (hudLine) {
      hudLine.setAttribute('x1', x);
      hudLine.setAttribute('y1', y);
      hudLine.setAttribute('x2', tipX);
      hudLine.setAttribute('y2', tipY + 20);
    }
  }

  function checkHotspotRaycast(clientX, clientY) {
    const hit = performHotspotRaycast(clientX, clientY);
    if (hit && hit.object.userData.info && hit.object.userData.info.station === currentStation) {
      if (activeSpatialHotspot !== hit.object) {
        showSpatialHUD(hit.object, hit.object.userData.info);
      }
    } else {
      if (activeSpatialHotspot) {
        hideSpatialHUD();
      }
    }
  }

  function showSpatialHUD(object, info) {
    if (!hudTooltip) return;
    activeSpatialHotspot = object;
    if (hudTitle) hudTitle.textContent = info.title || "Tasting Note";
    if (hudDesc) hudDesc.textContent = info.desc || "";
    if (hudBadge) hudBadge.textContent = info.badge || "Interact";
    hudTooltip.classList.add('is-active');
    updateSpatialHUDCoordinates();
  }

  function hideSpatialHUD() {
    activeSpatialHotspot = null;
    if (hudTooltip) hudTooltip.classList.remove('is-active');
    if (hudLine) {
      hudLine.setAttribute('x1', 0);
      hudLine.setAttribute('y1', 0);
      hudLine.setAttribute('x2', 0);
      hudLine.setAttribute('y2', 0);
    }
  }

  // =========================================================================
  // 13. MATHEMATICAL QUOTE CONFIGURATOR LOGIC (F16, F38–F45)
  // =========================================================================
  const inputGuests = document.getElementById('input-guests');
  const lblGuests = document.getElementById('lbl-guests');
  const tierPills = Array.from(document.querySelectorAll('.tier-pill'));
  const tierCards = Array.from(document.querySelectorAll('.tier-card'));

  const rcptTierName = document.getElementById('rcpt-tier-name');
  const rcptTierSubtotal = document.getElementById('rcpt-tier-subtotal');
  const rcptAddonsRow = document.getElementById('rcpt-addons-row');
  const rcptAddonsSubtotal = document.getElementById('rcpt-addons-subtotal');
  const rcptTax = document.getElementById('rcpt-tax');
  const rcptTotal = document.getElementById('rcpt-total');
  const btnSms = document.getElementById('btn-sms');
  const btnEmail = document.getElementById('btn-email');

  const addBeignets = document.getElementById('add-beignets');
  const addCart = document.getElementById('add-cart');
  const addSliders = document.getElementById('add-sliders');
  const addMimosas = document.getElementById('add-mimosas');

  let activeTierRate = 24;
  let activeTierLabel = "Graze Me, Craze Me";

  function updateQuote() {
    const guests = parseInt(inputGuests?.value || "75", 10);
    if (lblGuests) lblGuests.textContent = `${guests} guests`;

    // Synchronize 3D Spatial Console Puck & Buttons
    if (sliderPuck) {
      const t = (Math.max(50, Math.min(300, guests)) - 50) / 250;
      sliderPuck.position.x = -1.1 + t * 2.2;
    }
    if (console3DButtons) {
      console3DButtons.forEach(btn => {
        const isActive = (btn.userData.rate === 'holy-grail' && activeTierRate === 'holy-grail') ||
                         (Number(btn.userData.rate) === Number(activeTierRate));
        if (btn.userData.mesh && btn.userData.mesh.material) {
          btn.userData.mesh.material.emissiveIntensity = isActive ? 0.9 : 0.2;
          btn.userData.mesh.material.color.setHex(isActive ? 0x3d281a : 0x1f191c);
        }
      });
    }

    let tierSubtotal = 0;
    let tierNameStr = "";

    if (activeTierRate === 'holy-grail') {
      tierSubtotal = guests <= 75 ? 2000 : 3500;
      tierNameStr = `The Holy Grail Centerpiece (${guests} guests)`;
    } else {
      const rateNum = Number(activeTierRate);
      tierSubtotal = guests * rateNum;
      tierNameStr = `${activeTierLabel} (${guests} × $${rateNum})`;
    }

    let addonsTotal = 0;
    const selectedAddons = [];
    if (addBeignets?.checked) {
      addonsTotal += guests * 4.50;
      selectedAddons.push("Zeppole Beignets ($4.50/pp)");
    }
    if (addCart?.checked) {
      addonsTotal += 350;
      selectedAddons.push("Midnight Cart Service ($350)");
    }
    if (addSliders?.checked) {
      addonsTotal += guests * 2.95;
      selectedAddons.push("Extra Sliders ($2.95/pp)");
    }
    if (addMimosas?.checked) {
      addonsTotal += guests * 4.00;
      selectedAddons.push("Mimosa Bar Setup ($4.00/pp)");
    }

    if (rcptAddonsRow && rcptAddonsSubtotal) {
      if (addonsTotal > 0) {
        rcptAddonsRow.style.display = 'flex';
        rcptAddonsSubtotal.textContent = `$${addonsTotal.toFixed(2)}`;
      } else {
        rcptAddonsRow.style.display = 'none';
      }
    }

    const setupFee = 229.00;
    const taxableSubtotal = tierSubtotal + addonsTotal + setupFee;
    const tax = Math.round(taxableSubtotal * 18) / 100;
    const total = taxableSubtotal + tax;

    if (rcptTierName) rcptTierName.textContent = tierNameStr;
    if (rcptTierSubtotal) rcptTierSubtotal.textContent = `$${tierSubtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (rcptTax) rcptTax.textContent = `$${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (rcptTotal) rcptTotal.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const smsBody = encodeURIComponent(
      `Hi Tricia! I'm planning an event for ${guests} guests using your 3D builder.\n` +
      `Tier: ${tierNameStr}\n` +
      `Food Subtotal: $${tierSubtotal.toFixed(2)}\n` +
      (selectedAddons.length ? `Add-ons: ${selectedAddons.join(', ')} ($${addonsTotal.toFixed(2)})\n` : '') +
      `Production & Styling Setup: $229.00\n` +
      `Texas State Tax (18% Catering): $${tax.toFixed(2)}\n` +
      `Total Investment: $${total.toFixed(2)}\n` +
      `Is my date available?`
    );
    if (btnSms) btnSms.href = `sms:+18324588180?body=${smsBody}`;

    const emailSubject = encodeURIComponent(`Charcuterie Chick Event Quote — ${guests} Guests (${activeTierLabel})`);
    const emailBody = encodeURIComponent(
      `Hi Chef Tricia,\n\n` +
      `I'd like to reserve a date for my event with Charcuterie Chick:\n\n` +
      `• Guest Count: ${guests} guests\n` +
      `• Selected Tier: ${tierNameStr}\n` +
      `• Food Subtotal: $${tierSubtotal.toFixed(2)}\n` +
      (selectedAddons.length ? `• Add-ons: ${selectedAddons.join(', ')} ($${addonsTotal.toFixed(2)})\n` : '') +
      `• Setup Fee: $229.00\n` +
      `• Texas State Tax (18% Catering): $${tax.toFixed(2)}\n` +
      `• Total Investment: $${total.toFixed(2)}\n\n` +
      `Please let me know your calendar availability!\n\nThank you!`
    );
    if (btnEmail) btnEmail.href = `mailto:charcuteriechick@outlook.com?subject=${emailSubject}&body=${emailBody}`;
  }

  tierPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      initAudio();
      tierPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const rate = pill.dataset.rate;
      activeTierRate = rate === 'holy-grail' ? 'holy-grail' : Number(rate);
      activeTierLabel = pill.textContent.split('$')[0].trim();
      updateQuote();
    });
  });

  tierCards.forEach((tc) => {
    tc.addEventListener('click', () => {
      initAudio();
      tierCards.forEach((c) => c.classList.remove('active'));
      tc.classList.add('active');

      const rate = tc.dataset.tier;
      activeTierRate = Number(rate);
      activeTierLabel = tc.querySelector('h3')?.textContent.trim() || "Banquet Table";

      tierPills.forEach((p) => {
        p.classList.toggle('active', p.dataset.rate === rate);
      });

      updateQuote();
    });
  });

  if (inputGuests) inputGuests.addEventListener('input', updateQuote);
  [addBeignets, addCart, addSliders, addMimosas].forEach((el) => {
    if (el) el.addEventListener('change', () => { initAudio(); updateQuote(); });
  });

  updateQuote();

  // =========================================================================
  // 14. RESIZE & WEBGL CONTEXT LIFECYCLE HANDLERS
  // =========================================================================
  let isContextLost = false;

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    isContextLost = true;
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend().catch(() => {});
    }
    console.warn('[CharcuterieChick Engine] WebGL Context Lost. Paused rendering loop.');
  }, false);

  canvas.addEventListener('webglcontextrestored', () => {
    console.log('[CharcuterieChick Engine] WebGL Context Restored. Rebuilding GPU pipelines...');
    isContextLost = false;
    const clampedDPR = getClampedDPR();
    renderer.setPixelRatio(clampedDPR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    if (bloomPipeline) {
      bloomPipeline.setSize(window.innerWidth * clampedDPR, window.innerHeight * clampedDPR);
    }
    warmupAllStations(scene, camera, renderer, STATIONS);
    clock.start();
    animate();
    if (isAudioPlaying && audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }, false);

  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  let resizeDebounce = null;

  function onResize() {
    const curW = window.innerWidth;
    const curH = window.innerHeight;
    if (curW === lastWidth && Math.abs(curH - lastHeight) <= 120) return;

    if (resizeDebounce) clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      lastWidth = curW;
      lastHeight = curH;
      camera.aspect = curW / curH;
      camera.updateProjectionMatrix();
      const clampedDPR = getClampedDPR();
      renderer.setPixelRatio(clampedDPR);
      renderer.setSize(curW, curH);
      if (bloomPipeline) {
        bloomPipeline.setSize(curW * clampedDPR, curH * clampedDPR);
      }
    }, 60);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // =========================================================================
  // 15. MAIN ANIMATION & RENDERING LOOP (F10)
  // =========================================================================
  let clock = new THREE.Clock();
  let animationFrameId = null;

  // Adaptive Bloom Fallback (<45 FPS)
  let frameCount = 0;
  let lastFpsCheckTime = performance.now();
  let rollingFps = 60;

  function animate() {
    if (isContextLost) return;
    animationFrameId = requestAnimationFrame(animate);

    const rawDt = clock.getDelta();
    const dt = Math.min(rawDt, 0.1);
    const elapsedTime = clock.getElapsedTime();

    // FPS Monitoring & Adaptive Fallback
    frameCount++;
    const now = performance.now();
    if (now - lastFpsCheckTime >= 1000) {
      rollingFps = (frameCount * 1000) / (now - lastFpsCheckTime);
      frameCount = 0;
      lastFpsCheckTime = now;

      if (rollingFps < 45 && bloomPipeline.enabled) {
        console.warn(`[CharcuterieChick Engine] Performance fallback: FPS ${rollingFps.toFixed(1)} < 45. Disabling bloom pass.`);
        bloomPipeline.enabled = false;
      } else if (rollingFps >= 55 && !bloomPipeline.enabled) {
        console.log(`[CharcuterieChick Engine] Performance recovered: FPS ${rollingFps.toFixed(1)} >= 55. Re-enabling bloom pass.`);
        bloomPipeline.enabled = true;
      }
    }

    // Framerate-Independent Exponential Decay
    const momentumDecay = Math.exp(-7.6 * dt);
    targetProgress += scrollVelocity;
    scrollVelocity *= momentumDecay;
    targetProgress = Math.max(0, Math.min(1, targetProgress));

    const trackingDecay = 1.0 - Math.exp(-5.5 * dt);
    currentProgress += (targetProgress - currentProgress) * trackingDecay;

    // Synchronize UI plates and Nav when continuously scrolling
    if (Math.abs(scrollVelocity) > 0.0001 || isDragging) {
      const activeIdx = Math.round(currentProgress * (totalStations - 1));
      if (activeIdx !== currentStation) {
        currentStation = activeIdx;
        updateVideoBackdrop(activeIdx);
        chapters.forEach((ch, i) => {
          ch.classList.toggle('active', i === activeIdx);
        });
        navBtns.forEach((btn, i) => {
          btn.classList.toggle('active', i === activeIdx);
          if (i === activeIdx) btn.setAttribute('aria-current', 'page');
          else btn.removeAttribute('aria-current');
        });
        if (railBar) railBar.style.height = `${(activeIdx / (totalStations - 1)) * 100}%`;
        if (railText) railText.textContent = STATIONS[activeIdx].label;
        window.dispatchEvent(new CustomEvent('chapterChange', { detail: { chapterIndex: activeIdx } }));
      }
    }

    // Evaluate Catmull-Rom Centripetal Camera Spline Trajectory across Stations
    const curCam = cameraPathSpline.getPoint(currentProgress, { x: 0, y: 0, z: 0 });
    const curLook = lookAtPathSpline.getPoint(currentProgress, { x: 0, y: 0, z: 0 });

    // Mouse Parallax & Orbit Tilt Decay with Verlet Momentum Damping
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    const tiltDecay = Math.exp(-3.7 * dt);
    orbitTiltX *= tiltDecay;
    orbitTiltY *= tiltDecay;

    camera.position.set(
      curCam.x + mouse.x * 0.35 + orbitTiltX * 1.5,
      curCam.y - mouse.y * 0.25 - orbitTiltY * 1.2,
      curCam.z + Math.sin(elapsedTime * 0.38) * 0.08  // kinetic idle breath
        - Math.abs(scrollVelocity) * 0.8              // lens pull-back on scroll
    );
    camera.lookAt(curLook.x, curLook.y, curLook.z);

    // Roll banking along Catmull-Rom arc turns
    const rollAngle = Math.sin(currentProgress * Math.PI * 2.0) * 0.035;
    camera.rotation.z += rollAngle;

    // Velocity-responsive FOV lens breathing (40.0 deg up to 48.5 deg)
    if (!holdPortalActive && holdPortalProgress <= 0) {
      const targetFov = 40.0 + Math.min(8.5, Math.abs(scrollVelocity) * 18.0);
      camera.fov += (targetFov - camera.fov) * 0.1;
      camera.updateProjectionMatrix();
    }

    // Cursor Follow Light
    cursorLight.position.set(camera.position.x + mouse.x * 1.5, camera.position.y - mouse.y * 1.2, camera.position.z - 1.5);

    // Video Texture Background Stage Position Tracking
    const vProg = videoMgr.update();
    videoBlendMat.uniforms.uProgress.value = vProg;
    videoBlendMat.uniforms.uTime.value = elapsedTime;
    bgStageMesh.position.x = curLook.x;
    bgStageMesh.position.y = curLook.y + 0.4;
    bgStageMesh.position.z = -5.2;

    // Kinetic Relief Portal Materials Update
    reliefPortalMaterials.forEach((mat) => {
      mat.uniforms.uPointer.value.set(mouse.x, mouse.y);
      mat.uniforms.uScrollSpeed.value = scrollVelocity;
      mat.uniforms.uLightPos.value.copy(keyLight.position);
      mat.uniforms.uCursorLightPos.value.copy(cursorLight.position);
    });

    // Kinetic Station 0 Honey & Prosciutto Materials Update
    honeyMat.uniforms.uTime.value = elapsedTime;
    honeyMat.uniforms.uLightPos.value.copy(keyLight.position);
    honeyMat.uniforms.uCursorLightPos.value.copy(cursorLight.position);

    ribbonMat.uniforms.uTime.value = elapsedTime;
    ribbonMat.uniforms.uScrollSpeed.value = scrollVelocity;
    ribbonMat.uniforms.uLightPos.value.copy(keyLight.position);

    // Candle Multi-Harmonic Organic Flicker — more dramatic range
    candleLights.forEach((c) => {
      const flicker = 0.55 * Math.sin(7.31 * elapsedTime + c.phase) +
                      0.35 * Math.cos(11.17 * elapsedTime + 1.3 * c.phase) +
                      0.22 * Math.sin(17.93 * elapsedTime + 2.7 * c.phase) +
                      0.10 * Math.sin(31.4  * elapsedTime + 4.1 * c.phase);  // high freq micro-flicker
      c.light.intensity = c.baseIntensity + flicker;
    });

    // Gentle Float on Stage Displays
    stageGroups.forEach((sg, i) => {
      const bob = Math.sin(elapsedTime * 1.5 + i * 1.2) * 0.035;
      sg.position.y = (sg.userData.baseY || 0) + bob;
    });

    // Animate Rotating Ethereal Hotspot Rings
    rotatingRings.forEach((r, ri) => {
      r.rotation.z += 0.02;
      const breathe = 1.0 + Math.sin(elapsedTime * 3.5 + ri) * 0.15;
      r.scale.set(breathe, breathe, 1);
    });

    // Gated Powdered Sugar Particle Simulation
    if (isSugarSimActive) {
      sugarSimTimer -= dt;
      if (sugarSimTimer <= 0) {
        isSugarSimActive = false;
      }
      const sPos = sugarGeo.attributes.position.array;
      for (let i = 0; i < SUGAR_COUNT; i++) {
        if (sugarVelo[i * 3 + 1] > -50) {
          sPos[i * 3 + 0] += sugarVelo[i * 3 + 0] * dt;
          sPos[i * 3 + 1] += sugarVelo[i * 3 + 1] * dt;
          sPos[i * 3 + 2] += sugarVelo[i * 3 + 2] * dt;

          sugarVelo[i * 3 + 1] -= 2.4 * dt;
          sugarVelo[i * 3 + 0] *= 0.98;
          sugarVelo[i * 3 + 2] *= 0.98;

          if (sPos[i * 3 + 1] < -0.8) {
            sugarVelo[i * 3 + 1] = -100;
          }
        }
      }
      sugarGeo.attributes.position.needsUpdate = true;
    }

    // ── Honey Drip Viscous Physics (Station 0 only) ─────────────────────────
    if (currentStation === 0) {
      honeyDropTimer += dt;
      if (honeyDropTimer >= nextHoneySpawnDelay) {
        honeyDropTimer = 0;
        nextHoneySpawnDelay = 0.38 + Math.random() * 0.55;
        // Find an idle drop and respawn it
        for (let i = 0; i < HONEY_DROP_COUNT; i++) {
          if (honeyDropLife[i] <= 0.01) {
            // Bottom of honey sphere in stage0 local space ≈ Y=-0.47
            honeyDropPos[i * 3 + 0] = 0.38 + (Math.random() - 0.5) * 0.06;
            honeyDropPos[i * 3 + 1] = -0.47 + Math.random() * 0.04;
            honeyDropPos[i * 3 + 2] = 0.18 + (Math.random() - 0.5) * 0.04;
            honeyDropVelo[i * 3 + 0] = (Math.random() - 0.5) * 0.03;
            honeyDropVelo[i * 3 + 1] = -0.015;  // start very slow — viscous
            honeyDropVelo[i * 3 + 2] = (Math.random() - 0.5) * 0.03;
            honeyDropLife[i] = 1.0;
            break;
          }
        }
      }

      for (let i = 0; i < HONEY_DROP_COUNT; i++) {
        if (honeyDropLife[i] > 0.005) {
          // Viscous gravity — much slower than water
          honeyDropVelo[i * 3 + 1] -= 0.75 * dt;
          honeyDropVelo[i * 3 + 1]  = Math.max(honeyDropVelo[i * 3 + 1], -1.0); // terminal
          // Viscous drag on horizontal drift
          honeyDropVelo[i * 3 + 0] *= 0.97;
          honeyDropVelo[i * 3 + 2] *= 0.97;
          // Advance position
          honeyDropPos[i * 3 + 0] += honeyDropVelo[i * 3 + 0] * dt;
          honeyDropPos[i * 3 + 1] += honeyDropVelo[i * 3 + 1] * dt;
          honeyDropPos[i * 3 + 2] += honeyDropVelo[i * 3 + 2] * dt;
          // Fade out when drop reaches floor
          if (honeyDropPos[i * 3 + 1] < -1.5) {
            honeyDropLife[i] -= dt * 3.5;
          }
          if (honeyDropLife[i] < 0) honeyDropLife[i] = 0;
        }
      }

      honeyDropGeo.attributes.position.needsUpdate = true;
      honeyDropLifeAttr.needsUpdate = true;
      honeyDropMat.uniforms.uTime.value = elapsedTime;
    }

    // ── Champagne Bubble Physics (Station 3 only) ────────────────────────────
    if (currentStation === 3) {
      champTimer += dt;
      if (champTimer >= nextChampDelay) {
        champTimer = 0;
        nextChampDelay = 0.055 + Math.random() * 0.10;
        for (let i = 0; i < CHAMP_COUNT; i++) {
          if (champLife[i] <= 0.01) {
            // Spawn from base of centerpiece display
            champPos[i * 3 + 0] = (Math.random() - 0.5) * 0.85;
            champPos[i * 3 + 1] = -0.65 + Math.random() * 0.08;
            champPos[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
            champVelo[i * 3 + 0] = (Math.random() - 0.5) * 0.07;
            champVelo[i * 3 + 1] = 0.22 + Math.random() * 0.38;  // rise speed
            champVelo[i * 3 + 2] = (Math.random() - 0.5) * 0.07;
            champLife[i] = 1.0;
            break;
          }
        }
      }

      for (let i = 0; i < CHAMP_COUNT; i++) {
        if (champLife[i] > 0.005) {
          // Natural buoyancy rise + oscillation
          champPos[i * 3 + 0] += champVelo[i * 3 + 0] * dt
            + Math.sin(elapsedTime * 3.8 + champPhase[i]) * 0.003;
          champPos[i * 3 + 1] += champVelo[i * 3 + 1] * dt;
          champPos[i * 3 + 2] += champVelo[i * 3 + 2] * dt;
          champVelo[i * 3 + 1] *= 0.997;  // gentle drag as bubbles rise
          // Fade in quickly, then fade near top of display
          if (champPos[i * 3 + 1] > 0.75) {
            champLife[i] -= dt * 1.6;
          }
          if (champLife[i] < 0) champLife[i] = 0;
        }
      }

      champGeo.attributes.position.needsUpdate = true;
      champLifeAttr.needsUpdate = true;
    }

    // ── Hold-to-Enter Portal Expansion (Station 0 CTA mechanic) ─────────────
    if (holdPortalActive && currentStation === 0) {
      holdPortalProgress = Math.min(holdPortalProgress + dt / 0.85, 1.0);
      // Scale stage0 toward camera — dramatic zoom-in effect
      const portalScale = 1.0 + holdPortalProgress * 2.4;
      stage0.scale.setScalar(portalScale);
      // Narrow the FOV slightly (zoom lens feel)
      camera.fov = 40 - holdPortalProgress * 10;
      camera.updateProjectionMatrix();
      // Auto-fire navigation at completion
      if (holdPortalProgress >= 1.0 && !holdPortalFired) {
        holdPortalFired = true;
        setTimeout(() => setStation(1), 80);
      }
    } else if (!holdPortalActive && holdPortalProgress > 0) {
      // Quick spring-back reset on release
      holdPortalProgress = Math.max(holdPortalProgress - dt * 5, 0);
      const portalScale = 1.0 + holdPortalProgress * 2.4;
      stage0.scale.setScalar(portalScale);
      camera.fov = 40 - holdPortalProgress * 10;
      camera.updateProjectionMatrix();
      if (holdPortalProgress <= 0) {
        stage0.scale.setScalar(1);
        holdPortalFired = false;
        camera.fov = 40;
        camera.updateProjectionMatrix();
      }
    }

    // GPU Curl-Noise Embers Uniforms Update
    emberPoints.material.uniforms.uTime.value = elapsedTime;
    emberPoints.material.uniforms.uScrollSpeed.value = scrollVelocity;
    emberPoints.material.uniforms.uPointer.value.copy(cursorLight.position);

    // Lock spatial HUD tooltip and dynamic SVG leader line to active 3D beacon
    if (activeSpatialHotspot) {
      updateSpatialHUDCoordinates();
    }

    // Post-Processing Selective Bloom Render Pass
    bloomPipeline.render(scene, camera);
  }

  // Save initial stage Y positions
  stageGroups.forEach((sg) => { sg.userData.baseY = sg.position.y; });

  // Pre-compile all shaders across all 6 stations before render loop begins
  warmupAllStations(scene, camera, renderer, STATIONS);

  // Start animation loop
  animate();

  // =========================================================================
  // 16. GLOBAL API EXPORTS & BACKWARD COMPATIBILITY
  // =========================================================================
  const engineApi = {
    goTo: (idx, instant = false) => setStation(idx, instant),
    getChapter: () => currentStation,
    setGuests: (n) => {
      if (inputGuests) {
        inputGuests.value = n;
        updateQuote();
      }
    },
    focusHotspot: (index) => {
      let hp = interactiveHotspots[index];
      if (hp && hp.userData.info) {
        setStation(hp.userData.info.station, true);
        showSpatialHUD(hp, hp.userData.info);
      }
    },
    clickHotspot: (index) => {
      let hp = interactiveHotspots[index];
      // Smart resolution if hotspot 7 targets the beignet sugar burst
      if (index === 7) {
        const beignetHp = interactiveHotspots.find(h => h.userData.info && h.userData.info.title.includes('Beignet'));
        if (beignetHp) hp = beignetHp;
      }
      if (hp && hp.userData.info) {
        setStation(hp.userData.info.station, true);
        showSpatialHUD(hp, hp.userData.info);
        if (hp.userData.info.onClick) hp.userData.info.onClick();
      }
    },
    setProgress: (progress) => {
      targetProgress = Math.max(0, Math.min(1, progress));
      currentProgress = targetProgress;
    },
    jumpToStation: (index) => setStation(index, false),
    getClampedDPR: () => getClampedDPR(),
    getBloomPipeline: () => bloomPipeline,
    getRenderer: () => renderer,
    getScene: () => scene,
    getCamera: () => camera
  };

  // Expose both window.TableState (for existing tests) and window.ScrollytellingEngine (contract)
  window.TableState = engineApi;
  window.ScrollytellingEngine = engineApi;
  window.CatmullRomSpline3 = CatmullRomSpline3;

  // Expose window.QuoteEngine (contract from PROJECT.md)
  window.QuoteEngine = {
    setTier: (tierKey) => {
      const pill = tierPills.find(p => p.dataset.rate === String(tierKey) || (tierKey === 'holy' && p.dataset.rate === 'holy-grail'));
      if (pill) pill.click();
    },
    calculateQuote: ({ tier = 'graze', guests = 75, extraHours = 0, addons = [] } = {}) => {
      let foodRate = 24;
      if (tier === 'graze') foodRate = 24;
      else if (tier === 'standard') foodRate = 26;
      else if (tier === 'super') foodRate = 30;
      else if (tier === 'grand') foodRate = 38;

      let foodSubtotal = 0;
      if (tier === 'holy' || tier === 'holy-grail') {
        foodSubtotal = guests <= 75 ? 2000 : 3500;
      } else {
        foodSubtotal = guests * foodRate;
      }

      const extraTimeFee = guests * extraHours * 6;
      const setupFee = 229.00;

      let addonsSubtotal = 0;
      addons.forEach(a => {
        if (a === 'beignets') addonsSubtotal += guests * 4.50;
        else if (a === 'cart') addonsSubtotal += 350;
        else if (a === 'sliders') addonsSubtotal += guests * 2.95;
        else if (a === 'mimosas') addonsSubtotal += guests * 4.00;
      });

      const taxableSubtotal = foodSubtotal + addonsSubtotal + setupFee + extraTimeFee;
      const taxAmount = Math.round(taxableSubtotal * 18) / 100;
      const grandTotal = taxableSubtotal + taxAmount;

      return {
        foodSubtotal,
        setupFee,
        extraTimeFee,
        addonsSubtotal,
        taxableSubtotal,
        taxAmount,
        grandTotal,
        smsUrl: btnSms?.href || '',
        mailtoUrl: btnEmail?.href || ''
      };
    }
  };

  // Hold-portal API (used by immersion.js)
  window.TableState.startHoldPortal  = () => { holdPortalActive = true; holdPortalFired = false; };
  window.TableState.stopHoldPortal   = () => { holdPortalActive = false; };
  window.TableState.isHoldComplete   = () => holdPortalProgress >= 1.0;
  window.TableState.getStageGroups   = () => stageGroups;
  window.ScrollytellingEngine.startHoldPortal = window.TableState.startHoldPortal;
  window.ScrollytellingEngine.stopHoldPortal  = window.TableState.stopHoldPortal;
  window.ScrollytellingEngine.isHoldComplete  = window.TableState.isHoldComplete;
  window.ScrollytellingEngine.getStageGroups  = window.TableState.getStageGroups;

})();
