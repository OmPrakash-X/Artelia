// Global variables
let totalRevenue = 0;
let orderCount = 0;
let defaultProductImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNSIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
let defaultProfileImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzU1NSIgcng9IjEwMCIgcnk9IjEwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI3MCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlVTPC90ZXh0Pjwvc3ZnPg==';
let notifications = [];
let currentPeriod = 'today';
let filteredNotifications = [];

// Toggle sidebar visibility for mobile view
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("visible");
    document.getElementById("sidebar-overlay").classList.toggle("active");
    
    // Prevent scrolling of body when sidebar is open on mobile
    if (document.getElementById("sidebar").classList.contains("visible")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
}

// Show different sections based on navigation
function showSection(section) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });
    document.getElementById(section).classList.add("active");
    
    // If on mobile, close the sidebar
    if (window.innerWidth <= 768) {
        document.getElementById("sidebar").classList.remove("visible");
        document.getElementById("sidebar-overlay").classList.remove("active");
        document.body.style.overflow = "auto";
    }
    
    // Reload products when switching to the products section
    if (section === 'products') {
        loadProducts();
    }
    
    // Refresh dashboard data when switching to dashboard
    if (section === 'dashboard') {
        updateDashboardByTimePeriod(currentPeriod);
    }
    
    // Load profile data when switching to account section
    if (section === 'account') {
        loadProfileData();
    }
}

// Show different account subsections
function showAccountSubsection(subsection) {
    // Update navigation active state
    document.querySelectorAll(".account-nav-item").forEach(item => {
        item.classList.remove("active");
    });
    document.querySelector(`.account-nav-item[onclick="showAccountSubsection('${subsection}')"]`).classList.add("active");
    
    // Show the selected subsection
    document.querySelectorAll(".account-subsection").forEach(section => {
        section.classList.remove("active");
    });
    document.getElementById(subsection).classList.add("active");
}

// Load profile data from localStorage
function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem("profileData")) || {
        fullName: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        companyName: "Artelia Gallery",
        bio: "Art dealer specializing in fine art and collectibles with over 10 years of experience in the industry.",
        profileImage: localStorage.getItem("profileImage") || defaultProfileImage
    };
    
    // Set form field values
    document.getElementById("fullName").value = profileData.fullName;
    document.getElementById("email").value = profileData.email;
    document.getElementById("phone").value = profileData.phone;
    document.getElementById("companyName").value = profileData.companyName;
    document.getElementById("bio").value = profileData.bio;
    
    // Set profile image
    document.getElementById("userProfileImage").src = profileData.profileImage;
}

// Save profile data to localStorage
function saveProfileData(event) {
    event.preventDefault();
    
    const profileData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        companyName: document.getElementById("companyName").value,
        bio: document.getElementById("bio").value,
        profileImage: document.getElementById("userProfileImage").src
    };
    
    localStorage.setItem("profileData", JSON.stringify(profileData));
    alert("Profile information saved successfully!");
}

// Load products from localStorage to display in the grid
function loadProducts() {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = '';
    
    const products = JSON.parse(localStorage.getItem("products")) || [];
    document.getElementById("product-count").textContent = products.length;
    
    if (products.length === 0) {
        productsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">No products yet. Add your first product!</p>';
        return;
    }
    
    products.forEach((product, index) => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        
        // Truncate description for display
        const shortDesc = product.description.length > 80 
            ? product.description.substring(0, 80) + '...' 
            : product.description;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='${defaultProductImage}'">
            <div class="product-details">
                <h3>${product.name}</h3>
                <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
                <p>${shortDesc}</p>
                <span class="product-category">${formatCategory(product.category)}</span>
                <div class="product-actions">
                    <button class="action-btn sell-btn" onclick="sellProduct(${index})">Sell</button>
                    <button class="action-btn edit-btn" onclick="editProduct(${index})">Edit</button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${index})">Delete</button>
                </div>
            </div>
        `;
        productsContainer.appendChild(productCard);
    });
}

// Format category name for display (e.g., "fine-art" -> "Fine Art")
function formatCategory(category) {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// Handle selling a product
function sellProduct(productIndex) {
    // Get the product data
    const products = JSON.parse(localStorage.getItem("products")) || [];
    if (products[productIndex]) {
        const product = products[productIndex];
        
        // Add to total revenue
        totalRevenue += parseFloat(product.price);
        
        // Increment order count
        orderCount++;
        
        // Create a notification
        const now = new Date();
        const timeStr = now.toLocaleTimeString();
        const notification = {
            productName: product.name,
            price: product.price,
            time: timeStr,
            date: now.toISOString()
        };
        
        // Add to notifications and save to localStorage
        notifications.unshift(notification);
        localStorage.setItem("notifications", JSON.stringify(notifications));
        localStorage.setItem("totalRevenue", totalRevenue);
        localStorage.setItem("orderCount", orderCount);
        
        // Update dashboard based on current time filter
        updateDashboardByTimePeriod(currentPeriod);
        
        // Show success message
        alert(`Product "${product.name}" sold for $${parseFloat(product.price).toFixed(2)}!`);
        
        // Navigate to dashboard to see the notification
        showSection('dashboard');
    }
}

// Filter notifications based on time period
function filterNotificationsByPeriod(period) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30);
    
    return notifications.filter(notification => {
        const notificationDate = new Date(notification.date);
        
        switch(period) {
            case 'today':
                return notificationDate >= today;
            case 'weekly':
                return notificationDate >= weekAgo;
            case 'monthly':
                return notificationDate >= monthAgo;
            case 'lifetime':
                return true;
            default:
                return true;
        }
    });
}

// Calculate revenue from filtered notifications
function calculateRevenueFromNotifications(filteredNotifications) {
    return filteredNotifications.reduce((total, notification) => {
        return total + parseFloat(notification.price);
    }, 0);
}

// Update the notifications list in the dashboard based on time period
function updateNotificationsList(filteredNotifications) {
    const notificationsList = document.getElementById("notifications-list");
    
    if (filteredNotifications.length === 0) {
        notificationsList.innerHTML = '<div class="no-notifications">No sales in this time period</div>';
        return;
    }
    
    notificationsList.innerHTML = '';
    
    filteredNotifications.forEach((notification, index) => {
        const notificationItem = document.createElement("div");
        notificationItem.className = "notification-item";
        if (index === 0 && currentPeriod === 'today') {
            notificationItem.classList.add("new-notification");
        }
        
        notificationItem.innerHTML = `
            <div class="notification-icon">$</div>
            <div class="notification-content">
                <div class="notification-title">Sold: ${notification.productName}</div>
                <div class="notification-price">$${parseFloat(notification.price).toFixed(2)}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;
        
        notificationsList.appendChild(notificationItem);
    });
}

// Update dashboard data based on time period
function updateDashboardByTimePeriod(period) {
    currentPeriod = period;
    
    // Update active time filter button
    document.querySelectorAll('.time-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`.time-filter-btn[data-period="${period}"]`).classList.add('active');
    
    // Filter notifications by period
    filteredNotifications = filterNotificationsByPeriod(period);
    
    // Calculate revenue for the period
    const periodRevenue = calculateRevenueFromNotifications(filteredNotifications);
    
    // Update dashboard
    document.getElementById("total-revenue").textContent = `$${periodRevenue.toFixed(2)}`;
    document.getElementById("order-count").textContent = filteredNotifications.length;
    
    // Update notifications list
    updateNotificationsList(filteredNotifications);
}

// Open the product modal for adding a new product
function openAddProductModal() {
    document.getElementById("modalTitle").textContent = "Add New Product";
    document.getElementById("productForm").reset();
    document.getElementById("editProductIndex").value = "";
    document.getElementById("addProductModal").style.display = "block";
}

// Open the modal for editing an existing product
function editProduct(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    if (products[index]) {
        const product = products[index];
        
        document.getElementById("modalTitle").textContent = "Edit Product";
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("editProductIndex").value = index;
        
        // Reset file input - cannot set file input value for security reasons
        // Just inform the user they can update the image
        const fileInput = document.getElementById("productImage");
        fileInput.removeAttribute('required');
        
        document.getElementById("addProductModal").style.display = "block";
    }
}

// Close a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Delete a product after confirmation
function deleteProduct(index) {
    document.getElementById("deleteProductIndex").value = index;
    document.getElementById("deleteConfirmModal").style.display = "block";
}

// Confirm and delete the product
function confirmDeleteProduct() {
    const index = document.getElementById("deleteProductIndex").value;
    const products = JSON.parse(localStorage.getItem("products")) || [];
    
    if (products[index]) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        closeModal('deleteConfirmModal');
        loadProducts();
    }
}

// Convert image file to base64 for storage
function convertImageToBase64(file, callback) {
    if (!file) {
        callback(null);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Initialize the dashboard
function initializeDashboard() {
    // Load saved data from localStorage
    totalRevenue = parseFloat(localStorage.getItem("totalRevenue")) || 0;
    orderCount = parseInt(localStorage.getItem("orderCount")) || 0;
    notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    
    // Update dashboard with default time period
    updateDashboardByTimePeriod('today');
    
    // Update product count
    const products = JSON.parse(localStorage.getItem("products")) || [];
    document.getElementById("product-count").textContent = products.length;
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Load products
    loadProducts();
    
    // Add product form submission
    document.getElementById("productForm").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const name = document.getElementById("productName").value.trim();
        const price = parseFloat(document.getElementById("productPrice").value).toFixed(2);
        const description = document.getElementById("productDescription").value.trim();
        const category = document.getElementById("productCategory").value;
        const editIndex = document.getElementById("editProductIndex").value;
        const fileInput = document.getElementById("productImage");
        
        // Convert image to base64
        convertImageToBase64(fileInput.files[0], function(imageBase64) {
            const products = JSON.parse(localStorage.getItem("products")) || [];
            
            if (editIndex !== "") {
                // Edit existing product
                const index = parseInt(editIndex);
                products[index].name = name;
                products[index].price = price;
                products[index].description = description;
                products[index].category = category;
                // Only update image if a new one is provided
                if (imageBase64) {
                    products[index].image = imageBase64;
                }
            } else {
                // Add new product
                const newProduct = {
                    name,
                    price,
                    description,
                    category,
                    image: imageBase64 || defaultProductImage
                };
                products.push(newProduct);
            }
            
            localStorage.setItem("products", JSON.stringify(products));
            closeModal('addProductModal');
            loadProducts();
        });
    });
    
    // Profile form submission
    if (document.getElementById("profileForm")) {
        document.getElementById("profileForm").addEventListener("submit", saveProfileData);
    }
    
    // Profile image change
    if (document.getElementById("profileImageInput")) {
        document.getElementById("profileImageInput").addEventListener("change", function() {
            if (this.files && this.files[0]) {
                convertImageToBase64(this.files[0], function(imageBase64) {
                    if (imageBase64) {
                        document.getElementById("userProfileImage").src = imageBase64;
                        localStorage.setItem("profileImage", imageBase64);
                    }
                });
            }
        });
    }
    
    // Time filter buttons
    document.querySelectorAll('.time-filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const period = this.getAttribute('data-period');
            updateDashboardByTimePeriod(period);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.getElementById("sidebar-overlay").classList.remove("active");
        document.body.style.overflow = "auto";
    }
});