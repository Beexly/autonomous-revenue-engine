from pathlib import Path
import json
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import threading
ROOT=Path(__file__).resolve().parents[1]
S=ROOT/'site'
class Q(SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=ThreadingHTTPServer(('127.0.0.1',0),partial(Q,directory=str(S)))
threading.Thread(target=srv.serve_forever,daemon=True).start()
with sync_playwright() as p:
    b=p.chromium.launch(); page=b.new_page(viewport={'width':1440,'height':1000})
    page.goto(f'http://127.0.0.1:{srv.server_port}/',wait_until='networkidle')
    checks=page.evaluate('''() => {
  const out={};
  const overlaps=(a,b)=>{const r=a.getBoundingClientRect(),s=b.getBoundingClientRect();return !(r.right<=s.left||r.left>=s.right||r.bottom<=s.top||r.top>=s.bottom)};
  const boxes=[...document.querySelectorAll('h1,h2,h3,p,figure,img,select,input,button,summary,dt,dd,output,a')].filter(e=>e.checkVisibility());
  out.overlaps=[];
  for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const A=boxes[i],B=boxes[j];
    if(A.contains(B)||B.contains(A))continue;
    const cs=getComputedStyle(A);
    if(cs.position!=='static')continue;
    if(overlaps(A,B)){const ar=A.getBoundingClientRect(),br=B.getBoundingClientRect();const ix=Math.min(ar.right,br.right)-Math.max(ar.left,br.left),iy=Math.min(ar.bottom,br.bottom)-Math.max(ar.top,br.top);if(ix>8&&iy>8)out.overlaps.push([A.tagName+'.'+A.className,B.tagName+'.'+B.className,Math.round(ix),Math.round(iy)]);}
  }
  out.plateBefore=getComputedStyle(document.querySelector('.invitation .plate'),':before').content;
  out.h1Lines=document.querySelector('h1').innerText;
  out.frauncesLoaded=false;
  const test=document.createElement('span');test.style.fontFamily='EB Garamond';test.textContent='test';document.body.appendChild(test);
  out.egWidth=test.offsetWidth;test.remove();
  out.heroNoOverlap=!overlaps(document.querySelector('.title-block'),document.querySelector('.hero figure')); 
  out.egOK=document.fonts.check('20px "EB Garamond"');
  out.contrast=[];
  for(const sel of ['.hero-copy','.eyebrow','.menu-detail p','.field-hint','.bill-note']){
    const el=document.querySelector(sel);const s=getComputedStyle(el);const bg=el.closest('.menu')?getComputedStyle(document.querySelector('.menu')).backgroundColor:getComputedStyle(document.body).backgroundColor;
    const hex=c=>c.match(/\\d+/g).slice(0,3).map(x=>(+x).toString(16).padStart(2,'0')).join('');
    out.contrast.push([sel,hex(s.color),hex(bg)]);
  }
  out.bodyFont=getComputedStyle(document.body).font;
  return out;
}''')
    checks['menuGeometry']=page.locator('.menu-list summary, .menu-price').evaluate_all('(els)=>els.map(e=>({text:e.textContent,visible:e.checkVisibility(),box:e.getBoundingClientRect().toJSON(),position:getComputedStyle(e).position,margin:getComputedStyle(e).margin}))')
    (ROOT/'docs/research/studio-revision/layout.json').write_text(json.dumps(checks,indent=2))
    print(json.dumps(checks,indent=1))
    b.close()
srv.shutdown()
