"""Find which element overflows on sample-1 pages, and which img srcs 404.
Read-only inspection; prints evidence, changes nothing."""
import json
from playwright.sync_api import sync_playwright
routes=['index.html','menu.html','gallery.html','story.html','enquire.html']
base='https://charcuterie-chick-sample-1.vercel.app/'
JS='''() => {
  const doc=document.documentElement, vw=innerWidth;
  const offenders=[];
  for (const el of document.querySelectorAll('body *')) {
    const r=el.getBoundingClientRect();
    if (r.right>vw+1 || r.left<-1) {
      const cs=getComputedStyle(el);
      offenders.push({tag:el.tagName, cls:el.className&&String(el.className).slice(0,60), right:Math.round(r.right), left:Math.round(r.left), width:cs.width, position:cs.position, transform:cs.transform!=='none'});
    }
  }
  return {vw, scrollW:doc.scrollWidth, offenders:offenders.slice(0,12), count:offenders.length};
}'''
with sync_playwright() as p:
    b=p.chromium.launch(); page=b.new_page(viewport={'width':390,'height':844})
    for route in routes[:2]:
        page.goto(base+route, wait_until='networkidle')
        r=page.evaluate(JS)
        print(json.dumps({'route':route,**r}, indent=1))
        imgs=page.evaluate("[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,w:i.width,h:i.height}))")
        print(json.dumps([i for i in imgs if not i['src'].startswith('http')], indent=0))
    b.close()
