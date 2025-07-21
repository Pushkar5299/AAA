import plotly.graph_objects as go
import numpy as np

# Data from the provided JSON - handling scale issue by showing relative performance
retailer_data = {
    "Product Browse": 713,  # This is number of products available
    "Order Process": 100, 
    "Account Mgmt": 95,
    "Order Track": 90
}

admin_data = {
    "Order Mgmt": 100,
    "User Admin": 98,
    "Inventory Ctrl": 95,
    "Business Analyt": 92
}

# Normalize the first value to make comparison meaningful
retailer_normalized = retailer_data.copy()
retailer_normalized["Product Browse"] = 100  # Normalize to 100 for visual comparison

# Create figure
fig = go.Figure()

# Add retailer functions (using cyan color)
fig.add_trace(go.Bar(
    y=list(retailer_normalized.keys()),
    x=list(retailer_normalized.values()),
    name='Retailer Portal',
    orientation='h',
    marker_color='#1FB8CD',
    text=[f"{v}%" if k != "Product Browse" else "713 Products" for k, v in retailer_data.items()],
    textposition='outside',
    textfont=dict(size=10)
))

# Add admin functions (using darker cyan color)  
fig.add_trace(go.Bar(
    y=list(admin_data.keys()),
    x=list(admin_data.values()),
    name='Admin Portal',
    orientation='h',
    marker_color='#5D878F',
    text=[f"{v}%" for v in admin_data.values()],
    textposition='outside',
    textfont=dict(size=10)
))

# Update layout
fig.update_layout(
    title="Arimed Pharma Portal - Feature Overview",
    xaxis_title="Capability %",
    yaxis_title="Portal Features",
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5),
    xaxis=dict(range=[0, 110])
)

# Save the chart
fig.write_image("arimed_pharma_features.png")