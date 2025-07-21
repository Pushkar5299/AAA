// Arimed Pharma Application JavaScript

// Application State
let currentUser = null;
let currentUserType = null;
let cart = [];
let orders = [];
let products = [];
let retailers = [];
let currentOrderId = 1;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeEventListeners();
    loadData();
    showPage('home-page');
});

// Initialize Event Listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Navigation - Using event delegation and direct binding
    bindEvent('retailer-login-btn', 'click', () => {
        console.log('Retailer login clicked');
        showPage('retailer-auth-page');
    });
    
    bindEvent('admin-login-btn', 'click', () => {
        console.log('Admin login clicked');
        showPage('admin-auth-page');
    });
    
    bindEvent('hero-retailer-btn', 'click', () => {
        console.log('Hero retailer clicked');
        showPage('retailer-auth-page');
    });
    
    bindEvent('hero-admin-btn', 'click', () => {
        console.log('Hero admin clicked');
        showPage('admin-auth-page');
    });
    
    bindEvent('logout-btn', 'click', logout);

    // Auth tabs
    bindEvent('retailer-login-tab', 'click', () => showAuthTab('login'));
    bindEvent('retailer-signup-tab', 'click', () => showAuthTab('signup'));

    // Forms
    bindEvent('retailer-login-form', 'submit', handleRetailerLogin);
    bindEvent('retailer-signup-form', 'submit', handleRetailerSignup);
    bindEvent('admin-login-form', 'submit', handleAdminLogin);

    // Dashboard tabs
    bindEvent('products-tab', 'click', () => showDashboardSection('products'));
    bindEvent('cart-tab', 'click', () => showDashboardSection('cart'));
    bindEvent('orders-tab', 'click', () => showDashboardSection('orders'));
    bindEvent('schemes-tab', 'click', () => showDashboardSection('schemes'));

    // Admin dashboard tabs
    bindEvent('admin-orders-tab', 'click', () => showAdminSection('orders'));
    bindEvent('admin-retailers-tab', 'click', () => showAdminSection('retailers'));
    bindEvent('admin-products-tab', 'click', () => showAdminSection('products'));
    bindEvent('admin-reports-tab', 'click', () => showAdminSection('reports'));

    // Search and filters
    bindEvent('product-search', 'input', filterProducts);
    bindEvent('company-filter', 'change', filterProducts);
    bindEvent('scheme-filter', 'change', filterProducts);

    // Cart and orders
    bindEvent('place-order-btn', 'click', placeOrder);

    // Modal
    bindEvent('close-modal', 'click', closeOrderModal);
    
    const orderModal = document.getElementById('order-modal');
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === this) closeOrderModal();
        });
    }
}

// Helper function to safely bind events
function bindEvent(elementId, eventType, handler) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener(eventType, handler);
        console.log(`Bound ${eventType} event to ${elementId}`);
    } else {
        console.warn(`Element ${elementId} not found`);
    }
}

// Load initial data
async function loadData() {
    console.log('Loading data...');
    try {
        const response = await fetch('https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/052512f3a2e432f3db2d91cbee599bd1/81fdd789-24be-4e8a-a119-c5e719891a10/9ac0c500.json');
        const data = await response.json();
        
        products = data.products || [];
        retailers = data.retailers || [];
        orders = data.orders || [];
        
        console.log(`Loaded ${products.length} products, ${retailers.length} retailers`);
    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback data
        products = [
            {
                id: 1, name: "1 AL 5MG TAB", unit: "10T", company: "FDC",
                schemes: { scheme1: "7+1", scheme2: "12+2", scheme3: "" },
                quantity: 269, category: "pharmaceutical"
            },
            {
                id: 2, name: "AZEE 250 TAB", unit: "10T", company: "CIP",
                schemes: { scheme1: "10+3", scheme2: "4+1", scheme3: "" },
                quantity: 370, category: "pharmaceutical"
            },
            {
                id: 3, name: "CALPOL 500MG TAB", unit: "15T", company: "GSK",
                schemes: { scheme1: "5+1", scheme2: "", scheme3: "" },
                quantity: 823, category: "pharmaceutical"
            },
            {
                id: 4, name: "DOLO 650", unit: "15T", company: "MIC",
                schemes: { scheme1: "3+1", scheme2: "11+4", scheme3: "" },
                quantity: 350, category: "pharmaceutical"
            },
            {
                id: 5, name: "PAN 40 TAB", unit: "15T", company: "ALK",
                schemes: { scheme1: "11+1", scheme2: "", scheme3: "" },
                quantity: 474, category: "pharmaceutical"
            }
        ];
        retailers = [
            {
                id: 1, name: "MediCare Pharmacy", email: "admin@medicare.com",
                phone: "+91-9876543210", address: "123 Medical Street, Mumbai",
                license_number: "MH-LIC-2024-001", status: "active"
            },
            {
                id: 2, name: "HealthPlus Stores", email: "contact@healthplus.com",
                phone: "+91-9876543211", address: "456 Wellness Avenue, Delhi",
                license_number: "DL-LIC-2024-002", status: "active"
            }
        ];
        console.log('Using fallback data');
    }
    
    populateCompanyFilter();
    renderProducts();
    updateCartDisplay();
}

// Page Navigation
function showPage(pageId) {
    console.log(`Showing page: ${pageId}`);
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.style.display = 'block';
        console.log(`Successfully showed page: ${pageId}`);
    } else {
        console.error(`Page not found: ${pageId}`);
    }
    
    updateNavigation();
}

function updateNavigation() {
    // Update navigation visibility based on user state
    const userInfo = document.getElementById('user-info');
    const loginActions = document.getElementById('login-actions');
    const username = document.getElementById('username');
    
    if (currentUser) {
        if (userInfo) userInfo.classList.remove('hidden');
        if (loginActions) loginActions.classList.add('hidden');
        if (username) username.textContent = currentUser.name;
    } else {
        if (userInfo) userInfo.classList.add('hidden');
        if (loginActions) loginActions.classList.remove('hidden');
    }
}

function showAuthTab(type) {
    const loginTab = document.getElementById('retailer-login-tab');
    const signupTab = document.getElementById('retailer-signup-tab');
    const loginForm = document.getElementById('retailer-login-form');
    const signupForm = document.getElementById('retailer-signup-form');

    if (type === 'login') {
        if (loginTab) loginTab.classList.add('active');
        if (signupTab) signupTab.classList.remove('active');
        if (loginForm) loginForm.classList.remove('hidden');
        if (signupForm) signupForm.classList.add('hidden');
    } else {
        if (loginTab) loginTab.classList.remove('active');
        if (signupTab) signupTab.classList.add('active');
        if (loginForm) loginForm.classList.add('hidden');
        if (signupForm) signupForm.classList.remove('hidden');
    }
}

// Authentication
function handleRetailerLogin(e) {
    e.preventDefault();
    console.log('Handling retailer login');
    
    const email = e.target.querySelector('input[type="email"]').value;
    console.log('Login email:', email);
    
    // Demo login - accept any email
    const retailer = retailers.find(r => r.email === email) || {
        id: Date.now(),
        name: email.split('@')[0] + ' Pharmacy',
        email: email,
        status: 'active'
    };
    
    currentUser = retailer;
    currentUserType = 'retailer';
    
    console.log('Login successful for:', currentUser);
    showPage('retailer-dashboard');
    showNotification('Login successful!', 'success');
    loadRetailerData();
}

function handleRetailerSignup(e) {
    e.preventDefault();
    console.log('Handling retailer signup');
    
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    const formData = {};
    
    inputs.forEach((input, index) => {
        switch (input.type) {
            case 'text':
                if (index === 0) formData.name = input.value;
                else formData.license = input.value;
                break;
            case 'email':
                formData.email = input.value;
                break;
            case 'tel':
                formData.phone = input.value;
                break;
        }
    });
    
    const textarea = form.querySelector('textarea');
    if (textarea) formData.address = textarea.value;
    
    const newRetailer = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        license_number: formData.license,
        status: 'pending'
    };
    
    retailers.push(newRetailer);
    showNotification('Registration successful! Please wait for admin approval.', 'success');
    showAuthTab('login');
}

function handleAdminLogin(e) {
    e.preventDefault();
    console.log('Handling admin login');
    
    currentUser = { name: 'Admin User', email: 'admin@arimedpharma.com' };
    currentUserType = 'admin';
    
    console.log('Admin login successful');
    showPage('admin-dashboard');
    showNotification('Admin login successful!', 'success');
    loadAdminData();
}

function logout() {
    console.log('Logging out');
    currentUser = null;
    currentUserType = null;
    cart = [];
    showPage('home-page');
    showNotification('Logged out successfully', 'info');
}

// Dashboard Navigation
function showDashboardSection(section) {
    console.log(`Showing dashboard section: ${section}`);
    
    document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
    
    const sectionTab = document.getElementById(`${section}-tab`);
    const sectionElement = document.getElementById(`${section}-section`);
    
    if (sectionTab) sectionTab.classList.add('active');
    if (sectionElement) sectionElement.classList.add('active');
    
    // Load section-specific content
    switch (section) {
        case 'orders':
            renderOrders();
            break;
        case 'schemes':
            renderSchemes();
            break;
        case 'cart':
            renderCart();
            break;
        case 'products':
            renderProducts();
            break;
    }
}

function showAdminSection(section) {
    console.log(`Showing admin section: ${section}`);
    
    document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.remove('active'));
    
    const sectionTab = document.getElementById(`admin-${section}-tab`);
    const sectionElement = document.getElementById(`admin-${section}-section`);
    
    if (sectionTab) sectionTab.classList.add('active');
    if (sectionElement) sectionElement.classList.add('active');
    
    // Load section-specific content
    switch (section) {
        case 'orders':
            renderAdminOrders();
            break;
        case 'retailers':
            renderAdminRetailers();
            break;
        case 'products':
            renderAdminProducts();
            break;
        case 'reports':
            renderAdminReports();
            break;
    }
}

// Product Management
function populateCompanyFilter() {
    const companies = [...new Set(products.map(p => p.company))].sort();
    const select = document.getElementById('company-filter');
    if (select) {
        select.innerHTML = '<option value="">All Companies</option>';
        companies.forEach(company => {
            select.innerHTML += `<option value="${company}">${company}</option>`;
        });
    }
}

function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    const filteredProducts = getFilteredProducts();
    console.log(`Rendering ${filteredProducts.length} products`);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No products found</h3><p>Try adjusting your search or filters</p></div>';
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-header">
                <h3 class="product-name">${product.name}</h3>
                <span class="stock-status ${getStockStatus(product.quantity)}">${getStockLabel(product.quantity)}</span>
            </div>
            <div class="product-details">
                <div class="product-meta">
                    <span><strong>Unit:</strong> ${product.unit}</span>
                    <span><strong>Company:</strong> ${product.company}</span>
                </div>
                <div class="product-meta">
                    <span><strong>Stock:</strong> ${product.quantity}</span>
                </div>
                ${renderProductSchemes(product.schemes)}
            </div>
            <div class="product-actions">
                <input type="number" class="form-control quantity-input" min="1" max="${product.quantity}" value="1" id="qty-${product.id}">
                <button class="btn btn--primary" onclick="addToCart(${product.id})" ${product.quantity === 0 ? 'disabled' : ''}>
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function renderProductSchemes(schemes) {
    const activeSchemes = Object.values(schemes).filter(scheme => scheme && scheme.trim());
    if (activeSchemes.length === 0) return '';
    
    return `
        <div class="product-schemes">
            ${activeSchemes.map(scheme => `<span class="scheme-badge">${scheme}</span>`).join('')}
        </div>
    `;
}

function getStockStatus(quantity) {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 50) return 'low-stock';
    return 'in-stock';
}

function getStockLabel(quantity) {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 50) return 'Low Stock';
    return 'In Stock';
}

function filterProducts() {
    renderProducts();
}

function getFilteredProducts() {
    const searchEl = document.getElementById('product-search');
    const companyEl = document.getElementById('company-filter');
    const schemeEl = document.getElementById('scheme-filter');
    
    const search = searchEl ? searchEl.value.toLowerCase() : '';
    const company = companyEl ? companyEl.value : '';
    const schemeFilter = schemeEl ? schemeEl.value : '';
    
    return products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(search) || 
                            product.company.toLowerCase().includes(search);
        const matchesCompany = !company || product.company === company;
        
        let matchesScheme = true;
        if (schemeFilter === 'with-scheme') {
            matchesScheme = Object.values(product.schemes).some(scheme => scheme && scheme.trim());
        } else if (schemeFilter === 'no-scheme') {
            matchesScheme = !Object.values(product.schemes).some(scheme => scheme && scheme.trim());
        }
        
        return matchesSearch && matchesCompany && matchesScheme;
    });
}

// Cart Management
function addToCart(productId) {
    console.log('Adding product to cart:', productId);
    
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
    
    if (!product || quantity <= 0 || quantity > product.quantity) {
        showNotification('Invalid quantity', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity + quantity <= product.quantity) {
            existingItem.quantity += quantity;
        } else {
            showNotification('Not enough stock available', 'error');
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: product.name,
            unit: product.unit,
            company: product.company,
            quantity: quantity
        });
    }
    
    updateCartDisplay();
    showNotification(`Added ${product.name} to cart`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    renderCart();
    showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    const qty = parseInt(newQuantity);
    
    if (qty <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (qty > product.quantity) {
        showNotification('Not enough stock available', 'error');
        return;
    }
    
    item.quantity = qty;
    updateCartDisplay();
    renderCart();
}

function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (cartCountEl) cartCountEl.textContent = cartCount;
    if (cartTotalEl) cartTotalEl.textContent = cartCount;
    
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Your cart is empty</h3><p>Add some products to get started</p></div>';
        return;
    }
    
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-meta">
                    Unit: ${item.unit} | Company: ${item.company}
                </div>
            </div>
            <div class="cart-item-actions">
                <input type="number" class="form-control quantity-input" min="1" value="${item.quantity}" 
                       onchange="updateCartQuantity(${item.id}, this.value)">
                <button class="btn btn--outline btn--sm" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
}

// Order Management
function placeOrder() {
    console.log('Placing order');
    
    if (cart.length === 0) {
        showNotification('Cart is empty', 'error');
        return;
    }
    
    const order = {
        id: currentOrderId++,
        retailer_id: currentUser.id,
        retailer_name: currentUser.name,
        items: [...cart],
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        total_items: cart.reduce((total, item) => total + item.quantity, 0)
    };
    
    orders.push(order);
    
    // Update product quantities
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.quantity = Math.max(0, product.quantity - cartItem.quantity);
        }
    });
    
    // Show order confirmation
    showOrderConfirmation(order);
    
    // Send email notification (simulated)
    sendOrderNotification(order);
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    
    showNotification('Order placed successfully!', 'success');
}

function showOrderConfirmation(order) {
    const content = `
        <div class="order-confirmation">
            <h3>Order #${order.id} Confirmed</h3>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Retailer:</strong> ${order.retailer_name}</p>
            <p><strong>Total Items:</strong> ${order.total_items}</p>
            
            <h4>Items Ordered:</h4>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.unit})</span>
                        <span>Qty: ${item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-note" style="margin-top: 20px; padding: 16px; background-color: var(--color-bg-3); border-radius: var(--radius-base);">
                <strong>✓ Order notification sent to arimedpharmallp@gmail.com</strong>
                <p>Your order will be processed shortly.</p>
            </div>
        </div>
    `;
    
    const confirmationEl = document.getElementById('order-confirmation-content');
    const modalEl = document.getElementById('order-modal');
    
    if (confirmationEl) confirmationEl.innerHTML = content;
    if (modalEl) modalEl.classList.add('show');
}

function sendOrderNotification(order) {
    // Simulate email notification
    console.log('📧 Email sent to arimedpharmallp@gmail.com:');
    console.log('Order Details:', order);
    
    showNotification(`Order notification sent to arimedpharmallp@gmail.com`, 'info');
}

function closeOrderModal() {
    const modalEl = document.getElementById('order-modal');
    if (modalEl) modalEl.classList.remove('show');
}

// Admin and Retailer Data Loading
function loadRetailerData() {
    console.log('Loading retailer dashboard data');
    renderProducts();
    updateCartDisplay();
}

function loadAdminData() {
    console.log('Loading admin dashboard data');
    renderAdminOrders();
    renderAdminRetailers();
    renderAdminProducts();
    renderAdminReports();
}

// Render Functions
function renderOrders() {
    const container = document.getElementById('orders-list');
    if (!container) return;
    
    const userOrders = orders.filter(order => order.retailer_id === currentUser.id);
    
    if (userOrders.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No orders yet</h3><p>Your orders will appear here once you place them</p></div>';
        return;
    }
    
    container.innerHTML = userOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="status status--${order.status}">${order.status.toUpperCase()}</div>
                <div class="order-date">${order.date}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.unit})</span>
                        <span>Qty: ${item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-summary">
                <strong>Total Items: ${order.total_items}</strong>
            </div>
        </div>
    `).join('');
}

function renderSchemes() {
    const container = document.getElementById('schemes-list');
    if (!container) return;
    
    const activeSchemes = new Set();
    
    products.forEach(product => {
        Object.values(product.schemes).forEach(scheme => {
            if (scheme && scheme.trim()) {
                activeSchemes.add(scheme);
            }
        });
    });
    
    if (activeSchemes.size === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No active schemes</h3><p>Check back later for promotional offers</p></div>';
        return;
    }
    
    container.innerHTML = Array.from(activeSchemes).map(scheme => `
        <div class="scheme-card">
            <h3>Special Offer</h3>
            <div class="scheme-offer">${scheme}</div>
            <p>Buy ${scheme.split('+')[0]} get ${scheme.split('+')[1]} free!</p>
        </div>
    `).join('');
}

function renderAdminOrders() {
    const container = document.getElementById('admin-orders-list');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No orders</h3><p>Orders from retailers will appear here</p></div>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="admin-order-card">
            <div class="order-header">
                <div class="order-id">Order #${order.id}</div>
                <div class="status status--${order.status}">${order.status.toUpperCase()}</div>
                <div class="order-date">${order.date}</div>
            </div>
            <div class="order-details">
                <p><strong>Retailer:</strong> ${order.retailer_name}</p>
                <p><strong>Total Items:</strong> ${order.total_items}</p>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} (${item.unit})</span>
                        <span>Qty: ${item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="admin-order-actions">
                <button class="btn btn--primary btn--sm" onclick="updateOrderStatus(${order.id}, 'processing')">Process</button>
                <button class="btn btn--secondary btn--sm" onclick="updateOrderStatus(${order.id}, 'shipped')">Ship</button>
                <button class="btn btn--outline btn--sm" onclick="updateOrderStatus(${order.id}, 'delivered')">Deliver</button>
            </div>
        </div>
    `).join('');
}

function renderAdminRetailers() {
    const container = document.getElementById('admin-retailers-list');
    if (!container) return;
    
    container.innerHTML = retailers.map(retailer => `
        <div class="retailer-card">
            <h3>${retailer.name}</h3>
            <div class="retailer-details">
                <p><strong>Email:</strong> ${retailer.email}</p>
                <p><strong>Phone:</strong> ${retailer.phone || 'N/A'}</p>
                <p><strong>License:</strong> ${retailer.license_number}</p>
                <p><strong>Status:</strong> <span class="status status--${retailer.status}">${retailer.status.toUpperCase()}</span></p>
            </div>
            <div class="retailer-actions">
                ${retailer.status === 'pending' ? 
                    `<button class="btn btn--primary btn--sm" onclick="approveRetailer(${retailer.id})">Approve</button>
                     <button class="btn btn--outline btn--sm" onclick="rejectRetailer(${retailer.id})">Reject</button>` :
                    `<button class="btn btn--secondary btn--sm" onclick="toggleRetailerStatus(${retailer.id})">
                        ${retailer.status === 'active' ? 'Deactivate' : 'Activate'}
                     </button>`
                }
            </div>
        </div>
    `).join('');
}

function renderAdminProducts() {
    const container = document.getElementById('admin-products-list');
    if (!container) return;
    
    const displayProducts = products.slice(0, 20);
    
    container.innerHTML = `
        <div class="products-grid">
            ${displayProducts.map(product => `
                <div class="product-card">
                    <div class="product-header">
                        <h4>${product.name}</h4>
                        <span class="stock-status ${getStockStatus(product.quantity)}">${product.quantity} units</span>
                    </div>
                    <div class="product-details">
                        <p><strong>Company:</strong> ${product.company}</p>
                        <p><strong>Unit:</strong> ${product.unit}</p>
                        ${renderProductSchemes(product.schemes)}
                    </div>
                </div>
            `).join('')}
        </div>
        <p style="text-align: center; margin-top: 20px; color: var(--color-text-secondary);">
            Showing ${displayProducts.length} of ${products.length} total products
        </p>
    `;
}

function renderAdminReports() {
    const totalOrders = orders.length;
    const activeRetailers = retailers.filter(r => r.status === 'active').length;
    const productsInStock = products.filter(p => p.quantity > 0).length;
    
    const totalOrdersEl = document.getElementById('total-orders');
    const activeRetailersEl = document.getElementById('active-retailers');
    const productsInStockEl = document.getElementById('products-in-stock');
    
    if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
    if (activeRetailersEl) activeRetailersEl.textContent = activeRetailers;
    if (productsInStockEl) productsInStockEl.textContent = productsInStock;
}

// Admin Actions
function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        renderAdminOrders();
        showNotification(`Order #${orderId} status updated to ${status}`, 'success');
    }
}

function approveRetailer(retailerId) {
    const retailer = retailers.find(r => r.id === retailerId);
    if (retailer) {
        retailer.status = 'active';
        renderAdminRetailers();
        showNotification(`${retailer.name} approved successfully`, 'success');
    }
}

function rejectRetailer(retailerId) {
    const retailer = retailers.find(r => r.id === retailerId);
    if (retailer) {
        retailer.status = 'rejected';
        renderAdminRetailers();
        showNotification(`${retailer.name} rejected`, 'info');
    }
}

function toggleRetailerStatus(retailerId) {
    const retailer = retailers.find(r => r.id === retailerId);
    if (retailer) {
        retailer.status = retailer.status === 'active' ? 'inactive' : 'active';
        renderAdminRetailers();
        showNotification(`${retailer.name} status updated`, 'success');
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
    `;
    
    const notificationsEl = document.getElementById('notifications');
    if (notificationsEl) {
        notificationsEl.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Global functions for inline onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.updateOrderStatus = updateOrderStatus;
window.approveRetailer = approveRetailer;
window.rejectRetailer = rejectRetailer;
window.toggleRetailerStatus = toggleRetailerStatus;