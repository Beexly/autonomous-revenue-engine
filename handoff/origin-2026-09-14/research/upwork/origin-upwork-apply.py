"""Submit Lane-1 Upwork proposals from Garrett's Chrome session. Never buy Connects. Never print cookies."""
from __future__ import annotations

import json
import os
import shutil
import time
from pathlib import Path

from playwright.sync_api import TimeoutError as PWTimeout
from playwright.sync_api import sync_playwright

HOME = Path(r"C:\Users\Garrett")
SRC_USER = Path(os.environ.get("LOCALAPPDATA", r"C:\Users\Garrett\AppData\Local")) / "Google" / "Chrome" / "User Data"
DST = HOME / "so-upwork-chrome"
SHOTS = HOME / "origin-upwork-shots"
STATUS = HOME / "origin-upwork-submit-status.md"

JOBS = [
    {
        "id": "framer",
        "url": "https://www.upwork.com/freelance-jobs/apply/Framer-Website-Developer-for-Final-Edits-Integrations-Meta-Pixel-Setup_~022092295580341310820/",
        "bid": "250",
        "cover": """You asked for Meta Pixel + CAPI on a Framer site, plus GoHighLevel form tracking. I will not rebuild the site.

Framer Pixel without a shared event_id on CAPI is how leads vanish after iOS or double-count in Ads Manager. GHL forms usually fire a browser Lead and skip the server event, so Meta cannot dedupe.

I take that slice. $250 diagnostic, 3 business days. Events Manager evidence: Pixel vs CAPI, GHL form event_id parity, Test Events on a real form submit.

If the slice is broken, implementation is $500–$1,500 flat, quoted before I touch production. No retainer. No Framer redesign.

Houston. I can start today.

Baxley.Garrett@gmail.com
@SignaL_OriginHQ

Are the GHL forms embedded on Framer, or does Framer post into GHL?""",
    },
    {
        "id": "pixel-overcount",
        "url": "https://www.upwork.com/freelance-jobs/apply/Facebook-Pixel-Tracking-Issue_~022090157247832197619/",
        "bid": "250",
        "cover": """Purchase counts running higher than store sales is overcount until proven otherwise. Most common cause: Pixel + CAPI firing without a shared event_id, so Meta cannot dedupe.

Native Facebook & Instagram, one main pixel, Shopify. Simple setup still hides a second sender: checkout script, CAPI, or a third-party app. I will audit everything sending Purchase, then tell you which one is inflating the count, with Events Manager proof. Not a guess.

$250 diagnostic, 3 business days. You get: one Purchase per order or not, browser vs server dedup, a 7-day Meta-vs-Shopify count, before-state screenshots.

Your $300 listing is not the production fix. Implementation is $500–$1,500 after that, quoted flat, with after-state screenshots. No retainer. I am not bidding GA4.

Houston. I can start today.

Baxley.Garrett@gmail.com
@SignaL_OriginHQ

Is CAPI coming from Shopify native, a plugin, or custom server code?""",
    },
    {
        "id": "gtm-stape",
        "url": "https://www.upwork.com/freelance-jobs/apply/GTM-Google-Analytics-Expert-Ongoing-Tracking-Analytics-Support_~022091967546699073210/",
        "bid": "250",
        "cover": """You want someone to own GTM and GA4 for 3–6 months. I will not bid that retainer.

You also require Meta CAPI, Stape, and conversion-pixel QA. That is the slice I take.

Stape CAPI without event_id parity against the browser pixel is how GA4 and Meta disagree on the same conversion. I will not guess which one is lying until Events Manager and GTM preview say so.

$250 diagnostic as week one. 3 business days. Report: Pixel vs CAPI vs Stape, dedup status, conversion-pixel QA, what is actually broken.

If the CAPI/pixel slice is broken, implementation is $500–$1,500 flat. If tracking is clean, I stop. I do not take the ongoing GTM/GA4 seat.

Houston. I can start today.

Baxley.Garrett@gmail.com
@SignaL_OriginHQ

Is Stape already sending Purchase or Lead, or is CAPI still on the wish list?""",
    },
]

LOG = []


def log(msg: str) -> None:
    line = f"- {time.strftime('%H:%M:%S')} {msg}"
    LOG.append(line)
    print(line, flush=True)
    STATUS.write_text("# Origin Upwork submit status\n\n" + "\n".join(LOG) + "\n", encoding="utf-8")


def copy_profile() -> None:
    DST.mkdir(parents=True, exist_ok=True)
    SHOTS.mkdir(parents=True, exist_ok=True)
    src_default = SRC_USER / "Default"
    dst_default = DST / "Default"
    dst_default.mkdir(parents=True, exist_ok=True)
    (dst_default / "Network").mkdir(parents=True, exist_ok=True)
    files = [
        (SRC_USER / "Local State", DST / "Local State"),
        (src_default / "Preferences", dst_default / "Preferences"),
        (src_default / "Secure Preferences", dst_default / "Secure Preferences"),
        (src_default / "Cookies", dst_default / "Cookies"),
        (src_default / "Login Data", dst_default / "Login Data"),
        (src_default / "Web Data", dst_default / "Web Data"),
        (src_default / "Network" / "Cookies", dst_default / "Network" / "Cookies"),
        (src_default / "Network" / "Cookies-journal", dst_default / "Network" / "Cookies-journal"),
    ]
    for src, dst in files:
        try:
            if src.exists():
                shutil.copy2(src, dst)
                log(f"copied {src.name}")
        except Exception as e:
            log(f"copy-skip {src.name}: {type(e).__name__}")
    # Local Storage helps session restore
    for name in ("Local Storage", "Session Storage"):
        s, d = src_default / name, dst_default / name
        if s.exists() and not d.exists():
            try:
                shutil.copytree(s, d, dirs_exist_ok=True)
                log(f"copied tree {name}")
            except Exception as e:
                log(f"copy-skip {name}: {type(e).__name__}")


def page_text(page) -> str:
    try:
        return page.inner_text("body")[:8000]
    except Exception:
        return ""


def blocked_spend(text: str) -> bool:
    t = text.lower()
    needles = (
        "buy connects",
        "purchase connects",
        "add a billing",
        "credit card",
        "upgrade to",
        "membership",
    )
    return any(n in t for n in needles)


def fill_cover(page, cover: str) -> bool:
    selectors = [
        "textarea[aria-label*='Cover' i]",
        "textarea[placeholder*='Cover' i]",
        "textarea[data-test*='cover' i]",
        "[data-ev-label*='cover' i] textarea",
        "textarea",
        "[contenteditable='true']",
    ]
    for sel in selectors:
        loc = page.locator(sel)
        n = loc.count()
        for i in range(min(n, 6)):
            el = loc.nth(i)
            try:
                if not el.is_visible():
                    continue
                el.click(timeout=2000)
                el.fill(cover, timeout=5000)
                log(f"filled cover via {sel} #{i}")
                return True
            except Exception:
                try:
                    el.click(timeout=2000)
                    page.keyboard.insert_text(cover)
                    log(f"typed cover via {sel} #{i}")
                    return True
                except Exception:
                    continue
    return False


def fill_bid(page, bid: str) -> None:
    selectors = [
        "input[aria-label*='bid' i]",
        "input[aria-label*='rate' i]",
        "input[aria-label*='amount' i]",
        "input[data-test*='bid' i]",
        "input[data-test*='charge' i]",
        "input[inputmode='decimal']",
        "input[type='text']",
        "input[type='number']",
    ]
    for sel in selectors:
        loc = page.locator(sel)
        n = loc.count()
        for i in range(min(n, 8)):
            el = loc.nth(i)
            try:
                if not el.is_visible():
                    continue
                name = (el.get_attribute("aria-label") or "") + " " + (el.get_attribute("name") or "")
                low = name.lower()
                if any(x in low for x in ("search", "email", "password", "phone")):
                    continue
                el.click(timeout=1500)
                el.fill("")
                el.type(bid, delay=40)
                log(f"filled bid {bid} via {sel} #{i} {name[:80]}")
                return
            except Exception:
                continue
    log("bid field not found")


def switch_freelancer(page) -> None:
    text = page_text(page).lower()
    if "switch to freelancer" in text or "freelancer account" in text:
        for label in ("Switch to Freelancer", "Freelancer"):
            try:
                page.get_by_role("button", name=label).first.click(timeout=3000)
                page.wait_for_timeout(2500)
                log(f"clicked {label}")
                return
            except Exception:
                try:
                    page.get_by_text(label, exact=False).first.click(timeout=3000)
                    page.wait_for_timeout(2500)
                    log(f"clicked text {label}")
                    return
                except Exception:
                    continue


def submit_job(page, job: dict) -> str:
    jid = job["id"]
    page.goto(job["url"], wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(4000)
    page.screenshot(path=str(SHOTS / f"{jid}-01-open.png"), full_page=True)
    html = page.content()
    (SHOTS / f"{jid}-01.html").write_text(html, encoding="utf-8", errors="ignore")
    text = page_text(page)
    low = text.lower()
    if "log in" in low and "proposal" not in low and "cover letter" not in low:
        page.screenshot(path=str(SHOTS / f"{jid}-LOGIN.png"), full_page=True)
        return "LOGIN_WALL"
    if "access denied" in low or "error 1020" in low or "cloudflare" in low and "blocked" in low:
        return "BLOCKED"
    if blocked_spend(text):
        page.screenshot(path=str(SHOTS / f"{jid}-SPEND.png"), full_page=True)
        return "SPEND_WALL"
    switch_freelancer(page)
    if "already submitted" in low or "you have already applied" in low:
        page.screenshot(path=str(SHOTS / f"{jid}-already.png"), full_page=True)
        return "ALREADY"
    # dismiss cookies
    for label in ("Accept", "Accept all", "I agree"):
        try:
            page.get_by_role("button", name=label).first.click(timeout=1000)
        except Exception:
            pass
    if not fill_cover(page, job["cover"]):
        page.screenshot(path=str(SHOTS / f"{jid}-NOCOVER.png"), full_page=True)
        return "NO_COVER_FIELD"
    fill_bid(page, job["bid"])
    # skip boost / extra connects
    for label in ("Skip", "No thanks", "Not now", "Continue"):
        try:
            page.get_by_role("button", name=label).first.click(timeout=1500)
            log(f"clicked {label}")
        except Exception:
            pass
    page.screenshot(path=str(SHOTS / f"{jid}-02-filled.png"), full_page=True)
    text = page_text(page)
    if blocked_spend(text):
        page.screenshot(path=str(SHOTS / f"{jid}-SPEND.png"), full_page=True)
        return "SPEND_WALL"
    submitted = False
    for label in (
        "Send proposal",
        "Submit proposal",
        "Apply now",
        "Send",
        "Submit",
        "Next",
    ):
        try:
            btn = page.get_by_role("button", name=label).first
            if btn.is_visible():
                btn.click(timeout=4000)
                log(f"clicked {label}")
                submitted = True
                page.wait_for_timeout(3000)
                break
        except Exception:
            continue
    page.screenshot(path=str(SHOTS / f"{jid}-03-after.png"), full_page=True)
    text = page_text(page).lower()
    if blocked_spend(text):
        return "SPEND_WALL"
    if any(x in text for x in ("proposal submitted", "you have applied", "application sent", "successfully submitted")):
        return "SUBMITTED"
    if submitted:
        return "CLICKED_UNCONFIRMED"
    return "NO_SUBMIT_BUTTON"


def main() -> None:
    SHOTS.mkdir(parents=True, exist_ok=True)
    log("start apply")
    copy_profile()
    results = {}
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            user_data_dir=str(DST),
            channel="chrome",
            headless=False,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--window-size=1280,900",
                "--window-position=40,40",
            ],
            viewport={"width": 1280, "height": 900},
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto("https://www.upwork.com/nx/find-work/best-matches", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)
        page.screenshot(path=str(SHOTS / "home.png"), full_page=True)
        (SHOTS / "home.html").write_text(page.content(), encoding="utf-8", errors="ignore")
        log(f"home title: {page.title()}")
        switch_freelancer(page)
        page.screenshot(path=str(SHOTS / "home-after-switch.png"), full_page=True)
        for job in JOBS:
            try:
                status = submit_job(page, job)
            except PWTimeout as e:
                status = f"TIMEOUT {e}"
            except Exception as e:
                status = f"ERROR {type(e).__name__}: {e}"
            results[job["id"]] = {"status": status, "url": job["url"]}
            log(f"{job['id']}: {status}")
        ctx.close()
    (HOME / "origin-upwork-results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    log("done " + json.dumps(results))


if __name__ == "__main__":
    main()
