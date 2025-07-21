import plotly.graph_objects as go
import plotly.express as px

# Create hierarchical data for treemap
labels = []
parents = []
values = []
colors = []

# Root level
labels.append("Arimed Portal")
parents.append("")
values.append(20)
colors.append("#1FB8CD")  # Strong cyan for main portal

# Level 1 - Portals
labels.append("Retailer")
parents.append("Arimed Portal")
values.append(8)
colors.append("#5D878F")  # Cyan for retailer

labels.append("Admin")
parents.append("Arimed Portal")
values.append(8)
colors.append("#ECEBD5")  # Light green for admin

# Level 2 - Retailer Portal features (abbreviated to 15 chars)
retailer_features = [
    "Product Cat", "Search", "Cart", "Orders",
    "History", "Schemes", "Profile", "Stock"
]
for feature in retailer_features:
    labels.append(feature)
    parents.append("Retailer")
    values.append(1)
    colors.append("#FFC185")  # Light orange for retailer features

# Level 2 - Admin Portal features (abbreviated to 15 chars)
admin_features = [
    "Order Mgmt", "User Mgmt", "Products", "Reports",
    "Email", "Stock Ctrl", "Approvals", "Dashboard"
]
for feature in admin_features:
    labels.append(feature)
    parents.append("Admin")
    values.append(1)
    colors.append("#D2BA4C")  # Moderate yellow for admin features

# Create treemap
fig = go.Figure(go.Treemap(
    labels=labels,
    parents=parents,
    values=values,
    branchvalues="total",
    marker=dict(
        colors=colors,
        line=dict(width=2, color="white")
    ),
    hovertemplate='<b>%{label}</b><br>Parent: %{parent}<br>Value: %{value}<extra></extra>',
    textinfo="label",
    textposition="middle center",
    textfont_size=11
))

# Update layout
fig.update_layout(
    title="Arimed Pharma App Structure",
    font_size=10,
)

# Save the chart
fig.write_image("arimed_pharma_structure.png")