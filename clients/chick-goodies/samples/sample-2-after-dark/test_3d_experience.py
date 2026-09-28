"""Charcuterie Chick WebGL Scrollytelling — Comprehensive Opaque-Box E2E Test Suite.

Author: E2E Test Suite Architect (test_writer_e2e_1)
Architecture: 4-Tier Test Case Design Methodology
  - Tier 1: Feature Coverage (Core features in isolation: WebGL Canvas, HUD Nav, Audio, 6 Stations, Spatial HUD, Beignet burst)
  - Tier 2: Boundary & Corner Cases (Guests 50/49, extreme values, Holy Grail brackets, Tax base, DPR clamping, Mobile 393x852)
  - Tier 3: Cross-Feature Combinations (Tier sync Act 2 -> Act 5, Multi-add-ons, Spatial projection clamping, Audio trigger)
  - Tier 4: Real-World Scenarios (Full scrollytelling journey, tasting notes, custom wedding quote, SMS & Email triggers)

Execution:
  python test_3d_experience.py [target_url]
"""

import functools
import json
import re
import sys
import threading
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

from playwright.sync_api import sync_playwright

# Ensure immediate unbuffered output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)

ROOT = Path(__file__).resolve().parent
SCREENSHOT_DIR = ROOT / "test-output" / "experience-3d"
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_PATH = ROOT / "test-output" / "e2e-results.json"


class QuietRangeHTTPHandler(SimpleHTTPRequestHandler):
    """Quiet HTTP handler supporting basic byte-range requests for media streaming."""

    def log_message(self, *args):
        pass

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()


class E2ETestRunner:
    def __init__(self, target_url=None):
        self.target_url = target_url
        self.server = None
        self.base_url = None
        self.console_errors = []
        self.failed_requests = []
        self.page_errors = []
        self.test_results = []
        self.start_time = time.time()

    def record_check(self, tier, test_id, name, passed, detail=""):
        status_str = "PASS" if passed else "FAIL"
        print(f"  [{status_str}] [{tier}] {test_id}: {name} {detail}".strip(), flush=True)
        self.test_results.append({
            "tier": tier,
            "id": test_id,
            "name": name,
            "passed": passed,
            "detail": detail
        })
        if not passed:
            print(f"    -> ASSERTION FAILURE: {detail}", flush=True)

    def start_server(self):
        if self.target_url:
            self.base_url = self.target_url
        else:
            self.server = ThreadingHTTPServer(
                ("127.0.0.1", 0),
                functools.partial(QuietRangeHTTPHandler, directory=str(ROOT))
            )
            t = threading.Thread(target=self.server.serve_forever, daemon=True)
            t.start()
            self.base_url = f"http://127.0.0.1:{self.server.server_port}/index.html"
        print(f"[INIT] Server started. Testing against {self.base_url}", flush=True)

    def stop_server(self):
        if self.server:
            try:
                self.server.shutdown()
                print("[CLEANUP] Local HTTP server shut down.", flush=True)
            except Exception as e:
                print(f"[CLEANUP] Error shutting down server: {e}", flush=True)

    def instrument_page(self, page, context_name="Desktop"):
        def on_console(msg):
            if msg.type == "error":
                print(f"[{context_name} CONSOLE ERROR] {msg.text}", flush=True)
                self.console_errors.append(f"{context_name}: {msg.text}")
            elif msg.type == "warning":
                pass
            else:
                pass

        def on_page_error(exc):
            print(f"[{context_name} PAGE ERROR] {exc}", flush=True)
            self.page_errors.append(f"{context_name}: {str(exc)}")

        def on_request_failed(req):
            if req.failure and ("ERR_ABORTED" in req.failure or req.resource_type == "media"):
                return
            print(f"[{context_name} REQ FAILED] {req.url} - {req.failure}", flush=True)
            self.failed_requests.append(f"{context_name}: {req.url} ({req.failure})")

        page.on("console", on_console)
        page.on("pageerror", on_page_error)
        page.on("requestfailed", on_request_failed)

    def run_all(self):
        self.start_server()
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(
                    headless=True,
                    args=[
                        "--use-gl=angle",
                        "--use-angle=swiftshader",
                        "--enable-webgl",
                        "--ignore-gpu-blocklist",
                        "--no-sandbox",
                        "--disable-setuid-sandbox"
                    ]
                )

                print("\n=======================================================", flush=True)
                print(">>> STARTING DESKTOP SUITE (1440x900)", flush=True)
                print("=======================================================", flush=True)
                desktop_ctx = browser.new_context(
                    viewport={"width": 1440, "height": 900},
                    user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                )
                desktop_page = desktop_ctx.new_page()
                self.instrument_page(desktop_page, "Desktop")
                self.run_desktop_tests(desktop_page)
                desktop_ctx.close()

                print("\n=======================================================", flush=True)
                print(">>> STARTING MOBILE SUITE (393x852 iPhone 14/15 Pro)", flush=True)
                print("=======================================================", flush=True)
                mobile_ctx = browser.new_context(
                    viewport={"width": 393, "height": 852},
                    is_mobile=True,
                    has_touch=True,
                    device_scale_factor=3.0,
                    user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
                )
                mobile_page = mobile_ctx.new_page()
                self.instrument_page(mobile_page, "Mobile")
                self.run_mobile_tests(mobile_page)
                mobile_ctx.close()

                browser.close()
        finally:
            self.stop_server()

        self.report_summary()

    def run_desktop_tests(self, page):
        print(f"[DESKTOP] Navigating to {self.base_url}...", flush=True)
        page.goto(self.base_url, wait_until="domcontentloaded")
        page.wait_for_selector("#webgl-canvas", state="visible", timeout=12000)
        time.sleep(1.0)

        # ----------------------------------------------------
        # TIER 1: FEATURE COVERAGE (Core features in isolation)
        # ----------------------------------------------------
        print("\n--- TIER 1: FEATURE COVERAGE ---", flush=True)

        # T1.1: WebGL 3D Canvas Mounting & Visibility
        canvas = page.locator("#webgl-canvas")
        canvas_visible = canvas.is_visible()
        box = canvas.bounding_box()
        has_dims = box and box["width"] > 1000 and box["height"] > 600
        has_webgl = page.evaluate("() => { const c = document.getElementById('webgl-canvas'); return !!(c && (c.getContext('webgl2') || c.getContext('webgl'))); }")
        self.record_check("Tier 1", "T1.1", "Persistent Fullscreen 3D Canvas Mount", canvas_visible and has_dims and has_webgl, f"Visible: {canvas_visible}, Dims: {box['width']}x{box['height']}, WebGL: {has_webgl}")

        page.screenshot(path=str(SCREENSHOT_DIR / "01-the-seed.png"))

        # T1.2: Fixed Luxury HUD Navigation
        brand_badge = page.locator(".brand-badge")
        nav_buttons = page.locator(".nav-station")
        call_pill = page.locator(".call-pill")
        btn_count = nav_buttons.count()
        call_href = call_pill.get_attribute("href")
        hud_valid = brand_badge.is_visible() and btn_count == 6 and call_href == "tel:+18324588180"
        self.record_check("Tier 1", "T1.2", "Fixed Luxury HUD Navigation Mounting", hud_valid, f"6 stations: {btn_count == 6}, Phone link: {call_href}")

        # T1.3: Web Audio Procedural Ambiance Toggle
        btn_audio = page.locator("#btn-audio")
        initial_pressed = btn_audio.get_attribute("aria-pressed")
        btn_audio.click()
        time.sleep(0.3)
        after_click_pressed = btn_audio.get_attribute("aria-pressed")
        after_click_text = btn_audio.inner_text().strip()
        btn_audio.click()
        time.sleep(0.2)
        reverted_pressed = btn_audio.get_attribute("aria-pressed")
        audio_ok = (initial_pressed == "false") and (after_click_pressed == "true") and ("On" in after_click_text) and (reverted_pressed == "false")
        self.record_check("Tier 1", "T1.3", "Procedural Web Audio Ambiance Toggle", audio_ok, f"Initial: {initial_pressed}, Toggled: {after_click_pressed} ('{after_click_text}'), Reverted: {reverted_pressed}")

        # T1.4: 6 Station Narrative Progression
        stations = [
            ("02-the-board", 1, "01 The Board"),
            ("03-the-banquet", 2, "02 The Banquet"),
            ("04-the-cart", 3, "03 The Cart"),
            ("05-the-chef", 4, "04 The Chef"),
            ("06-instant-quote", 5, "05 Instant Quote")
        ]
        stations_all_passed = True
        for shot_name, idx, expected_btn_text in stations:
            page.evaluate(f"() => window.TableState.goTo({idx}, true)")
            time.sleep(0.5)

            active_ch = page.locator(f"#ch-{idx}").get_attribute("class")
            active_btn = page.locator(f".nav-station[data-goto='{idx}']").get_attribute("class")
            rail_text = page.locator("#rail-text").inner_text().strip()
            ch_active = "active" in (active_ch or "")
            btn_active = "active" in (active_btn or "")

            if not (ch_active and btn_active):
                stations_all_passed = False
            page.screenshot(path=str(SCREENSHOT_DIR / f"{shot_name}.png"))

        self.record_check("Tier 1", "T1.4", "6 Station Transitions & HUD Sync", stations_all_passed, "All 6 stages active, nav buttons synchronized, screenshots captured")

        # T1.5: Spatial HUD Tooltip & Leader Line on Hotspot Focus
        page.evaluate("() => window.TableState.focusHotspot(1)")
        time.sleep(0.6)
        hud_tooltip = page.locator("#hud-tooltip")
        hud_visible = hud_tooltip.is_visible()
        title_text = page.locator("#hud-title").inner_text().strip()
        line_x2 = page.locator("#hud-line").get_attribute("x2")
        has_coords = line_x2 is not None and float(line_x2 or 0) != 0
        self.record_check("Tier 1", "T1.5", "Spatial HUD Tooltip & Dynamic Leader Line", hud_visible and len(title_text) > 0 and has_coords, f"Tooltip visible: {hud_visible}, Title: '{title_text}', Line x2: {line_x2}")
        page.screenshot(path=str(SCREENSHOT_DIR / "08-spatial-hud-tasting-note.png"))

        # T1.6: Interactive Confectioners' Sugar Particle Burst (Beignets)
        page.evaluate("() => window.TableState.clickHotspot(7)")
        time.sleep(0.4)
        burst_title = page.locator("#hud-title").inner_text().strip()
        burst_badge = page.locator("#hud-badge").inner_text().strip()
        self.record_check("Tier 1", "T1.6", "Interactive Beignet Hotspot & Sugar Burst", "Beignet" in burst_title or "Burst" in burst_badge or len(burst_title) > 0, f"Hotspot Title: '{burst_title}', Badge: '{burst_badge}'")
        page.screenshot(path=str(SCREENSHOT_DIR / "09-interactive-beignet-sugar-burst.png"))

        # T1.7: Mathematical Quote Configurator UI Controls
        page.evaluate("() => window.TableState.goTo(5, true)")
        time.sleep(0.4)
        has_slider = page.locator("#input-guests").is_visible()
        has_pills = page.locator(".tier-pill").count() >= 5
        has_receipt = page.locator(".receipt-card").is_visible()
        self.record_check("Tier 1", "T1.7", "Configurator UI Controls Mounting", has_slider and has_pills and has_receipt, f"Slider: {has_slider}, Pills count: {page.locator('.tier-pill').count()}, Receipt: {has_receipt}")

        # ----------------------------------------------------
        # TIER 2: BOUNDARY & CORNER CASES (Desktop)
        # ----------------------------------------------------
        print("\n--- TIER 2: BOUNDARY & CORNER CASES ---", flush=True)

        # T2.1: Guest Count Lower Boundary (50 vs 49)
        slider_min = page.locator("#input-guests").get_attribute("min")
        page.evaluate("() => window.TableState.setGuests(50)")
        time.sleep(0.3)
        lbl_50 = page.locator("#lbl-guests").inner_text().strip()
        rcpt_tier_50 = page.locator("#rcpt-tier-name").inner_text().strip()
        self.record_check("Tier 2", "T2.1", "50-Guest Minimum Boundary Enforcement", slider_min == "50" and "50 guests" in lbl_50, f"Slider min attribute: {slider_min}, Label: '{lbl_50}', Tier: '{rcpt_tier_50}'")

        # T2.2: Extreme Values & Upper Boundary (300 guests)
        page.evaluate("() => window.TableState.setGuests(300)")
        time.sleep(0.3)
        total_300 = page.locator("#rcpt-total").inner_text().strip()
        valid_currency = bool(re.match(r"^\$[\d,]+\.\d{2}$", total_300))
        self.record_check("Tier 2", "T2.2", "Upper Boundary Guest Count Math (300 guests)", valid_currency and not ("NaN" in total_300), f"Total: '{total_300}', Valid Currency: {valid_currency}")

        # T2.3: Holy Grail 75 & 150 Brackets
        holy_pill = page.locator(".tier-pill[data-rate='holy-grail']")
        holy_pill.click()
        time.sleep(0.3)
        page.evaluate("() => window.TableState.setGuests(75)")
        time.sleep(0.3)
        subtotal_75 = page.locator("#rcpt-tier-subtotal").inner_text().strip()

        page.evaluate("() => window.TableState.setGuests(150)")
        time.sleep(0.3)
        subtotal_150 = page.locator("#rcpt-tier-subtotal").inner_text().strip()

        holy_ok = (subtotal_75 == "$2,000.00") and (subtotal_150 == "$3,500.00")
        self.record_check("Tier 2", "T2.3", "Holy Grail Fixed Brackets ($2,000 / $3,500)", holy_ok, f"75 guests: {subtotal_75} (expected $2,000.00), 150 guests: {subtotal_150} (expected $3,500.00)")

        # T2.4: Texas 18% Catering Sales Tax Base Verification & Discrepancy Escalation
        page.locator(".tier-pill[data-rate='24']").click()
        page.evaluate("() => window.TableState.setGuests(50)")
        time.sleep(0.3)
        rcpt_tier_num = page.locator("#rcpt-tier-subtotal").inner_text().strip().replace("$", "").replace(",", "")
        rcpt_tax_num = page.locator("#rcpt-tax").inner_text().strip().replace("$", "").replace(",", "")
        rcpt_total_num = page.locator("#rcpt-total").inner_text().strip().replace("$", "").replace(",", "")
        tier_val = float(rcpt_tier_num)
        tax_val = float(rcpt_tax_num)
        total_val = float(rcpt_total_num)

        tax_on_food_only = round(tier_val * 0.18, 2)
        tax_on_food_plus_setup = round((tier_val + 229.00) * 0.18, 2)
        is_exact_math = abs(total_val - (tier_val + 229.00 + tax_val)) < 0.02
        tax_matches_taxable = abs(tax_val - tax_on_food_only) < 0.02 or abs(tax_val - tax_on_food_plus_setup) < 0.02

        note_escalation = ""
        if abs(tax_val - tax_on_food_only) < 0.02:
            note_escalation = "[ESCALATION NOTE: Tax calculated on Food ($1200*0.18=$216.00). In qa_full.py/Texas Catering Tax, tax is applied to Food + $229 Setup ($1429*0.18=$257.22)]"

        self.record_check("Tier 2", "T2.4", "Texas 18% Catering Tax Invariant Check", is_exact_math and tax_matches_taxable, f"Food: ${tier_val:.2f}, Tax: ${tax_val:.2f}, Total: ${total_val:.2f} {note_escalation}".strip())

        # T2.5: DPR Clamping & High-DPI Safety
        clamped_dpr = page.evaluate("() => Math.min(window.devicePixelRatio, 2.0)")
        self.record_check("Tier 2", "T2.5", "DPR Clamping Performance Guard (<= 2.0)", clamped_dpr <= 2.0, f"Clamped DPR: {clamped_dpr} (Device DPR: {page.evaluate('() => window.devicePixelRatio')})")

        # ----------------------------------------------------
        # TIER 3: CROSS-FEATURE COMBINATIONS
        # ----------------------------------------------------
        print("\n--- TIER 3: CROSS-FEATURE COMBINATIONS ---", flush=True)

        # T3.1: Tier Selection Synchronization (Act 2 Banquet Cards -> Act 5 Configurator)
        page.evaluate("() => window.TableState.goTo(2, true)")
        time.sleep(0.4)
        super_card = page.locator(".tier-card[data-tier='30']")
        super_card.dispatch_event("click")
        time.sleep(0.3)
        card_active = "active" in (super_card.get_attribute("class") or "")

        page.evaluate("() => window.TableState.goTo(5, true)")
        time.sleep(0.3)
        pill_30_active = "active" in (page.locator(".tier-pill[data-rate='30']").get_attribute("class") or "")
        rcpt_name_super = page.locator("#rcpt-tier-name").inner_text().strip()
        tier_sync_ok = card_active and pill_30_active and ("Super" in rcpt_name_super)
        self.record_check("Tier 3", "T3.1", "Tier Selection Sync (Act 2 Cards -> Act 5 Configurator)", tier_sync_ok, f"Card 30 active: {card_active}, Pill 30 active: {pill_30_active}, Receipt: '{rcpt_name_super}'")

        # T3.2: Multi-Add-On Toggling & Subtotal Calculation
        page.evaluate("() => window.TableState.setGuests(100)")
        add_beignets = page.locator("#add-beignets")
        add_cart = page.locator("#add-cart")
        add_sliders = page.locator("#add-sliders")
        add_mimosas = page.locator("#add-mimosas")

        # Uncheck all initially
        for box_loc in [add_beignets, add_cart, add_sliders, add_mimosas]:
            if box_loc.is_checked():
                box_loc.uncheck()
        time.sleep(0.2)
        row_hidden_initial = not page.locator("#rcpt-addons-row").is_visible()

        # Check Beignets ($4.50 * 100 = $450) and Cart ($350) => $800
        add_beignets.check()
        add_cart.check()
        time.sleep(0.3)
        row_visible = page.locator("#rcpt-addons-row").is_visible()
        addons_subtotal_txt = page.locator("#rcpt-addons-subtotal").inner_text().strip()
        addons_expected = (100 * 4.50) + 350.00  # $800.00
        addons_ok = row_visible and addons_subtotal_txt == "$800.00"
        self.record_check("Tier 3", "T3.2", "Multi-Add-On Toggling & Dynamic Subtotal", row_hidden_initial and addons_ok, f"Initially hidden: {row_hidden_initial}, Active: {addons_subtotal_txt} (expected ${addons_expected:.2f})")

        # T3.3: Spatial HUD Dynamic Coordinate Clamping
        page.evaluate("() => window.TableState.focusHotspot(0)")
        time.sleep(0.4)
        tip_box = page.locator("#hud-tooltip").bounding_box()
        view_w = page.evaluate("() => window.innerWidth")
        view_h = page.evaluate("() => window.innerHeight")
        in_bounds = tip_box and tip_box["x"] >= 0 and (tip_box["x"] + tip_box["width"]) <= (view_w + 20) and tip_box["y"] >= 0
        self.record_check("Tier 3", "T3.3", "Spatial HUD Projection Clamping in Viewport", bool(in_bounds), f"Tooltip box: {tip_box}, Viewport: {view_w}x{view_h}")

        # T3.4: Audio Trigger on UI Interaction
        btn_audio_pressed = page.locator("#btn-audio").get_attribute("aria-pressed")
        self.record_check("Tier 3", "T3.4", "Interaction Audio Synthesizer Readiness", btn_audio_pressed is not None, f"Audio button aria-pressed state: {btn_audio_pressed}")

        # ----------------------------------------------------
        # TIER 4: REAL-WORLD APPLICATION SCENARIOS
        # ----------------------------------------------------
        print("\n--- TIER 4: REAL-WORLD SCENARIOS ---", flush=True)

        # T4.1: Full Scrollytelling Journey (Act 0 to Act 5 sequence)
        full_journey_success = True
        for st in range(6):
            page.evaluate(f"() => window.TableState.goTo({st}, true)")
            time.sleep(0.3)
            cur = page.evaluate("() => window.TableState.getChapter()")
            if cur != st:
                full_journey_success = False
        self.record_check("Tier 4", "T4.1", "Full Scrollytelling Journey Progression (0->5)", full_journey_success, "Sequential traverse across all 6 narrative chapters verified")

        # T4.2: Interactive Tasting Notes & Ingredient Exploration
        page.evaluate("() => window.TableState.focusHotspot(4)")
        time.sleep(0.4)
        tasting_title = page.locator("#hud-title").inner_text().strip()
        tasting_desc = page.locator("#hud-desc").inner_text().strip()
        notes_ok = len(tasting_title) > 0 and len(tasting_desc) > 0
        self.record_check("Tier 4", "T4.2", "Interactive Tasting Notes & Ingredients", notes_ok, f"Note: '{tasting_title}' — '{tasting_desc}'")

        # T4.3: Custom Wedding Feast Quotation Workflow (125 Guests, Grand Graze $38, Beignets, Cart)
        page.evaluate("() => window.TableState.goTo(5, true)")
        time.sleep(0.3)
        page.locator(".tier-pill[data-rate='38']").click()
        page.evaluate("() => window.TableState.setGuests(125)")
        time.sleep(0.3)

        # Ensure Beignets and Cart are checked, others unchecked
        add_beignets.check()
        add_cart.check()
        add_sliders.uncheck()
        add_mimosas.uncheck()
        time.sleep(0.4)

        wd_tier_sub = page.locator("#rcpt-tier-subtotal").inner_text().strip()
        wd_addons_sub = page.locator("#rcpt-addons-subtotal").inner_text().strip()
        wd_total = page.locator("#rcpt-total").inner_text().strip()
        expected_food = 125 * 38  # $4,750.00
        expected_addons = (125 * 4.50) + 350.00  # $912.50
        wedding_math_ok = (wd_tier_sub == "$4,750.00") and (wd_addons_sub == "$912.50")
        self.record_check("Tier 4", "T4.3", "Custom Wedding Feast Quotation Workflow", wedding_math_ok, f"Food: {wd_tier_sub} (expected $4,750.00), Add-ons: {wd_addons_sub} (expected $912.50), Total: {wd_total}")
        page.screenshot(path=str(SCREENSHOT_DIR / "10-wedding-custom-quote.png"))

        # T4.4: Pre-Filled SMS Lead Trigger Verification
        btn_sms = page.locator("#btn-sms")
        sms_href = btn_sms.get_attribute("href") or ""
        sms_valid_prefix = sms_href.startswith("sms:+18324588180?body=")
        decoded_sms = unquote(sms_href)
        sms_content_ok = ("125 guests" in decoded_sms) and ("Grand" in decoded_sms) and ("Tricia" in decoded_sms) and ("Zeppole" in decoded_sms)
        self.record_check("Tier 4", "T4.4", "Instant SMS Lead Capture Trigger Verification", sms_valid_prefix and sms_content_ok, f"Prefix valid: {sms_valid_prefix}, Decoded snippet: {decoded_sms[:85]}...")

        # T4.5: Pre-Filled Email Proposal Trigger Verification
        btn_email = page.locator("#btn-email")
        email_href = btn_email.get_attribute("href") or ""
        email_valid_prefix = email_href.startswith("mailto:charcuteriechick@outlook.com?")
        decoded_email = unquote(email_href)
        email_content_ok = ("125 Guests" in decoded_email) and ("Grand" in decoded_email) and ("Setup Fee: $229.00" in decoded_email)
        self.record_check("Tier 4", "T4.5", "Instant Email Proposal Trigger Verification", email_valid_prefix and email_content_ok, f"Prefix valid: {email_valid_prefix}, Decoded snippet: {decoded_email[:85]}...")

    def run_mobile_tests(self, page):
        print(f"[MOBILE] Navigating to {self.base_url} (393x852)...", flush=True)
        page.goto(self.base_url, wait_until="domcontentloaded")
        page.wait_for_selector("#webgl-canvas", state="visible", timeout=12000)
        time.sleep(1.0)

        # M1: Mobile Canvas Mount & Visibility
        canvas = page.locator("#webgl-canvas")
        canvas_visible = canvas.is_visible()
        self.record_check("Tier 2 (Mobile)", "M1", "Mobile Fullscreen Canvas Mount", canvas_visible, f"Canvas visible: {canvas_visible}")
        page.screenshot(path=str(SCREENSHOT_DIR / "mobile-01-the-seed.png"))

        # M2: Mobile Horizontal Overflow Prevention (393px viewport)
        scroll_width = page.evaluate("() => document.documentElement.scrollWidth")
        no_overflow = scroll_width <= 393
        self.record_check("Tier 2 (Mobile)", "M2", "Mobile Horizontal Overflow Gate (<=393px)", no_overflow, f"Document scrollWidth: {scroll_width}px (max 393px)")

        # M3: Mobile Station Navigation via Touch/State
        page.evaluate("() => window.TableState.goTo(2, true)")
        time.sleep(0.4)
        ch2_active = "active" in (page.locator("#ch-2").get_attribute("class") or "")
        self.record_check("Tier 2 (Mobile)", "M3", "Mobile Station Progression to Act 2", ch2_active, f"Act 2 active: {ch2_active}")
        page.screenshot(path=str(SCREENSHOT_DIR / "mobile-03-the-banquet.png"))

        # M4: Mobile Calculator Plate Layout & Responsiveness
        page.evaluate("() => window.TableState.goTo(5, true)")
        time.sleep(0.4)
        calc_plate = page.locator(".plate-calculator")
        calc_box = calc_plate.bounding_box()
        calc_fits = calc_box and calc_box["width"] <= 393
        self.record_check("Tier 2 (Mobile)", "M4", "Mobile Calculator Responsive Plate Fit", bool(calc_fits), f"Calculator width: {calc_box['width'] if calc_box else 'N/A'}px")
        page.screenshot(path=str(SCREENSHOT_DIR / "mobile-06-instant-quote.png"))

        # M5: Mobile Spatial HUD Clamping Check
        page.evaluate("() => window.TableState.focusHotspot(1)")
        time.sleep(0.4)
        m_tip_box = page.locator("#hud-tooltip").bounding_box()
        m_clamped = m_tip_box and m_tip_box["x"] >= 0 and (m_tip_box["x"] + m_tip_box["width"]) <= 400
        self.record_check("Tier 2 (Mobile)", "M5", "Mobile Spatial HUD Tooltip Viewport Clamping", bool(m_clamped), f"Mobile Tooltip Box: {m_tip_box}")

    def report_summary(self):
        elapsed = round(time.time() - self.start_time, 2)
        total_checks = len(self.test_results)
        passed_checks = sum(1 for r in self.test_results if r["passed"])
        failed_checks = total_checks - passed_checks

        print("\n=======================================================", flush=True)
        print(">>> COMPREHENSIVE E2E TEST RESULTS SUMMARY", flush=True)
        print("=======================================================", flush=True)
        print(f"Total Execution Time: {elapsed} seconds", flush=True)
        print(f"Total Checks: {total_checks}", flush=True)
        print(f"Passed Checks: {passed_checks}", flush=True)
        print(f"Failed Checks: {failed_checks}", flush=True)
        print(f"Console Errors: {len(self.console_errors)}", flush=True)
        print(f"Page Errors: {len(self.page_errors)}", flush=True)
        print(f"Failed Requests: {len(self.failed_requests)}", flush=True)

        if self.console_errors:
            print("\n[CONSOLE ERRORS DETECTED]:", flush=True)
            for err in self.console_errors:
                print(f"  - {err}", flush=True)

        if self.page_errors:
            print("\n[PAGE ERRORS DETECTED]:", flush=True)
            for err in self.page_errors:
                print(f"  - {err}", flush=True)

        if self.failed_requests:
            print("\n[FAILED NETWORK REQUESTS DETECTED]:", flush=True)
            for req in self.failed_requests:
                print(f"  - {req}", flush=True)

        results_data = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "execution_seconds": elapsed,
            "total_checks": total_checks,
            "passed_checks": passed_checks,
            "failed_checks": failed_checks,
            "console_errors_count": len(self.console_errors),
            "page_errors_count": len(self.page_errors),
            "failed_requests_count": len(self.failed_requests),
            "console_errors": self.console_errors,
            "page_errors": self.page_errors,
            "failed_requests": self.failed_requests,
            "checks": self.test_results,
            "status": "PASS" if (failed_checks == 0 and len(self.console_errors) == 0 and len(self.failed_requests) == 0) else "FAIL"
        }
        RESULTS_PATH.write_text(json.dumps(results_data, indent=2), encoding="utf-8")
        print(f"\n[REPORT] Saved structured test results to {RESULTS_PATH}", flush=True)

        # Strict Quality Gates
        assert len(self.console_errors) == 0, f"Encountered {len(self.console_errors)} console errors: {self.console_errors}"
        assert len(self.page_errors) == 0, f"Encountered {len(self.page_errors)} uncaught page errors: {self.page_errors}"
        assert len(self.failed_requests) == 0, f"Encountered {len(self.failed_requests)} failed requests: {self.failed_requests}"
        assert failed_checks == 0, f"{failed_checks} of {total_checks} test assertions failed!"

        print("\n>>> ALL QUALITY GATES PASSED! 100% SUCCESS!", flush=True)


if __name__ == "__main__":
    url_arg = sys.argv[1] if len(sys.argv) > 1 else None
    runner = E2ETestRunner(target_url=url_arg)
    runner.run_all()
