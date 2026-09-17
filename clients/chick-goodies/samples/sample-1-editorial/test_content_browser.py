"""Browser regression: prefills, static menu fallback, drafts, money, responsive content."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
import threading, unittest
from playwright.sync_api import sync_playwright
B=Path(__file__).resolve().parent.parent
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
class BrowserContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(B)))
        threading.Thread(target=cls.server.serve_forever,daemon=True).start()
        cls.base=f'http://127.0.0.1:{cls.server.server_port}/'
        cls.pw=sync_playwright().start(); cls.browser=cls.pw.chromium.launch()
    @classmethod
    def tearDownClass(cls):
        cls.browser.close();cls.pw.stop();cls.server.shutdown()
    def test_query_prefills(self):
        for d,selector in [('sample-1-editorial','[name="menu"]'),('sample-2-after-dark','#menu-choice')]:
            page=self.browser.new_page()
            for query,expected in [('menu=grand','grand'),('table=super','super'),('occasion=wedding','holy')]:
                page.goto(self.base+d+'/enquire.html?'+query)
                self.assertEqual(page.locator(selector).input_value(),expected)
            page.close()
    def test_garden_note_wording(self):
        page=self.browser.new_page();page.goto(self.base+'sample-1-editorial/enquire.html?occasion=wedding')
        page.click('#enquiry-form button[type="submit"]')
        draft=page.locator('#draft-preview').input_value()
        self.assertIn("I'd like a quote for a wedding",draft)
        self.assertIn('not a booking',draft)
        page.close()
    def test_garden_static_menu_visible(self):
        page=self.browser.new_page(java_script_enabled=False)
        page.goto(self.base+'sample-1-editorial/menu.html')
        self.assertTrue(page.locator('#graze').is_visible()); page.close()
    def test_dark_draft_and_estimate(self):
        page=self.browser.new_page(); page.goto(self.base+'sample-2-after-dark/enquire.html?menu=grand')
        page.fill('#event-name','Test Host');page.fill('#venue','Tomball');page.select_option('#extra-time','1')
        self.assertEqual(page.locator('.estimate-total').inner_text(),'$2,689.22')
        page.click('.draft-button');draft=page.locator('#draft-text').input_value()
        for value in ['Test Host','Tomball','$2,689.22','extra time $150.00','not a booking']: self.assertIn(value,draft)
        for menu,guests,total in [('holy','75','$2,630.22'),('holy','150','$4,400.22'),('grand','50','$2,512.22'),('super','50','$2,040.22'),('standard','50','$1,804.22'),('graze','50','$1,686.22')]:
            page.select_option('#extra-time','0');page.select_option('#menu-choice',menu);page.fill('#guests',guests)
            self.assertEqual(page.locator('.estimate-total').inner_text(),total)
        page.fill('#guests','49');self.assertTrue(page.locator('#estimate .invalid').is_visible())
        page.select_option('#menu-choice','undecided');page.click('.draft-button');self.assertIn('custom quote',page.locator('#draft-text').input_value())
        page.close()
    def test_responsive_content(self):
        for d in ['sample-1-editorial','sample-2-after-dark']:
            page=self.browser.new_page(reduced_motion='reduce')
            errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
            for width in [390,1440]:
                page.set_viewport_size({'width':width,'height':900})
                for route in ['index','menu','gallery','story','enquire']:
                    with self.subTest(sample=d,width=width,page=route):
                        page.goto(self.base+d+'/'+route+'.html')
                        self.assertLessEqual(page.evaluate('document.documentElement.scrollWidth'),width)
                        self.assertTrue(page.locator('header nav a').last.is_visible())
                        self.assertFalse(errors)
            page.close()
if __name__=='__main__': unittest.main()
