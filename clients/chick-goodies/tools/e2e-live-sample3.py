"""Live end-to-end crawl of the deployed sample-3 site.
Fetches the live index, follows every internal .html link, records status,
console errors, failed requests and broken images per page."""
import json, re
from urllib.parse import urljoin
from playwright.sync_api import sync_playwright

BASE = "https://charcuterie-chick-sample-3.vercel.app/"
results = {}

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    console_errors, bad_responses = [], []

    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("response", lambda r: bad_responses.append(f"{r.status} {r.url}") if r.status >= 400 else None)

    def visit(url):
        console_errors.clear(); bad_responses.clear()
        resp = page.goto(url, wait_until="networkidle", timeout=45000)
        page.evaluate("Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))")
        imgs = page.evaluate("[...document.images].filter(i=>!(i.complete&&i.naturalWidth>0)).map(i=>i.getAttribute('src'))")
        hrefs = page.evaluate("""[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'))
            .filter(h=>h && !h.startsWith('#') && !h.startsWith('tel:') && !h.startsWith('sms:') && !h.startsWith('mailto:'))""")
        results[url] = {
            "status": resp.status,
            "console_errors": sorted(set(console_errors)),
            "bad_responses": sorted(set(bad_responses)),
            "broken_images": imgs,
        }
        return [urljoin(url, h) for h in hrefs]

    linked = visit(BASE)
    internal = sorted({u for u in linked if u.startswith(BASE) and u.endswith(".html")})
    results["_internal_pages_found"] = internal
    for u in internal:
        visit(u)
    browser.close()

print(json.dumps(results, indent=2))
ok = all(v["status"] == 200 and not v["console_errors"] and not v["bad_responses"] and not v["broken_images"]
         for k, v in results.items() if not k.startswith("_"))
print("E2E_VERDICT:", "PASS" if ok else "FAIL")
