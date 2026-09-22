"""Content strategy regression checks. Run with python -m unittest test_content.py."""
import unittest
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).parent

class ContentTests(unittest.TestCase):
    def test_home_hero_uses_tricias_tagline(self):
        page = BeautifulSoup((ROOT / 'index.html').read_text(encoding='utf-8'), 'html.parser')
        self.assertEqual(page.h1.get_text(' ', strip=True), 'Elegance without the cost.')

    def test_shared_navigation_and_footer(self):
        # table.html is a separate exploration with its own chrome, not one of
        # concept 3's five pages. Scope the shared-chrome assertions to those five.
        for name in ('index.html','menu.html','gallery.html','story.html','enquire.html'):
            file = ROOT / name
            with self.subTest(page=file.name):
                page = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
                self.assertEqual([a.get_text(' ', strip=True) for a in page.select('header nav a')], ['Home', 'Menus and prices', 'Photos', 'About Tricia', 'Get a quote'])
                self.assertIn('English and Spanish spoken.', page.footer.get_text())
                self.assertIn('A quote request, not a booking.', page.footer.get_text())

    def test_menu_choices_and_prices_are_visible(self):
        page = BeautifulSoup((ROOT / 'menu.html').read_text(encoding='utf-8'), 'html.parser')
        for term in ['Pick your sliders, dips and salads.', 'muffuletta', "Mom's macaroni", 'Taco Cart $26.95', 'Mimosa Chick $4.00']:
            self.assertIn(term, page.get_text(' ', strip=True))
        self.assertEqual(len(page.select('.menu-item')), 5)

    def test_quote_has_faq_and_fields_in_order(self):
        page = BeautifulSoup((ROOT / 'enquire.html').read_text(encoding='utf-8'), 'html.parser')
        self.assertEqual([x['id'] for x in page.select('.planner-inputs input, .planner-inputs select, .planner-inputs textarea')], ['date', 'guests', 'occasion', 'table', 'venue', 'notes', 'name'])
        self.assertEqual(len(page.select('.faq-item')), 5)
        self.assertIn('Price your party.', page.h1.get_text())

if __name__ == '__main__':
    unittest.main()
