"""Garden Atelier regression checks; run with Python + Playwright installed."""
from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parents[1] / 'samples/sample-1-editorial'
ROUTES = ['index', 'menu', 'gallery', 'story', 'enquire']

def structure():
    for route in ROUTES:
        path = ROOT / f'{route}.html'
        assert path.exists(), f'Missing distinct route: {route}.html'
        text = path.read_text(encoding='utf-8')
        assert text.count('<h1') == 1, route
        assert 'garden.css' in text and 'garden.js' in text, f'{route}: independent assets missing'
        assert all(f'{p}.html' in text for p in ROUTES), f'{route}: navigation incomplete'
    print('PASS: five real routes with shared navigation and independent Garden assets')

if __name__ == '__main__':
    structure()
