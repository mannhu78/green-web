
from flask import (
    Blueprint,
    request,
    jsonify
)

import traceback

from api.services.shap_service import (
    generate_shap_explanation
)

shap_bp = Blueprint(
    "shap",
    __name__
)

@shap_bp.route(
    "/shap",
    methods=["POST"]
)
def shap_explain():

    try:

        data = request.get_json()

        print("\n===== SHAP INPUT =====")
        print(data)

        result = generate_shap_explanation(
            data
        )

        print("\n===== SHAP SUCCESS =====")

        return jsonify(result)

    except Exception as e:

        print("\n===== SHAP ERROR =====")

        traceback.print_exc()

        return jsonify({

            "error": str(e)

        }), 500

