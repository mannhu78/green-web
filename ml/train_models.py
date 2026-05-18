import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    roc_auc_score,
    confusion_matrix
)

from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier
)
from xgboost import XGBClassifier

from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE

from xgboost import XGBClassifier

from lightgbm import LGBMClassifier

from catboost import CatBoostClassifier

# =========================
# Load Data
# =========================

df = pd.read_csv(
    "./crawler/dataset_final_cleaned.csv"
)

# =========================
# Remove moderate
# =========================

df = df[
    df["green_label"] != "moderate"
]

# =========================
# Re-map target
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
# Encode categorical columns
# =========================

categorical_cols = [
    "category",
    "page_type",
    "device"
]

le_dict = {}

for col in categorical_cols:

    le = LabelEncoder()

    df[col] = le.fit_transform(df[col])

    le_dict[col] = le

# =========================
# Feature / Target
# =========================

X = df.drop(
    columns=[

        "url",
        "green_label",
        "target",
        "co2",
        "scan_time",
        "performance_score",

        "page_size_mb",
        "heavy_js",
        "heavy_images"
    ]
)

y = df["target"]

# =========================
# Split Train / Validation / Test
# =========================

# 70% train
# 30% temp

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.3,
    random_state=42,
    stratify=y
)

# 15% validation
# 15% test

X_val, X_test, y_val, y_test = train_test_split(
    X_temp,
    y_temp,
    test_size=0.5,
    random_state=42,
    stratify=y_temp
)

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
# Feature Scaling
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
# Models
# =========================

models = {

    "Logistic Regression":
        LogisticRegression(max_iter=500),

    "Decision Tree":
        DecisionTreeClassifier(
            random_state=42
        ),

    "Random Forest":
        RandomForestClassifier(

            n_estimators=300,

            max_depth=12,

            min_samples_split=5,

            min_samples_leaf=2,

            random_state=42,

            class_weight="balanced"
        ),

    "Gradient Boosting":
        GradientBoostingClassifier(
            random_state=42
        ),

    "KNN":
        KNeighborsClassifier(),

    "SVM":
        SVC(probability=True),

    # =========================
    # XGBoost
    # =========================

    "XGBoost":
    XGBClassifier(

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
    ),

    # =========================
    # LightGBM
    # =========================

    "LightGBM":
    LGBMClassifier(

        n_estimators=500,

        learning_rate=0.03,

        max_depth=8,

        num_leaves=50,

        min_child_samples=20,

        subsample=0.8,

        colsample_bytree=0.8,

        reg_alpha=0.5,

        reg_lambda=0.5,

        class_weight={
            0: 2,
            1: 1
        },

        force_col_wise=True,

        verbose=-1,

        random_state=42
    ),
    # =========================
    # CatBoost
    # =========================

    "CatBoost":
    CatBoostClassifier(

        iterations=500,

        learning_rate=0.03,

        depth=5,

        l2_leaf_reg=3,

        loss_function="Logloss",

        verbose=0,

        random_state=42
    )
}

# =========================
# Train & Validation
# =========================

results = []

best_model = None
best_f1 = 0

for name, model in models.items():

    print(f"\n========== {name} ==========")

    # =========================
    # Use Scaled Data
    # =========================

    if name in [
        "Logistic Regression",
        "KNN",
        "SVM"
    ]:

        model.fit(
            X_train_scaled,
            y_train
        )

        y_val_pred = model.predict(
            X_val_scaled
        )

    else:

        model.fit(
            X_train,
            y_train
        )

        y_prob = model.predict_proba(
            X_val
        )[:, 1]

        threshold = 0.45

        y_val_pred = (
            y_prob >= threshold
        ).astype(int)

    accuracy = accuracy_score(
    y_val,
    y_val_pred
    )

    f1 = f1_score(
        y_val,
        y_val_pred,
        average="macro"
    )

    if hasattr(model, "predict_proba"):

        if name in [
            "Logistic Regression",
            "KNN",
            "SVM"
        ]:

            y_prob = model.predict_proba(
                X_val_scaled
            )[:, 1]

        else:

            y_prob = model.predict_proba(
                X_val
            )[:, 1]

        auc = roc_auc_score(
            y_val,
            y_prob
        )

    else:

        auc = 0

    print("Validation Accuracy:", accuracy)

    print("Validation F1 Macro:", f1)

    print("Validation ROC-AUC:", auc)

    print(
        classification_report(
            y_val,
            y_val_pred
        )
    )

    results.append({

    "model": name,

    "validation_accuracy":
        accuracy,

    "validation_f1_macro":
        f1,

    "validation_auc":
        auc

})

    if f1 > best_f1:

        best_f1 = f1
        best_model = model
        best_model_name = name

# =========================
# Ranking
# =========================

results_df = pd.DataFrame(results)

print("\n===== MODEL RANKING =====")

print(
    results_df.sort_values(
    by="validation_f1_macro",
    ascending=False
    )
)

# =========================
# Train Best Model Again
# =========================

threshold = 0.45

if hasattr(best_model, "predict_proba"):

    if best_model_name in [
        "Logistic Regression",
        "KNN",
        "SVM"
    ]:

        y_prob = best_model.predict_proba(
            X_test_scaled
        )[:, 1]

    else:

        y_prob = best_model.predict_proba(
            X_test
        )[:, 1]

    y_test_pred = (
        y_prob >= threshold
    ).astype(int)

else:

    if best_model_name in [
        "Logistic Regression",
        "KNN",
        "SVM"
    ]:

        y_test_pred = best_model.predict(
            X_test_scaled
        )

    else:

        y_test_pred = best_model.predict(
            X_test
        )
# =========================
# Feature Importance
# =========================

if hasattr(best_model, "feature_importances_"):

    importance = pd.DataFrame({

        "feature": X.columns,

        "importance":
            best_model.feature_importances_

    })

    importance = importance.sort_values(
        by="importance",
        ascending=False
    )

    print("\n===== FEATURE IMPORTANCE =====")

    print(importance)

else:

    print(
        "\nModel này không hỗ trợ feature importance"
    )

# =========================
# Confusion Matrix
# =========================

from sklearn.metrics import confusion_matrix

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
# Refit scaler for full train
# =========================

scaler_full = StandardScaler()

X_full_train_scaled = scaler_full.fit_transform(
    X_full_train
)

X_test_scaled = scaler_full.transform(
    X_test
)

# =========================
# Retrain Best Model
# =========================

if best_model_name in [
    "Logistic Regression",
    "KNN",
    "SVM"
]:

    best_model.fit(
        X_full_train_scaled,
        y_full_train
    )

else:

    best_model.fit(
        X_full_train,
        y_full_train
    )

# =========================
# Final Test
# =========================

print(f"\n===== FINAL TEST: {best_model_name} =====")

threshold = 0.45

if hasattr(best_model, "predict_proba"):

    if best_model_name in [
        "Logistic Regression",
        "KNN",
        "SVM"
    ]:

        y_prob = best_model.predict_proba(
            X_test_scaled
        )[:, 1]

    else:

        y_prob = best_model.predict_proba(
            X_test
        )[:, 1]

    y_test_pred = (
        y_prob >= threshold
    ).astype(int)

else:

    if best_model_name in [
        "Logistic Regression",
        "KNN",
        "SVM"
    ]:

        y_test_pred = best_model.predict(
            X_test_scaled
        )

    else:

        y_test_pred = best_model.predict(
            X_test
        )

# =========================
# Metrics
# =========================

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
    y_prob
)

print("Test Accuracy:", test_accuracy)

print("Test F1 Macro:", test_f1)

print("Test ROC-AUC:", test_auc)

print(
    classification_report(
        y_test,
        y_test_pred
    )
)