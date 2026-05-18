import pandas as pd
import numpy as np
import joblib
import shap
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve
)

from imblearn.over_sampling import SMOTE

from xgboost import XGBClassifier

# =========================
# Load Dataset
# =========================

df = pd.read_csv(
    "./crawler/dataset_final_cleaned.csv"
)

print("\n===== ORIGINAL DATA =====")
print(df.shape)

# =========================
# Remove Moderate
# =========================

df = df[
    df["green_label"] != "moderate"
]

print("\n===== AFTER REMOVE MODERATE =====")
print(df.shape)

# =========================
# Target Mapping
# =========================

df["target"] = df["green_label"].map({

    "green": 0,
    "heavy": 1
})

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
# Encode Categorical Columns
# =========================

categorical_cols = [

    "category",
    "page_type",
    "device"
]

label_encoders = {}

for col in categorical_cols:

    le = LabelEncoder()

    df[col] = le.fit_transform(
        df[col]
    )

    label_encoders[col] = le

# =========================
# Feature / Target
# =========================

X = df.drop(columns=[

    "url",
    "green_label",
    "target",

    "co2",
    "scan_time",
    "performance_score",

    "page_size_mb",
    "heavy_js",
    "heavy_images"
])

y = df["target"]

feature_columns = X.columns.tolist()

print("\n===== FEATURES =====")
print(feature_columns)

# =========================
# Train / Validation / Test
# =========================

X_train, X_temp, y_train, y_temp = train_test_split(

    X,
    y,

    test_size=0.3,

    stratify=y,

    random_state=42
)

X_val, X_test, y_val, y_test = train_test_split(

    X_temp,
    y_temp,

    test_size=0.5,

    stratify=y_temp,

    random_state=42
)

print("\n===== DATA SPLIT =====")

print("Train:", X_train.shape)
print("Validation:", X_val.shape)
print("Test:", X_test.shape)

# =========================
# SMOTE ONLY TRAIN
# =========================

smote = SMOTE(
    random_state=42
)

X_train, y_train = smote.fit_resample(

    X_train,
    y_train
)

print("\n===== AFTER SMOTE =====")

print(
    pd.Series(y_train).value_counts()
)

# =========================
# Scaling
# =========================

scaler = StandardScaler()

X_train_scaled = scaler.fit_transform(
    X_train
)

X_val_scaled = scaler.transform(
    X_val
)

X_test_scaled = scaler.transform(
    X_test
)

# =========================
# XGBoost Model
# =========================

model = XGBClassifier(

    n_estimators=500,

    learning_rate=0.03,

    max_depth=5,

    min_child_weight=3,

    subsample=0.8,

    colsample_bytree=0.8,

    gamma=0.1,

    reg_alpha=0.1,

    reg_lambda=1,

    random_state=42,

    eval_metric="logloss"
)

# =========================
# Train Model
# =========================

model.fit(
    X_train,
    y_train
)

# =========================
# Validation Prediction
# =========================

y_val_prob = model.predict_proba(
    X_val
)[:, 1]

# =========================
# Threshold Tuning
# =========================

best_threshold = 0.5
best_f1 = 0

for t in np.arange(0.30, 0.71, 0.01):

    y_val_pred = (
        y_val_prob >= t
    ).astype(int)

    f1 = f1_score(

        y_val,
        y_val_pred,

        average="macro"
    )

    if f1 > best_f1:

        best_f1 = f1
        best_threshold = t

print("\n===== BEST THRESHOLD =====")

print("Threshold:", best_threshold)

print("Validation F1:", best_f1)

# =========================
# Final Validation Metrics
# =========================

y_val_pred = (
    y_val_prob >= best_threshold
).astype(int)

val_accuracy = accuracy_score(
    y_val,
    y_val_pred
)

val_f1 = f1_score(

    y_val,
    y_val_pred,

    average="macro"
)

val_auc = roc_auc_score(
    y_val,
    y_val_prob
)

print("\n===== VALIDATION RESULT =====")

print("Validation Accuracy:", val_accuracy)

print("Validation F1 Macro:", val_f1)

print("Validation ROC-AUC:", val_auc)

print(
    classification_report(
        y_val,
        y_val_pred
    )
)

# =========================
# Confusion Matrix
# =========================

cm = confusion_matrix(
    y_val,
    y_val_pred
)

print("\n===== CONFUSION MATRIX =====")

print(cm)

# =========================
# Combine Train + Validation
# =========================

X_full_train = pd.concat([
    pd.DataFrame(X_train),
    X_val
])

y_full_train = pd.concat([
    pd.Series(y_train),
    y_val
])

# =========================
# Retrain Final Model
# =========================

final_model = XGBClassifier(

    n_estimators=500,

    learning_rate=0.03,

    max_depth=5,

    min_child_weight=3,

    subsample=0.8,

    colsample_bytree=0.8,

    gamma=0.1,

    reg_alpha=0.1,

    reg_lambda=1,

    random_state=42,

    eval_metric="logloss"
)

final_model.fit(
    X_full_train,
    y_full_train
)

# =========================
# Final Test
# =========================

y_test_prob = final_model.predict_proba(
    X_test
)[:, 1]

y_test_pred = (
    y_test_prob >= best_threshold
).astype(int)

test_accuracy = accuracy_score(
    y_test,
    y_test_pred
)

test_f1 = f1_score(

    y_test,
    y_test_pred,

    average="macro"
)

test_auc = roc_auc_score(
    y_test,
    y_test_prob
)

print("\n===== FINAL TEST =====")

print("Test Accuracy:", test_accuracy)

print("Test F1 Macro:", test_f1)

print("Test ROC-AUC:", test_auc)

print(
    classification_report(
        y_test,
        y_test_pred
    )
)

# =========================
# ROC CURVE
# =========================

fpr, tpr, thresholds = roc_curve(
    y_test,
    y_test_prob
)

plt.figure(figsize=(8, 6))

plt.plot(
    fpr,
    tpr,
    label=f"AUC = {test_auc:.4f}"
)

plt.plot([0, 1], [0, 1], linestyle="--")

plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")

plt.title("ROC Curve")

plt.legend()

plt.savefig(
    "ml/roc_curve.png",
    bbox_inches="tight"
)

plt.close()

print("ROC Curve saved")

# =========================
# Feature Importance
# =========================

importance = pd.DataFrame({

    "feature": X.columns,

    "importance":
        model.feature_importances_
})

importance = importance.sort_values(

    by="importance",
    ascending=False
)

print("\n===== FEATURE IMPORTANCE =====")

print(importance)

# =========================
# Save Feature Importance
# =========================

importance.to_csv(

    "ml/feature_importance.csv",

    index=False
)

# =========================
# SHAP Explainability
# =========================

print("\n===== GENERATING SHAP =====")

explainer = shap.TreeExplainer(
    final_model
)

shap_values = explainer.shap_values(
    X_test
)

# =========================
# SHAP Summary Plot
# =========================

shap.summary_plot(

    shap_values,

    X_test,

    show=False
)

plt.savefig(

    "ml/shap_summary.png",

    bbox_inches="tight"
)

plt.close()

print("SHAP summary saved")

# =========================
# Save XGBoost Model
# =========================

final_model.save_model(
    "ml/xgboost_model.json"
)

# =========================
# Save Other Artifacts
# =========================

joblib.dump(

    scaler,

    "ml/scaler.pkl"
)

joblib.dump(

    label_encoders,

    "ml/label_encoders.pkl"
)

joblib.dump(

    feature_columns,

    "ml/feature_columns.pkl"
)

joblib.dump(

    best_threshold,

    "ml/best_threshold.pkl"
)

print("\n===== MODEL SAVED =====")

print("xgboost_model.json")
print("scaler.pkl")
print("label_encoders.pkl")
print("feature_columns.pkl")
print("best_threshold.pkl")

