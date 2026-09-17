"""Adapted from client tools/quality-gate.py; all outputs stay in this sample."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
import threading,json
from playwright.sync_api import sync_playwright
S=Path(__file__).resolve().parent
OUT=S/'test-output';OUT.mkdir(exist_ok=True)
AXE=S.parents[1]/'tools/qa-runtime/node_modules/axe-core/axe.min.js'
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(S)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
report={'sample':S.name,'pages':[],'failures':[]}
def check(ok,detail):
 if not ok:report['failures'].append(detail)
try:
 with sync_playwright() as p:
  browser=p.chromium.launch()
  page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  for width in [390,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for route in ['index.html','menu.html','gallery.html','story.html','enquire.html']:
    errors.clear();response=page.goto(base+route,wait_until='networkidle');page.evaluate('''async()=>{await Promise.all([...document.images].map(i=>{i.loading="eager";return Promise.race([i.decode().catch(()=>{}),new Promise(r=>setTimeout(r,8000))])}))}''')
    m=page.evaluate('''()=>({h1:document.querySelectorAll('h1').length,width:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,alt:i.hasAttribute('alt'),sized:i.hasAttribute('width')&&i.hasAttribute('height')})),links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').pop(),bytes:r.decodedBodySize}))})''')
    m.update({'route':route,'viewport':width,'status':response.status,'errors':list(errors)})
    check(response.status==200,f'{route}: HTTP {response.status}');check(m['h1']==1,f'{route}: h1 count');check(m['scroll']<=width,f'{route}@{width}: overflow');check(not errors,f'{route}: {errors}')
    check(all(x['ok'] and x['alt'] and x['sized'] for x in m['images']),f'{route}: image loading/alt/dimensions')
    check(not any('logo-paper' in x['src'] or x['src']=='img/logo.png' for x in m['images']),f'{route}: obsolete logo')
    for link in set(m['links']):
     if link.startswith(('http','mailto:','tel:','sms:','#')):continue
     check(page.request.get(base+link.split('#')[0]).status==200,f'{route}: broken link {link}')
    page.add_script_tag(path=str(AXE))
    axe=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))}")
    m['axe']=axe;check(not axe,f'{route}@{width}: axe '+str(axe))
    report['pages'].append(m)
  browser.close()
finally: server.shutdown()
report['passed']=not report['failures'];(OUT/'quality-gate-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps({'passed':report['passed'],'pages':len(report['pages']),'failures':report['failures']},indent=2));raise SystemExit(0 if report['passed'] else 1)
