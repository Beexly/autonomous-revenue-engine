from pathlib import Path
import json
from playwright.sync_api import sync_playwright
OUT=Path(__file__).resolve().parents[1]/'docs/research/gathering/live-validation.json'
rows=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 page=browser.new_page(viewport={'width':390,'height':844})
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 for i in (1,2,3):
  for route in ('index.html','menu.html','gallery.html','story.html','enquire.html'):
   errors.clear(); url=f'https://charcuterie-chick-sample-{i}.vercel.app/{route}'
   try:
    response=page.goto(url,wait_until='networkidle',timeout=45000)
    row={'url':url,'status':response.status,'console_errors':list(errors)}
    if response.status==200:
     row.update(page.evaluate('''() => ({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,missingImageAlt:[...document.images].filter(x=>!x.hasAttribute('alt')).length,brokenImages:[...document.images].filter(x=>!x.complete||!x.naturalWidth).map(x=>x.src),unlabelledInputs:[...document.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(x=>!x.labels?.length&&!x.getAttribute('aria-label')&&!x.getAttribute('aria-labelledby')).map(x=>x.id)})'''))
    row['passed']=row['status']==200 and not row['console_errors'] and row.get('h1')==1 and not row.get('overflow') and not row.get('brokenImages') and not row.get('missingImageAlt') and not row.get('unlabelledInputs')
   except Exception as e:row={'url':url,'passed':False,'error':str(e)}
   rows.append(row)
 browser.close()
report={'scope':'Live HTTP routes, JavaScript errors, mobile overflow, image loading and basic accessibility checks; not full WCAG/visual approval','passed':all(x['passed'] for x in rows),'checks':rows}
OUT.write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
raise SystemExit(0 if report['passed'] else 1)
