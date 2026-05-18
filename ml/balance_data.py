import pandas as pd

df = pd.read_csv("./crawler/dataset_final_cleaned.csv")

# =========================
# Remove moderate
# =========================

df = df[
    df["green_label"] != "moderate"
]

print(df["green_label"].value_counts())

from sklearn.utils import resample

# =========================
# Separate classes
# =========================

green_df = df[
    df["green_label"] == "green"
]

heavy_df = df[
    df["green_label"] == "heavy"
]

# =========================
# Downsample heavy
# =========================

heavy_downsampled = resample(
    heavy_df,
    replace=False,
    n_samples=len(green_df),
    random_state=42
)

# =========================
# Combine
# =========================

balanced_df = pd.concat([
    green_df,
    heavy_downsampled
])

# Shuffle
balanced_df = balanced_df.sample(
    frac=1,
    random_state=42
)

print(
    balanced_df["green_label"]
    .value_counts()
)

# Save
balanced_df.to_csv(
    "balanced_dataset.csv",
    index=False
)