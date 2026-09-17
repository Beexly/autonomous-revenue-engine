"""Enhance one real photo: 2x Lanczos resample, unsharp, graded contrast/color.
Prints before/after metrics. No AI generation; derived from her original file."""
from pathlib import Path
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import numpy as np, json, sys
S=Path(__file__).resolve().parents[1]/'samples/sample-3-studio/img'
src=S/'knot-hero.jpg'; out=S/'knot-hero-v2.jpg'
im=Image.open(src).convert('RGB')
def lap_var(img):
 g=img.convert('L'); import numpy as np
 a=np.asarray(g,dtype=float)
 k=np.asarray([[0,1,0],[1,-4,1],[0,1,0]],dtype=float)
 from numpy.lib.stride_tricks import sliding_window_view
 conv=(sliding_window_view(a,(3,3))*k).sum(axis=(2,3))
 return float(conv[1:-1,1:-1].var())
before={'size':im.size,'laplacian_variance':lap_var(im),'contrast_std':float(__import__('numpy').asarray(im.convert('L')).std())}
w,h=im.size
v=im.resize((w*2,h*2),Image.LANCZOS)
v=v.filter(ImageFilter.UnsharpMask(radius=1.6,percent=110,threshold=2))
v=ImageEnhance.Contrast(v).enhance(1.07)
v=ImageEnhance.Color(v).enhance(1.14)
v=ImageEnhance.Brightness(v).enhance(1.015)
v.save(out,quality=92,optimize=True)
after={'size':v.size,'laplacian_variance':lap_var(v),'contrast_std':float(__import__('numpy').asarray(v.convert('L')).std())}
print(json.dumps({'source':src.name,'output':out.name,'before':before,'after':after,'bytes_before':src.stat().st_size,'bytes_after':out.stat().st_size},indent=2))
