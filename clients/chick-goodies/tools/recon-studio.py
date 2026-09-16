from pathlib import Path
import json
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/research/studio-revision'
OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width':1440,'height':1000}, device_scale_factor=1)
    results = {}
    for name,url in [('before','https://charcuterie-chick-sample-3.vercel.app'),('emp','https://www.elevenmadisonpark.com/'),('noma','https://noma.dk/')]:
        try:
            page.goto(url, wait_until='domcontentloaded', timeout=60000)
            page.wait_for_timeout(1800)
            results[name] = page.evaluate('''() => [...document.querySelectorAll('body,h1,nav,a,p,img')].filter(e=>e.getBoundingClientRect().width>0).slice(0,35).map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,text:e.innerText?.slice(0,100),font:s.fontFamily,size:s.fontSize,line:s.lineHeight,color:s.color,background:s.backgroundColor,fit:s.objectFit,border:s.borderWidth,width:r.width,height:r.height}})''')
            page.screenshot(path=str(OUT / (name+'.png')))
            print(name,page.title(),len(results[name]))
        except Exception as e: results[name] = {'error':str(e)}; print(name,str(e))
    browser.close()
(OUT/'computed.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
