"""Enumerate live rendered images without altering sites or source assets."""
from pathlib import Path
import json,hashlib
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];OUT=R/'docs/research/image-audit';OUT.mkdir(parents=True,exist_ok=True)
rows=[];routes=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for sample in (1,2,3):
  for width in (390,1440):
   page=browser.new_page(viewport={'width':width,'height':900})
   for route in ('','menu.html','gallery.html','story.html','enquire.html'):
    url=f'https://charcuterie-chick-sample-{sample}.vercel.app/{route}'
    try:
     response=page.goto(url,wait_until='networkidle',timeout=45000)
     status=response.status;routes.append({'url':url,'width':width,'status':status})
     if status!=200:continue
     for i,img in enumerate(page.locator('img').all()):
      row=img.evaluate('''e=>({src:e.getAttribute('src'),currentSrc:e.currentSrc,alt:e.getAttribute('alt'),loading:e.loading,srcset:e.srcset,naturalWidth:e.naturalWidth,naturalHeight:e.naturalHeight,renderedWidth:e.getBoundingClientRect().width,renderedHeight:e.getBoundingClientRect().height,objectFit:getComputedStyle(e).objectFit,visible:!!e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'})''')
      row.update({'page':url,'viewport':width,'index':i})
      if row['visible'] and row['renderedWidth']>0 and row['renderedHeight']>0:
       name=f'{sample}-{width}-{route or "index"}-{i}.png';img.screenshot(path=str(OUT/name),timeout=15000);row['screenshot']=name
      rows.append(row)
    except Exception as e:routes.append({'url':url,'width':width,'error':str(e)})
   page.close()
 browser.close()
report={'routes':routes,'images':rows,'unique_sources':sorted({r['currentSrc'] for r in rows}),'visual_review':'Not yet performed; screenshots are evidence, not visual approval.'}
(OUT/'manifest.json').write_text(json.dumps(report,indent=2));print(json.dumps({'routes_checked':len(routes),'rendered_image_entries':len(rows),'unique_sources':len(report['unique_sources']),'output':str(OUT),'non_200':[x for x in routes if x.get('status')!=200]},indent=2))
