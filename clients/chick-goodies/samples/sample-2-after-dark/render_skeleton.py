from playwright.sync_api import sync_playwright
import os

html_path = r'C:/Users/Garrett/XiaomiMiMoProjects/.mimo-sessions/2026/09/28/you-are-the-lead-narrative-architect/cc-skeleton.html'

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('file:///' + html_path)
    page.wait_for_timeout(1000)
    page.screenshot(path='test-output/skeleton_0_prologue.png')
    
    # Scroll to Act 1
    page.evaluate("document.getElementById('act1').scrollIntoView()")
    page.wait_for_timeout(1000)
    page.screenshot(path='test-output/skeleton_1_act1.png')

    # Scroll to Act 2
    page.evaluate("document.getElementById('act2').scrollIntoView()")
    page.wait_for_timeout(1000)
    page.screenshot(path='test-output/skeleton_2_act2.png')

    # Scroll to Act 3
    page.evaluate("document.getElementById('act3').scrollIntoView()")
    page.wait_for_timeout(1000)
    page.screenshot(path='test-output/skeleton_3_act3.png')

    # Scroll to Epilogue / Calculator
    page.evaluate("document.getElementById('epilogue').scrollIntoView()")
    page.wait_for_timeout(1000)
    page.screenshot(path='test-output/skeleton_4_epilogue.png')

    # Scroll to Instruments / Calculator docket
    page.evaluate("document.querySelector('.instruments').scrollIntoView()")
    page.wait_for_timeout(1000)
    page.screenshot(path='test-output/skeleton_5_calculator.png')

    browser.close()
print('SUCCESS_SKELETON_RENDERED')
