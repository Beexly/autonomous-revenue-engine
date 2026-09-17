"""Read-only local QA. Exit 1 on defects; no deploy and no messages sent."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
import argparse,threading,json,hashlib
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
ap=argparse.ArgumentParser();ap.add_argument('--sample',default='sample-3-studio');args=ap.parse_args()
S=R/'samples'/args.sample
OUT=R/'docs/research/gathering'/('qa-'+args.sample);OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(S)))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}/'
report={'sample':args.sample,'pages':[],'failures':[],'interactions':[]}
def check(ok,detail):
 if not ok:report['failures'].append(detail)
with sync_playwright() as p:
 browser=p.chromium.launch(args=['--enable-unsafe-swiftshader'])
 page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 for width in [390,1440]:
  page.set_viewport_size({'width':width,'height':900})
  for route in ['index.html','menu.html','gallery.html','story.html','enquire.html']:
   errors.clear();response=page.goto(base+route,wait_until='networkidle');page.evaluate('Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))')
   m=page.evaluate('''()=>({h1:document.querySelectorAll('h1').length,width:innerWidth,scroll:document.documentElement.scrollWidth,images:[...document.images].map(i=>({src:i.getAttribute('src'),ok:i.complete&&i.naturalWidth>0,alt:i.hasAttribute('alt'),sized:i.hasAttribute('width')&&i.hasAttribute('height')})),links:[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')),resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').pop(),bytes:r.decodedBodySize}))})''')
   m.update({'route':route,'viewport':width,'status':response.status,'errors':list(errors)})
   check(response.status==200,f'{route}: HTTP {response.status}');check(m['h1']==1,f'{route}: h1 count');check(m['scroll']<=width,f'{route}@{width}: overflow');check(not errors,f'{route}: {errors}')
   check(all(x['ok'] and x['alt'] and x['sized'] for x in m['images']),f'{route}: image loading/alt/dimensions')
   check(not any('logo-paper' in x['src'] or x['src']=='img/logo.png' for x in m['images']),f'{route}: obsolete logo')
   for link in set(m['links']):
    if link.startswith(('http','mailto:','tel:','sms:','#')):continue
    check(page.request.get(base+link.split('#')[0]).status==200,f'{route}: broken link {link}')
   page.add_script_tag(path=str(R/'tools/qa-runtime/node_modules/axe-core/axe.min.js'))
   axe=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))}")
   m['axe']=axe;check(not axe,f'{route}@{width}: axe '+str(axe))
   page.screenshot(path=str(OUT/f'{route}-{width}.png'),full_page=True);report['pages'].append(m)
 if args.sample=='sample-3-studio':
  page.goto(base,wait_until='networkidle');page.wait_for_timeout(600)
  scene=page.evaluate('window.GatheringScene');report['scene']=scene;check(scene and scene.get('ready'),'WebGL did not render')
  if scene and scene.get('ready'):
   before=scene['frames'];page.mouse.move(1250,500);page.wait_for_timeout(400);after=page.evaluate('window.GatheringScene');check(after['frames']>before,'Scene not animating');check(after['pointer']!=scene['pointer'],'Pointer not reactive')
   page.locator('#motion').click();before=page.evaluate('GatheringScene.frames');page.wait_for_timeout(250);check(page.evaluate('GatheringScene.frames')==before,'Pause failed')
   page.emulate_media(reduced_motion='reduce');page.reload(wait_until='networkidle');check(page.evaluate('GatheringScene.paused'),'Reduced motion not respected');page.emulate_media(reduced_motion='no-preference')
  page.goto(base+'gallery.html');page.locator('[data-lightbox]').first.click();check(page.locator('dialog').is_visible(),'Gallery did not open');src=page.locator('#large-photo').get_attribute('src');page.locator('#next-photo').click();check(page.locator('#large-photo').get_attribute('src')!=src,'Gallery next failed');page.keyboard.press('Escape');check(not page.locator('dialog').is_visible(),'Gallery escape failed')
  page.goto(base+'enquire.html');
  for table,n,total in [('holy',75,263022),('holy',150,440022),('grand',50,251222),('super',50,204022),('standard',50,180422),('graze',50,168622)]:
   actual=page.evaluate('([id,n])=>GatheringQuote.calculate(id,n)',[table,n]);check(actual.get('total')==total,f'Quote mismatch {table} {n}')
  for table,n in [('holy',76),('graze',49),('grand',50.5),('bad',50)]:check(page.evaluate('([id,n])=>!!GatheringQuote.calculate(id,n).error',[table,n]),f'Invalid quote accepted {table} {n}')
  report['interactions']=['scene render/pointer/pause/reduced-motion','gallery open/next/escape','six quote totals and four invalid boundaries']
 browser.close()
server.shutdown();report['passed']=not report['failures'];(OUT/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps({'passed':report['passed'],'pages':len(report['pages']),'failures':report['failures'],'scene':report.get('scene'),'report':str(OUT/'report.json')},indent=2));raise SystemExit(0 if report['passed'] else 1)
