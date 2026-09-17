"""Content strategy acceptance tests for the two independently built concepts."""
import unittest
from pathlib import Path
from bs4 import BeautifulSoup
BASE = Path(__file__).parent.parent
DIRS = ['sample-1-editorial', 'sample-2-after-dark']
class ContentTests(unittest.TestCase):
    def test_visible_strategy(self):
        for directory in DIRS:
            pages = {p.stem: BeautifulSoup(p.read_text(encoding='utf-8'), 'html.parser') for p in (BASE / directory).glob('*.html')}
            for name, page in pages.items():
                with self.subTest(concept=directory, page=name):
                    labels=[]
                    for a in page.select('header nav a'):
                        labels.append(' '.join(t.strip() for t in a.find_all(string=True, recursive=False) if t.strip()))
                    self.assertEqual(labels, ['Home','Menus and prices','Photos','About Tricia','Get a quote'])
                    footer=page.footer.get_text(' ',strip=True)
                    for text in ['English and Spanish spoken.', 'Charcuterie Chick · Tricia Holfelder · Tomball, TX', "Send me the date and the headcount. I'll take it from there.", 'A quote request, not a booking. Dates and prices are confirmed by Tricia.']:
                        self.assertIn(text,footer)
            for name in ['index','story']:
                self.assertEqual(len(pages[name].select('.proof blockquote')),3)
                self.assertIn('Best of Weddings 2026',pages[name].get_text())
                self.assertIn('https://www.charcuteriechick.ai',str(pages[name].select_one('.proof')))
            menu=pages['menu']
            self.assertEqual(len(menu.select('.menu-panel')),5)
            self.assertFalse(menu.select('.choices details'))
            for text in ["Tricia's corn dip", "Mom's macaroni", 'muffuletta', 'Every table runs 90 minutes.', 'Taco Cart', '$26.95']:
                self.assertIn(text,menu.get_text(' ',strip=True))
            quote=pages['enquire']
            self.assertEqual(len(quote.select('.faq-item')),5)
            self.assertIn('you send the draft', quote.get_text())
            fields = quote.select('#enquiry-form [name]') if directory==DIRS[0] else quote.select('#planner input, #planner select, #planner textarea')
            order=[f.get('name') if directory==DIRS[0] else f.get('id') for f in fields]
            self.assertEqual(order, ['date','guests','occasion','menu','location','notes','name'] if directory==DIRS[0] else ['event-date','guests','occasion','menu-choice','venue','extra-time','event-notes','event-name'])
if __name__ == '__main__': unittest.main()
