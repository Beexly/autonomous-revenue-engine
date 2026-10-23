import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { VignetteShader } from "three/addons/shaders/VignetteShader.js";

const BLOOM = 1;

const bloomAdd = {
  uniforms: {
    tDiffuse: { value: null },
    bloomTexture: { value: null },
  },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform sampler2D bloomTexture;",
    "varying vec2 vUv;",
    "void main(){",
    "  vec3 base = texture2D(tDiffuse, vUv).rgb;",
    "  vec3 glow = texture2D(bloomTexture, vUv).rgb;",
    "  gl_FragColor = vec4(base + glow, 1.0);",
    "}",
  ].join("\n"),
};

const grainShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.032 },
    time: { value: 0 },
  },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform float amount;",
    "uniform float time;",
    "varying vec2 vUv;",
    "float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "void main(){",
    "  vec4 color = texture2D(tDiffuse, vUv);",
    "  float g = hash(vUv * vec2(900.0, 600.0) + fract(time)) - 0.5;",
    "  color.rgb += g * amount;",
    "  gl_FragColor = color;",
    "}",
  ].join("\n"),
};

function woodGrain() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const g = canvas.getContext("2d");
  g.fillStyle = "#382416";
  g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 90; i++) {
    const y = (i / 90) * 512 + Math.sin(i * 1.7) * 3;
    g.strokeStyle = i % 4 === 0 ? "rgba(22, 12, 6, 0.45)" : "rgba(78, 48, 28, 0.18)";
    g.lineWidth = i % 5 === 0 ? 2 : 1;
    g.beginPath();
    g.moveTo(0, y);
    g.bezierCurveTo(70, y + 6, 150, y - 5, 256, y + 2);
    g.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.2, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export function mountScene(canvas, hooks) {
  const gl =
    canvas.getContext("webgl2", { antialias: false, alpha: false }) ||
    canvas.getContext("webgl", { antialias: false, alpha: false });
  if (!gl) return { ok: false, render() {}, dispose() {} };

  const mobile = window.innerWidth < 800;
  const renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x100904, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x100904, 0.08);
  scene.background = new THREE.Color(0x100904);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.18;

  scene.add(new THREE.HemisphereLight(0xffedd7, 0x100904, 0.15));

  const wheelPos = new THREE.Vector3(0.154, 0.294, -0.819);
  const rindPos = new THREE.Vector3(0.154, 0.36, -0.819);

  const key = new THREE.SpotLight(0xffc98a, 8, 16, 0.5, 0.6, 1);
  key.position.set(-1.7, 2.7, 1.5);
  key.target.position.copy(rindPos);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.4;
  key.shadow.camera.far = 14;
  key.shadow.bias = -0.0008;
  scene.add(key, key.target);

  const fill = new THREE.SpotLight(0xffedd7, 4, 16, 0.7, 0.6, 1);
  fill.position.set(1.7, 1.9, 1.3);
  fill.target.position.copy(rindPos);
  scene.add(fill, fill.target);

  const rim = new THREE.SpotLight(0xffc98a, 5, 8, 0.45, 0.45, 1);
  rim.position.set(0.12, 1.35, -1.75);
  rim.target.position.copy(rindPos);
  scene.add(rim, rim.target);

  const grain = woodGrain();
  const wood = new THREE.MeshStandardMaterial({
    color: 0x382416,
    map: grain,
    roughness: 0.82,
    metalness: 0,
  });
  const table = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 12), wood);
  table.position.y = -0.04;
  table.receiveShadow = true;
  scene.add(table);

  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const disposables = [wood, grain, env, table.geometry];
  const plates = [];
  let pending = 5;

  function markLoaded() {
    pending -= 1;
    if (pending <= 0 && hooks && hooks.onReady) hooks.onReady();
  }

  function addPhoto(src, x, y, z, w, h, rotY, crop) {
    const mat = new THREE.MeshBasicMaterial({ color: 0x6c5f51, side: THREE.DoubleSide });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    card.position.set(x, y - table.position.y, z);
    card.rotation.y = rotY;
    card.castShadow = true;
    table.add(card);
    plates.push(card);
    disposables.push(card.geometry, mat);
    loader.load(src, function (texture) {
      let map = texture;
      const image = texture.image;
      if (crop && image && crop.x >= 0 && crop.y >= 0 && crop.x + crop.w <= image.width && crop.y + crop.h <= image.height) {
        const scale = 4;
        const board = document.createElement("canvas");
        board.width = crop.w * scale;
        board.height = crop.h * scale;
        const ctx = board.getContext("2d");
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(image, crop.x, crop.y, crop.w, crop.h, 0, 0, board.width, board.height);
        const pixels = ctx.getImageData(0, 0, board.width, board.height);
        const src = new Uint8ClampedArray(pixels.data);
        const data = pixels.data;
        const amount = 0.45;
        for (let y = 1; y < board.height - 1; y++) {
          for (let x = 1; x < board.width - 1; x++) {
            const i = (y * board.width + x) * 4;
            for (let c = 0; c < 3; c++) {
              const center = src[i + c];
              const around = (src[i - 4 + c] + src[i + 4 + c] + src[i - board.width * 4 + c] + src[i + board.width * 4 + c]) * 0.25;
              const next = center + (center - around) * amount;
              data[i + c] = next < 0 ? 0 : next > 255 ? 255 : next;
            }
          }
        }
        ctx.putImageData(pixels, 0, 0);
        map = new THREE.CanvasTexture(board);
        texture.dispose();
      }
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = Math.min(8, maxAniso);
      map.magFilter = THREE.LinearFilter;
      map.minFilter = THREE.LinearMipmapLinearFilter;
      map.generateMipmaps = true;
      mat.map = map;
      mat.color.set(0xffffff);
      mat.needsUpdate = true;
      disposables.push(map);
      markLoaded();
    }, undefined, markLoaded);
    return card;
  }

  const longPos = new THREE.Vector3(0, 0.6, 0.18);
  addPhoto("img/board-wide.jpg", longPos.x, longPos.y, longPos.z, 1.32, 0.92, 0.32);
  const wheel = addPhoto("img/wheel-peak.jpg", wheelPos.x, wheelPos.y, wheelPos.z, 0.5, 0.298, 0);
  const meatPos = new THREE.Vector3(-0.12, 0.18, -1.15);
  const fruitPos = new THREE.Vector3(0.4, 0.18, -1.45);
  const farPos = new THREE.Vector3(-0.05, 0.16, -1.85);
  addPhoto("img/graze-02.jpg", meatPos.x, meatPos.y, meatPos.z, 0.3, 0.36, 0.7);
  addPhoto("img/table-01.jpg", fruitPos.x, fruitPos.y, fruitPos.z, 0.28, 0.34, -0.55);
  addPhoto("img/board-02.jpg", farPos.x, farPos.y, farPos.z, 0.26, 0.32, 0.1);

  const flameMat = new THREE.MeshBasicMaterial({ color: 0xfff3d2, toneMapped: false });
  const flameGeo = new THREE.SphereGeometry(0.0035, 8, 6);
  const peakFlameGeo = new THREE.SphereGeometry(0.004, 10, 8);
  disposables.push(flameMat, flameGeo, peakFlameGeo);
  const flames = [];
  const candles = [];
  const candleAt = [
    [0.55, 0.2, 2.2],
    [-0.5, 0.2, 1.05],
    [0.32, 0.41, -0.78],
    [-0.45, 0.2, -1.7],
    [0.4, 0.2, -2.6],
    [-0.3, 0.2, -4.0],
  ];
  candleAt.forEach(function (at, i) {
    const flame = new THREE.Mesh(i === 2 ? peakFlameGeo : flameGeo, flameMat);
    flame.position.set(at[0], at[1], at[2]);
    flame.layers.enable(BLOOM);
    scene.add(flame);
    flames.push(flame);
    const light = new THREE.PointLight(0xffb15a, 2, 3.4, 2);
    light.position.set(at[0], at[1], at[2]);
    scene.add(light);
    candles.push(light);
  });

  const knots = [
    new THREE.Vector3(0, 1.55, 4.2),
    new THREE.Vector3(2.53, 0.35, 0.8),
    new THREE.Vector3(-2.11, 0.69, 1.99),
    new THREE.Vector3(0.18, 0.28, -0.3),
    new THREE.Vector3(0.55, 0.38, -1.4),
    new THREE.Vector3(-0.2, 0.46, -2.15),
    new THREE.Vector3(-0.53, 0.74, -2.0),
    new THREE.Vector3(0.24, 2.52, 4.94),
  ];
  const looks = [
    longPos,
    longPos,
    longPos,
    wheelPos,
    meatPos,
    fruitPos,
    new THREE.Vector3(0, 0.16, -1),
    new THREE.Vector3(0, 0.08, 0.1),
  ];
  const curve = new THREE.CatmullRomCurve3(knots, false, "catmullrom", 0.25);
  const knotU = knots.map(function (knot) {
    let bestU = 0;
    let bestD = Infinity;
    const probe = new THREE.Vector3();
    for (let i = 0; i <= 240; i++) {
      const u = i / 240;
      curve.getPointAt(u, probe);
      const d = probe.distanceToSquared(knot);
      if (d < bestD) {
        bestD = d;
        bestU = u;
      }
    }
    return bestU;
  });

  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.05, 40);
  camera.layers.enable(BLOOM);
  const pointer = { x: 0, y: 0 };
  const onPointer = function (event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer);

  const size = new THREE.Vector2(window.innerWidth, window.innerHeight);
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.addPass(new RenderPass(scene, camera));
  bloomComposer.addPass(new UnrealBloomPass(size, 0.35, 0.4, 0.85));

  const bokehPass = new BokehPass(scene, camera, { focus: 0.55, aperture: 0.00012, maxblur: 0.0012 });
  const gradePass = new ShaderPass(bloomAdd);
  const vignettePass = new ShaderPass(VignetteShader);
  vignettePass.uniforms.offset.value = 1.1;
  vignettePass.uniforms.darkness.value = 0.55;
  const grainPass = new ShaderPass(grainShader);
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(bokehPass);
  composer.addPass(gradePass);
  composer.addPass(vignettePass);
  composer.addPass(grainPass);
  composer.addPass(new OutputPass());

  const dark = new THREE.MeshBasicMaterial({ color: 0x000000 });
  disposables.push(dark);
  const saved = new Map();
  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM);

  function darken(obj) {
    if (!obj.isMesh || bloomLayer.test(obj.layers)) return;
    saved.set(obj.uuid, obj.material);
    obj.material = dark;
  }
  function restore(obj) {
    const prev = saved.get(obj.uuid);
    if (prev) obj.material = prev;
  }

  const pos = new THREE.Vector3();
  const look = new THREE.Vector3();

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const ratio = Math.min(window.devicePixelRatio || 1, w < 800 ? 1.5 : 2);
    renderer.setPixelRatio(ratio);
    renderer.setSize(w, h, false);
    const bloomScale = w < 800 ? 0.5 : 1;
    bloomComposer.setSize(Math.max(1, Math.floor(w * bloomScale)), Math.max(1, Math.floor(h * bloomScale)));
    composer.setSize(w, h);
  }
  window.addEventListener("resize", resize);

  function render(ms, progress, reduce) {
    const t = Math.min(1, Math.max(0, progress));
    const seconds = ms * 0.001;
    curve.getPointAt(t, pos);
    let i = 0;
    while (i < looks.length - 2 && t >= knotU[i + 1]) i += 1;
    const span = Math.max(0.0001, knotU[i + 1] - knotU[i]);
    const f = Math.min(1, Math.max(0, (t - knotU[i]) / span));
    look.lerpVectors(looks[i], looks[i + 1], f);
    if (!reduce) {
      pos.x += Math.sin(seconds * 0.35) * 0.012;
      look.x += Math.max(-0.08, Math.min(0.08, pointer.x * 0.08));
      look.y += Math.max(-0.08, Math.min(0.08, -pointer.y * 0.04));
      for (let n = 0; n < candles.length; n++) {
        candles[n].intensity = 2 + Math.sin(seconds * 9 + n) * 0.35;
      }
    }
    camera.position.copy(pos);
    camera.lookAt(look);
    if (reduce) {
      renderer.render(scene, camera);
    } else {
      scene.traverse(darken);
      bloomComposer.render();
      scene.traverse(restore);
      saved.clear();
      bokehPass.uniforms.focus.value = camera.position.distanceTo(wheelPos);
      gradePass.uniforms.bloomTexture.value = bloomComposer.readBuffer.texture;
      grainPass.uniforms.time.value = seconds;
      composer.render();
    }
    return { x: camera.position.x, y: camera.position.y, z: camera.position.z, wheel: wheel.position.z };
  }

  function dispose() {
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("resize", resize);
    scene.traverse(function (obj) {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const list = Array.isArray(obj.material) ? obj.material : [obj.material];
        list.forEach(function (mat) {
          if (mat.map) mat.map.dispose();
          mat.dispose();
        });
      }
    });
    bloomComposer.dispose();
    composer.dispose();
    pmrem.dispose();
    env.dispose();
    renderer.dispose();
  }

  return { ok: true, render, dispose, plates };
}
