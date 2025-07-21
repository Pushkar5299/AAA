import pandas as pd

# Load the product data
df = pd.read_excel("ARIMED-PHARMA-SCHEME-1.xlsx", sheet_name="Report")

# Display basic information about the dataset
print("Dataset Overview:")
print(f"Total products: {len(df)}")
print(f"Columns: {list(df.columns)}")
print("\nFirst few rows:")
print(df.head())

print("\nColumn details:")
for col in df.columns:
    print(f"- {col}: {df[col].dtype}")
    
print("\nUnique companies:")
print(df['Com'].value_counts().head(10))

print("\nSample scheme data:")
print("Scheme 1 patterns:", df['Scm 1'].value_counts().head(5))
print("Scheme 2 patterns:", df['Scm 2'].value_counts().head(5))
print("Scheme 3 patterns:", df['Scm 3'].value_counts().head(5))