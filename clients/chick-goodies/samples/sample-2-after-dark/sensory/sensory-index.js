/**
 * Charcuterie Chick — Sensory pack entry point
 * ============================================================
 * Drop this in after `shader-engine.js` (or anywhere after the scroll
 * controller exists) and it wires itself up.
 *
 *   <link rel="stylesheet" href="/sensory/sensory.css">
 *   <script type="module" src="/sensory/sensory-index.js"></script>
 *
 * Exposed on `window.CCSensory` so `shader-engine.js` can call into it
 * without an import dance:
 *
 *   // from shader-engine.js
 *   CCSensory.audio.setAct(currentActId);
 *   CCSensory.audio.setVelocity(scrollVelocity);
 *   CCSensory.audio.cue('knife');      // the audio logo, five times only
 *
 *   // cross-act memory payoff
 *   document.addEventListener('cc:dwell', e => {
 *     if (e.detail.key === 'honeycomb') { /* it comes back on the beignets *\/ }
 *   });
 */

import acoustics from './sensory-acoustics.js';
import dwell, { NOTES } from './sensory-dwell-notes.js';

const CLASS_NAMES = {
  header: 'sensory-header',
  toggle: 'audio-toggle',
  icon: 'audio-toggle__icon',
  state: 'audio-toggle__state',
};

function buildToggle() {
  if (document.querySelector(`.${CLASS_NAMES.toggle}`)) {
    return document.querySelector(`.${CLASS_NAMES.toggle}`);
  }

  const header = document.createElement('header');
  header.className = CLASS_NAMES.header;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = CLASS_NAMES.toggle;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', 'Turn on kitchen sound');

  const icon = document.createElement('span');
  icon.className = CLASS_NAMES.icon;
  icon.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = 'Sound';

  const stateIndicator = document.createElement('span');
  stateIndicator.className = CLASS_NAMES.state;
  stateIndicator.textContent = 'off';
  stateIndicator.setAttribute('aria-hidden', 'true');

  button.append(icon, label, stateIndicator);
  header.append(button);
  document.body.appendChild(header);

  button.addEventListener('click', async () => {
    const on = await acoustics.toggle();
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute(
      'aria-label',
      on ? 'Turn off kitchen sound' : 'Turn on kitchen sound'
    );
    stateIndicator.textContent = on ? 'on' : 'off';
    // A single soft board click confirms the gesture that unlocked audio.
    // It is the only sound that plays without a narrative cue.
    if (on) acoustics.cue('board');
  });

  return button;
}

/**
 * Wire the pack to whatever scroll/act controller is already on the page.
 *
 * Two strategies, both zero-cost when idle:
 *   1. If the page publishes `--p` / `--velocity` on <html> (our skeleton
 *      does), read them once per frame via a single rAF loop that is a
 *      no-op while audio is off.
 *   2. If an act controller calls `CCSensory.audio.setAct()` directly,
 *      that takes precedence and the poll simply confirms.
 */
function watchScroll() {
  const root = document.documentElement;
  let lastAct = root.getAttribute('data-act') || 'prologue';
  let ticking = false;

  acoustics.setAct(lastAct);

  const read = () => {
    ticking = false;
    if (!acoustics.isEnabled()) return;

    const act = root.getAttribute('data-act') || 'prologue';
    if (act !== lastAct) {
      lastAct = act;
      acoustics.setAct(act);
    }

    const velocity = parseFloat(root.style.getPropertyValue('--velocity')) || 0;
    acoustics.setVelocity(velocity);
  };

  // One listener, coalesced to a single rAF. Never a per-event allocation.
  const onScroll = () => {
    if (ticking || !acoustics.isEnabled()) return;
    ticking = true;
    requestAnimationFrame(read);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('cc:act', (event) => {
    const id = event.detail && event.detail.id;
    if (id) {
      lastAct = id;
      acoustics.setAct(id);
    }
  });

  document.addEventListener('visibilitychange', () => {
    acoustics.onVisibility(document.hidden);
  });
}

function install() {
  buildToggle();
  dwell.attach(document);
  watchScroll();

  window.CCSensory = Object.freeze({
    audio: {
      enable: () => acoustics.enable(),
      disable: () => acoustics.disable(),
      toggle: () => acoustics.toggle(),
      isEnabled: () => acoustics.isEnabled(),
      setAct: (id) => acoustics.setAct(id),
      setVelocity: (v) => acoustics.setVelocity(v),
      cue: (name) => acoustics.cue(name),
    },
    dwell: {
      attach: (root) => dwell.attach(root),
      detach: () => dwell.detach(),
      getMarked: () => dwell.getMarked(),
      close: () => dwell.close(),
      NOTES,
    },
  });

  document.dispatchEvent(new CustomEvent('cc:sensory-ready'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', install, { once: true });
} else {
  install();
}

export { acoustics, dwell, NOTES };
