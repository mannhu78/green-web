from playwright.sync_api import sync_playwright
import uuid
import os
import time

SCREENSHOT_DIR = "screenshots"

os.makedirs(
    SCREENSHOT_DIR,
    exist_ok=True
)

def capture_screenshot(url):

    filename = f"{uuid.uuid4()}.png"

    path = os.path.join(
        SCREENSHOT_DIR,
        filename
    )

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True,
            args=[
                "--disable-blink-features=AutomationControlled"
            ]
        )

        context = browser.new_context(

            viewport={
                "width": 1366,
                "height": 768
            },

            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            )
        )

        page = context.new_page()

        # tránh bị detect automation
        page.add_init_script("""
            Object.defineProperty(
                navigator,
                'webdriver',
                {
                    get: () => undefined
                }
            )
        """)

        page.goto(
            url,
            wait_until="networkidle",
            timeout=90000
        )

        # chờ render thêm
        time.sleep(3)

        page.screenshot(
            path=path,
            full_page=False
        )

        browser.close()

    return f"http://localhost:5000/screenshots/{filename}"