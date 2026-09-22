# Historical writer retained for reference only. Stop on import as well as CLI.
# Keep this after the module docstring / future imports, before all other code.
raise SystemExit(
    "LEGACY BUILD DISABLED: canonical sample HTML/CSS/JS are direct-edited. "
    "Do not regenerate or replay preparation/migration scripts. "
    "See clients/chick-goodies/tools/BUILD-SAFETY.md."
)

from pathlib import Path
from PIL import Image
import json, shutil
R=Path(__file__).resolve().parents[1]
S=R/'samples/sample-3-studio'
D=R/'samples/shared'; D.mkdir(exist_ok=True)
im=Image.open('C:/Users/Garrett/Downloads/The Chick Goodies (1).jpg').convert('RGB')
# Remove only the two micro-tagline lines identified in source coordinates.
# Preserve pictorial mark and original lettering. Sample nearby paper color.
bg=im.getpixel((640,990))
im.paste(bg,(655,946,948,1040))
im.crop((565,680,1820,1113)).save(D/'brand.webp',quality=98)
from bs4 import BeautifulSoup
soup=BeautifulSoup((S/'index.html').read_text(encoding='utf-8'),'html.parser')
menus=[]
for d in soup.select('.menu-list details'):
 menus.append({'id':d['id'].replace('menu-',''),'name':d.h3.text,'price':d.select_one('.menu-price').text,'description':d.select('.menu-detail p')[1].text})
data={'menus':menus,'phone':soup.select_one('#text-enquiry')['href'][4:],'email':soup.select_one('#email-enquiry')['href'][7:]}
(D/'facts.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
for name in ['sample-1-editorial','sample-2-after-dark','sample-3-studio']:
 out=R/'samples'/name
 shutil.copy2(D/'brand.webp',out/'img/brand.webp')
 shutil.copy2(D/'facts.json',out/'facts.json')
 print(name,'brand and facts ready')
print('Brand treatment: original lettering and emblem, micro-tagline removed; no AI/redraw. Visual acceptance pending.')
