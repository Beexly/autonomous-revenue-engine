/**
 * Charcuterie Chick — Acoustic Soundscape
 * ============================================================
 * Procedural Web Audio. No sample files, no network, no decode.
 *
 * Design constraints held:
 *   - AudioContext is created ONLY on explicit user opt-in (a gesture).
 *     An unvisited page allocates nothing and plays nothing.
 *   - Zero per-frame allocation in the idle path. The scroll loop only
 *     writes a scalar; scheduling is event-driven.
 *   - Every one-shot node is created, scheduled, and disconnected by
 *     its own `ended`/timer, so node count is bounded and leak-free.
 *   - One shared 2-second noise buffer reused by every voice.
 *
 * Integration surface (see SENSORY-ENHANCEMENT-PACK.md):
 *   CCSensory.audio.enable() / disable() / toggle() / isEnabled()
 *   CCSensory.audio.setAct('prologue'|'act1'|'act2'|'act3'|'epilogue')
 *   CCSensory.audio.cue('knife'|'board'|'glass'|'pour'|'chime')
 *
 * The `knife` cue is the site's audio logo. Fire it at the five moments
 * named in the narrative — 4:40, 10:40, faintly under Act 2, at the Grail
 * reveal, and at 7:15. Nowhere else.
 */

const REDUCED =
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Per-act room tone. Gain is intentionally very low — this is warmth,
 *  not music. Anything louder fights the copy. */
const ROOMS = {
  prologue: { bedGain: 0.055, bedFilter: 280, air: 0.010, hum: 0.020, warmth: 90 },
  act1:     { bedGain: 0.050, bedFilter: 620, air: 0.018, hum: 0.010, warmth: 70 },
  act2:     { bedGain: 0.075, bedFilter: 760, air: 0.028, hum: 0.016, warmth: 110 },
  act3:     { bedGain: 0.085, bedFilter: 520, air: 0.022, hum: 0.032, warmth: 130 },
  epilogue: { bedGain: 0.038, bedFilter: 420, air: 0.012, hum: 0.008, warmth: 60 },
};

const FADE = 0.9;          // seconds — room crossfades
const CUE_HEADROOM = 0.55; // one-shots never exceed this of master

class AcousticSoundscape {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.bed = null;
    this.bedFilter = null;
    this.air = null;
    this.hum = null;
    this.noiseBuffer = null;
    this.enabled = false;
    this.act = 'prologue';
    this._nodes = 0;
  }

  /* ---------------------------------------------------------- lifecycle */

  isEnabled() {
    return this.enabled;
  }

  async enable() {
    if (this.enabled) return true;
    if (!this._initContext()) return false;

    // Browsers require a gesture; this method is called from one.
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }

    this.enabled = true;
    this._startBed();
    this._applyRoom(this.act, 0.25);
    document.documentElement.setAttribute('data-audio', 'on');
    return true;
  }

  async disable() {
    if (!this.enabled || !this.ctx) return;
    this.enabled = false;
    document.documentElement.setAttribute('data-audio', 'off');

    const t = this.ctx.currentTime;
    if (this.master) {
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(this.master.gain.value, t);
      this.master.gain.linearRampToValueAtTime(0, t + 0.45);
    }
    // Suspend after the fade so a re-enable starts from silence cleanly.
    window.setTimeout(() => {
      if (!this.enabled && this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    }, 520);
  }

  async toggle() {
    return this.enabled ? (this.disable(), false) : (await this.enable(), true);
  }

  /**
   * Called from the scroll/act controller. Cheap: one object write and,
   * only if the act actually changed, a handful of scheduled ramps.
   */
  setAct(actId) {
    if (!ROOMS[actId] || actId === this.act) return;
    this.act = actId;
    if (this.enabled) this._applyRoom(actId, FADE);
  }

  /** Per-frame scalar from the scroll loop. Ignored when not enabled. */
  setVelocity(v) {
    if (!this.enabled || !this.bedFilter) return;
    // Gentle: velocity only opens the air band a little. Never a wow/flutter.
    const target = ROOMS[this.act].bedFilter + Math.min(Math.abs(v) * 0.9, 260);
    const t = this.ctx.currentTime;
    this.bedFilter.frequency.setTargetAtTime(target, t, 0.18);
  }

  /* ---------------------------------------------------------- context */

  _initContext() {
    if (this.ctx) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;

    try {
      this.ctx = new AC({ latencyHint: 'interactive' });
    } catch {
      return false;
    }

    const ctx = this.ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    // Shared noise buffer — 2s of decorrelated white noise, reused everywhere.
    this.noiseBuffer = this._makeNoise(ctx, 2);

    // Bed: noise -> lowpass -> gain -> master
    this.bedFilter = ctx.createBiquadFilter();
    this.bedFilter.type = 'lowpass';
    this.bedFilter.frequency.value = ROOMS.prologue.bedFilter;
    this.bedFilter.Q.value = 0.6;

    this.bed = ctx.createGain();
    this.bed.gain.value = 0;

    this.bedFilter.connect(this.bed);
    this.bed.connect(this.master);

    // Air: high band, almost inaudible, gives the room a sense of space.
    const airFilter = ctx.createBiquadFilter();
    airFilter.type = 'highpass';
    airFilter.frequency.value = 3200;
    this.air = ctx.createGain();
    this.air.gain.value = 0;
    airFilter.connect(this.air);
    this.air.connect(this.master);

    // Hum: the warmth of a single bulb. Low sine, heavily rolled off.
    this.hum = ctx.createGain();
    this.hum.gain.value = 0;
    const humOsc = ctx.createOscillator();
    humOsc.type = 'sine';
    humOsc.frequency.value = ROOMS.prologue.warmth;
    humOsc.connect(this.hum);
    this.hum.connect(this.master);
    humOsc.start();

    // Route noise into both filters from one source.
    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;
    noise.connect(this.bedFilter);
    noise.connect(airFilter);
    noise.start();

    return true;
  }

  _makeNoise(ctx, seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    // Cheap, smooth-enough noise. Not audiophile pink — it is room tone.
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    return buffer;
  }

  _startBed() {
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(1, t + 0.8);
  }

  _applyRoom(actId, fade) {
    const room = ROOMS[actId];
    const t = this.ctx.currentTime;
    const ramp = (param, value) => {
      param.cancelScheduledValues(t);
      param.setValueAtTime(param.value, t);
      param.linearRampToValueAtTime(value, t + fade);
    };

    ramp(this.bed.gain, room.bedGain);
    ramp(this.bedFilter.frequency, room.bedFilter);
    ramp(this.air.gain, room.air);
    ramp(this.hum.gain, room.hum);

    // The bulb warmth is a pitch, not just a level.
    const humOsc = this.hum.context ? null : null;
    void humOsc;
    // (pitch is left stable — retuning a continuous oscillator glides audibly)
  }

  /* ---------------------------------------------------------- one-shots */

  /**
   * Fire a cue. Each cue builds a tiny graph, schedules itself, and
   * self-disconnects. Nothing accumulates.
   */
  cue(name) {
    if (!this.enabled || !this.ctx) return;
    switch (name) {
      case 'knife': return this._cueKnife();
      case 'board': return this._cueBoard();
      case 'glass': return this._cueGlass();
      case 'pour':  return this._cuePour();
      case 'chime': return this._cueChime();
      default: return;
    }
  }

  _out(gainValue) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = gainValue * CUE_HEADROOM;
    g.connect(this.master);
    return g;
  }

  /** The audio logo. Metal on wood — a bright transient over a dull body. */
  _cueKnife() {
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // Wood body: short filtered noise burst.
    const wood = ctx.createBufferSource();
    wood.buffer = this.noiseBuffer;
    const woodFilter = ctx.createBiquadFilter();
    woodFilter.type = 'lowpass';
    woodFilter.frequency.setValueAtTime(900, t);
    woodFilter.frequency.exponentialRampToValueAtTime(180, t + 0.09);
    const woodGain = this._out(0.34);
    woodGain.gain.setValueAtTime(0.0001, t);
    woodGain.gain.linearRampToValueAtTime(0.34 * CUE_HEADROOM, t + 0.004);
    woodGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    wood.connect(woodFilter);
    woodFilter.connect(woodGain);
    wood.start(t, Math.random() * 1.5);
    wood.stop(t + 0.14);

    // Blade: a short high ping with fast decay.
    const blade = ctx.createOscillator();
    blade.type = 'triangle';
    blade.frequency.setValueAtTime(2400, t);
    blade.frequency.exponentialRampToValueAtTime(900, t + 0.05);
    const bladeFilter = ctx.createBiquadFilter();
    bladeFilter.type = 'bandpass';
    bladeFilter.frequency.value = 2200;
    bladeFilter.Q.value = 6;
    const bladeGain = this._out(0.22);
    bladeGain.gain.setValueAtTime(0.0001, t);
    bladeGain.gain.linearRampToValueAtTime(0.22 * CUE_HEADROOM, t + 0.003);
    bladeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    blade.connect(bladeFilter);
    bladeFilter.connect(bladeGain);
    blade.start(t);
    blade.stop(t + 0.09);

    this._cleanup([wood, blade], 0.2);
  }

  /** Soft wooden board click. Almost felt more than heard. */
  _cueBoard() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, t);
    filter.frequency.exponentialRampToValueAtTime(140, t + 0.05);

    const g = this._out(0.26);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.26 * CUE_HEADROOM, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

    src.connect(filter);
    filter.connect(g);
    src.start(t, Math.random() * 1.5);
    src.stop(t + 0.09);
    this._cleanup([src], 0.12);
  }

  /** Glassware resonance. High-Q ping, long-ish exponential tail. */
  _cueGlass() {
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // Two partials a real flute would have, slightly detuned.
    const partials = [
      { f: 1860, a: 0.20, q: 14 },
      { f: 3720, a: 0.08, q: 18 },
    ];
    const stops = [];

    for (const p of partials) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = p.f;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = p.f;
      bp.Q.value = p.q;

      const g = this._out(p.a);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(p.a * CUE_HEADROOM, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

      osc.connect(bp);
      bp.connect(g);
      osc.start(t);
      osc.stop(t + 0.95);
      stops.push(osc);
    }

    this._cleanup(stops, 1.0);
  }

  /** Wine pour: noise through a bandpass that rises then falls, like liquid. */
  _cuePour() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const duration = 1.15;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    src.loop = true;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(520, t);
    bp.frequency.linearRampToValueAtTime(1750, t + 0.42);
    bp.frequency.linearRampToValueAtTime(760, t + duration);
    bp.Q.value = 3.2;

    const g = this._out(0.17);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.17 * CUE_HEADROOM, t + 0.12);
    g.gain.linearRampToValueAtTime(0.10 * CUE_HEADROOM, t + duration * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    src.connect(bp);
    bp.connect(g);
    src.start(t);
    src.stop(t + duration + 0.05);
    this._cleanup([src], duration + 0.1);
  }

  /** The quietest cue. Fired when a dwell note opens. */
  _cueChime() {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 1240;

    const g = this._out(0.11);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.11 * CUE_HEADROOM, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    osc.connect(g);
    osc.start(t);
    osc.stop(t + 0.6);
    this._cleanup([osc], 0.65);
  }

  /** Stop sources after they finish so the graph does not grow. */
  _cleanup(sources, seconds) {
    window.setTimeout(() => {
      for (const s of sources) {
        try { s.disconnect(); } catch { /* already gone */ }
      }
    }, seconds * 1000 + 120);
  }

  /** Tab hidden: suspend. No point rendering room tone to a backgrounded tab. */
  onVisibility(hidden) {
    if (!this.ctx) return;
    if (hidden) {
      if (this.ctx.state === 'running') this.ctx.suspend().catch(() => {});
    } else if (this.enabled && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }
}

export const acoustics = new AcousticSoundscape();
export default acoustics;
