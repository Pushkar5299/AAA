# Format the product data for the web application
import json

# Clean and format the product data
df_clean = df.copy()

# Fill NaN values with empty strings for schemes
df_clean['Scm 2'] = df_clean['Scm 2'].fillna('')
df_clean['Scm 3'] = df_clean['Scm 3'].fillna('')

# Create a structured data format for the web application
products_data = []

for index, row in df_clean.iterrows():
    product = {
        "id": index + 1,
        "name": row['Product name'],
        "unit": row['Unit'],
        "company": row['Com'],
        "schemes": {
            "scheme1": row['Scm 1'] if pd.notna(row['Scm 1']) else '',
            "scheme2": row['Scm 2'] if row['Scm 2'] != '' else '',
            "scheme3": row['Scm 3'] if row['Scm 3'] != '' else ''
        },
        "quantity": int(row['Cl qty']),
        "category": "pharmaceutical"  # Default category
    }
    products_data.append(product)

# Create sample retailer data for demonstration
sample_retailers = [
    {
        "id": 1,
        "name": "MediCare Pharmacy",
        "email": "admin@medicare.com",
        "phone": "+91-9876543210",
        "address": "123 Medical Street, Mumbai, MH 400001",
        "license_number": "MH-LIC-2024-001",
        "status": "active"
    },
    {
        "id": 2,
        "name": "HealthPlus Stores",
        "email": "contact@healthplus.com", 
        "phone": "+91-9876543211",
        "address": "456 Wellness Avenue, Delhi, DL 110001",
        "license_number": "DL-LIC-2024-002",
        "status": "active"
    }
]

# Sample admin data
sample_admin = {
    "id": 1,
    "name": "Admin User",
    "email": "admin@arimedpharma.com",
    "role": "super_admin"
}

print(f"Total products formatted: {len(products_data)}")
print(f"Sample product structure:")
print(json.dumps(products_data[0], indent=2))

print(f"\nTop 10 companies by product count:")
company_counts = df_clean['Com'].value_counts().head(10)
print(company_counts.to_dict())

# Create the application data structure
app_data = {
    "products": products_data,
    "retailers": sample_retailers,
    "admin": sample_admin,
    "company_info": {
        "name": "Arimed Pharma LLP",
        "email": "arimedpharmallp@gmail.com",
        "phone": "+91-XXXXXXXXXX",
        "address": "Pharmaceutical Distribution Hub"
    }
}

# Save the data as JSON for the application
with open("arimed_pharma_data.json", "w") as f:
    json.dump(app_data, f, indent=2)

print("\nApplication data saved successfully!")
print(f"Data includes: {len(products_data)} products, {len(sample_retailers)} sample retailers")