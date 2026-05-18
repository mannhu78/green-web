
import xgboost as xgb
import joblib
import pandas as pd

# =========================
# Load Booster
# =========================

model = xgb.Booster()

model.load_model(
    "ml/xgboost_model.json"
)

label_encoders = joblib.load(
    "ml/label_encoders.pkl"
)

feature_columns = joblib.load(
    "ml/feature_columns.pkl"
)

best_threshold = float(
    joblib.load(
        "ml/best_threshold.pkl"
    )
)

# =========================
# Predict Function
# =========================

def predict_green_label(data):

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

        value = str(
            df[col].iloc[0]
        )

        if value not in le.classes_:

            df[col] = 0

        else:

            df[col] = int(
                le.transform([value])[0]
            )

    # =========================
    # Reorder Features
    # =========================

    df = df[feature_columns]

    # =========================
    # Convert Numeric
    # =========================

    df = df.astype(float)

    # =========================
    # XGBoost DMatrix
    # =========================

    dmatrix = xgb.DMatrix(df)

    # =========================
    # Predict
    # =========================

    probability = float(
        model.predict(dmatrix)[0]
    )

    prediction = int(
        probability >= best_threshold
    )

    label = (
        "heavy"
        if prediction == 1
        else "green"
    )

    return {

        "prediction": int(prediction),

        "green_label": str(label),

        "probability": float(
            round(probability, 4)
        ),

        "green_score": float(
            round(
                (1 - probability) * 100,
                2
            )
        )
    }

