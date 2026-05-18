
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

from api.models.history_model import (
    AnalyzeHistory
)

from api.services.shap_service import (
    generate_shap_explanation
)


from api.services.green_score_service import (
    calculate_green_score
)



from flask import jsonify



# =========================
# ML Predictor
# =========================

from api.services.predictor import (
    predict_green_label
)

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

        # =========================
        # Lighthouse Analyze
        # =========================

        result = analyze_website(url)

        # =========================
        # ML Prediction
        # =========================

        print("START PREDICT")

        ml_result = predict_green_label({

            "category":
                result.get("category", "general"),

            "page_type":
                result.get("page_type", "desktop"),

            "device":
                result.get("device", "desktop"),

            "request_count":
                result.get("request_count", 0),

            "total_bytes":
                result.get("total_bytes", 0),

            "image_bytes":
                result.get("image_bytes", 0),

            "js_bytes":
                result.get("js_bytes", 0),

            "css_bytes":
                result.get("css_bytes", 0),

            "font_bytes":
                result.get("font_bytes", 0),

            "video_bytes":
                result.get("video_bytes", 0),

            "has_video":
                result.get("has_video", 0),

            "image_count":
                result.get("image_count", 0),

            "script_count":
                result.get("script_count", 0),

            "third_party_requests":
                result.get(
                    "third_party_requests",
                    0
                ),

            "unused_js":
                result.get("unused_js", 0),

            "unused_css":
                result.get("unused_css", 0),

            "lcp":
                result.get("lcp", 0),

            "fcp":
                result.get("fcp", 0),

            "cls":
                result.get("cls", 0),

            "tbt":
                result.get("tbt", 0)
        })

        print("PREDICT SUCCESS")
        print(ml_result)

        # =========================
        # SHAP Explainability
        # =========================

        #shap_result = generate_shap_explanation({

          #  "category":
          #      result.get("category", 0),

          #  "page_type":
          #      result.get("page_type", 0),

           # "device":
           #     result.get("device", 0),

           # "request_count":
           #     result.get("request_count", 0),

           # "total_bytes":
           #     result.get("total_bytes", 0),

           # "image_bytes":
           #     result.get("image_bytes", 0),

           # "js_bytes":
            #    result.get("js_bytes", 0),

            #"css_bytes":
            #    result.get("css_bytes", 0),

           # "font_bytes":
           #     result.get("font_bytes", 0),

           # "video_bytes":
           #     result.get("video_bytes", 0),

           # "has_video":
           #     result.get("has_video", 0),

           # "image_count":
           #     result.get("image_count", 0),

           # "script_count":
           #     result.get("script_count", 0),

           # "third_party_requests":
            #    result.get("third_party_requests", 0),

           # "unused_js":
           #     result.get("unused_js", 0),

           # "unused_css":
           #     result.get("unused_css", 0),

           # "lcp":
           #     result.get("lcp", 0),

           # "fcp":
            #    result.get("fcp", 0),

            #"cls":
           #     result.get("cls", 0),

           # "tbt":
            #    result.get("tbt", 0),

           # "js_ratio":
             #   result.get("js_ratio", 0),

            #"image_ratio":
             #   result.get("image_ratio", 0),

            #"css_ratio":
            #    result.get("css_ratio", 0),

           # "third_party_ratio":
             #   result.get("third_party_ratio", 0),

            #"unused_code_ratio":
            #    result.get("unused_code_ratio", 0),

          #  "media_ratio":
         #       result.get("media_ratio", 0)
        #})

       # result["shap"] = shap_result

        # =========================
        # Merge ML Result
        # =========================

       
        # =========================
        # Calculate Final Green Score
        # =========================

        final_green_score = calculate_green_score(
            result,
            ml_result
        )

        # =========================
        # Final Label
        # =========================

        if final_green_score >= 70:

            final_label = "green"

        elif final_green_score >= 40:

            final_label = "moderate"

        else:

            final_label = "heavy"

        # =========================
        # Merge Result
        # =========================

        result.update({

            "ml_prediction":
                int(ml_result["prediction"]),

            "ai_label":
                str(ml_result["green_label"]),

            "probability":
                float(ml_result["probability"]),

            "green_label":
                final_label,

            "green_score":
                final_green_score
        })
    

        # =========================
        # Screenshot
        # =========================

        try:

            screenshot = capture_screenshot(url)

            result["screenshot"] = screenshot

            print("SCREENSHOT SUCCESS:", screenshot)

        except Exception as e:

            print("SCREENSHOT ERROR:", str(e))

            result["screenshot"] = None

        # =========================
        # Suggestions
        # =========================

        suggestions = generate_suggestions(
            result
        )

        result["suggestions"] = (
            suggestions
        )

        # =========================
        # Carbon Equivalent
        # =========================

        equivalent = (
            generate_carbon_equivalent(
                result["co2"]
            )
        )

        result["equivalent"] = (
            equivalent
        )

        # =========================
        # Eco Mode
        # =========================

        eco_mode = simulate_eco_mode({

            "total_bytes":
                result["total_bytes"],

            "video_bytes":
                result["video_bytes"],

            "unused_js":
                result["unused_js"],

            "optimized_images_savings":
                result.get(
                    "optimized_images_savings",
                    0
                ),

            "webp_savings":
                result.get(
                    "webp_savings",
                    0
                ),

            "co2":
                result["co2"]
        })

        result["eco_mode"] = (
            eco_mode
        )

        # =========================
        # Green Badge
        # =========================

        result["green_badge"] = bool(
            result["green_score"] >= 70
        )

        # =========================
        # Save History
        # =========================

        user_email = data.get(
            "user_email"
        )

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

        return jsonify(result)



    except Exception as e:

        return {

            "url": url,

            "performance_score": None,

            "co2": None,

            "green_label": "error",

            "probability": 0,

            "green_score": 0,

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

