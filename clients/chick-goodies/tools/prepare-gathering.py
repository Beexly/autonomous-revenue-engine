from pathlib import Path
from PIL import Image
import shutil,urllib.request,hashlib,json
ROOT=Path(__file__).resolve().parents[1]; S=ROOT/'samples/sample-3-studio'
source=Path('C:/Users/Garrett/Downloads/The Chick Goodies (1).jpg')
original=S/'img/chick-original.jpg';shutil.copy2(source,original)
im=Image.open(source).convert('RGB')
# Crop the dark artwork's bounds with generous padding; no recoloring or redraw.
import numpy as np
a=np.array(im);mask=a.min(axis=2)<150
y,x=np.where(mask);bounds=(max(0,int(x.min())-35),max(0,int(y.min())-35),min(im.width,int(x.max())+36),min(im.height,int(y.max())+36))
im.crop(bounds).save(S/'img/chick-logo.webp',quality=96)
(S/'vendor').mkdir(exist_ok=True)
for file,url in [('three.module.js','https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js'),('THREE-LICENSE.txt','https://cdn.jsdelivr.net/npm/three@0.170.0/LICENSE')]:
 data=urllib.request.urlopen(url,timeout=40).read();(S/'vendor'/file).write_bytes(data)
report={'original_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'original_size':im.size,'crop':bounds,'crop_size':Image.open(S/'img/chick-logo.webp').size,'reference_card':'IMG_7724 (1).jpeg: local OCR identifies promotional card plus private chat; not published','three':'0.170.0, MIT, vendored locally'}
(ROOT/'docs/research/gathering/assets.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
