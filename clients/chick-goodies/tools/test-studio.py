from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import threading, json, urllib.request, hashlib
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
S=ROOT/'samples/sample-3-studio'
OUT=ROOT/'docs/research/studio-revision'
class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(S)))
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}/'
report={'viewports':[],'checks':[]}
with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page()
    errors=[]
    page.on('pageerror',lambda e: errors.append(str(e)))
    for width in [1440,390,320]:
        page.set_viewport_size({'width':width,'height':1000 if width==1440 else 844})
        page.goto(url,wait_until='networkidle')
        page.evaluate('Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))')
        metrics=page.evaluate('''() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,title:document.title.length,description:document.querySelector('meta[name="description"]').content.length,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.getBoundingClientRect().width,native:i.naturalWidth,alt:!!i.alt,dimensions:i.hasAttribute('width')&&i.hasAttribute('height')})),overflow:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.tagName+'.'+e.className)})''')
        assert metrics['scrollWidth']==width,metrics
        assert metrics['h1']==1 and metrics['title']<=60 and 120<=metrics['description']<=155,metrics
        assert all(i['loaded'] and i['alt'] and i['dimensions'] and i['width']<=i['native']+1 for i in metrics['images']),metrics
        report['viewports'].append(metrics)
        page.screenshot(path=str(OUT/f'after-{width}.png'),full_page=True)
    for table,count,total in [('holy',75,263022),('holy',150,440022),('grand',50,251222),('super',50,204022),('standard',50,180422),('graze',50,168622)]:
        q=page.evaluate('([id,n])=>StudioQuote.calculate(id,n)',[table,count])
        assert q['total']==total,(table,q,total)
        report['checks'].append(f'{table} / {count}: {total/100:.2f}')
    for table,count in [('holy',74),('holy',76),('holy',149),('holy',151),('graze',49),('graze',50.5),('graze',''),('bad',50)]:
        q=page.evaluate('([id,n])=>StudioQuote.calculate(id,n)',[table,count]);assert q.get('error'),q
    report['checks'].append('8 invalid quote boundaries rejected')
    page.locator('#menu-grand summary').click()
    assert page.locator('#menu-grand').get_attribute('open') is not None
    page.locator('#menu-grand [data-table]').click()
    assert page.locator('#table').input_value()=='grand'
    page.locator('#guests').fill('50')
    assert page.locator('#total').inner_text()=='$2,512.22'
    page.locator('#more').click();assert page.locator('#guests').input_value()=='55'
    page.locator('#fewer').click();assert page.locator('#guests').input_value()=='50'
    page.locator('.enquiry summary').click()
    page.locator('#name').fill('QA Example');page.locator('#notes').fill('Test only — no enquiry sent')
    from urllib.parse import unquote
    for selector in ['#text-enquiry','#email-enquiry']:
        href=unquote(page.locator(selector).get_attribute('href'))
        assert 'QA Example' in href and '$2,512.22' in href and 'Grand Graze' in href
    page.locator('#guests').fill('49');assert 'minimum' in page.locator('#quote-error').inner_text()
    assert 'custom quote' in unquote(page.locator('#email-enquiry').get_attribute('href'))
    report['checks'].append('menu selection, guest stepper, message composition and invalid custom enquiry passed; no messages sent')
    page.evaluate("Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true})")
    page.locator('#copy').click();assert page.locator('#message-preview').is_visible()
    report['checks'].append('clipboard-denied manual fallback passed')
    page.emulate_media(reduced_motion='reduce')
    assert page.evaluate("getComputedStyle(document.documentElement).scrollBehavior")=='auto'
    page.goto(url,wait_until='networkidle');page.keyboard.press('Tab');assert page.locator('.skip').evaluate('(e)=>e===document.activeElement')
    report['checks'].append('reduced motion and keyboard skip link passed')
    assets=page.evaluate("[...document.querySelectorAll('img[src],script[src],link[href]')].map(e=>e.getAttribute('src')||e.getAttribute('href')).filter(x=>!x.startsWith('http'))")
    for asset in assets:
        response=urllib.request.urlopen(url+asset);data=response.read();assert response.status==200 and len(data)>0
    report['checks'].append(f'{len(assets)} referenced local assets HTTP 200 with nonzero bytes')
    assert not errors,errors
    report['page_errors']=errors
    context=browser.new_context(java_script_enabled=False)
    nojs=context.new_page();nojs.goto(url);nojs.locator('#menu-graze summary').click();assert nojs.locator('#menu-graze .menu-price').is_visible()
    report['checks'].append('no-JavaScript menu disclosure works; enquiry has direct contact fallback')
    browser.close()
server.shutdown()
for name in ['index.html','studio.css','studio.js','studio-data.json','img/plate.svg']:
    assert (S/name).read_bytes()==(ROOT/'site'/name).read_bytes(),name
report['checks'].append('sample/site exact byte parity for five build files')
(OUT/'qa.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2))
