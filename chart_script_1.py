import plotly.graph_objects as go

# Hierarchical data
labels = [
    "ArimedPharma",       # root
    "Stats", "713 Prods", "5+ Firms", "B2B Secure",
    "Retailer", "ProdSearch", "OrderPlace", "OrderTrack", "StockInfo", "MobileUI", "AuthSystem",
    "Admin", "OrderMgmt", "AccAdmin", "InvCtrl", "Analytics", "EmailSys", "UsrApprove",
    "CoreTech", "Auth", "EmailNotify", "Realtime", "Responsive", "DataSecure"
]

parents = [
    "",                   # root has no parent
    "ArimedPharma", "Stats", "Stats", "Stats",            # Stats branch
    "ArimedPharma", "Retailer", "Retailer", "Retailer", "Retailer", "Retailer", "Retailer",  # Retailer branch
    "ArimedPharma", "Admin", "Admin", "Admin", "Admin", "Admin", "Admin",                 # Admin branch
    "ArimedPharma", "CoreTech", "CoreTech", "CoreTech", "CoreTech", "CoreTech"                # CoreTech branch
]

# Assign values so each parent equals sum(children)
values = [20,            # root total
          3, 1, 1, 1,    # Stats and leaves
          6, 1, 1, 1, 1, 1, 1,  # Retailer and leaves
          6, 1, 1, 1, 1, 1, 1,  # Admin and leaves
          5, 1, 1, 1, 1, 1      # CoreTech and leaves
]

colors = [
    "#1FB8CD",  # root
    "#FFC185", "#ECEBD5", "#5D878F", "#D2BA4C",
    "#FFC185", "#ECEBD5", "#5D878F", "#D2BA4C", "#B4413C", "#964325", "#944454",
    "#FFC185", "#ECEBD5", "#5D878F", "#D2BA4C", "#B4413C", "#964325", "#944454",
    "#FFC185", "#ECEBD5", "#5D878F", "#D2BA4C", "#B4413C", "#964325"
]

fig = go.Figure(go.Treemap(
    labels=labels,
    parents=parents,
    values=values,
    branchvalues="total",
    marker=dict(colors=colors, line=dict(color="white", width=2)),
    textinfo="label",
    textfont_size=12
))

fig.update_layout(title="Arimed Pharma Architecture")

fig.write_image("arimed_pharma_architecture.png")