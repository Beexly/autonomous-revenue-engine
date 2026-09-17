"""Local Chromium engineering QA; writes evidence only inside this sample."""
from pathlib import Path
import json, functools, threading, time
from urllib.parse import urlparse, unquote
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'test-output'; OUT.mkdir(exist_ok=True)
ROUTES=['index','menu','gallery','story','enquire']
facts=json.loads((ROOT/'facts.json').read_text(encoding='utf-8-sig'))
results={'browser':'Playwright bundled Chromium, Windows headless','viewports':[], 'checks':[], 'console_errors':[], 'page_errors':[], 'failed_requests':[], 'screenshots':[], 'visual_approval':False}
class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=f'http://127.0.0.1:{server.server_port}/'
def check(condition,message):
    assert condition,message
    results['checks'].append(message)
def instrument(page):
    page.on('pageerror',lambda err:results['page_errors'].append(str(err)))
    page.on('console',lambda msg:results['console_errors'].append(msg.text) if msg.type=='error' else None)
    page.on('requestfailed',lambda req:results['failed_requests'].append({'url':req.url,'error':req.failure}))
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True)
        results['browser_version']=browser.version
        for width in [360,390,768,1440]:
            context=browser.new_context(viewport={'width':width,'height':1000})
            page=context.new_page(); instrument(page)
            for route in ROUTES:
                response=page.goto(base+route+'.html',wait_until='networkidle')
                check(response.status==200,f'{width}/{route}: HTTP 200')
                page.evaluate("async () => { for (const img of document.images) {img.loading='eager'; await img.decode().catch(()=>{});} await document.fonts.ready; }")
                metrics=page.evaluate('''() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,title:document.title.length,description:document.querySelector('meta[name=description]').content.length,images:[...document.images].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth>0,width:i.getBoundingClientRect().width,native:i.naturalWidth,alt:i.hasAttribute('alt'),dimensions:i.hasAttribute('width')&&i.hasAttribute('height')})),brand:[...document.querySelectorAll('.brand img')].map(i=>i.getBoundingClientRect().width)})''')
                results['viewports'].append({'route':route,**metrics})
                check(metrics['scrollWidth']<=width,f'{width}/{route}: no horizontal page overflow')
                check(metrics['h1']==1 and metrics['title']<=60 and 120<=metrics['description']<=155,f'{width}/{route}: heading and metadata gates')
                check(all(i['loaded'] and i['alt'] and i['dimensions'] and i['width']<=i['native']+.1 for i in metrics['images']),f'{width}/{route}: images loaded, attributed, dimensioned, not upscaled')
                check(len(metrics['brand'])==2 and all(w >= (155 if width<=700 else 190) for w in metrics['brand']),f'{width}/{route}: original brand mounts meet width floor')
                check(page.locator('header nav a').count()==5,f'{width}/{route}: five navigation destinations')
                check(page.locator(f'a[href="mailto:{facts["email"]}"]').count()>0 and page.locator(f'a[href="tel:+{facts["phone"]}"]').count()>0,f'{width}/{route}: direct contact matches facts.json')
                if width in [390,1440]:
                    shot=OUT/f'{route}-{width}.png'; page.screenshot(path=str(shot),full_page=True); results['screenshots'].append(str(shot))
            context.close()
        context=browser.new_context(viewport={'width':1440,'height':1000})
        page=context.new_page(); instrument(page)
        page.goto(base+'index.html'); page.keyboard.press('Tab')
        check(page.locator('.skip').evaluate('(e)=>e===document.activeElement'),'Keyboard skip link is first focus target')
        page.keyboard.press('Enter')
        check(page.locator('#main').evaluate('(e)=>e===document.activeElement'),'Skip link moves focus to main content')
        page.mouse.move(900,400); page.wait_for_timeout(80)
        check(bool(page.locator('.hero').evaluate("e=>e.style.getPropertyValue('--spot-x')")),'Pointer updates real CSS spotlight position')
        page.evaluate('window.scrollTo(0,300)');page.wait_for_timeout(100)
        check(float(page.locator('.hero').evaluate("e=>e.style.getPropertyValue('--scene-progress')"))>0,'Native scroll updates theatrical scene progress')
        page.evaluate('window.scrollTo(0,0)');page.locator('.motion').click()
        page.mouse.move(500,450);page.wait_for_timeout(80)
        check(page.locator('html').get_attribute('class')=='motion-off','Explicit motion pause disables decorative interaction')
        page.locator('header nav a[href="menu.html"]').click()
        for menu in facts['menus']:
            page.locator('[data-menu='+menu['id']+']').click()
            check(page.locator('.menu-panel:visible').count()==1 and page.locator('#'+menu['id']).is_visible(),f'Menu selection: {menu["id"]}')
        page.go_back()
        check(page.locator('#standard').is_visible(),'Menu browser Back restores prior stage')
        page.go_forward()
        check(page.locator('#graze').is_visible(),'Menu browser Forward restores selected stage')
        page.locator('[data-menu=holy]').focus();page.keyboard.press('ArrowRight')
        check(page.locator('#grand').is_visible(),'Menu keyboard arrows change stage')
        page.locator('#grand .ticket').click();page.wait_for_function("document.querySelector('#estimate').textContent.includes('$2,512.22')")
        check(page.locator('#menu-choice').input_value()=='grand','Menu CTA presets enquiry menu')
        cases=[('holy',75,0,'$2,630.22'),('holy',150,0,'$4,400.22'),('grand',50,0,'$2,512.22'),('super',50,0,'$2,040.22'),('standard',50,0,'$1,804.22'),('graze',50,0,'$1,686.22'),('graze',50,2,'$2,040.22'),('holy',150,4,'$6,524.22')]
        for menu,count,extra,total in cases:
            page.locator('#menu-choice').select_option(menu);page.locator('#guests').fill(str(count));page.locator('#extra-time').select_option(str(extra))
            check(total in page.locator('#estimate').inner_text(),f'Quote regression: {menu}/{count}/{extra} = {total}')
        for menu,count in [('holy','74'),('holy','76'),('holy','149'),('holy','151'),('grand','49'),('graze','50.5'),('super','-1'),('standard',''),('graze','10001')]:
            page.locator('#menu-choice').select_option(menu);page.locator('#guests').fill(count)
            check(page.locator('#estimate .invalid').count()==1 and page.locator('#estimate .estimate-total').count()==0,f'Invalid quote rejected: {menu}/{count}')
        page.locator('#event-notes').fill('<img src=x onerror=alert(1)> Test only')
        page.locator('.draft-button').click()
        check('custom quote' in page.locator('#draft-text').input_value().lower(),'Invalid quote can prepare honest custom enquiry')
        check('<img src=x' in page.locator('#draft-text').input_value() and page.locator('#draft-review img').count()==0,'Enquiry notes stay plain text, never inserted as markup')
        check(page.locator('#open-email').get_attribute('href').startswith('mailto:'+facts['email']+'?'),'Email draft uses exact facts recipient')
        page.locator('#draft-text').fill('Edited by the guest')
        check('Edited%20by%20the%20guest' in page.locator('#open-email').get_attribute('href'),'Edited draft updates explicit email link')
        page.evaluate("Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('denied'))},configurable:true})")
        page.locator('#copy-draft').click()
        check('copy it manually' in page.locator('#draft-status').inner_text(),'Clipboard-denied fallback selects draft and gives instructions')
        check(page.evaluate('localStorage.length===0 && sessionStorage.length===0'),'No PII or choices persisted in browser storage')
        page.goto(base+'gallery.html');page.locator('[data-film="1"]').click();page.wait_for_timeout(700)
        check(page.locator('.filmstrip').evaluate('e=>e.scrollLeft')>0,'Filmstrip next button actually scrolls photographs')
        for i in range(6):
            link=page.locator('[data-lightbox]').nth(i);link.click();page.locator('#lightbox-image').evaluate('e=>e.decode()')
            check(page.locator('#lightbox').is_visible(),f'Gallery frame {i+1} opens accessible native dialog')
            check(page.locator('#lightbox-image').evaluate('e=>e.getBoundingClientRect().width<=e.naturalWidth'),'Lightbox respects native image width')
            page.keyboard.press('Escape');check(not page.locator('#lightbox').is_visible(),f'Gallery frame {i+1}: Escape closes')
            check(link.evaluate('e=>e===document.activeElement'),f'Gallery frame {i+1}: focus restored')
        for route in ROUTES:
            page.goto(base+route+'.html')
            for href in page.locator('a[href]').evaluate_all('els=>els.map(e=>e.getAttribute("href"))'):
                path=urlparse(href).path
                if not path or href.startswith(('mailto:','tel:','http:','https:')):continue
                check((ROOT/unquote(path)).is_file(),f'{route}: local link exists {path}')
        context.close()
        for mode in ['no-js','reduced-motion']:
            ctx=browser.new_context(java_script_enabled=mode!='no-js',reduced_motion='reduce' if mode=='reduced-motion' else 'no-preference',viewport={'width':390,'height':844})
            page=ctx.new_page();instrument(page)
            for route in ROUTES:
                page.goto(base+route+'.html',wait_until='networkidle')
                check(page.locator('h1').is_visible(),f'{mode}/{route}: meaningful static page visible')
            page.goto(base+'menu.html')
            if mode=='no-js':check(page.locator('.menu-panel:visible').count()==5,'No JavaScript: all five menu descriptions remain visible')
            else:
                check(page.locator('html').get_attribute('class')=='motion-off','Reduced-motion preference disables motion')
                page.locator('.motion').click();check(page.locator('html').get_attribute('class')=='motion-off','Explicit control cannot override reduced-motion preference')
            ctx.close()
        browser.close()
    check(not results['console_errors'],'Zero browser console errors')
    check(not results['page_errors'],'Zero uncaught page errors')
    check(not results['failed_requests'],'Zero failed network requests')
    for route in ROUTES:
        soup=BeautifulSoup((ROOT/(route+'.html')).read_text(encoding='utf-8'),'html.parser')
        ids=[tag['id'] for tag in soup.select('[id]')]
        check(len(ids)==len(set(ids)),f'{route}: no duplicate IDs')
        check(all(soup.find(id=label['for']) for label in soup.select('label[for]')),f'{route}: every explicit field label has a control')
    results['status']='PASS';print(f'PASS: {len(results["checks"])} assertions; 20 viewport/route combinations; 10 screenshots; zero browser errors.')
except Exception as error:
    results['status']='FAIL';results['failure']=str(error);raise
finally:
    server.shutdown()
    (OUT/'qa-results.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
