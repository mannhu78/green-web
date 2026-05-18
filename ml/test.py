import pandas as pd

df = pd.read_csv("./crawler/dataset_final_cleaned.csv")

print(df.head())
print(df.shape)
print(df.info())

print(df.isnull().sum())
print(df.duplicated().sum())
print(df["green_label"].value_counts())

import seaborn as sns
import matplotlib.pyplot as plt

corr = df.corr(numeric_only=True)

plt.figure(figsize=(12,8))
sns.heatmap(corr, annot=True)
plt.show()

df.hist(figsize=(15,10))
plt.show()