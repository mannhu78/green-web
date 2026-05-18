from playwright.sync_api import sync_playwright
import uuid
import os

BASE_DIR = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        ".."
    )
)

SCREENSHOT_DIR = os.path.join(
    BASE_DIR,
    "screenshots"
)

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
            headless=True
        )

        page = browser.new_page(
            viewport={
                "width": 1366,
                "height": 768
            }
        )

        page.goto(
            url,
            wait_until="domcontentloaded",
            timeout=30000
        )

        # chờ render thêm
        page.wait_for_timeout(4000)

        page.screenshot(
            path=path,
            full_page=False
        )

        browser.close()

    return f"http://localhost:5000/screenshots/{filename}"