from pathlib import Path
import json, urllib.request, hashlib
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
report=[]
with sync_playwright() as p:
    browser=p.chromium.launch()
    for host in ['charcuterie-chick-sample-3.vercel.app','charcuterie-chick-showcase.vercel.app']:
        base='https://'+host+'/'
        page=browser.new_page(viewport={'width':390,'height':844})
        errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
        response=page.goto(base,wait_until='networkidle',timeout=60000)
        assert response.status==200
        assert page.locator('#total').inner_text()=='$2,630.22'
        page.locator('#table').select_option('graze');page.locator('#guests').fill('50')
        assert page.locator('#total').inner_text()=='$1,686.22'
        assert page.evaluate('document.documentElement.scrollWidth===innerWidth')
        assert page.locator('h1').inner_text()=='Charcuterie\nChick'
        assert 'the tables' in page.locator('header').inner_text().lower()
        assert page.locator('.hero img').evaluate('(i)=>i.complete && i.naturalWidth===945')
        layout=[]
        for width in [390,1440]:
            page.set_viewport_size({'width':width,'height':1000})
            page.evaluate('window.scrollTo(0,0)')
            check=page.evaluate('''() => {
                const nodes=[...document.querySelectorAll('h1,h2,h3,p,figure,img,summary,dt,dd,output,a')].filter(e=>e.checkVisibility());
                const collisions=[];
                for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
                    const a=nodes[i],b=nodes[j];if(a.contains(b)||b.contains(a))continue;
                    const r=a.getBoundingClientRect(),s=b.getBoundingClientRect();
                    const x=Math.min(r.right,s.right)-Math.max(r.left,s.left),y=Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top);
                    if(x>8&&y>8)collisions.push([a.tagName+'.'+a.className,b.tagName+'.'+b.className]);
                }
                return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,collisions,captionsValid:[...document.querySelectorAll('figcaption')].every(e=>e.parentElement.tagName==='FIGURE' && e.textContent.trim())};
            }''')
            assert not check['overflow'] and not check['collisions'] and check['captionsValid'],check
            layout.append(check)
        files=['studio.css','studio.js','img/plate.svg']
        assets=page.evaluate("[...document.images].map(i=>i.getAttribute('src'))")
        for file in set(files+assets):
            data=urllib.request.urlopen(base+file).read()
            assert data==(ROOT/'site'/file).read_bytes(),file
        # Vercel may normalize HTML; verify semantic content in browser instead.
        assert 'Beexly' not in page.inner_text('body')
        assert 'proposal' not in page.inner_text('body').lower()
        assert not errors,errors
        report.append({'url':base,'status':response.status,'checked_assets':len(set(files+assets)),'mobile_overflow':False,'quote_default':2630.22,'quote_graze_50':1686.22,'page_errors':errors})
        page.close()
    browser.close()
(ROOT/'docs/research/studio-revision/live.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
