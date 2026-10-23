import Lenis from "https://esm.sh/lenis@1.3.26";
import gsap from "https://esm.sh/gsap@3.12.7";
import { ScrollTrigger } from "https://esm.sh/gsap@3.12.7/ScrollTrigger";
import { mountScene } from "./scene.js";

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const lenis = new Lenis({
  autoRaf: false,
  lerp: 0.1,
  syncTouch: false,
  allowNestedScroll: true,
  respectReducedMotion: true,
});

lenis.on("scroll", ScrollTrigger.update);

const canvas = document.querySelector("#view");
const still = document.querySelector("#still");
const quote = document.querySelector("#quote");
let frozen = false;
const scene = mountScene(canvas, {
  onReady() {
    lenis.resize();
    ScrollTrigger.refresh();
  },
});

const openBtn = document.querySelector("#check-date");
const closeBtn = document.querySelector("#quote-close");
const underlay = [
  document.querySelector("header"),
  document.querySelector("main"),
  document.querySelector("footer"),
];

function setQuote(open, focusInside) {
  quote.hidden = !open;
  if (openBtn) openBtn.setAttribute("aria-expanded", open ? "true" : "false");
  underlay.forEach(function (node) {
    if (node) node.inert = open;
  });
  if (open && focusInside) {
    const field = quote.querySelector("input");
    if (field) field.focus({ preventScroll: true });
  }
}

function showFallback() {
  document.documentElement.dataset.webgl = "off";
  still.hidden = false;
  setQuote(true, false);
}

if (!scene.ok) {
  showFallback();
} else if (reduce) {
  document.documentElement.dataset.motion = "reduce";
  document.documentElement.dataset.webgl = "on";
  still.hidden = false;
  setQuote(true, false);
} else {
  document.documentElement.dataset.webgl = "on";
  still.hidden = true;
}

function maxScroll() {
  if (typeof lenis.limit === "number" && lenis.limit > 0) return lenis.limit;
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

const pose = { x: 0, y: 0, z: 0, progress: 0 };

if (!reduce) {
  gsap.utils.toArray(".beat h1, .beat h2").forEach(function (heading) {
    gsap.fromTo(heading, { y: 18 }, {
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 78%", toggleActions: "play none none none" },
    });
  });
}

function renderScene(ms) {
  const progress = reduce ? 0 : (lenis.animatedScroll || 0) / maxScroll();
  pose.progress = progress;
  if (!scene.ok) return;
  if (reduce) {
    if (frozen) return;
    frozen = true;
    const next = scene.render(ms, 0, true);
    pose.x = next.x;
    pose.y = next.y;
    pose.z = next.z;
    return;
  }
  const next = scene.render(ms, progress, false);
  pose.x = next.x;
  pose.y = next.y;
  pose.z = next.z;
}

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.add((time) => {
  renderScene(time * 1000);
});
gsap.ticker.lagSmoothing(0);

function onQuoteKey(event) {
  if (quote.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    setQuote(false, false);
    if (openBtn) openBtn.focus({ preventScroll: true });
    return;
  }
  if (event.key !== "Tab") return;
  const nodes = quote.querySelectorAll("a, button, input");
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

if (openBtn) {
  openBtn.addEventListener("click", function () {
    setQuote(true, true);
  });
}
if (closeBtn) {
  closeBtn.addEventListener("click", function () {
    setQuote(false, false);
    if (openBtn) openBtn.focus({ preventScroll: true });
  });
}
quote.addEventListener("keydown", onQuoteKey);

window.addEventListener("pagehide", function () {
  if (scene.dispose) scene.dispose();
});

window.bindCalculators();
window.__flight = { lenis, pose, autoRaf: false };
