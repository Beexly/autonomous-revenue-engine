import threading
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent

class QuietHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 8088), QuietHandler)
srv_thread = threading.Thread(target=server.serve_forever, daemon=True)
srv_thread.start()

console_logs = []
page_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    page.on('pageerror', lambda err: page_errors.append(f"[ERROR] {err}"))
    
    page.goto('http://127.0.0.1:8088/index.html', wait_until='networkidle')
    page.wait_for_timeout(1500)
    page.screenshot(path='test-output/assembled_0_prologue.png')
    
    # Act 1
    page.evaluate("document.getElementById('act1').scrollIntoView()")
    page.wait_for_timeout(1200)
    page.screenshot(path='test-output/assembled_1_act1.png')

    # Act 2
    page.evaluate("document.getElementById('act2').scrollIntoView()")
    page.wait_for_timeout(1200)
    page.screenshot(path='test-output/assembled_2_act2.png')

    # Act 3
    page.evaluate("document.getElementById('act3').scrollIntoView()")
    page.wait_for_timeout(1200)
    page.screenshot(path='test-output/assembled_3_act3.png')

    # Epilogue
    page.evaluate("document.getElementById('epilogue').scrollIntoView()")
    page.wait_for_timeout(1200)
    page.screenshot(path='test-output/assembled_4_epilogue.png')

    # Instruments / Calculator
    page.evaluate("document.querySelector('.instruments').scrollIntoView()")
    page.wait_for_timeout(1200)
    page.screenshot(path='test-output/assembled_5_calculator.png')

    # Test Calculator Interactions: Select Grand Graze with 65 guests
    page.fill('#guests', '65')
    page.evaluate("document.getElementById('guests').dispatchEvent(new Event('input'))")
    page.click('button[data-tier="grand-graze"]')
    page.wait_for_timeout(400)
    page.screenshot(path='test-output/assembled_6_calc_grand_graze.png')

    # Test Calculator Interactions: Select Holy Grail with 120 guests
    page.fill('#guests', '120')
    page.evaluate("document.getElementById('guests').dispatchEvent(new Event('input'))")
    page.click('button[data-tier="holy-grail"]')
    page.wait_for_timeout(400)
    page.screenshot(path='test-output/assembled_7_calc_holy_grail.png')

    browser.close()

    # Mobile Verification (390 x 844 iPhone 14 standard)
    browser_mob = p.chromium.launch(headless=True)
    page_mob = browser_mob.new_page(viewport={'width': 390, 'height': 844})
    page_mob.on('console', lambda msg: console_logs.append(f"[MOB {msg.type}] {msg.text}"))
    page_mob.on('pageerror', lambda err: page_errors.append(f"[MOB ERROR] {err}"))

    page_mob.goto('http://127.0.0.1:8088/index.html', wait_until='networkidle')
    page_mob.wait_for_timeout(1200)
    page_mob.screenshot(path='test-output/mobile_0_prologue.png')

    page_mob.evaluate("document.getElementById('act1').scrollIntoView()")
    page_mob.wait_for_timeout(1000)
    page_mob.screenshot(path='test-output/mobile_1_act1.png')

    page_mob.evaluate("document.getElementById('act2').scrollIntoView()")
    page_mob.wait_for_timeout(1000)
    page_mob.screenshot(path='test-output/mobile_2_act2.png')

    page_mob.evaluate("document.getElementById('act3').scrollIntoView()")
    page_mob.wait_for_timeout(1000)
    page_mob.screenshot(path='test-output/mobile_3_act3.png')

    page_mob.evaluate("document.querySelector('.instruments').scrollIntoView()")
    page_mob.wait_for_timeout(1000)
    page_mob.screenshot(path='test-output/mobile_5_calculator.png')

    browser_mob.close()

server.shutdown()

print("CONSOLE LOGS:")
for l in console_logs:
    print("  ", l)

print("PAGE ERRORS:", len(page_errors))
for e in page_errors:
    print("  ", e)

print("SUCCESS_ASSEMBLED_TEST_COMPLETE")
