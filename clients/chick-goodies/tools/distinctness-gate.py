#!/usr/bin/env python3
"""G7 -- are the three samples still three samples?

Every other gate reads one sample in isolation, so none of them could see two
samples drifting onto the same ground. That is exactly what happened: the
boutique warm-up carried sample-1's paper from #f5f3ec to #f7f1e6, which is
11.8 -> 12.0 RGB units from sample-3's #fff9ea. Nothing moved, by that
measure. What moved was saturation, 31% -> 51%, and the two read as one
colour on screen.

Three things this gate does NOT do, each for a reason found by measuring:

  * It does not judge on RGB distance. That is the metric that missed it.
  * It does not judge on ink. During the collision the two inks were espresso
    and electric blue, dE00 37.40 apart. Ink never noticed and never would.
  * It does not assert a universal "distinct enough" constant. The honest
    numbers are too close together to support one: the collision scored
    dE00 2.32, today scores 4.10, and the state before the warm-up -- which
    was not distinct either -- sat between them at 3.66.

So it is a regression gate, not a judge of taste. It pins the palette you
approved and fails when a pair drifts closer than that, with an absolute
floor underneath so a careless re-pin cannot bless a collision.

    python3 tools/distinctness-gate.py                  # gate the samples
    python3 tools/distinctness-gate.py --selftest       # prove the metric first
    python3 tools/distinctness-gate.py --update-baseline
    python3 tools/distinctness-gate.py --hosts https://a,https://b,https://c
"""
import argparse
import json
import math
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASELINE = ROOT / 'tools' / 'sample-identity.json'

# Floors are set from the measured collision, not from taste: it scored
# dE00 2.32 and dL* 2.7, and must fail. Today scores 4.10 and 6.4.
FLOOR_DE = 3.0
FLOOR_DL = 4.0
# How far a pair may slip from its approved separation before that is drift.
DRIFT_TOLERANCE = 0.75


def srgb_to_lab(rgb):
    def inv(c):
        c /= 255
        return c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4
    r, g, b = [inv(v) for v in rgb]
    X = r * .4124564 + g * .3575761 + b * .1804375
    Y = r * .2126729 + g * .7151522 + b * .0721750
    Z = r * .0193339 + g * .1191920 + b * .9503041

    def f(t):
        return t ** (1 / 3) if t > (6 / 29) ** 3 else t / (3 * (6 / 29) ** 2) + 4 / 29
    fx, fy, fz = f(X / .95047), f(Y / 1.0), f(Z / 1.08883)
    return (116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz))


def ciede2000(lab1, lab2):
    """CIEDE2000. Validated against Sharma, Wu & Dalal (2005); see --selftest."""
    L1, a1, b1 = lab1
    L2, a2, b2 = lab2
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2)
    Cbar = (C1 + C2) / 2
    G = .5 * (1 - math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7))) if Cbar > 0 else .5
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)

    def hue(ap, bp):
        if ap == 0 and bp == 0:
            return 0.0
        h = math.degrees(math.atan2(bp, ap))
        return h + 360 if h < 0 else h
    h1p, h2p = hue(a1p, b1), hue(a2p, b2)
    dLp, dCp = L2 - L1, C2p - C1p
    if C1p * C2p == 0:
        dhp = 0.0
    elif abs(h2p - h1p) <= 180:
        dhp = h2p - h1p
    elif h2p - h1p > 180:
        dhp = h2p - h1p - 360
    else:
        dhp = h2p - h1p + 360
    dHp = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dhp / 2))
    Lbp, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    if C1p * C2p == 0:
        hbp = h1p + h2p
    elif abs(h1p - h2p) <= 180:
        hbp = (h1p + h2p) / 2
    elif h1p + h2p < 360:
        hbp = (h1p + h2p + 360) / 2
    else:
        hbp = (h1p + h2p - 360) / 2
    T = (1 - .17 * math.cos(math.radians(hbp - 30))
         + .24 * math.cos(math.radians(2 * hbp))
         + .32 * math.cos(math.radians(3 * hbp + 6))
         - .20 * math.cos(math.radians(4 * hbp - 63)))
    dth = 30 * math.exp(-(((hbp - 275) / 25) ** 2))
    Rc = 2 * math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) if Cbp > 0 else 0.0
    Sl = 1 + (.015 * (Lbp - 50) ** 2) / math.sqrt(20 + (Lbp - 50) ** 2)
    Sc = 1 + .045 * Cbp
    Sh = 1 + .015 * Cbp * T
    Rt = -math.sin(math.radians(2 * dth)) * Rc
    return math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2
                     + Rt * (dCp / Sc) * (dHp / Sh))


# Sharma et al. (2005) reference pairs: hue wraparound, near-neutrals, and the
# blue region where the rotation term bites. A metric nobody checked is not
# evidence.
SHARMA = [((50, 2.6772, -79.7751), (50, 0, -82.7485), 2.0425),
          ((50, 3.1571, -77.2803), (50, 0, -82.7485), 2.8615),
          ((50, 2.8361, -74.0200), (50, 0, -82.7485), 3.4412),
          ((50, -1.3802, -84.2814), (50, 0, -82.7485), 1.0000),
          ((50, 0, 0), (50, -1, 2), 2.3669),
          ((50, 2.4900, -0.0010), (50, -2.4900, 0.0009), 7.1792),
          ((50, 2.5, 0), (50, 0, -2.5), 4.3065),
          ((50, 2.5, 0), (73, 25, -18), 27.1492),
          ((50, 2.5, 0), (61, -5, 29), 22.8977),
          ((50, 2.5, 0), (56, -27, -3), 31.9030),
          ((50, 2.5, 0), (58, 24, 15), 19.4535),
          ((60.2574, -34.0099, 36.2677), (60.4626, -34.1751, 39.4387), 1.2644),
          ((63.0109, -31.0961, -5.8663), (62.8187, -29.7946, -4.0864), 1.2630),
          ((22.7233, 20.0904, -46.6940), (23.0331, 14.9730, -42.5619), 2.0373),
          ((90.8027, -2.0831, 1.4410), (91.1528, -1.6435, 0.0447), 1.4441),
          ((6.7747, -0.2908, -2.4247), (5.8714, -0.0985, -2.2286), 0.6377)]


def selftest():
    worst = max(abs(ciede2000(a, b) - e) for a, b, e in SHARMA)
    ok = worst < 1e-4
    print(f'  CIEDE2000 vs Sharma et al. (2005): {len(SHARMA)} pairs, '
          f'worst error {worst:.2e}')
    print(f'  {"PASS - the metric is sound" if ok else "FAIL - metric is wrong"}')
    return 0 if ok else 1


PROBE = """() => {
  const hex = c => { const n = c.slice(c.indexOf('(')+1, c.indexOf(')')).split(',').map(Number);
                     return '#' + n.slice(0,3).map(v => Math.round(v).toString(16).padStart(2,'0')).join(''); };
  const b = getComputedStyle(document.body);
  const h1 = document.querySelector('h1');
  return { ground: hex(b.backgroundColor),
           ink: hex(b.color),
           heading: h1 ? getComputedStyle(h1).fontFamily.split(',')[0].replace(/["']/g,'').trim() : null };
}"""


def hexrgb(x):
    return tuple(int(x[i:i + 2], 16) for i in (1, 3, 5))


def measure(urls):
    from playwright.sync_api import sync_playwright
    out = {}
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={'width': 1440, 'height': 900})
        for name, url in urls.items():
            pg.goto(url, wait_until='load')
            pg.wait_for_timeout(600)
            out[name] = pg.evaluate(PROBE)
        br.close()
    return out


def pairs(seen):
    names = sorted(seen)
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            ga, gb = seen[a]['ground'], seen[b]['ground']
            la, lb = srgb_to_lab(hexrgb(ga)), srgb_to_lab(hexrgb(gb))
            yield (f'{a} vs {b}', {
                'ground_de': round(ciede2000(la, lb), 2),
                'ground_dl': round(abs(la[0] - lb[0]), 1),
                'heading_a': seen[a]['heading'], 'heading_b': seen[b]['heading']})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--update-baseline', action='store_true')
    ap.add_argument('--hosts', help='three comma-separated base URLs, in sample order')
    a = ap.parse_args()
    if a.selftest:
        return selftest()

    if selftest() != 0:
        return 1
    print()

    # a sample is a directory that actually serves a homepage; samples/ also
    # holds shared/ and an empty sample-4-table that would otherwise 404.
    samples = sorted(x.name for x in (ROOT / 'samples').iterdir()
                     if (x / 'index.html').is_file())
    if a.hosts:
        hosts = a.hosts.split(',')
        if len(hosts) != len(samples):
            sys.exit(f'--hosts needs {len(samples)} urls, got {len(hosts)}')
        for h in hosts:
            if not h.startswith('https://'):
                sys.exit(f'--hosts must be https, got: {h}')
        urls = {s: f'{h.rstrip("/")}/index.html' for s, h in zip(samples, hosts)}
    else:
        urls = {s: (ROOT / 'samples' / s / 'index.html').as_uri() for s in samples}

    seen = measure(urls)
    for n in samples:
        s = seen[n]
        print(f"  {n:20s} ground {s['ground']}  ink {s['ink']}  heading {s['heading']}")
    print()

    found = dict(pairs(seen))
    if a.update_baseline:
        BASELINE.write_text(json.dumps(
            {'samples': seen, 'pairs': found}, indent=2, sort_keys=True) + '\n')
        print(f'  baseline re-pinned: {BASELINE.relative_to(ROOT)}')
        return 0

    if not BASELINE.exists():
        sys.exit(f'no baseline at {BASELINE.relative_to(ROOT)} '
                 '-- run once with --update-baseline')
    base = json.loads(BASELINE.read_text())['pairs']

    fails = []
    print(f'  {"pair":26s} {"dE00":>7s} {"floor":>6s} {"base":>6s}  '
          f'{"dL*":>6s} {"floor":>6s} {"base":>6s}  typefaces')
    for name, m in found.items():
        b = base.get(name)
        de, dl = m['ground_de'], m['ground_dl']
        bde = b['ground_de'] if b else None
        bdl = b['ground_dl'] if b else None
        bad = []
        if de < FLOOR_DE:
            bad.append(f'ground dE00 {de} below floor {FLOOR_DE}')
        if dl < FLOOR_DL:
            bad.append(f'ground dL* {dl} below floor {FLOOR_DL}')
        if bde is not None and de < bde - DRIFT_TOLERANCE:
            bad.append(f'ground dE00 drifted {bde} -> {de}')
        if bdl is not None and dl < bdl - DRIFT_TOLERANCE:
            bad.append(f'ground dL* drifted {bdl} -> {dl}')
        same_type = m['heading_a'] and m['heading_a'] == m['heading_b']
        if same_type:
            bad.append(f'both headings set in {m["heading_a"]}')
        mark = 'ok  ' if not bad else 'FAIL'
        print(f'  {mark} {name:21s} {de:7.2f} {FLOOR_DE:6.1f} '
              f'{bde if bde is not None else "-":>6} {dl:6.1f} {FLOOR_DL:6.1f} '
              f'{bdl if bdl is not None else "-":>6}  '
              f'{"SAME" if same_type else "differ"}')
        fails += [f'{name}: {r}' for r in bad]

    print()
    if fails:
        for f in fails:
            print(f'  ! {f}')
        print(f'\n  FAIL {len(fails)} -- the samples are converging')
        return 1
    print('  PASS - every pair holds its ground, and no two share a heading face')
    return 0


if __name__ == '__main__':
    sys.exit(main())
