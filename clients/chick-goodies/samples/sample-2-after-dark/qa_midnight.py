from pathlib import Path
import json
ROOT = Path(__file__).resolve().parent
ROUTES = ['index','menu','gallery','story','enquire']
def route_contract():
    for route in ROUTES:
        path = ROOT / (route+'.html')
        assert path.exists(), f'Missing route: {route}'
        text = path.read_text(encoding='utf-8')
        assert 'midnight.css' in text, f'{route}: missing Midnight Supper design'
        assert text.count('src="img/brand.webp"') == 2, f'{route}: two original brand mounts required'
    print('PASS: five complete Midnight Supper routes and brand mounts')
def interaction_contract():
    import functools, threading
    from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
    from playwright.sync_api import sync_playwright
    class QuietHandler(SimpleHTTPRequestHandler):
        def log_message(self,*args): pass
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}/'
    try:
        with sync_playwright() as p:
            browser=p.chromium.launch(headless=True)
            page=browser.new_page(viewport={'width':1440,'height':1000})
            page.goto(base+'index.html')
            assert page.locator('.motion').is_visible(), 'Motion control must enhance the static page'
            page.locator('.motion').click()
            assert 'Motion: off' in page.locator('.motion').inner_text()
            page.goto(base+'menu.html')
            for menu in ['holy','grand','super','standard','graze']:
                page.locator(f'[data-menu={menu}]').click()
                assert page.locator('.menu-panel:visible').count()==1
                assert page.locator('#'+menu).is_visible()
            page.goto(base+'gallery.html')
            page.locator('[data-lightbox]').first.click()
            assert page.locator('#lightbox').is_visible()
            page.keyboard.press('Escape')
            assert not page.locator('#lightbox').is_visible()
            page.goto(base+'enquire.html')
            page.wait_for_function("document.querySelector('#estimate').textContent.includes('$2,630.22')")
            page.locator('#menu-choice').select_option('graze')
            page.locator('#guests').fill('50')
            assert '$1,686.22' in page.locator('#estimate').inner_text()
            page.locator('#guests').fill('49')
            assert '50' in page.locator('#estimate .invalid').inner_text()
            page.locator('.draft-button').click()
            assert page.locator('#draft-review').is_visible()
            assert 'custom quote' in page.locator('#draft-text').input_value().lower()
            assert page.locator('#open-email').get_attribute('href').startswith('mailto:')
            browser.close()
    finally: server.shutdown()
    print('PASS: motion, five menu states, gallery lightbox, estimator and draft')
if __name__ == '__main__':
    route_contract()
    interaction_contract()
