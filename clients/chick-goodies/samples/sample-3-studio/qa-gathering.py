"""Local real-browser regression suite. No submissions, no deployment."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import threading, json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'qa-evidence'
OUT.mkdir(exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{server.server_port}/'
report = {'pages': [], 'checks': [], 'failures': []}
def check(ok, name):
    report['checks'].append({'name': name, 'passed': bool(ok)})
    if not ok: report['failures'].append(name)
with sync_playwright() as p:
    browser = p.chromium.launch(args=['--enable-unsafe-swiftshader'])
    page = browser.new_page()
    for width in [390, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.goto(url, wait_until='networkidle')
        measures = page.evaluate('''() => ({
          width:innerWidth,
          nav:[...document.querySelectorAll('header nav a')].map(a=>({text:a.textContent,height:a.getBoundingClientRect().height})),
          food:document.querySelector('.hero-photo img')?.getBoundingClientRect().toJSON(),
          action:document.querySelector('.hero .pill')?.getBoundingClientRect().toJSON(),
          scene:document.querySelector('.table-world').getBoundingClientRect().toJSON()
        })''')
        report['pages'].append(measures)
        check(all(a['height'] >= 44 for a in measures['nav']), f'{width}: navigation touch targets >=44px')
        check(measures.get('food') and measures['food']['top'] < 780, f'{width}: real food begins in initial viewport')
        check(measures.get('action') and measures['action']['bottom'] < 900, f'{width}: hero enquiry action in initial viewport')
        page.screenshot(path=str(OUT / f'layout-{width}.png'), full_page=True)
    browser.close()
server.shutdown()
report['passed'] = not report['failures']
(OUT / 'layout-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
raise SystemExit(0 if report['passed'] else 1)
