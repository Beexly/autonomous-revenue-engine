from pathlib import Path
from playwright.sync_api import sync_playwright
import json
R=Path(__file__).resolve().parents[1]/'docs/research/gathering'
R.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch();page=b.new_page(viewport={'width':1440,'height':1000})
 results={}
 for key,url in [('unseen','https://unseen.co/'),('solare','https://casadisolare.com/')]:
  try:
   page.goto(url,wait_until='domcontentloaded',timeout=45000);page.wait_for_timeout(3000)
   results[key]=page.evaluate('''()=>({title:document.title,canvases:[...document.querySelectorAll('canvas')].map(e=>({w:e.width,h:e.height})),styles:[...document.querySelectorAll('body,h1,h2,a,button')].filter(e=>e.checkVisibility()).slice(0,24).map(e=>{const s=getComputedStyle(e);return {tag:e.tagName,text:e.textContent.slice(0,75),font:s.fontFamily,size:s.fontSize,line:s.lineHeight,spacing:s.letterSpacing,position:s.position,color:s.color,background:s.backgroundColor}})})''')
  except Exception as e:results[key]={'error':str(e)}
 b.close()
(R/'references.json').write_text(json.dumps(results,indent=2))
print(json.dumps(results,indent=2)[:11000])
