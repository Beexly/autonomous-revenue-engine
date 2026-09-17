"""Regression: navigation fits and the original brand stays visible."""
import json, sys, threading
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]/'samples/sample-1-editorial'
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
base=sys.argv[1].rstrip('/') if len(sys.argv)>1 else f'http://127.0.0.1:{server.server_port}'
rows=[]
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        for width in (360,390,768,1440):
            page=browser.new_page(viewport={'width':width,'height':900})
            for route in ('index','menu','gallery','story','enquire'):
                page.goto(f'{base}/{route}.html',wait_until='networkidle')
                row=page.evaluate('''() => {const logo=document.querySelector('.masthead .brand img').getBoundingClientRect();const links=[...document.querySelectorAll('.masthead nav a')].map(a=>a.getBoundingClientRect());return {viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,logoWidth:logo.width,linksFit:links.every(r=>r.left>=0&&r.right<=innerWidth&&r.height>=40)};}''')
                row.update(route=route)
                row['passed']=row['scrollWidth']<=width and row['logoWidth']>=120 and row['linksFit']
                rows.append(row)
            page.close()
        browser.close()
finally:
    server.shutdown()
print(json.dumps({'checks':len(rows),'failures':[r for r in rows if not r['passed']]},indent=2))
raise SystemExit(0 if all(r['passed'] for r in rows) else 1)
