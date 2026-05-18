
import shap
import joblib
import pandas as pd

from xgboost import XGBClassifier

# =========================
# Load Model
# =========================

model = XGBClassifier()

model.load_model(
    "ml/xgboost_model.json"
)

label_encoders = joblib.load(
    "ml/label_encoders.pkl"
)

feature_columns = joblib.load(
    "ml/feature_columns.pkl"
)

# =========================
# SHAP Explainer
# =========================

explainer = shap.TreeExplainer(
    model.get_booster()
)

# =========================
# Generate SHAP
# =========================

def generate_shap_explanation(data):

    df = pd.DataFrame([data])

    # =========================
    # Feature Engineering
    # =========================

    df["js_ratio"] = (
        df["js_bytes"] /
        (df["total_bytes"] + 1)
    )

    df["image_ratio"] = (
        df["image_bytes"] /
        (df["total_bytes"] + 1)
    )

    df["css_ratio"] = (
        df["css_bytes"] /
        (df["total_bytes"] + 1)
    )

    df["third_party_ratio"] = (
        df["third_party_requests"] /
        (df["request_count"] + 1)
    )

    df["unused_code_ratio"] = (
        (df["unused_js"] + df["unused_css"]) /
        (df["total_bytes"] + 1)
    )

    df["media_ratio"] = (
        (df["image_bytes"] + df["video_bytes"]) /
        (df["total_bytes"] + 1)
    )

    # =========================
    # Encode categorical
    # =========================

    categorical_cols = [
        "category",
        "page_type",
        "device"
    ]

    for col in categorical_cols:

        le = label_encoders[col]

        value = str(df[col].iloc[0])

        if value not in le.classes_:

            df[col] = 0

        else:

            df[col] = le.transform([value])

    # =========================
    # Reorder columns
    # =========================

    df = df[feature_columns]

    # =========================
    # SHAP values
    # =========================

    shap_values = explainer.shap_values(df)

    # =========================
    # Feature impacts
    # =========================

    impacts = []

    for i, feature in enumerate(feature_columns):

        impacts.append({

            "feature": feature,

            "impact": round(
                float(shap_values[0][i]),
                4
            )
        })

    # sort strongest impact first
    impacts = sorted(

        impacts,

        key=lambda x: abs(x["impact"]),

        reverse=True
    )

    return {

        "top_features":
            impacts[:10]
    }

