import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import (
    LabelEncoder,
    StandardScaler
)
from sklearn.model_selection import GridSearchCV

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

from imblearn.over_sampling import SMOTE



# =========================
# Load Dataset
# =========================

df = pd.read_csv(
    "./crawler/dataset_final_cleaned.csv"
)

# =========================
# Remove Moderate Label
# =========================

df = df[
    df["green_label"] != "moderate"
]

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

X = df.drop(
    columns=[
        "url",
        "green_label",
        "target",
        "co2",
        "scan_time",
        "performance_score"
    ]
)

y = df["target"]

# =========================
# Split Data
# =========================

X_train, X_temp, y_train, y_temp = train_test_split(
    X,
    y,
    test_size=0.3,
    random_state=42,
    stratify=y
)

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
# Balance Train Data
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
# Random Forest Model
# =========================
rf = RandomForestClassifier(
    random_state=42
)

param_grid = {

    "n_estimators": [100, 200, 300],

    "max_depth": [8, 12, 16],

    "min_samples_split": [2, 5, 10],

    "min_samples_leaf": [1, 2, 4],

    "max_features": [
        "sqrt",
        "log2"
    ]
}

grid_search = GridSearchCV(

    estimator=rf,

    param_grid=param_grid,

    cv=5,

    scoring="accuracy",

    n_jobs=-1,

    verbose=2
)

grid_search.fit(
    X_train,
    y_train
)

model = grid_search.best_estimator_

print("\n===== BEST PARAMETERS =====")

print(
    grid_search.best_params_
)

# =========================
# Train Model
# =========================

model.fit(
    X_train,
    y_train
)

# =========================
# Validation
# =========================

y_val_pred = model.predict(
    X_val
)

val_accuracy = accuracy_score(
    y_val,
    y_val_pred
)

print("\n===== VALIDATION =====")

print(
    "Validation Accuracy:",
    val_accuracy
)

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
# Final Test
# =========================

y_test_pred = model.predict(
    X_test
)

test_accuracy = accuracy_score(
    y_test,
    y_test_pred
)

print("\n===== FINAL TEST =====")

print(
    "Test Accuracy:",
    test_accuracy
)

print(
    classification_report(
        y_test,
        y_test_pred
    )
)

# =========================
# Save Model
# =========================

joblib.dump(
    model,
    "random_forest_model.pkl"
)

joblib.dump(
    label_encoders,
    "label_encoders.pkl"
)

print("\nModel saved successfully!")