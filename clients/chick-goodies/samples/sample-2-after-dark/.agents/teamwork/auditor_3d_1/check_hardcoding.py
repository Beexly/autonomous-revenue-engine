import re

def search_files():
    files = {
        'index.html': r'C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\index.html',
        'experience.js': r'C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\experience.js',
        'immersion.js': r'C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\immersion.js',
    }

    for name, path in files.items():
        print(f"=== {name} ===")
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check for updateQuote
        matches = [m.start() for m in re.finditer(r'updateQuote', content)]
        print(f"  'updateQuote' matches: {len(matches)}")
        for m in matches:
            start = max(0, m - 50)
            end = min(len(content), m + 150)
            snippet = content[start:end].replace('\n', ' ')
            print(f"    Snippet: {snippet[:120]}...")

        # Check for webdriver or playwright detection
        cheat_patterns = ['navigator.webdriver', '__playwright', 'headless', 'window.playwright', 'selenium']
        for cp in cheat_patterns:
            if cp in content.lower():
                print(f"  [ALERT] Found cheat pattern '{cp}' in {name}!")

        # Check for hardcoded 4750 or 912.50
        for val in ['4750', '912.50', '912.5', '3978.41']:
            if val in content:
                print(f"  [CHECK] Found string '{val}' in {name}!")

search_files()
