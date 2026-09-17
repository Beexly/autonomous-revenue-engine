"""Rendered-contrast audit: every visible text node, its computed colour, and the
first opaque background painted behind it. Same method as axe's color-contrast
rule, run locally because the proxy blocks the npm install."""
import sys

from playwright.sync_api import sync_playwright

JS = """() => {
  const lin = c => { c/=255; return c<=0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); };
  const lum = ([r,g,b]) => 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);
  const parse = s => { const m=/rgba?\\(([^)]+)\\)/.exec(s); if(!m) return null;
    const p=m[1].split(',').map(parseFloat); return {rgb:[p[0],p[1],p[2]], a:p.length>3?p[3]:1}; };
  const over = (fg,bg,a) => fg.map((c,i)=>a*c+(1-a)*bg[i]);
  const bgOf = el => {
    let e = el, img = false;
    while (e && e !== document.documentElement) {
      const s = getComputedStyle(e);
      if (s.backgroundImage && s.backgroundImage.includes('url(')) img = true;
      const c = parse(s.backgroundColor);
      if (c && c.a === 1) return {rgb:c.rgb, img};
      if (c && c.a > 0) return {rgb:c.rgb, img, semi:true};
      e = e.parentElement;
    }
    return {rgb:[255,255,255], img};
  };
  // Is a real photograph painted under this text? An ancestor walk cannot tell,
  // because an <img> is a sibling in the paint order, not a background.
  const photoUnder = el => {
    // if the element paints its own opaque background, nothing beneath it matters
    const own = parse(getComputedStyle(el).backgroundColor);
    if (own && own.a === 1) return false;
    const r = el.getBoundingClientRect();
    const xs = [r.left + r.width * 0.25, r.left + r.width * 0.75];
    const ys = [r.top + r.height * 0.5];
    for (const x of xs) for (const y of ys) {
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) continue;
      const stack = document.elementsFromPoint(x, y);
      const i = stack.indexOf(el);
      const below = i === -1 ? stack : stack.slice(i + 1);
      for (const n of below) {
        if (n.tagName === 'IMG') return true;
        const bs = getComputedStyle(n);
        if (bs.backgroundImage && bs.backgroundImage.includes('url(')) return true;
        const c = parse(bs.backgroundColor);
        if (c && c.a === 1) return false;   // an opaque layer covers anything beneath
      }
    }
    return false;
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
    // WCAG 1.4.3 exempts disabled controls, and axe skips them too
    if (el.disabled || el.closest('[disabled],[aria-disabled="true"]')) continue;
    if (el.closest('fieldset[disabled]')) continue;
    const own = [...el.childNodes].filter(n=>n.nodeType===3 && n.textContent.trim());
    if (!own.length) continue;
    const s = getComputedStyle(el);
    if (s.visibility==='hidden' || +s.opacity===0) continue;
    const r = el.getBoundingClientRect();
    if (r.width<2 || r.height<2) continue;
    // parked off-screen on purpose (skip links, visually-hidden helpers)
    if (r.right < 0 || r.bottom < 0 || r.left > innerWidth + 400) continue;
    const fg = parse(s.color); if (!fg) continue;
    const bg = bgOf(el);
    const eff = fg.a<1 ? over(fg.rgb,bg.rgb,fg.a) : fg.rgb;
    const op = +s.opacity;
    const eff2 = op<1 ? over(eff,bg.rgb,op) : eff;
    const L1 = lum(eff2), L2 = lum(bg.rgb);
    const ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const px = parseFloat(s.fontSize);
    const bold = (parseInt(s.fontWeight,10)||400) >= 700;
    const large = px >= 24 || (bold && px >= 18.66);
    const need = large ? 3 : 4.5;
    // Text sitting directly on a photograph has no CSS background to measure, so
    // the ratio below is meaningless. Report it as its own category instead of a
    // number: this is the exact case axe scores as a pass and a reader cannot read.
    if ((bg.img || photoUnder(el)) && ratio >= need) {
      out.push({sel: el.tagName + (typeof el.className==='string'&&el.className ? '.'+el.className.trim().split(/\\s+/)[0] : ''),
        text: el.textContent.trim().slice(0,38), ratio: null, need, px: Math.round(px),
        fg: s.color, bg: 'a photograph', overImage: true});
      continue;
    }
    if (ratio < need && photoUnder(el)) {
      out.push({sel: el.tagName + (typeof el.className==='string'&&el.className ? '.'+el.className.trim().split(/\\s+/)[0] : ''),
        text: el.textContent.trim().slice(0,38), ratio: null, need, px: Math.round(px),
        fg: s.color, bg: 'a photograph', overImage: true});
      continue;
    }
    if (ratio < need) out.push({sel: el.tagName + (typeof el.className==='string'&&el.className ? '.'+el.className.trim().split(/\\s+/)[0] : ''),
      text: el.textContent.trim().slice(0,38), ratio:+ratio.toFixed(2), need, px:Math.round(px),
      fg:s.color, bg:'rgb('+bg.rgb.map(Math.round).join(',')+')', overImage: bg.img});
  }
  return out;
}"""

base, pages, widths = sys.argv[1], sys.argv[2].split(','), [int(x) for x in sys.argv[3].split(',')]
bad = 0
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for w in widths:
        pg = b.new_page(viewport={'width': w, 'height': 900})
        for p in pages:
            pg.goto(f'{base}/{p}.html'); pg.wait_for_timeout(350)
            for v in pg.evaluate(JS):
                bad += 1
                if v['ratio'] is None:
                    print(f"  {p}@{w} OVER A PHOTOGRAPH, no measurable background | {v['sel']} "
                          f"{v['px']}px | {v['fg']} | \"{v['text']}\"")
                else:
                    print(f"  {p}@{w} {v['ratio']}:1 need {v['need']} | {v['sel']} {v['px']}px "
                          f"| {v['fg']} on {v['bg']} | \"{v['text']}\"")
        pg.close()
    b.close()
print(f"FAIL {bad}" if bad else "PASS - every text node meets AA")
