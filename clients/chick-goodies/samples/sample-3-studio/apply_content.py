"""One-time content migration, preserving existing layout and contact targets."""
# Historical writer retained for reference only. Stop on import as well as CLI.
# Keep this after the module docstring / future imports, before all other code.
raise SystemExit(
    "LEGACY BUILD DISABLED: canonical sample HTML/CSS/JS are direct-edited. "
    "Do not regenerate or replay preparation/migration scripts. "
    "See clients/chick-goodies/tools/BUILD-SAFETY.md."
)

from pathlib import Path
from bs4 import BeautifulSoup
ROOT = Path(__file__).parent

def text(page, selector, value):
    node = page.select_one(selector)
    assert node is not None, selector
    node.clear()
    node.append(value)

for file in ROOT.glob('*.html'):
    page = BeautifulSoup(file.read_text(encoding='utf-8'), 'html.parser')
    for a, label in zip(page.select('header nav a'), ['Home', 'Menus and prices', 'Photos', 'About Tricia', 'Get a quote']):
        a.string = label
    text(page, '.footer-invite', 'Send me the date and the headcount.')
    last = page.footer.select('div')[-1]
    last.p.string = 'A quote request, not a booking. Dates and prices are confirmed by Tricia.'
    first = page.footer.select_one('div')
    for value in ['Charcuterie Chick · Tricia Holfelder · Tomball, TX', 'English and Spanish spoken.']:
        p = page.new_tag('p'); p.string = value; first.append(p)
    a = page.new_tag('a', href='https://www.instagram.com/charcuteriechickhtx/'); a.string='@charcuteriechickhtx'; first.append(a)
    file.write_text(str(page), encoding='utf-8')
