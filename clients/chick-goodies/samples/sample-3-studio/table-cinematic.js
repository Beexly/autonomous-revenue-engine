/* The Table — a persistent scene you move through, not a page you load.
 *
 * Five "pages" are five camera stations inside one scene. Scroll and the nav
 * both drive the same station value; the camera eases between them. Nothing
 * here is a picture of invented food and nothing is a model of food either:
 * the room, the table, the linen, the glass and the candles are geometry and
 * procedural shading. The food is Tricia's real photographs, lying on the
 * table as prints.
 *
 * Built on the three r170 already vendored here. No new dependency, no build
 * step, no network beyond the page's own fonts.
 */
import * as T from './vendor/three.module.js';

const canvas = document.getElementById('table-canvas');
const stage  = document.getElementById('stage');
const motion = document.getElementById('motion');
const navBtns = [...document.querySelectorAll('#stations button')];
const sections = [...document.querySelectorAll('.station')];

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const metrics = { ready:false, frames:0, paused:reduced.matches, station:1, drawCalls:0, quality:1.5 };
window.TableScene = metrics;

/* ---------- small helpers, written here rather than pulled in ---------- */
const clamp = (v,a,b) => Math.min(Math.max(v, a), b);
// cubic ease, the only easing curve this site needs
const ease  = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const lerp  = (a,b,t) => a + (b-a)*t;

/* A matcap baked in a 2D canvas: a warm key from upper left, a cool rim from
 * lower right. Crosswire's trick — baked lighting instead of real-time
 * reflections — but generated at runtime so it ships as zero bytes. */
function matcap(base, key, rim, gloss){
  const s = 128, c = document.createElement('canvas');
  c.width = c.height = s;
  const x = c.getContext('2d');
  x.fillStyle = base; x.fillRect(0,0,s,s);
  let g = x.createRadialGradient(s*.34,s*.30,2, s*.34,s*.30, s*.82);
  g.addColorStop(0,key); g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0,0,s,s);
  g = x.createRadialGradient(s*.74,s*.80,2, s*.74,s*.80, s*.46);
  g.addColorStop(0,rim); g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0,0,s,s);
  if (gloss){
    g = x.createRadialGradient(s*.30,s*.24,1, s*.30,s*.24, s*.16);
    g.addColorStop(0,'rgba(255,255,255,.95)'); g.addColorStop(1,'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0,0,s,s);
  }
  // fade the square corners so the sphere lookup stays clean
  x.globalCompositeOperation = 'destination-in';
  g = x.createRadialGradient(s/2,s/2,s*.30, s/2,s/2,s*.50);
  g.addColorStop(0,'rgba(0,0,0,1)'); g.addColorStop(1,'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0,0,s,s);
  x.globalCompositeOperation = 'source-over';
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

/* Deterministic noise so the table dresses the same way on every load. */
function seeded(seed){
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

try {

const renderer = new T.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.setClearColor(0x120d0a, 1);

const scene  = new T.Scene();
scene.fog = new T.FogExp2(0x120d0a, 0.031);
const camera = new T.PerspectiveCamera(41, 1, .1, 120);

/* ---------- light: one warm source, and the dark does the rest ---------- */
// A softbox environment, very low, so shadow stays the material.
{
  const pm = new T.PMREMGenerator(renderer), es = new T.Scene();
  es.background = new T.Color(0x120d0a);
  const panel = (hex,gain,w,h,p,r) => {
    const m = new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshBasicMaterial({ color:hex, side:T.DoubleSide }));
    m.material.color.multiplyScalar(gain);
    m.position.set(p[0],p[1],p[2]); m.rotation.set(r[0],r[1],r[2]); es.add(m);
  };
  panel(0xffd9a0, 2.4, 10, 7, [-5, 7, 3], [-Math.PI/2.4, 0, .25]);  // the warm source
  panel(0x24406b, .28, 10, 8, [ 7, 3,-5], [0, -Math.PI/2.2, 0]);     // a cold window, barely
  scene.environment = pm.fromScene(es, .06, .1, 50).texture;
  pm.dispose();
  es.traverse(o => { if (o.geometry){ o.geometry.dispose(); o.material.dispose(); } });
}

const key = new T.DirectionalLight(0xffd7a2, 3.1);
key.position.set(-6.5, 8.2, 3.4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.radius = 4;
key.shadow.bias = -0.0009;
key.shadow.normalBias = 0.022;
{ const c = key.shadow.camera; c.near = 2; c.far = 40; c.left = -14; c.right = 14; c.top = 10; c.bottom = -10; c.updateProjectionMatrix(); }
scene.add(key);
// the candle on the table: small, warm, close
const candle = new T.PointLight(0xffb057, 9, 9, 2);
candle.position.set(1.2, 1.15, 0);
scene.add(candle);
scene.add(new T.AmbientLight(0x2a1c14, 1.1));

/* ---------- the room ---------- */
const floor = new T.Mesh(
  new T.PlaneGeometry(90, 90),
  new T.MeshStandardMaterial({ color:0x1a1209, roughness:.97, metalness:0 })
);
floor.rotation.x = -Math.PI/2; floor.position.y = -1.32; floor.receiveShadow = true;
scene.add(floor);

/* ---------- the table: dark walnut, grain written in the shader ---------- */
const woodMat = new T.MeshStandardMaterial({ color:0x4a2f1c, roughness:.62, metalness:.02 });
woodMat.onBeforeCompile = sh => {
  sh.vertexShader = sh.vertexShader
    .replace('#include <common>', '#include <common>\nvarying vec3 vGrainPos;')
    .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGrainPos = position;');
  sh.fragmentShader = sh.fragmentShader
    .replace('#include <common>', `#include <common>
      varying vec3 vGrainPos;
      float gnoise(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`)
    .replace('#include <color_fragment>', `#include <color_fragment>
      // rings along x, fine fibre along z, a few darker streaks
      float ring = sin(vGrainPos.x * 5.2 + sin(vGrainPos.z * .7) * 2.4);
      float fibre = gnoise(floor(vec2(vGrainPos.x * 240.0, vGrainPos.z * 5.0)));
      float streak = smoothstep(.80, 1.0, sin(vGrainPos.x * 1.6 + 1.7));
      diffuseColor.rgb *= .80 + ring * .085 + fibre * .075;
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.13, .075, .04), streak * .35);`);
};
const table = new T.Mesh(new T.BoxGeometry(26, .34, 4.4), woodMat);
table.position.y = 0; table.castShadow = true; table.receiveShadow = true;
scene.add(table);
// legs, only where the camera can see them
for (const x of [-10.5, 10.5]) for (const z of [-1.6, 1.6]) {
  const leg = new T.Mesh(new T.CylinderGeometry(.13, .1, 1.3, 12), woodMat);
  leg.position.set(x, -.8, z); leg.castShadow = true; scene.add(leg);
}

/* ---------- linen runner: the weave is geometry shading, not an image ---------- */
const linenMat = new T.MeshStandardMaterial({ color:0xd9cdb4, roughness:.93, metalness:0, side:T.DoubleSide });
linenMat.onBeforeCompile = sh => {
  sh.uniforms.uT = { value: 0 };
  sh.vertexShader = sh.vertexShader
    .replace('#include <common>', '#include <common>\nuniform float uT;\nvarying vec2 vW;')
    .replace('#include <begin_vertex>', `#include <begin_vertex>
      vW = uv;
      // the cloth breathes, barely
      transformed.z += sin(uv.x * 11.0 + uT * .5) * .018 + sin(uv.y * 5.0 - uT * .32) * .012;`);
  sh.fragmentShader = sh.fragmentShader
    .replace('#include <common>', '#include <common>\nvarying vec2 vW;')
    .replace('#include <color_fragment>', `#include <color_fragment>
      float warp = sin(vW.x * 1100.0), weft = sin(vW.y * 190.0);
      diffuseColor.rgb *= .955 + warp * weft * .045;
      // a single woven stripe near each edge, the way real table linen runs
      float edge = smoothstep(.052, .045, abs(vW.y - .5) * -1.0 + .5);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.42, .30, .17), edge * .55);`);
  linenMat.userData.sh = sh;
};
const linen = new T.Mesh(new T.PlaneGeometry(25, 1.9, 220, 18), linenMat);
linen.rotation.x = -Math.PI/2; linen.position.y = .176;
linen.receiveShadow = true; linen.castShadow = true;
scene.add(linen);

/* ---------- glass, brass and candlelight, dressed procedurally ---------- */
const rnd = seeded(20260917);
const brass = new T.MeshMatcapMaterial({ matcap: matcap('#3a2a12','#ffd98f','#7a5520', true) });

// Glass: the "shader art" route — no built-in refract(), just a normal-driven
// UV push against what is behind, plus a rim that catches the candle.
const glassMat = new T.ShaderMaterial({
  transparent:true, side:T.DoubleSide, depthWrite:false,
  uniforms:{ uEmber:{ value:new T.Color(0xffb057) }, uTint:{ value:new T.Color(0xcfd9cf) } },
  vertexShader:`
    varying vec3 vN; varying vec3 vV;
    void main(){
      vN = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position,1.);
      vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader:`
    uniform vec3 uEmber; uniform vec3 uTint;
    varying vec3 vN; varying vec3 vV;
    void main(){
      float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.6); // fresnel
      float thickness = smoothstep(0.0, 1.0, 1.0 - abs(dot(vN, vec3(0.,1.,0.))));
      vec3 col = mix(uTint * .18, uTint * .52, thickness);
      col += uEmber * f * 1.35;                 // the candle in the rim
      gl_FragColor = vec4(col, clamp(.13 + f * .72, 0., .88));
    }`
});

/* Nothing on this table pretends to be food. The food is in her photographs,
 * which lie on the linen as prints (below). What sits with them is candlelight,
 * and a few glasses at the far ends of the table, where they catch the room
 * from a distance and never sit in front of a close camera. */
const cupGeo  = new T.CylinderGeometry(.085, .058, .23, 18, 1, true);
const stemGeo = new T.CylinderGeometry(.06, .06, .012, 14);
for (const [x, z] of [[-12.4, 1.3], [-11.0, -1.3], [12.0, 1.3], [12.6, -1.2]]){
  const g = new T.Group();
  g.position.set(x + (rnd()-.5) * .3, .17, z);
  const c = new T.Mesh(cupGeo, glassMat); c.position.y = .115; g.add(c);
  g.add(new T.Mesh(stemGeo, glassMat));
  scene.add(g);
}
const flames = [];

// candlesticks, the light the room is actually lit by
for (const x of [1.2, -4.6, 6.9]){
  const stick = new T.Mesh(new T.CylinderGeometry(.045,.075,.62,14), brass);
  stick.position.set(x, .50, .05); stick.castShadow = true; scene.add(stick);
  const flame = new T.Mesh(new T.SphereGeometry(.035,10,8), new T.MeshBasicMaterial({ color:0xffcf8a }));
  flame.position.set(x, .84, .05); flame.scale.y = 1.9; scene.add(flame);
  flames.push(flame);
}

/* ---------- her photographs, as prints lying on the table ---------- */
/* Real event photos as prints, between the objects. Angled, modest in size and
 * lit by the room, which is why 480px files read as objects here instead of as
 * soft wallpaper. */
const loader = new T.TextureLoader();
const prints = [
  { f:'table-03.jpg',  x:-11.4, w:1.05 },
  { f:'knot-3.jpg',    x: -5.9, w:1.45 },
  { f:'board-02.jpg',  x: -3.4, w:1.00 },
  { f:'table-01.jpg',  x: -2.2, w:1.05 },
  { f:'boards-01.jpg', x:  0.4, w:1.05 },
  { f:'candy-01.jpg',  x:  2.6, w:1.05 },
  { f:'board-01.jpg',  x:  5.9, w:1.05 },
];
for (const p of prints){
  loader.load('img/' + p.f, tex => {
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const ratio = (tex.image && tex.image.height / tex.image.width) || 1;
    const h = p.w * ratio;
    const geo = new T.PlaneGeometry(p.w, h, 20, 20);
    // a real print never lies flat
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++){
      const ux = pos.getX(i) / p.w, uy = pos.getY(i) / h;
      pos.setZ(i, Math.sin(ux * 2.4) * .028 + Math.cos(uy * 2.0) * .020);
    }
    geo.computeVertexNormals();
    const m = new T.Mesh(geo, new T.MeshStandardMaterial({ map:tex, roughness:.86, metalness:0 }));
    m.rotation.x = -Math.PI/2;
    m.rotation.z = (rnd()-.5) * .7;
    m.position.set(p.x, .205, (rnd()-.5)*.56);
    m.castShadow = true; m.receiveShadow = true;
    scene.add(m);
    // a paper border, so it reads as a print on a table
    const edge = new T.Mesh(new T.PlaneGeometry(p.w*1.085, h*1.085),
      new T.MeshStandardMaterial({ color:0xefe7d6, roughness:.94 }));
    edge.rotation.copy(m.rotation); edge.position.copy(m.position);
    edge.position.y -= .004; edge.receiveShadow = true;
    scene.add(edge);
  });
}

/* ---------- her food, cut out of her photographs and stood on the table ---------- */
/* No models. Each object is one of her own photographs with the background
 * removed, on an upright plane that turns to face the camera (around the
 * vertical axis only, so it stays standing), casting its own silhouette as
 * shadow. One sits under every camera station, the way a product site puts
 * one real object in the middle of the frame. The cart stands on the floor
 * behind the table. Three boards lie flat on the runner. */
const standing = [];
const cutouts = [
  { f:'knot-2.webp',    x: -1.6, z:-.15, h:1.10 },  // cones, seen from the door
  { f:'table-02.webp',  x: -4.0, z: .15, h: .95 },  // bloody marys
  { f:'knot-4.webp',    x: -7.4, z:-.10, h:1.25 },  // station 2: the cones on their riser
  { f:'sips-02.webp',   x:  4.7, z: .25, h:1.00 },  // station 3: bloody marys
  { f:'cart-640.webp',  x:  4.2, z:-3.1, h:2.55, floor:true },  // station 3: the cart itself
  { f:'graze-03.webp',  x:  7.7, z:-.20, h: .90 },  // jars
  { f:'sips-01.webp',   x:  9.0, z: .10, h: .95 },  // station 4: mimosas
  { f:'graze-02.webp',  x:  2.45,z:-.35, h: .75 },  // station 5: one cone past the candle, out of the close lens
];
const flats = [
  { f:'wide-640.webp',  x: -9.0, w:1.50 },  // the board, from above
  { f:'sweets-01.webp', x:  3.4, w:1.10 },  // the skillet
  { f:'graze-01.webp',  x:10.0, w:1.30 },   // candy trays
];
const cutMaterial = tex => new T.MeshStandardMaterial({ map:tex, transparent:true, alphaTest:.35, roughness:.9, metalness:0, side:T.DoubleSide });
const cutDepth = tex => new T.MeshDepthMaterial({ depthPacking:T.RGBADepthPacking, map:tex, alphaTest:.35 });
for (const c of cutouts){
  loader.load('img/cut/' + c.f, tex => {
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const ratio = (tex.image && tex.image.width / tex.image.height) || 1;
    const m = new T.Mesh(new T.PlaneGeometry(c.h * ratio, c.h), cutMaterial(tex));
    const base = c.floor ? -1.32 : .176;
    m.position.set(c.x, base + c.h / 2, c.z);
    m.castShadow = true;
    m.customDepthMaterial = cutDepth(tex);
    scene.add(m); standing.push(m);
    faceCamera();
  });
}
for (const c of flats){
  loader.load('img/cut/' + c.f, tex => {
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const ratio = (tex.image && tex.image.height / tex.image.width) || 1;
    const m = new T.Mesh(new T.PlaneGeometry(c.w, c.w * ratio), cutMaterial(tex));
    m.rotation.x = -Math.PI/2;
    m.rotation.z = (rnd()-.5) * .5;
    m.position.set(c.x, .21, (rnd()-.5) * .3);
    m.castShadow = true; m.receiveShadow = true;
    m.customDepthMaterial = cutDepth(tex);
    scene.add(m);
  });
}
function faceCamera(){
  for (const m of standing) m.rotation.y = Math.atan2(camera.position.x - m.position.x, camera.position.z - m.position.z);
}

/* ---------- the five stations: this is the navigation ---------- */
const STATIONS = [
  { p:[-13.0, 6.10,  11.4], t:[-1.2, 0.35,  0.0] },  // 1 arrive: the room, from the door
  { p:[ -8.6, 1.42,   3.5], t:[-7.4, 0.28,  0.1] },  // 2 the tables: down on the surface
  { p:[  4.9, 2.35,   4.9], t:[ 4.2, 0.30,  0.0] },  // 3 the cart
  { p:[ 11.6, 1.72,   3.1], t:[ 9.0, 0.55, -0.2] },  // 4 tricia: the head of the table
  { p:[  1.0, 0.92,   2.5], t:[ 1.2, 0.42,  0.0] },  // 5 the number: one setting, close
];
let station = 0;          // continuous: 0 .. STATIONS.length-1
let targetStation = 0;
const camPos = new T.Vector3(...STATIONS[0].p);
const camTgt = new T.Vector3(...STATIONS[0].t);
const pointer = new T.Vector2(), pointerTo = new T.Vector2();

function scrollStation(){
  const doc = document.documentElement;
  const max = doc.scrollHeight - innerHeight;
  const t = max > 0 ? clamp(scrollY / max, 0, 1) : 0;
  targetStation = t * (STATIONS.length - 1);
}

function applyCamera(){
  const i = clamp(Math.floor(station), 0, STATIONS.length - 2);
  const f = ease(clamp(station - i, 0, 1));
  const a = STATIONS[i], b = STATIONS[i+1];
  camPos.set(lerp(a.p[0],b.p[0],f), lerp(a.p[1],b.p[1],f), lerp(a.p[2],b.p[2],f));
  camTgt.set(lerp(a.t[0],b.t[0],f), lerp(a.t[1],b.t[1],f), lerp(a.t[2],b.t[2],f));
  // the head moves a little with the cursor; never enough to break the frame
  camera.position.set(camPos.x + pointer.x * .55, camPos.y + pointer.y * .26, camPos.z);
  camera.lookAt(camTgt);
  faceCamera();
  const s = Math.round(station) + 1;
  if (s !== metrics.station){
    metrics.station = s;
    navBtns.forEach(b => b.setAttribute('aria-current', String(+b.dataset.go === s)));
  }
}

/* ---------- frame loop, with its own budget ---------- */
let raf = 0, last = 0, clock = 0, frames = 0, windowStart = 0;
let paused = reduced.matches;

function frame(now){
  raf = 0;
  if (paused || document.hidden) return;
  const dt = Math.min((now - last)/1000, .05); last = now;
  clock += dt;

  const gap = targetStation - station;
  station = Math.abs(gap) < .0015 ? targetStation : station + gap * Math.min(1, dt * 4.6);
  pointer.lerp(pointerTo, Math.min(1, dt * 2.4));
  applyCamera();

  if (linenMat.userData.sh) linenMat.userData.sh.uniforms.uT.value = clock;
  candle.intensity = 9 + Math.sin(clock * 7.3) * .9 + Math.sin(clock * 2.1) * .5; // flicker
  for (let i = 0; i < flames.length; i++){
    flames[i].scale.set(1, 1.9 + Math.sin(clock * 9 + i) * .22, 1);
  }

  renderer.render(scene, camera);
  metrics.frames++; metrics.drawCalls = renderer.info.render.calls;

  // adaptive quality: if we cannot hold the budget, drop pixel ratio once
  // Measure against the wall clock, not `dt`: dt is clamped to .05 so a long
  // frame cannot jolt the camera, which means summing it under-counts exactly
  // on the slow device this sampler exists to rescue.
  frames++;
  if (now - windowStart >= 2000){
    const fps = frames / ((now - windowStart) / 1000);
    metrics.fps = Math.round(fps);
    if (fps < 45 && metrics.quality > 1){
      metrics.quality = 1; renderer.setPixelRatio(1);
    } else if (fps < 24 && metrics.quality === 1){
      // shadows are the most expensive pass here; drop them before the scene
      metrics.quality = .5; renderer.shadowMap.enabled = false;
      scene.traverse(o => { if (o.material) o.material.needsUpdate = true; });
    }
    frames = 0; windowStart = now;
  }
  raf = requestAnimationFrame(frame);
}
function start(){ if (!raf && !paused && !document.hidden){ last = windowStart = performance.now(); frames = 0; raf = requestAnimationFrame(frame); } }
function stop(){ cancelAnimationFrame(raf); raf = 0; }

function resize(){
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w/h; camera.updateProjectionMatrix();
  applyCamera(); renderer.render(scene, camera);
}

/* ---------- wiring ---------- */
addEventListener('scroll', () => { scrollStation(); start(); }, { passive:true });
addEventListener('resize', resize, { passive:true });
addEventListener('pointermove', e => {
  pointerTo.set(e.clientX/innerWidth*2 - 1, 1 - e.clientY/innerHeight*2);
}, { passive:true });
document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

navBtns.forEach(b => b.addEventListener('click', () => {
  const el = sections[+b.dataset.go - 1];
  if (el) el.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block:'start' });
}));

function setPaused(v){
  paused = v;
  metrics.paused = v;
  motion.setAttribute('aria-pressed', String(v));
  motion.textContent = v ? 'Play motion' : 'Pause motion';
  if (v){ stop(); applyCamera(); renderer.render(scene, camera); } else start();
}
motion.addEventListener('click', () => setPaused(!paused));
reduced.addEventListener('change', () => setPaused(reduced.matches));

canvas.addEventListener('webglcontextlost', e => {
  e.preventDefault(); stop(); stage.classList.remove('lit');
  metrics.ready = false; motion.textContent = 'Motion unavailable'; motion.disabled = true;
});

resize();
scrollStation(); station = targetStation; applyCamera();
renderer.render(scene, camera);
stage.classList.add('lit');
metrics.ready = true;
setPaused(paused);

} catch (err) {
  metrics.error = String(err);
  if (motion){ motion.textContent = 'Static view'; motion.disabled = true; }
}
