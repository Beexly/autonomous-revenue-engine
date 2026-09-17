"""Sample-3-only end-to-end parity: local files vs deployed production bytes.
No deploy, no mutation. Fails loudly if live and local diverge."""
from pathlib import Path
import hashlib,json,urllib.request
R=Path(__file__).resolve().parents[1]
S=R/'samples/sample-3-studio'
BASE='https://charcuterie-chick-sample-3.vercel.app/'
ROUTES=['index.html','menu.html','gallery.html','story.html','enquire.html','gathering.css','gathering.js','table-scene.js','img/brand.webp','img/knot-hero.jpg','img/tricia-662.jpg','img/cart-640.jpg','img/knot-2.jpg','img/knot-3.jpg','img/sweets-01.jpg','img/sips-01.jpg','img/board-01.jpg']
def sha(b):return hashlib.sha256(b).hexdigest()[:16]
rows=[]
for rel in ROUTES:
    local=S/rel
    try:
        live=urllib.request.urlopen(BASE+rel,timeout=30).read()
    except Exception as e:
        rows.append({'file':rel,'live':'ERROR '+str(e)[:60],'match':False});continue
    ok=local.exists() and sha(local.read_bytes())==sha(live)
    rows.append({'file':rel,'local_bytes':local.stat().st_size if local.exists() else None,'live_bytes':len(live),'match':ok})
report={'target':'sample-3 only','routes_checked':len(ROUTES),'passed':all(r['match'] for r in rows),'rows':rows}
(R/'docs/research/gathering/sample-3-parity.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'passed':report['passed'],'routes_checked':report['routes_checked'],'mismatches':[r for r in rows if not r['match']]},indent=2))
raise SystemExit(0 if report['passed'] else 1)
