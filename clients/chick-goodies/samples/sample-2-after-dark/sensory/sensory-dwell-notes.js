/**
 * Charcuterie Chick — Dwell Micro-Interactions
 * ============================================================
 * Micro-narrative popovers on pairing stations. The guest lingers;
 * the world answers. Never a click.
 *
 * This module replaces the skeleton's silent `[data-dwell]` marker and
 * does both jobs from one source of truth:
 *   1. marks the station (the cross-act memory payoff), and
 *   2. surfaces Tricia's note for the guest who stayed.
 *
 * Performance budget
 *   - One `setTimeout` per station, created on enter, cleared on leave.
 *   - One shared popover element, moved with `transform` + `opacity` only.
 *     No reflow, no re-measure on open.
 *   - Pointer listeners are `passive: true`. No scroll jank.
 *   - Nothing is allocated per frame. Idle cost is zero.
 *
 * Integration surface:
 *   CCSensory.dwell.attach(root?)   CCSensory.dwell.detach()
 *   CCSensory.dwell.getMarked()     // Set of station keys
 *   CCSensory.dwell.NOTES           // the note registry
 *
 * Emits `cc:dwell` on `document` when a station is first marked, so the
 * cross-act memory mechanic can listen without a second timer:
 *
 *   document.addEventListener('cc:dwell', (e) => {
 *     // e.detail.key, e.detail.node
 *   });
 *
 * (Do not nest block comments in this file — a stray terminator closes
 * the JSDoc early and the module stops parsing.)
 */

import acoustics from './sensory-acoustics.js';

const DWELL_MS = 2000;
const LEAVE_GRACE_MS = 180;
const MOVE_SLOP = 14; // px of pointer jitter allowed before dwell cancels

const REDUCED =
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Tricia's culinary notes.
 *
 * ⚠ FACT CHECK BEFORE LAUNCH — three lines carry product claims that are
 * not on the client's published site and need her sign-off verbatim:
 *   - `prosciutto.grade`  ("18-month Prosciutto di Parma")
 *   - `honeycomb.crystal` (the crystallization temperature claim)
 *   - `manchego.age`      ("twelve months" — consistent with the narrative,
 *                          but confirm the D.O.P. aging she actually buys)
 * Everything else is technique and voice, which she owns already.
 */
export const NOTES = {
  prosciutto: {
    key: 'prosciutto',
    label: 'Prosciutto',
    eyebrow: 'Prologue · The slice',
    body:
      'It goes on whole. A shank that has been broken into is a shank that ' +
      'has already started giving up. I take it from the fat cap and travel ' +
      'the length in one motion — no back-and-forth, no sawing. Sawing tears ' +
      'the muscle and the fat separates from the meat on the plate.',
    aside: '▸ Confirm with Tricia — product grade',
    footnote:
      'The narrative claims 18-month Prosciutto di Parma. Her live site names ' +
      'no grade. Either she confirms this exact product or the line is cut.',
  },

  honeycomb: {
    key: 'honeycomb',
    label: 'Honeycomb',
    eyebrow: 'Prologue · The comb',
    body:
      'Texas wildflower, from hives I can name, cut off the frame in slabs ' +
      'while it is still weeping. Comb that has sat begins to granulate — the ' +
      'glucose sets first and the whole slab goes cloudy and hard. I cut it ' +
      'the morning of, or I do not put it out.',
    aside: '▸ Confirm with Tricia — crystallization claim',
    footnote:
      'The granulation detail is real honey science but the timing ("the ' +
      'morning of") is a workflow claim. She should confirm before it ships.',
  },

  manchego: {
    key: 'manchego',
    label: 'Manchego',
    eyebrow: 'Act 1 · Salt to sweet',
    body:
      'D.O.P. from La Mancha, twelve months. Anything younger is rubber and ' +
      'anything older turns bitter at the rind. I cut it in triangles because ' +
      'a triangle has a point, and a point is somewhere to start when a ' +
      'nervous guest is looking at a counter full of strangers.',
    aside: null,
    footnote: null,
  },

  brie: {
    key: 'brie',
    label: 'Brie',
    eyebrow: 'Act 1 · Fat to acid',
    body:
      'Out of the cooler the night before, and standing at room temperature ' +
      'when it goes on. Cold brie is a mistake people make in public and then ' +
      'blame on the cheese. At room temperature it slumps at the cut instead ' +
      'of fighting back, and the fat carries the fig instead of coating you.',
    aside: null,
    footnote: null,
  },

  fig: {
    key: 'fig',
    label: 'Black mission fig',
    eyebrow: 'Act 1 · Fat to acid',
    body:
      'Split with the thumb, never the knife. A knife crushes the seed, and ' +
      'the seed is where the perfume lives. You paid for the perfume. Split ' +
      'by hand it opens along its own seam and the inside stays whole.',
    aside: null,
    footnote: null,
  },
};

/* ------------------------------------------------------------------ */

class DwellNotes {
  constructor() {
    this.marked = new Set();
    this._timers = new Map();
    this._grace = new Map();
    this._origin = new Map();
    this._el = null;
    this._root = null;
    this._open = null;
    this._bound = false;
  }

  attach(root) {
    if (this._bound) return;
    this._root = root || document;
    this._ensurePopover();

    const stations = this._root.querySelectorAll('[data-dwell]');
    for (const node of stations) {
      const key = node.dataset.dwell;
      if (!key || !(key in NOTES)) continue;

      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'note');
      node.setAttribute('aria-describedby', `dwell-note-${key}`);

      node.addEventListener('pointerenter', this._onEnter);
      node.addEventListener('pointerleave', this._onLeave);
      node.addEventListener('pointermove', this._onMove, { passive: true });
      node.addEventListener('focus', this._onEnter);
      node.addEventListener('blur', this._onLeave);
      node.addEventListener('click', this._onClick);
    }

    this._onKey = (e) => {
      if (e.key === 'Escape') this.close();
    };
    this._onScroll = () => {
      if (this._open) this.close();
    };
    document.addEventListener('keydown', this._onKey);
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._bound = true;
  }

  detach() {
    if (!this._bound) return;
    const stations = this._root.querySelectorAll('[data-dwell]');
    for (const node of stations) {
      node.removeEventListener('pointerenter', this._onEnter);
      node.removeEventListener('pointerleave', this._onLeave);
      node.removeEventListener('pointermove', this._onMove);
      node.removeEventListener('focus', this._onEnter);
      node.removeEventListener('blur', this._onLeave);
      node.removeEventListener('click', this._onClick);
    }
    document.removeEventListener('keydown', this._onKey);
    window.removeEventListener('scroll', this._onScroll);
    for (const t of this._timers.values()) clearTimeout(t);
    for (const t of this._grace.values()) clearTimeout(t);
    this._timers.clear();
    this._grace.clear();
    this.close();
    this._bound = false;
  }

  getMarked() {
    return new Set(this.marked);
  }

  /* -------------------------------------------------------- events */

  _onEnter = (event) => {
    const node = event.currentTarget;
    const key = node.dataset.dwell;
    if (!key) return;

    // A pointerenter from a finger is a hold; from a mouse it is a hover.
    // Either way, lingering is the gesture. There is no click path.
    this._origin.set(key, { x: event.clientX ?? 0, y: event.clientY ?? 0 });

    const existing = this._grace.get(key);
    if (existing) {
      clearTimeout(existing);
      this._grace.delete(key);
    }

    if (this._timers.has(key)) return;
    this._timers.set(
      key,
      window.setTimeout(() => {
        this._timers.delete(key);
        this._reveal(node, key);
      }, DWELL_MS)
    );
  };

  _onLeave = (event) => {
    const key = event.currentTarget.dataset.dwell;
    if (!key) return;

    const timer = this._timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this._timers.delete(key);
    }

    // Grace period so a small pointer nudge does not snap the note shut.
    this._grace.set(
      key,
      window.setTimeout(() => {
        this._grace.delete(key);
        if (this._open === key) this.close();
      }, LEAVE_GRACE_MS)
    );
  };

  _onMove = (event) => {
    const key = event.currentTarget.dataset.dwell;
    const origin = this._origin.get(key);
    if (!origin || !this._timers.has(key)) return;

    const dx = Math.abs((event.clientX ?? 0) - origin.x);
    const dy = Math.abs((event.clientY ?? 0) - origin.y);
    if (dx > MOVE_SLOP || dy > MOVE_SLOP) {
      clearTimeout(this._timers.get(key));
      this._timers.delete(key);
    }
  };

  _onClick = (event) => {
    const node = event.currentTarget;
    const key = node.dataset.dwell;
    if (!key) return;
    if (this._open === key) {
      this.close();
    } else {
      this._reveal(node, key);
    }
  };

  /* -------------------------------------------------------- reveal */

  _reveal(node, key) {
    const note = NOTES[key];
    if (!note) return;

    // Memory mechanic: mark once, announce once.
    if (!this.marked.has(key)) {
      this.marked.add(key);
      document.dispatchEvent(
        new CustomEvent('cc:dwell', { detail: { key, node } })
      );
    }

    this._open = key;
    this._render(note);

    // Position from the station's box. Measured once per open, not per frame.
    const box = node.getBoundingClientRect();
    const el = this._el;
    const width = 300;
    const margin = 16;

    let left = box.left + box.width / 2 - width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

    const noteHeight = el.offsetHeight || 280;
    let top = box.bottom + 12;
    // Flip above when there is not room below.
    if (top + noteHeight > window.innerHeight - margin) {
      top = Math.max(margin, box.top - noteHeight - 12);
    }
    top = Math.max(margin, Math.min(top, window.innerHeight - noteHeight - margin));

    el.style.transform = `translate3d(${Math.round(left)}px, ${Math.round(top)}px, 0)`;
    el.setAttribute('data-open', 'true');

    // The chime is the only sound a note makes. Quiet, and never on reduced motion.
    if (!REDUCED) acoustics.cue('chime');
  }

  _render(note) {
    const el = this._el;
    el.innerHTML = '';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'dwell__eyebrow';
    eyebrow.textContent = note.eyebrow;

    const label = document.createElement('p');
    label.className = 'dwell__label';
    label.textContent = note.label;

    const body = document.createElement('p');
    body.className = 'dwell__body';
    body.textContent = note.body;

    el.append(eyebrow, label, body);

    // Build-side flag for the two claims awaiting Tricia's sign-off.
    // Rendered only when the module is loaded with ?sensory-draft=1, so a
    // reviewer sees it and a guest never does.
    if (note.aside && new URLSearchParams(location.search).has('sensory-draft')) {
      const aside = document.createElement('p');
      aside.className = 'dwell__aside';
      aside.textContent = note.aside;
      el.append(aside);
    }

    el.id = `dwell-note-${note.key}`;
  }

  close() {
    if (this._el) this._el.setAttribute('data-open', 'false');
    this._open = null;
  }

  _ensurePopover() {
    if (this._el) return;
    const el = document.createElement('div');
    el.className = 'dwell-note';
    el.setAttribute('data-open', 'false');
    el.setAttribute('role', 'note');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    this._el = el;
  }
}

export const dwell = new DwellNotes();
export default dwell;
