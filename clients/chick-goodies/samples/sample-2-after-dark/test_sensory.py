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

server = ThreadingHTTPServer(('127.0.0.1', 8089), QuietHandler)
srv_thread = threading.Thread(target=server.serve_forever, daemon=True)
srv_thread.start()

console_logs = []
page_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.on('console', lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    page.on('pageerror', lambda err: page_errors.append(f"[ERROR] {err}"))

    # 1. Load page and verify sound toggle exists
    page.goto('http://127.0.0.1:8089/index.html', wait_until='networkidle')
    page.wait_for_timeout(1000)
    
    toggle = page.locator('.audio-toggle')
    assert toggle.count() == 1, "Audio toggle button must exist in DOM"
    assert toggle.get_attribute('aria-pressed') == 'false', "Initial audio state must be off"
    
    # 2. Click toggle to enable sound
    toggle.click()
    page.wait_for_timeout(500)
    assert toggle.get_attribute('aria-pressed') == 'true', "Audio state must be on after click"
    is_enabled = page.evaluate("window.CCSensory && window.CCSensory.audio.isEnabled()")
    assert is_enabled is True, "CCSensory.audio.isEnabled() must return true"
    page.screenshot(path='test-output/sensory_0_audio_enabled.png')
    print("[OK] Audio toggle verified and operational")

    # 3. Test dwell interaction on Prosciutto station in Prologue
    prosciutto_station = page.locator('[data-dwell="prosciutto"]')
    assert prosciutto_station.count() == 1, "Prosciutto dwell station must exist"
    
    # Hover for 2.2 seconds (dwell timer is 2000ms)
    prosciutto_station.hover()
    page.wait_for_timeout(2200)
    
    dwell_note = page.locator('.dwell-note')
    assert dwell_note.get_attribute('data-open') == 'true', "Dwell note popover must open on linger"
    note_body = page.locator('.dwell__body').inner_text()
    assert "The blade enters at the fat cap" in note_body or "travels the length" in note_body or "shank" in note_body
    page.screenshot(path='test-output/sensory_1_prosciutto_dwell.png')
    print("[OK] Dwell micro-interaction popover verified on Prosciutto")

    # 4. Test dwell on Fig station in Act 1
    page.evaluate("document.getElementById('act1').scrollIntoView()")
    page.wait_for_timeout(1000)
    
    fig_station = page.locator('[data-dwell="fig"]')
    assert fig_station.count() == 1, "Fig dwell station must exist"
    fig_station.hover()
    page.wait_for_timeout(2200)
    
    page.screenshot(path='test-output/sensory_2_fig_dwell.png')
    
    # Check that cc:dwell event unhid the Act 2 fig memory element
    fig_memory_hidden = page.evaluate("document.querySelector('[data-memory=\"fig\"]').hidden")
    assert fig_memory_hidden is False, "Act 2 fig memory payoff must be revealed after dwell"
    print("[OK] Cross-act memory payoff verified for Fig (Act 2)")

    # 5. Test dwell on Honeycomb station in Prologue
    page.evaluate("document.getElementById('prologue').scrollIntoView()")
    page.wait_for_timeout(800)
    
    honeycomb_station = page.locator('[data-dwell="honeycomb"]')
    assert honeycomb_station.count() == 1, "Honeycomb dwell station must exist"
    honeycomb_station.hover()
    page.wait_for_timeout(2200)
    
    honeycomb_memory_hidden = page.evaluate("document.querySelector('[data-memory=\"honeycomb\"]').hidden")
    assert honeycomb_memory_hidden is False, "Act 3 honeycomb memory payoff must be revealed after dwell"
    print("[OK] Cross-act memory payoff verified for Honeycomb (Act 3)")

    # 6. Test Reviewer Mode (?sensory-draft=1) for confirmation flags
    page.goto('http://127.0.0.1:8089/index.html?sensory-draft=1', wait_until='networkidle')
    page.wait_for_timeout(1000)
    prosciutto_station = page.locator('[data-dwell="prosciutto"]')
    prosciutto_station.hover()
    page.wait_for_timeout(2200)
    
    aside = page.locator('.dwell__aside')
    assert aside.count() == 1, "Reviewer aside flag must appear in draft mode"
    aside_text = aside.inner_text()
    assert "CONFIRM WITH TRICIA" in aside_text.upper()
    page.screenshot(path='test-output/sensory_3_draft_flag.png')
    print("[OK] Reviewer draft mode flag verified (?sensory-draft=1)")

    # 7. Mobile verification (390 x 844)
    browser_mob = p.chromium.launch(headless=True)
    page_mob = browser_mob.new_page(viewport={'width': 390, 'height': 844})
    page_mob.goto('http://127.0.0.1:8089/index.html', wait_until='networkidle')
    page_mob.wait_for_timeout(1000)
    
    toggle_mob = page_mob.locator('.audio-toggle')
    assert toggle_mob.count() == 1, "Mobile audio toggle must be present"
    page_mob.screenshot(path='test-output/sensory_4_mobile_header.png')
    browser_mob.close()

    browser.close()

server.shutdown()

print("CONSOLE LOGS:", len(console_logs))
print("PAGE ERRORS:", len(page_errors))
for e in page_errors:
    print("  ", e)

assert len(page_errors) == 0, "No page errors allowed"
print("ALL_SENSORY_TESTS_PASSED_CLEANLY")
