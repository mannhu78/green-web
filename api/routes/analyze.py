from flask import (
    Blueprint,
    request
)
from api.extensions import db

from api.services.lighthouse_service import (
    analyze_website
)

from api.services.eco_mode_service import (
    simulate_eco_mode
)

from api.services.carbon_insight_service import (
    generate_carbon_equivalent
)

from api.services.recommendation_service import (
    generate_suggestions
)
from api.services.green_host_service import (
    check_green_host
)

from api.services.screenshot_service import (
    capture_screenshot
)

from api.models.history_model import AnalyzeHistory


analyze_bp = Blueprint(
    "analyze",
    __name__
)

@analyze_bp.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    url = None

    try:

        data = request.get_json()

        url = data.get("url")

        result = analyze_website(url)

        try:

            screenshot = capture_screenshot(url)

            result["screenshot"] = screenshot

        except Exception:

            result["screenshot"] = (
                "http://localhost:5000/screenshots/default.png"
            )

        suggestions = (
            generate_suggestions(result)
        )

        result["suggestions"] = (
            suggestions
        )

        equivalent = (
            generate_carbon_equivalent(
                result["co2"]
            )
        )

        result["equivalent"] = equivalent

        eco_mode = simulate_eco_mode({

            "total_bytes":
                result["total_bytes"],

            "video_bytes":
                result["video_bytes"],

            "unused_js":
                result["unused_js"],

            "optimized_images_savings":
                result["optimized_images_savings"],

            "webp_savings":
                result["webp_savings"],

            "co2":
                result["co2"]
        })

        result["eco_mode"] = eco_mode

        result["green_badge"] = (
            result["co2"] < 0.5
        )

        user_email = data.get("user_email")

        if user_email:

            history = AnalyzeHistory(

                user_email=user_email,

                url=url,

                performance_score=
                    result["performance_score"],

                co2=result["co2"],

                green_label=
                    result["green_label"]
            )

            db.session.add(history)

            db.session.commit()

        # =========================
        # Green Hosting Check
        # =========================

        try:

            green_host = (
                check_green_host(url)
            )

            result["green_host"] = (
                green_host
            )

        except Exception as e:

            result["green_host"] = {

                "green": False,

                "hosted_by": "Unknown",

                "error": str(e)
            }

        return result

    except Exception as e:

        return {

            "url": url,

            "performance_score": None,

            "co2": None,

            "green_label": "error",

            "scan_time": None,

            "page_size_mb": None,

            "request_count": None,

            "image_bytes": 0,

            "js_bytes": 0,

            "css_bytes": 0,

            "font_bytes": 0,

            "video_bytes": 0,

            "lcp": None,

            "fcp": None,

            "cls": None,

            "tbt": None,

            "unused_js": 0,

            "unused_css": 0,

            "suggestions": [],

            "equivalent": None,

            "eco_mode": None,

            "green_badge": False,

            "green_host": None,

            "error": str(e)

        }, 500