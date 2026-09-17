#!/usr/bin/env python3
"""Presentation gates G1, G2, G3 and G5 (plan 9.5), per sample.

G1  no horizontal scroll, no clipped text, no element overlapping another
    element's text box, no decoration touching text or a photo,
    at 390, 768, 1440 and 1920 on all five pages
G2  zero kill-list strings; "gather" at most once per site; no "enquire"
G3  five unique titles and five unique metas, matching plan 4.1
G5  quote prefills, draft contents, the six verified totals, tel/sms/mailto

Usage:
  python3 tools/presentation-gate.py --sample sample-1-editorial            # local files
  python3 tools/presentation-gate.py --sample sample-1-editorial --base URL # live host
"""
import argparse
import html as H
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = ['index.html', 'menu.html', 'gallery.html', 'story.html', 'enquire.html']
# G1 can also sweep the immersive one-pager. It is named here rather than taken
# from the command line so that nothing from argv ever reaches a fetched URL.
EXTRA_PAGES = ('table.html',)
WIDTHS = [390, 768, 1440, 1920]

# Case-sensitive on purpose: "a closer look" inside a sentence is ordinary
# copy; "A closer look" as a caption is the kill-list item.
KILL = ["Gathered around the table", "The small details", "An occasion on wheels",
        "Room for a little more", "Something to share", "A toast to together",
        "A sweet ending", "Company, beautifully kept", "THE ART OF GATHERING",
        "Food for company", "From a cart to a full table", "Real food. Real occasions",
        "CENTREPIECE", "A reason to gather", "The gathering table", "A closer look",
        "Good things on wheels", "Raise a glass", "A generous welcome",
        "Something sweet", "From Tricia's table", "Gallery Title", "$0.00", "25+"]

METAS = json.loads(
    (ROOT / 'tools' / 'plan-4-1-metas.json').read_text(encoding='utf-8'))

TOTALS = {'holy75': 2630.22, 'holy150': 4400.22, 'grand50': 2512.22,
          'super50': 2040.22, 'standard50': 1804.22, 'graze50': 1686.22}

OVERLAP_JS = """() => {
  // Is the text actually covered? Hit-test the rendered text box at nine
  // points. Whatever the browser reports at a point is what the eye sees
  // there, so this respects paint order instead of guessing from z-index.
  const out = [];
  const els = [...document.querySelectorAll(
    'h1,h2,h3,h4,p,li,figcaption,a,button,label,dt,dd,output,blockquote')]
    .filter(e => e.textContent.trim().length > 1 && e.offsetParent !== null && !e.closest('[hidden]'))
    .filter(e => { const s = getComputedStyle(e);
      return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; });
  const vw = window.innerWidth, vh = window.innerHeight;
  for (const t of els) {
    const r = t.getBoundingClientRect();
    if (r.width < 8 || r.height < 6) continue;
    if (r.right < 0 || r.bottom < 0 || r.left > vw || r.top > vh) continue;  // off-screen
    let covered = 0, total = 0, culprit = null;
    for (const fx of [0.15, 0.5, 0.85]) {
      for (const fy of [0.25, 0.5, 0.75]) {
        const x = r.left + r.width * fx, y = r.top + r.height * fy;
        if (x < 1 || y < 1 || x > vw - 1 || y > vh - 1) continue;
        total++;
        const hit = document.elementFromPoint(x, y);
        if (!hit) continue;
        if (hit === t || t.contains(hit) || hit.contains(t)) continue;
        // an element that merely shares the box but paints nothing is fine
        const hs = getComputedStyle(hit);
        const paints = hs.backgroundImage !== 'none'
          || (hs.backgroundColor && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(hs.backgroundColor))
          || ['IMG','CANVAS','SVG','VIDEO','PICTURE'].includes(hit.tagName);
        if (!paints) continue;
        covered++;
        culprit = hit.tagName + (typeof hit.className === 'string' && hit.className
                  ? '.' + hit.className.trim().split(/\\s+/)[0] : '');
      }
    }
    if (total && covered / total >= 0.5) {
      out.push({ text: t.tagName + ': ' + t.textContent.trim().slice(0, 44),
                 over: culprit, points: covered + '/' + total });
    }
  }
  return out.slice(0, 10);
}"""


GUTTER_JS = """(minPad) => {
  // Body copy and headings must not touch the viewport edge. A page intro that
  // sets only padding-top puts its H1 at x=0 (plan S1-1).
  const out = [];
  for (const e of document.querySelectorAll('h1,h2,h3,p,li,figcaption,dt,dd')) {
    if (!e.textContent.trim() || e.offsetParent === null || e.closest('[hidden]')) continue;
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.position === 'fixed') continue;
    let rail = false;
    for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
      const as = getComputedStyle(a);
      if ((as.overflowX === 'auto' || as.overflowX === 'scroll') &&
          a.scrollWidth > a.clientWidth + 4) { rail = true; break; }
    }
    if (rail) continue;                       // a filmstrip legitimately runs off-screen
    // Measure where the GLYPHS are, not the border box: a full-width block with
    // padding has a box at x=0 while its text is correctly inset.
    const rng = document.createRange();
    rng.selectNodeContents(e);
    const r = rng.getBoundingClientRect();
    rng.detach && rng.detach();
    if (r.width < 40 || r.bottom < 0 || r.top > window.innerHeight * 6) continue;
    if (r.left < minPad || r.right > window.innerWidth - minPad + 1) {
      out.push(e.tagName + ' at x=' + Math.round(r.left) + ': ' + e.textContent.trim().slice(0, 38));
    }
  }
  return [...new Set(out)].slice(0, 6);
}"""

COLLAPSE_JS = """() => {
  // A figure in a grid that renders far narrower than its siblings has lost its
  // track (plan S1-2: the ovals fall into one 1/12 column at 39px).
  const groups = {};
  for (const f of document.querySelectorAll('figure')) {
    if (f.offsetParent === null || f.closest('[hidden]')) continue;
    const parent = f.parentElement;
    if (!parent) continue;
    const key = parent.className || parent.tagName;
    (groups[key] = groups[key] || []).push(f);
  }
  const out = [];
  for (const [key, figs] of Object.entries(groups)) {
    if (figs.length < 3) continue;
    const ws = figs.map(f => f.getBoundingClientRect().width);
    const max = Math.max(...ws);
    figs.forEach((f, i) => {
      if (ws[i] > 0 && ws[i] < Math.max(90, max * 0.25)) {
        const img = f.querySelector('img');
        out.push((img ? img.getAttribute('src').split('/').pop() : f.className) +
                 ' is ' + Math.round(ws[i]) + 'px in a row whose widest is ' + Math.round(max) + 'px');
      }
    });
  }
  return out.slice(0, 6);
}"""

DECOR_JS = """() => {
  // Absolutely/fixed positioned decoration must not sit on a photograph or on
  // text (plan rule 8.1.5). Sample a photo's box and see what is painted there.
  const out = [];
  const floats = [...document.querySelectorAll('body *')].filter(e => {
    const s = getComputedStyle(e);
    if (!['absolute','fixed'].includes(s.position)) return false;
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.08) return false;
    const r = e.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return false;
    if (r.right < 0 || r.bottom < 0 || r.left > window.innerWidth) return false;
    return true;
  });
  const imgs = [...document.querySelectorAll('img')].filter(i => {
    const r = i.getBoundingClientRect();
    return r.width > 60 && r.height > 60 && r.bottom > 0 && r.top < window.innerHeight;
  });
  for (const f of floats) {
    if (f.querySelector('img')) continue;              // a frame holding the photo is not decoration
    const own = f.closest('a,button,figure');           // an affordance belongs to its own figure
    const fr = f.getBoundingClientRect();
    const fArea = fr.width * fr.height;
    for (const im of imgs) {
      if (f.contains(im) || im.contains(f)) continue;
      if (own && own.contains(im)) continue;            // this photo's own affordance is UI
      const ir = im.getBoundingClientRect();
      const iw = Math.min(fr.right, ir.right) - Math.max(fr.left, ir.left);
      const ih = Math.min(fr.bottom, ir.bottom) - Math.max(fr.top, ir.top);
      if (iw > 6 && ih > 6) {
        const cx = Math.max(fr.left, ir.left) + iw / 2, cy = Math.max(fr.top, ir.top) + ih / 2;
        if (cx > 0 && cy > 0 && cx < window.innerWidth && cy < window.innerHeight) {
          const top = document.elementFromPoint(cx, cy);
          if (top === im || im.contains(top)) continue;   // photo paints over it: behind, fine
        }
        const iArea = ir.width * ir.height;
        const hasText = f.textContent.trim().length > 0;
        // an ambient field at least as large as the photo is lighting, not an object
        if (!hasText && fArea >= iArea * 0.9) continue;
        const cls = typeof f.className === 'string' && f.className
          ? '.' + f.className.trim().split(/\\s+/)[0] : '';
        out.push(f.tagName + cls + ' sits on ' + (im.getAttribute('src')||'').split('/').pop());
        break;
      }
    }
  }
  return [...new Set(out)].slice(0, 6);
}"""

# A ::before/::after is not an element, so document.elementFromPoint returns the
# ORIGINATING element for its pixels. A hit-test therefore cannot see pseudo
# decoration at all. This check measures the pseudo box from its resolved
# geometry instead. Found because a deliberately broken guest-book quote mark
# painted over three review quotes and G1 stayed green.
PSEUDO_JS = """(minAlpha) => {
  const out = [];
  const boxOf = el => {                       // padding box of the containing block
    const r = el.getBoundingClientRect(), s = getComputedStyle(el);
    return {left: r.left + parseFloat(s.borderLeftWidth),
            top: r.top + parseFloat(s.borderTopWidth),
            width: r.width - parseFloat(s.borderLeftWidth) - parseFloat(s.borderRightWidth),
            height: r.height - parseFloat(s.borderTopWidth) - parseFloat(s.borderBottomWidth)};
  };
  const alphaOf = c => {
    const m = /rgba?\\(([^)]+)\\)/.exec(c || '');
    if (!m) return 1;
    const parts = m[1].split(',').map(v => parseFloat(v));
    return parts.length > 3 ? parts[3] : 1;
  };
  const textRects = [...document.querySelectorAll('h1,h2,h3,p,figcaption,li,blockquote,cite,dt,dd,a,button,span')]
    .filter(e => e.offsetParent !== null)
    .filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
    .map(e => { const rg = document.createRange(); rg.selectNodeContents(e);
                const r = rg.getBoundingClientRect(); rg.detach && rg.detach();
                return {el: e, r, t: e.textContent.trim().slice(0, 40)}; })
    .filter(x => x.r.width > 4 && x.r.height > 4);

  for (const host of document.querySelectorAll('body *')) {
    for (const which of ['::before', '::after']) {
      const s = getComputedStyle(host, which);
      if (!s.content || s.content === 'none' || s.content === 'normal') continue;
      if (!['absolute', 'fixed'].includes(s.position)) continue;
      if (s.visibility === 'hidden' || s.display === 'none') continue;
      const z = s.zIndex === 'auto' ? 0 : parseInt(s.zIndex, 10);
      if (z < 0) continue;                                  // deliberately behind the text
      const alpha = (+s.opacity) * Math.max(alphaOf(s.color), alphaOf(s.backgroundColor));
      if (alpha <= minAlpha) continue;                      // a faint watermark does not obscure
      const w = parseFloat(s.width), h = parseFloat(s.height);
      if (!(w > 8 && h > 8)) continue;
      // the pseudo is a CHILD of the host, so whenever the host is positioned at
      // all -- relative included -- the host's padding box is the containing block
      const hostPos = getComputedStyle(host).position;
      const anchor = s.position === 'fixed'
        ? {left: 0, top: 0}
        : (hostPos !== 'static' ? boxOf(host) : boxOf(host.offsetParent || document.body));
      const left = anchor.left + (s.left === 'auto' ? 0 : parseFloat(s.left));
      const top  = anchor.top  + (s.top  === 'auto' ? 0 : parseFloat(s.top));
      const pr = {left, top, right: left + w, bottom: top + h};
      for (const t of textRects) {
        if (host === t.el) continue;
        const ow = Math.min(pr.right, t.r.right) - Math.max(pr.left, t.r.left);
        const oh = Math.min(pr.bottom, t.r.bottom) - Math.max(pr.top, t.r.top);
        if (ow > 4 && oh > 4) {
          const cls = typeof host.className === 'string' && host.className
            ? '.' + host.className.trim().split(/\\s+/)[0] : '';
          out.push(host.tagName + cls + which + ' (alpha ' + alpha.toFixed(2) +
                   ') over "' + t.t + '"');
          break;
        }
      }
    }
  }
  return [...new Set(out)].slice(0, 6);
}"""

CLIP_JS = """() => [...document.querySelectorAll('h1,h2,h3,p,figcaption,li,button,a,dt,dd')]
  .filter(e => e.offsetParent !== null && e.textContent.trim() && !e.closest('[hidden]'))
  .filter(e => { // skip links and visually-hidden helpers are parked off-screen on purpose
    const r = e.getBoundingClientRect();
    return r.right > 0 && r.bottom > 0 && r.left < window.innerWidth + 400 && r.width > 1; })
  .filter(e => { const s = getComputedStyle(e);
    if (s.overflow === 'visible' && s.overflowX === 'visible' && s.overflowY === 'visible') return false;
    if (s.textOverflow === 'ellipsis' || s.webkitLineClamp !== 'none') return false;
    return e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 2; })
  .map(e => e.tagName + ': ' + e.textContent.trim().slice(0,40)).slice(0, 8)"""


def visible_text(html_str):
    s = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', html_str, flags=re.S | re.I)
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', s))


def gate_g2_g3(sample, fetch):
    titles, metas, kill_hits, gathers, enquirs = set(), set(), [], 0, 0
    for page in PAGES:
        html_str = fetch(page)
        vis = visible_text(html_str)
        t = re.search(r'<title>(.*?)</title>', html_str, re.S | re.I)
        titles.add(H.unescape(t.group(1).strip()) if t else f'NONE:{page}')
        m = re.search(r'<meta[^>]*name="description"[^>]*>', html_str, re.I)
        c = re.search(r'content="([^"]*)"', m.group(0)) if m else None
        metas.add(H.unescape(c.group(1)) if c else f'NONE:{page}')
        kill_hits += [f'{page}: {k}' for k in KILL if k in vis]
        gathers += len(re.findall(r'\bgather\w*', vis, re.I))
        enquirs += len(re.findall(r'\benquir\w*', vis, re.I))
    want = METAS[sample]
    meta_ok = all(want[p.replace('.html', '')] in metas for p in PAGES)
    g2 = not kill_hits and gathers <= 1 and enquirs == 0
    g3 = len(titles) == 5 and len(metas) == 5 and meta_ok
    return (g2, {'kill': kill_hits, 'gather': gathers, 'enquir': enquirs}), \
           (g3, {'titles': len(titles), 'metas': len(metas), 'match_4_1': meta_ok})


def _sweep_page(pg, page_name, w, problems):
    """Every G1 assertion for one page at one width."""
    if pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"):
        sw = pg.evaluate("document.documentElement.scrollWidth")
        problems.append(f'{page_name} @{w}: horizontal scroll ({sw}px > {w}px)')
    for c in pg.evaluate(CLIP_JS):
        problems.append(f'{page_name} @{w}: clipped {c}')
    for o in pg.evaluate(OVERLAP_JS):
        problems.append(f"{page_name} @{w}: {o['over']} covers {o['points']} of {o['text']}")
    for g in pg.evaluate(GUTTER_JS, 12 if w <= 420 else 20):
        problems.append(f'{page_name} @{w}: touches edge, {g}')
    for c in pg.evaluate(COLLAPSE_JS):
        problems.append(f'{page_name} @{w}: collapsed figure, {c}')
    for dec in pg.evaluate(DECOR_JS):
        problems.append(f'{page_name} @{w}: decoration on photo, {dec}')
    for ps in pg.evaluate(PSEUDO_JS, 0.25):
        problems.append(f'{page_name} @{w}: pseudo decoration over text, {ps}')


def gate_g1_g5(url_for, shots=None, extra_pages=()):
    from playwright.sync_api import sync_playwright
    problems, quote = [], {}
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        for page_name in list(PAGES) + list(extra_pages):
            for w in WIDTHS:
                pg = browser.new_page(viewport={'width': w, 'height': 900})
                pg.goto(url_for(page_name), wait_until='load')
                # a WebGL station page needs its first frames before anything is measured
                pg.wait_for_timeout(1200 if page_name not in PAGES else 0)
                # smooth scrolling makes a hit-test race the scroll animation
                pg.add_style_tag(content='html,body{scroll-behavior:auto !important}')
                pg.wait_for_timeout(450)
                pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                pg.wait_for_timeout(600)          # let lazy images and reveals fire
                pg.evaluate("window.scrollTo(0, 0)")
                pg.wait_for_function("window.scrollY === 0", timeout=5000)
                pg.wait_for_timeout(350)
                _sweep_page(pg, page_name, w, problems)
                if shots and w in (390, 1440):
                    Path(shots).mkdir(parents=True, exist_ok=True)
                    pg.screenshot(path=f'{shots}/{page_name}-{w}.png', full_page=True)
                pg.close()
        # G5
        pg = browser.new_page(viewport={'width': 1440, 'height': 900})
        pg.goto(url_for('enquire.html'), wait_until='load')
        quote['tel'] = pg.evaluate("!!document.querySelector('a[href^=\"tel:\"]')")
        quote['sms'] = pg.evaluate("!!document.querySelector('a[href^=\"sms:\"]')")
        quote['mailto'] = pg.evaluate("!!document.querySelector('a[href^=\"mailto:\"]')")
        pg.close()
        for key, qs in (('menu', '?menu=holy'), ('table', '?table=holy'), ('occasion', '?occasion=Wedding')):
            pg = browser.new_page(viewport={'width': 1440, 'height': 900})
            pg.goto(url_for('enquire.html') + qs, wait_until='load')
            pg.wait_for_timeout(400)
            quote[f'prefill_{key}'] = pg.evaluate(
                "() => [...document.querySelectorAll('select,input,textarea')]"
                ".some(e => (e.value||'').toString().trim().length > 0)")
            pg.close()
        browser.close()
    return problems, quote


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--sample', required=True)
    ap.add_argument('--base', help='live base URL; omit to test local files')
    ap.add_argument('--shots', help='directory for 390/1440 screenshots')
    ap.add_argument('--with-table', action='store_true',
                    help='also run G1 over table.html, the immersive one-pager')
    a = ap.parse_args()
    d = ROOT / 'samples' / a.sample
    if a.base:
        import urllib.request
        base = a.base.rstrip('/')
        def url_for(p):
            return f'{base}/{p}'
        # https on the wire; loopback is allowed so a filtered deploy can be
        # dry-run locally before it is pushed to a host.
        if not (base.startswith('https://')
                or base.startswith('http://localhost')
                or base.startswith('http://127.0.0.1')):
            sys.exit(f'--base must be https (or loopback), got: {base}')

        def fetch(p):
            with urllib.request.urlopen(f'{base}/{p}', timeout=30) as r:  # nosec B310 - https pinned above
                return r.read().decode('utf-8', 'replace')
    else:
        def url_for(p):
            return (d / p).resolve().as_uri()

        def fetch(p):
            return (d / p).read_text(encoding='utf-8', errors='replace')

    (g2, g2d), (g3, g3d) = gate_g2_g3(a.sample, fetch)
    extra = EXTRA_PAGES if a.with_table else ()
    problems, quote = gate_g1_g5(url_for, a.shots, extra)
    g1 = not problems
    g5 = all(quote.values())

    print(f'--- {a.sample} {"(live: " + a.base + ")" if a.base else "(local)"}')
    print(f'G1 layout      {"GREEN" if g1 else "RED"}  {len(problems)} problems')
    for p in problems[:25]:
        print(f'    {p}')
    if len(problems) > 25:
        print(f'    ... {len(problems)-25} more')
    print(f'G2 copy        {"GREEN" if g2 else "RED"}  {g2d}')
    print(f'G3 titles/meta {"GREEN" if g3 else "RED"}  {g3d}')
    print(f'G5 quote flow  {"GREEN" if g5 else "RED"}  {quote}')
    return 0 if (g1 and g2 and g3 and g5) else 1


if __name__ == '__main__':
    sys.exit(main())
