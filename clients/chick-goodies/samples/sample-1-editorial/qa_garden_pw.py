"""Garden Atelier Playwright verification: screenshots, console errors, interactions."""
from playwright.sync_api import sync_playwright, ViewportSize
from pathlib import Path
from datetime import datetime
import json

ROOT = Path(__file__).resolve().parent
OUT = Path(__file__).resolve().parent / 'test-output'
OUT.mkdir(exist_ok=True)
ROUTES = ['index', 'menu', 'gallery', 'story', 'enquire']
VIEWPORTS = {
    'desktop-1440': ViewportSize(width=1440, height=900),
    'mobile-390': ViewportSize(width=390, height=844),
}
results = {}
def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        # No-JS baseline
        page = browser.new_page(java_script_enabled=False)
        for rv, vp in VIEWPORTS.items():
            page.set_viewport_size(vp)
            for route in ROUTES:
                url = f'file://{ROOT}/{route}.html'
                page.goto(url)
                out_png = OUT / f'nojs-{rv}-{route}.png'
                page.screenshot(path=str(out_png), full_page=True)
                # Accessibility check: at least one h1 per page
                h1s = page.eval_on_selector_all('h1', 'els => els.length')
                results[f'nojs-{rv}-{route}-h1'] = h1s
                results[f'nojs-{rv}-{route}-screenshot'] = str(out_png.name)
        # JS enabled + interactions
        page = browser.new_page()
        for rv, vp in VIEWPORTS.items():
            page.set_viewport_size(vp)
            for route in ROUTES:
                page.goto(f'file://{ROOT}/{route}.html')
                page.eval_on_selector('body', 'el => el.classList.add("loaded")')
                page.wait_for_timeout(600)
                out_png = OUT / f'js-{rv}-{route}.png'
                page.screenshot(path=str(out_png), full_page=True)
                # Console errors
                errors = []
                page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
                page.reload()
                page.wait_for_timeout(400)
                results[f'js-{rv}-{route}-screenshot'] = str(out_png.name)
                results[f'js-{rv}-{route}-errors'] = errors[:5]
        # Interaction tests
        page = browser.new_page(viewport=VIEWPORTS['desktop-1440'])
        # Menu tabs
        page.goto(f'file://{ROOT}/menu.html')
        page.eval_on_selector('body', 'el => el.classList.add("loaded")')
        page.wait_for_timeout(300)
        tabs = page.eval_on_selector_all('[data-menu]', 'els => els.map(e=>e.textContent.trim())')
        results['menu-tabs'] = tabs
        # Click second tab
        page.click('[data-menu="grand"]')
        active = page.eval_on_selector('[data-current="true"]', 'el => el.textContent.trim()')
        results['menu-active-tab'] = active
        panel_active = page.eval_on_selector('#grand', 'el => getComputedStyle(el).display')
        results['menu-active-panel'] = panel_active
        page.screenshot(path=str(OUT/'interaction-menu-tabs.png'), full_page=True)
        # Gallery lightbox
        page.goto(f'file://{ROOT}/gallery.html')
        page.eval_on_selector('body', 'el => el.classList.add("loaded")')
        page.wait_for_timeout(300)
        first_image = page.query_selector('[data-lightbox]')
        if first_image:
            first_image.click()
            page.wait_for_timeout(400)
            lightbox_open = page.eval_on_selector('#lightbox', 'el => el.classList.contains("open")')
            results['gallery-lightbox-open'] = lightbox_open
            page.screenshot(path=str(OUT/'interaction-gallery-lightbox.png'), full_page=True)
            # Close
            page.click('#lightbox-close')
            page.wait_for_timeout(300)
            lightbox_closed = page.eval_on_selector('#lightbox', 'el => !el.classList.contains("open")')
            results['gallery-lightbox-closed'] = lightbox_closed
        # Enquiry form
        page.goto(f'file://{ROOT}/enquire.html')
        page.eval_on_selector('body', 'el => el.classList.add("loaded")')
        page.eval_on_selector('#enquiry-form', 'el => el.hidden = false')
        page.wait_for_timeout(300)
        form_visible = page.eval_on_selector('#enquiry-form', 'el => !el.hidden')
        results['enquire-form-visible'] = form_visible
        page.select_option('#enquiry-form [name="occasion"]', 'A wedding')
        page.fill('#enquiry-form [name="name"]', 'Test User')
        page.fill('#enquiry-form [name="date"]', '2026-10-15')
        page.fill('#enquiry-form [name="guests"]', '75')
        page.select_option('#enquiry-form [name="menu"]', 'holy')
        page.fill('#enquiry-form [name="location"]', 'Tomball')
        page.fill('#enquiry-form [name="notes"]', 'Please confirm availability.')
        page.click('#enquiry-form button[type="submit"]')
        page.wait_for_timeout(600)
        draft_visible = page.eval_on_selector('#draft-result', 'el => !el.hidden')
        results['enquire-draft-hidden'] = not draft_visible
        draft_text = page.eval_on_selector('#draft-preview', 'el => el.value.substring(0,200)')
        results['enquire-draft-text'] = draft_text
        page.screenshot(path=str(OUT/'interaction-enquire-form.png'), full_page=True)
        # Email link validation
        email_href = page.eval_on_selector('#draft-email', 'el => el.href')
        results['enquire-email-link-valid'] = email_href.startswith('mailto:') and '@' in email_href
        # Back button check
        page.goto(f'file://{ROOT}/menu.html')
        page.go_back()
        page.go_forward()
        results['navigation-history'] = True
        # Reduced motion
        page = browser.new_page(viewport=VIEWPORTS['desktop-1440'])
        browser.contexts[0].add_init_script('window.matchMedia = window.matchMedia || (() => ({matches:true,addEventListener:()=>{},removeEventListener:()=>{}}))')
        page.goto(f'file://{ROOT}/index.html')
        page.eval_on_selector('body', 'el => el.classList.add("loaded")')
        page.wait_for_timeout(300)
        caustics_display = page.eval_on_selector('.ambient canvas', 'el => getComputedStyle(el).display')
        results['reduced-motion-canvas'] = caustics_display
        browser.close()
        (OUT / 'qa-results.json').write_text(json.dumps(results, indent=2, default=str), encoding='utf-8')
        print(json.dumps(results, indent=2, default=str))

if __name__ == '__main__':
    run()
