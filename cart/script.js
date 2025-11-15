// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const filterToggle = document.getElementById('filterToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const searchInput = document.getElementById('searchInput');
const suggestions = document.getElementById('suggestions');
const productsList = document.getElementById('productsList');
const applyFilters = document.getElementById('applyFilters');
const resetFilters = document.getElementById('resetFilters');
const activeFilters = document.getElementById('activeFilters');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const pagination = document.getElementById('pagination');

const products = [
    {
        id: 1,
        title: "Traditional Pattachitra Painting of Lord Jagannath",
        price: 129.99,
        originalPrice: 159.99,
        rating: 4.8,
        reviews: 129,
        image: "./productimages/lordjagganath.jpg",
        tag: "New Arrival",
        description: "This beautiful Pattachitra painting depicts Lord Jagannath in traditional Odisha style. Hand-painted by master artisans using natural colors on treated cloth.",
        category: "paintings",
        filter: "pattachitra"
    },
    {
        id: 2,
        title: "Pattachitra Painting - Krishna Leela",
        price: 145.50,
        originalPrice: 180.00,
        rating: 4.9,
        reviews: 98,
        image: "./productimages/leela.jpg",
        tag: "Trending",
        description: "A masterpiece depicting Krishna Leela scenes in authentic Pattachitra style. Hand-painted with natural colors on silk canvas. This artwork showcases the intricate detailing that Pattachitra is famous for.",
        category: "paintings",
        filter: "pattachitra"
    },
    {
        id: 3,
        title: "Pattachitra Painting - Ganesha",
        price: 89.99,
        originalPrice: 119.99,
        rating: 4.7,
        reviews: 74,
        image: "./productimages/ganesha.jpg",
        tag: "Popular",
        description: "An elegant Pattachitra representation of Lord Ganesha with traditional motifs and patterns. Perfect decorative piece for your living room or as a gift.",
        category: "paintings",
        filter: "pattachitra" 
    },
    {
        id: 4,
        title: "Traditional Ramayana Scene Pattachitra",
        price: 199.99,
        originalPrice: 249.99,
        rating: 5.0,
        reviews: 42,
        image: "./productimages/mayur.jpg",
        tag: "Trending",
        description: "This large Pattachitra painting depicts scenes from Ramayana with intricate details. The artwork showcases the exceptional talent of Odisha's finest artisans.",
        category: "paintings",
        filter: "pattachitra"
    },
    {
        id: 5,
        title: "Tree of Life Pattachitra Art",
        price: 112.50,
        originalPrice: 135.00,
        rating: 4.6,
        reviews: 56,
        image: "./productimages/mayur1.jpg",
        tag: "Best Seller",
        description: "The Tree of Life depicted in traditional Pattachitra style with birds and animals. Made using natural colors on treated cloth.",
        category: "paintings",
        filter: "pattachitra"
    },
    {
        id: 6,
        title: "Pattachitra Wall Hanging - Vishnu Avatar",
        price: 169.99,
        originalPrice: 199.99,
        rating: 4.9,
        reviews: 28,
        image: "./productimages/machli.jpg",
        tag: "Limited Edition",
        description: "A detailed Pattachitra wall hanging showcasing all ten avatars of Lord Vishnu. Hand-crafted by master artisans of Raghurajpur village in Odisha.",
        category: "paintings",
        filter: "pattachitra"
    },
    {
        id: 7,
        title: "Miniature Pattachitra Art Set",
        price: 78.50,
        originalPrice: 99.99,
        rating: 4.5,
        reviews: 65,
        image: "./productimages/hattini.jpg",
        tag: "New Arrival",
        description: "A set of three miniature Pattachitra paintings depicting different deities. Perfect for small spaces or as a thoughtful gift for art lovers.",
        category: "paintings",
        filter: "pattachitra"
    },
    {
        id: 8,
        title: "Pattachitra Radha Krishna Painting",
        price: 158.75,
        originalPrice: 185.00,
        rating: 4.8,
        reviews: 37,
        image: "./productimages/lordjagganath.jpg",
        tag: "Most Viewed",
        description: "A beautiful representation of Radha Krishna in authentic Pattachitra style. The fine detailing and vibrant colors make this artwork stand out.",
        category: "paintings",
        filter: "pattachitra"
    },
    {
        id: 9,
        title: "Village Life Pattachitra",
        price: 135.99,
        originalPrice: 165.00,
        rating: 4.7,
        reviews: 49,
        image: "./productimages/hatttinni.jpg",
        tag: "Trending",
        description: "This unique Pattachitra painting depicts everyday village life in rural Odisha. A celebration of tradition and culture captured through this ancient art form.",
        category: "paintings",
        filter: "pattachitra"
    }
];



// State Variables
let currentFilters = {
    category: "paintings",
    filter: "pattachitra",
    price: {
        min: 50,
        max: 250
    }
};

let currentPage = 1;
const itemsPerPage = 6;


document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    // Set "Pattachitra" as active filter on load
    updateActiveFilters();
});


function setupEventListeners() {
    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Mobile Filter Toggle
    filterToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });

    // Close Sidebar
    closeSidebar.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });

    // Search Input

   
    searchInput.addEventListener('input', (e) => {
        if (e.target.value.length > 0) {
            showSearchSuggestions(e.target.value);
        } else {
            suggestions.style.display = 'none';
        }
    });

    // Filter Links
    document.querySelectorAll('.filter-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            const filter = link.getAttribute('data-filter');
            
            // Update active class
            document.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update filters
            currentFilters.category = category;
            currentFilters.filter = filter;
            
            // Reset to first page
            currentPage = 1;
            
            // Update UI
            updateActiveFilters();
            filterProducts();
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Apply Filters
    applyFilters.addEventListener('click', () => {
        const minPrice = parseFloat(document.getElementById('minPrice').value.replace('$', ''));
        const maxPrice = parseFloat(document.getElementById('maxPrice').value.replace('$', ''));
        
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            currentFilters.price.min = minPrice;
            currentFilters.price.max = maxPrice;
            
            // Reset to first page
            currentPage = 1;
            
            // Update UI
            updateActiveFilters();
            filterProducts();
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        }
    });

    // Reset Filters
    resetFilters.addEventListener('click', () => {
        // Reset to defaults
        currentFilters = {
            category: "paintings",
            filter: "pattachitra",
            price: {
                min: 50,
                max: 250
            }
        };
        
        // Update inputs
        document.getElementById('minPrice').value = '$50';
        document.getElementById('maxPrice').value = '$250';
        
        // Update active filter
        document.querySelectorAll('.filter-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-category="paintings"][data-filter="pattachitra"]').classList.add('active');
        
        // Reset to first page
        currentPage = 1;
        
        // Update UI
        updateActiveFilters();
        filterProducts();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });

    // Pagination
    pagination.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target.classList.contains('page-button') || e.target.classList.contains('prev-next')) {
            if (e.target.classList.contains('page-button')) {
                currentPage = parseInt(e.target.textContent);
            } else if (e.target.textContent === 'Next »') {
                currentPage = Math.min(currentPage + 1, 5);
            } else if (e.target.textContent === '« Prev') {
                currentPage = Math.max(currentPage - 1, 1);
            }
            
            // Update UI
            updatePagination();
            filterProducts();
            
            // Scroll to top of products
            productsList.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Close Modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Close Modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });

    // Range slider functionality (simplified)
    // In a real implementation, this would be more complex with proper dragging
    const startHandle = document.querySelector('.range-handle.start');
    const endHandle = document.querySelector('.range-handle.end');
    const rangeFill = document.querySelector('.range-fill');
    
    // For demo purposes, update price inputs on handle click
    startHandle.addEventListener('click', () => {
        const minPrice = Math.floor(Math.random() * 100) + 20;
        document.getElementById('minPrice').value = '$' + minPrice;
    });
    
    endHandle.addEventListener('click', () => {
        const maxPrice = Math.floor(Math.random() * 150) + 150;
        document.getElementById('maxPrice').value = '$' + maxPrice;
    });
}

// Show Search Suggestions
function showSearchSuggestions(query = '') {
    suggestions.style.display = 'block';
    suggestions.innerHTML = '';
    
    let filteredSuggestions = searchSuggestions;
    if (query) {
        filteredSuggestions = searchSuggestions.filter(s => 
            s.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    if (filteredSuggestions.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'suggestion-item';
        noResults.textContent = 'No matching results';
        suggestions.appendChild(noResults);
    } else {
        filteredSuggestions.forEach(s => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = s;
            item.addEventListener('click', () => {
                searchInput.value = s;
                suggestions.style.display = 'none';
                // Simulate search action
                alert(`Searching for: ${s}`);
            });
            suggestions.appendChild(item);
        });
    }
}

// Render Products
function renderProducts(productsToRender) {
    productsList.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsList.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    
    // Calculate slice for pagination
    const start = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = productsToRender.slice(start, start + itemsPerPage);
    
    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-details">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    <div class="rating-stars">★★★★★</div>
                    <div class="rating-count">${product.rating} (${product.reviews})</div>
                </div>
                <div class="product-price">
                    <div class="current-price">$${product.price}</div>
                    <div class="original-price">$${product.originalPrice}</div>
                </div>
                ${product.tag ? `<div class="product-tag">${product.tag}</div>` : ''}
            </div>
        `;
        
        // Open modal on click
        productCard.addEventListener('click', () => {
            openProductModal(product);
        });
        
        productsList.appendChild(productCard);
    });
    
    // Update pagination
    updatePagination();
}

// Open Product Modal
function openProductModal(product) {
    modalBody.innerHTML = `
        <div class="modal-image" style="background-image: url('${product.image}')"></div>
        <div class="modal-details">
            <h2 class="modal-title">${product.title}</h2>
            <div class="product-rating">
                <div class="rating-stars">★★★★★</div>
                <div class="rating-count">${product.rating} (${product.reviews} reviews)</div>
            </div>
            <div class="product-price">
                <div class="current-price">$${product.price}</div>
                <div class="original-price">$${product.originalPrice}</div>
            </div>
            <p class="modal-description">${product.description}</p>
            <button class="add-to-cart">Add to Cart</button>
        </div>
    `;
    
    // Add event listener for the Add to Cart button
    modalBody.querySelector('.add-to-cart').addEventListener('click', () => {
        alert(`Added "${product.title}" to cart!`);
    });
    
    productModal.style.display = 'block';
}

// Filter Products
function filterProducts() {
    const filteredProducts = products.filter(product => {
        // Check category and filter
        const categoryMatch = currentFilters.category === product.category || currentFilters.category === "top";
        const filterMatch = currentFilters.filter === product.filter || 
                        (currentFilters.category === "top" && currentFilters.filter === "new" && product.tag === "New Arrival") ||
                        (currentFilters.category === "top" && currentFilters.filter === "most-viewed" && product.tag === "Most Viewed") ||
                        (currentFilters.category === "top" && currentFilters.filter === "trending" && product.tag === "Trending");
        
        // Check price range
        const priceMatch = product.price >= currentFilters.price.min && product.price <= currentFilters.price.max;
        
        return categoryMatch && filterMatch && priceMatch;
    });
    
    renderProducts(filteredProducts);
}

// Update Active Filters
function updateActiveFilters() {
    activeFilters.innerHTML = '';
    
    // Add category and filter tag
    if (currentFilters.category && currentFilters.filter) {
        let filterText;
        if (currentFilters.category === "top") {
            filterText = currentFilters.filter === "new" ? "New Arrivals" : 
                        currentFilters.filter === "most-viewed" ? "Most Viewed" : "Trending Items";
        } else {
            // Capitalize first letter of filter
            filterText = currentFilters.filter.charAt(0).toUpperCase() + currentFilters.filter.slice(1);
        }
        
        const filterTag = document.createElement('div');
        filterTag.className = 'filter-tag';
        filterTag.innerHTML = `
            ${filterText} <span class="remove-filter" data-type="category">✕</span>
        `;
        
        filterTag.querySelector('.remove-filter').addEventListener('click', () => {
            resetFilters.click();
        });
        
        activeFilters.appendChild(filterTag);
    }
    
    // Add price range tag
    const priceTag = document.createElement('div');
    priceTag.className = 'filter-tag';
    priceTag.innerHTML = `
        Price: $${currentFilters.price.min} - $${currentFilters.price.max} <span class="remove-filter" data-type="price">✕</span>
    `;
    
    priceTag.querySelector('.remove-filter').addEventListener('click', () => {
        currentFilters.price.min = 50;
        currentFilters.price.max = 250;
        document.getElementById('minPrice').value = '$50';
        document.getElementById('maxPrice').value = '$250';
        filterProducts();
    });
    
    activeFilters.appendChild(priceTag);
}

// Update Pagination
function updatePagination() {
    const pageButtons = pagination.querySelectorAll('.page-button');
    pageButtons.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add('active');
        }
    });
    
    // Update prev/next buttons
    const prevNext = pagination.querySelectorAll('.prev-next');
    prevNext.forEach(button => {
        pagination.removeChild(button);
    });
    
    // Add "Prev" button if not on first page
    if (currentPage > 1) {
        const prevButton = document.createElement('a');
        prevButton.href = '#';
        prevButton.className = 'prev-next';
        prevButton.textContent = '« Prev';
        pagination.insertBefore(prevButton, pagination.firstChild);
    }
    
    // Add "Next" button if not on last page
    if (currentPage < 5) {
        const nextButton = document.createElement('a');
        nextButton.href = '#';
        nextButton.className = 'prev-next';
        nextButton.textContent = 'Next »';
        pagination.appendChild(nextButton);
    }
}
