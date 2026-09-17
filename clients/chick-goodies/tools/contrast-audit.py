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
      if (s.backgroundImage && s.backgroundImage !== 'none') img = true;
      const c = parse(s.backgroundColor);
      if (c && c.a === 1) return {rgb:c.rgb, img};
      if (c && c.a > 0) return {rgb:c.rgb, img, semi:true};
      e = e.parentElement;
    }
    return {rgb:[255,255,255], img};
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (!el.offsetParent && getComputedStyle(el).position !== 'fixed') continue;
    const own = [...el.childNodes].filter(n=>n.nodeType===3 && n.textContent.trim());
    if (!own.length) continue;
    const s = getComputedStyle(el);
    if (s.visibility==='hidden' || +s.opacity===0) continue;
    const r = el.getBoundingClientRect();
    if (r.width<2 || r.height<2) continue;
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
                note = '  (over a background image - axe cannot judge either)' if v['overImage'] else ''
                print(f"  {p}@{w} {v['ratio']}:1 need {v['need']} | {v['sel']} {v['px']}px "
                      f"| {v['fg']} on {v['bg']} | \"{v['text']}\"{note}")
        pg.close()
    b.close()
print(f"FAIL {bad}" if bad else "PASS - every text node meets AA")
