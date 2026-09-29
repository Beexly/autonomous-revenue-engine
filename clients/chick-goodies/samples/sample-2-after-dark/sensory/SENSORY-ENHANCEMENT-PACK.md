# Awwwards-Tier Sensory Enhancement Pack
### Charcuterie Chick — Lead Sensory & Interaction Architect
**For staging:** `charcuterie-chick-sample-2.vercel.app`
**Integrates with:** `shader-engine.js`, `#layer-webgl`, `data-act`, `--velocity`
**Design system:** `Charcuterie-Chick-Visual-Design-System.md` (all locks held)

---

## 0. What this pack is

Two additive layers, neither of which asks the guest to click anything.

1. **Acoustic soundscape** — procedural Web Audio, opt-in, synthesised in the
   browser. No sample files, no network, no decode, no CDN.
2. **Dwell micro-interactions** — a slip of paper that appears when the guest
   *lingers*, carrying Tricia's culinary note. Linger is the gesture. There is
   no click path to a note.

Both sit **beside** the existing narrative thesis, not on top of it: the guest
still moves and the world still responds. The popovers are what the world says
back.

---

## 1. Files

```
sensory/
├── sensory-acoustics.js    Web Audio controller + synthesised voices
├── sensory-dwell-notes.js  dwell detection + popover + note registry
├── sensory.css             toggle chrome + popover (print docket, not a card)
├── sensory-index.js        wiring + window.CCSensory export
└── SENSORY-ENHANCEMENT-PACK.md
```

Drop-in:

```html
<link rel="stylesheet" href="/sensory/sensory.css">
<script type="module" src="/sensory/sensory-index.js"></script>
```

Nothing else is required. The toggle is created on load; the popover element is
created on first dwell; the `AudioContext` is created on the first click of the
toggle.

---

## 2. Acoustic soundscape

### Design position

The narrative's audio logo is **the knife, five times and only five times**.
This pack builds the *room* around that logo, not a soundtrack over it. Every
gain in the graph is deliberately low — this is warmth you notice when it is
gone, not music you notice when it arrives.

### The graph

```
                    ┌─ lowpass ─ bedGain ─┐
[2s noise buffer] ──┤                     ├─ master ─ destination
   (looped)         └─ highpass ─ air ────┘
                      3200Hz
[sine ~60–130Hz] ─── humGain ─────────────┘

one-shots (knife / board / glass / pour / chime)
  └─ their own tiny graphs ── master
```

Three persistent voices. Nothing else survives longer than a cue.

### Room tone per act

| Act | Bed gain | Filter | Air | Bulb hum | What it feels like |
|---|---|---|---|---|---|
| `prologue` | 0.055 | 280 Hz | 0.010 | 0.020 | A kitchen at 4:40. Almost silence. |
| `act1` | 0.050 | 620 Hz | 0.018 | 0.010 | Flat, bright, honest. North window. |
| `act2` | 0.075 | 760 Hz | 0.028 | 0.016 | A room filling. More air, more mid. |
| `act3` | 0.085 | 520 Hz | 0.022 | 0.032 | Warmest. Edison bulbs have a hum. |
| `epilogue` | 0.038 | 420 Hz | 0.012 | 0.008 | Morning. Quietest point on the site. |

Crossfades run over **900 ms** — long enough that an act change is never a cut,
short enough that the guest does not hear the mix being mixed.

### Cues

| Cue | Synthesis | Use |
|---|---|---|
| `knife` | Lowpass noise body (900→180 Hz, 120 ms) + triangle ping (2400→900 Hz, 70 ms) | **The audio logo.** Five moments only — see below. |
| `board` | Lowpass noise (700→140 Hz, 70 ms) | Tactile confirmation. Also fires once when sound is enabled. |
| `glass` | Two detuned sines at 1860 / 3720 Hz through high-Q bandpass, 900 ms tail | Glassware resonance. Act 2 and Act 3 only. |
| `pour` | Loop noise through a bandpass rising 520→1750→760 Hz over 1.15 s | Wine pour. Act 3, sparingly. |
| `chime` | Single sine at 1240 Hz, 550 ms decay | Fires when a dwell note opens. The quietest sound on the site. |

**The five knife moments** (from the master narrative — do not add a sixth):

1. 4:40 AM — the first slice in the Prologue
2. 10:40 AM — the Manchego wedge
3. Act 2 — faintly, under the chatter
4. The Grail reveal — because that is what it cost
5. 7:15 AM — the last beat before the loop closes

### Opt-in toggle

Lives in a fixed top-right `header`, whisper-quiet: mono, uppercase, hairline
underline, a three-bar level mark that shifts from faint to amber when on. No
fill, no radius, no shadow. It reads as marginalia on a magazine page, which is
the only chrome this design system allows.

```
┌──────────────────────────────┐
│                      ▁▃▁ SOUND · OFF │   ← hairline underline
└──────────────────────────────┘
```

**Audio is never started without a gesture.** The `AudioContext` does not exist
until the first click. An unvisited page costs nothing.

Also handled: `visibilitychange` suspends the context when the tab is hidden and
resumes it on return. `prefers-reduced-motion` suppresses the `chime` (the one
sound tied to a UI motion) but leaves room tone alone — that is a motion
preference, not a volume preference, and the guest can still turn sound off.

---

## 3. Dwell micro-interactions

### Why dwell and not click

The narrative thesis: **the guest never clicks an object.** A popover that opens
on click would reintroduce exactly the failure mode of the previous build —
turning the guest into a shopper hunting for hotspots. Dwell is the hand
*staying*, which is the same grammar as the scroll.

### Mechanic

```
pointerenter / focus  ──►  start 2000 ms timer
pointermove           ──►  cancel if > 14 px drift (a graze is not a linger)
pointerleave / blur   ──►  clear timer, 180 ms grace, then close
timer fires           ──►  mark station · open popover · play `chime`
Escape                ──►  close
```

Touch works the same way: a finger that holds is a linger. There is no tap path
to a note.

### Stations

Five stations, tagged `data-dwell="<key>"`, placed at the elements the
narrative already treats as the pairing architecture:

| Key | Placement | Pairing | Note in Tricia's voice |
|---|---|---|---|
| `prosciutto` | Prologue — the slice | — | The one-motion cut. Why sawing tears the muscle. |
| `honeycomb` | Prologue / `pair-salt-sweet` | Salt → Sweet | Texas wildflower, cut the morning of. What granulation does to the comb. |
| `manchego` | Act 1 / `pair-salt-sweet` | Salt → Sweet | D.O.P., twelve months. Why triangles. |
| `brie` | Act 1 / `pair-fat-acid` | Fat → Acid | Out of the cooler overnight. Why cold brie gets blamed for its own serving error. |
| `fig` | Act 1 / `pair-fat-acid` | Fat → Acid | Split with the thumb. Where the perfume lives. |

Markup is one attribute and one optional hook:

```html
<span data-dwell="honeycomb">Texas wildflower comb</span>
```

The module handles tabindex, `role="note"`, `aria-describedby`, focus handling
and the hover affordance. Keyboard users reach every note.

### The memory mechanic is preserved

The existing silent marker is replaced by this module, not run beside it. One
source of truth: a station is **both** marked and surfaced. The cross-act
payoff still fires as a `cc:dwell` CustomEvent on `document`:

```js
document.addEventListener('cc:dwell', (e) => {
  if (e.detail.key === 'honeycomb') {
    // it comes back, drizzled on the beignets at 11:40
  }
  if (e.detail.key === 'fig') {
    // "That one. Somebody's about to take it."
  }
});
```

So the guest who lingers gets a note *now* and a payoff *later*. The two
experiences do not compete.

### Visual language

The popover is a **slip of paper**, not a card. Cream ground at 94% opacity,
hairline border, `border-radius: 0`, `box-shadow: none`, Cormorant for the note
body, IBM Plex Mono for the eyebrow. It is the same print-docket language as
the Epilogue receipt, so the two objects feel like they came from the same
kitchen.

---

## 4. Integration with `shader-engine.js`

The pack exports a frozen namespace. No imports required inside the shader
engine — call it from wherever already owns the frame loop.

```js
// ── shader-engine.js ────────────────────────────────────────────

// After the pack's module has loaded (listen if load order is uncertain):
document.addEventListener('cc:sensory-ready', () => {
  // wire whatever you need once
});

// Every frame you already run:
function frame() {
  // … your existing work …

  // 1. keep the room in sync with the current act
  CCSensory.audio.setAct(currentActId);

  // 2. let velocity breathe the air band a little
  CCSensory.audio.setVelocity(scrollVelocity);

  // 3. the audio logo — the five knife moments, and nowhere else
  if (crossedKnifeMoment) {
    CCSensory.audio.cue('knife');
  }
}
```

If the page already publishes `data-act` on `<html>` and `--velocity` in the
style attribute (our skeleton does both), the pack syncs itself and you can
skip the calls entirely. `setAct` / `setVelocity` are there for a shader engine
that owns the frame loop and wants to drive it explicitly.

If the shader engine wants to know what the guest noticed:

```js
const marked = CCSensory.dwell.getMarked(); // Set of keys
// or
document.addEventListener('cc:dwell', ({ detail }) => {
  // detail.key, detail.node
});
```

---

## 5. Performance budget

There is no such thing as literally zero cost. Here is the honest accounting.

| Concern | Cost when idle | Cost when active |
|---|---|---|
| `AudioContext` | **Does not exist** until first opt-in click | One context, 4 persistent nodes + 1 shared buffer |
| Room tone | 0 (loop only runs after enable) | 3 voices, one shared 2 s noise buffer, no allocation per frame |
| Cues | 0 | 3–6 nodes created and disconnected within ≤ 1 s |
| Scroll listener | 1 passive listener, early-returns when audio is off | Coalesced to 1 `requestAnimationFrame`, no per-event allocation |
| Dwell | 0 listeners until `attach()` | 1 `setTimeout` per hovered station, cleared on leave |
| Popover | Element created once, `opacity: 0`, `pointer-events: none` | `transform` + `opacity` only. No reflow on open. |

Measured against the design system's rule that the guest never clicks an object:
**there is no click handler on any station or any canvas element.** The only
click in the pack is the sound toggle, which is a UI control, not a scene object.

Rules I held while writing it, so this does not drift:

- `passive: true` on every pointer/scroll listener that does not call
  `preventDefault`.
- No `layout` reads inside a `requestAnimationFrame` callback except the one
  `getBoundingClientRect` on a popover open, which happens once per note.
- No `innerHTML` for user-controlled strings — notes are built with
  `textContent`, so a note can never inject markup.
- One `setTimeout` per station, always cleared. No timer leaks on `detach()`.
- One-shot audio nodes `disconnect()` themselves after their tail.

---

## 6. Fact-check flags — must clear before launch

Three lines in the note registry carry product claims that are **not** on the
client's published site. They are written in Tricia's voice because the brief
asked for that voice, but they are hers to confirm or cut. Rendered to a
reviewer only when the page is loaded with `?sensory-draft=1`; a guest never
sees the flags.

| Note | Claim | Status |
|---|---|---|
| `prosciutto` | "18-month Prosciutto di Parma" | `▸ CONFIRM` — live site names no grade |
| `honeycomb` | comb granulates if it sits; cut the morning of | `▸ CONFIRM` — the science is real, the workflow claim is hers |
| `manchego` | D.O.P., twelve months | `▸ CONFIRM` the aging she actually buys (consistent with the narrative) |

Everything else in the notes is technique and voice, which she already owns.

---

## 7. Design system compliance

Checked against `Charcuterie-Chick-Visual-Design-System.md` §13 *Do Not Build*:

- No primitive geometry, no 3D food — the pack adds no geometry at all.
- No floating SaaS cards — the popover is `border-radius: 0`, `box-shadow: none`,
  hairline rules only.
- No clickable objects — dwell only; the sole click is the sound toggle.
- No filled CTA buttons — the toggle is a hairline text control.
- No scrolljacking — the pack reads scroll state, never writes it.
- No emoji anywhere in the notes or UI.
- Amber (`#e5a642`) is the only accent on dark grounds; copper (`#c26838`) on
  light, matching the act theming system.

---

## 8. What I could not verify here

- **I could not run this in a browser.** Playwright is configured on this
  machine but not in this turn's toolset, so the modules are syntax-checked and
  reviewed but not exercised. Before it ships: enable sound, scroll all five
  acts, dwell each of the five stations, and confirm the `chime` is quiet enough
  not to fight the copy.
- **No live audio on this machine.** The synthesis is plain Web Audio node
  maths and should sound as described, but ears on the real build are the only
  real test. The `knife` cue in particular is the brand — if it reads as a
  click instead of a blade, retune `blade.frequency` (currently 2400→900 Hz)
  and the `bladeFilter.Q` (currently 6).
- **The existing `marked` Set in `sensory-index.js`'s predecessor is replaced,
  not merged.** If the deployed `shader-engine.js` already imports the old
  marker, remove it — running both would double-fire the memory payoff.

---

## 9. One recommendation

The pack is additive, and additive things tend to get turned up. The strongest
version of this site is the one where a reviewer turns the sound on, scrolls,
and then turns it **off** and realises they miss it. Keep the gains where they
are. If anything feels thin in review, the fix is a better `knife` sample, not
a louder room.
