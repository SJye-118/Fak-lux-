import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBMigO8NopC4FB-FXXgmvkdowozMBcHO4Y",
    authDomain: "systemanalysis-5fe44.firebaseapp.com",
    projectId: "systemanalysis-5fe44",
    storageBucket: "systemanalysis-5fe44.firebasestorage.app",
    messagingSenderId: "307308613981",
    appId: "1:307308613981:web:7abf11abc2d7430db298b4",
    measurementId: "G-971FV62XNW"
};

// Cart state management
const cartState = {
    items: [], // Cart items array
    total: 0,  // Total price of all items
    addItem(product) {
        const existingProduct = this.items.find(item => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            this.items.push({ ...product });
        }

        this.total += parseFloat(product.price);
        this.updateCartUI();
        this.saveCartState(); // Save to localStorage whenever cart is updated
    },

    // Update cart UI and display in the dropdown
    updateCartUI() {
        const cartCount = document.querySelector('#cart-count');
        const cartDropdown = document.getElementById('cartDropdown');
        const cartItemsList = document.getElementById('cartItems');

        // Update cart count badge
        const totalQuantity = this.items.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalQuantity;

        // Update cart items in dropdown
        cartItemsList.innerHTML = '';
        this.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} x${item.quantity} - $${(item.quantity * item.price).toFixed(2)}`;
            cartItemsList.appendChild(listItem);
        });

        // Update cart total
        const totalPrice = document.createElement('li');
        totalPrice.textContent = `Total: $${this.total.toFixed(2)}`;
        totalPrice.style.fontWeight = 'bold';
        cartItemsList.appendChild(totalPrice);
    },

    // Save the cart state in localStorage
    saveCartState() {
        localStorage.setItem('cartState', JSON.stringify(this));
    },

    // Load the cart state from localStorage
    loadCartState() {
        const storedCart = JSON.parse(localStorage.getItem('cartState'));
        if (storedCart) {
            this.items = storedCart.items || [];
            this.total = storedCart.total || 0;
            this.updateCartUI(); // Update UI if there is saved state
        }
    }
};

// Sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.getElementById('mySidebar');
    const closeBtn = document.querySelector('.close-btn');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }
});

// Product functionality
const productManager = {
    init() {
        const productCards = document.querySelectorAll('.product-card');

        productCards.forEach((card, index) => {
            const button = card.querySelector('button');
            if (button) {
                button.addEventListener('click', () => {
                    const product = {
                        id: index + 1,
                        name: card.querySelector('h3').textContent.trim(),
                        price: parseFloat(card.querySelector('p').textContent.replace('$', '')),
                        quantity: 1
                    };

                    cartState.addItem(product);
                    this.showToast(`${product.name} added to cart!`);
                });
            }
        });
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2500);
    }
};

// Cart dropdown toggle
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cartDropdown');

    cartIcon.addEventListener('click', () => {
        cartDropdown.classList.toggle('active');
    });
});

// Cart state loading after page load
document.addEventListener('DOMContentLoaded', () => {
    cartState.loadCartState();
    productManager.init();
});

// Checkout Button functionality
document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.querySelector('#cartDropdown button'); // Checkout button in dropdown

    checkoutButton.addEventListener('click', () => {
        // Redirect to the checkout page
        window.location.href = 'checkout.html';
    });
});

// Add required styles dynamically
const styles = `
    .cart-dropdown.active {
        display: flex;
        flex-direction: column;
    }
    .toast {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        z-index: 1000;
        animation: fadeInOut 2.5s ease forwards;
    }
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        15% { opacity: 1; transform: translateY(0); }
        85% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
    }
`;
document.addEventListener('DOMContentLoaded', () => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
});

document.addEventListener('DOMContentLoaded', () => {
    const aboutLink = document.getElementById('about-link');
    const helpLink = document.querySelector('.nav-link[href="#help"]');
    const tncLink = document.getElementById('tnc-link');
    const privacyLink = document.getElementById('privacyPolicy');

    const aboutModal = document.getElementById('aboutModal');
    const helpModal = document.getElementById('helpModal');
    const tncModal = document.getElementById('tncModal');
    const privacyModal = document.getElementById('privacyModal');

    const closeModalButtons = document.querySelectorAll('.modal-close');

    // Function to show a modal
    function showModal(modal) {
        modal.classList.add('active');
    }

    // Function to hide a modal
    function hideModal(modal) {
        modal.classList.remove('active');
    }

    // Event listeners for opening modals
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(aboutModal);
    });

    helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(helpModal);
    });

    tncLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(tncModal);
    });

    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(privacyModal);
    })

    // Event listeners for closing modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            hideModal(modal);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            const modalContent = modal.querySelector('.modal-content');
            if (!modalContent.contains(event.target)) {
                modal.classList.remove('active');
            }
        });
    });

    const closeModalButtons = document.querySelectorAll('.modal-close');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            modal.classList.remove('active');
        });
    });
});

const app = initializeApp(firebaseConfig);
const auth = getAuth();  // Get Auth instance

// Sign out function
function signOutUser() {
    auth.signOut()  // Sign out user
        .then(() => {
            sessionStorage.removeItem('firebase:authUser');  // Remove users from sessionStorage 
            sessionStorage.removeItem('displayName');
            alert('User logged out');
            window.location.href = 'authentication/login.html';  // Redirect to login page
        })
        .catch((error) => {
            alert('Error signing out:', error);
        });
}

// Function to set and get displayName from sessionStorage
function updateDisplayName(user) {
    const displayName = user.displayName || user.email.split('@')[0]; // Use email prefix if displayName is null
    sessionStorage.setItem('displayName', displayName); // Save displayName to sessionStorage
    document.getElementById('display-name').textContent = displayName;
}

// Auth state changed listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        updateDisplayName(user); // Update the display name from sessionStorage
    } else {
        // No user is signed in
        const displayName = 'Guest'; // Default to "Guest" if no user is logged in
        sessionStorage.setItem('displayName', displayName); // Save "Guest" to sessionStorage
        document.getElementById('display-name').textContent = displayName;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Apply dark mode if enabled
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    // If on settings page, ensure toggle is in correct state
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
    }
});

// Search and Filter Functionality
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productsGrid = document.querySelector('.products-grid');
    const logoutButton = document.getElementById('logout-button');


    function filterProducts() {
        const searchTerm = searchBar.value.toLowerCase();
        const category = categoryFilter.value;
        const priceRange = priceFilter.value;

        const products = document.querySelectorAll('.product-categories, .product-card');

        products.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productPrice = parseFloat(product.querySelector('p')?.textContent?.replace('$', '') || '0');

            let matchesSearch = productName.includes(searchTerm);
            let matchesCategory = !category || product.classList.contains(category);
            let matchesPrice = true;

            if (priceRange) {
                const [min, max] = priceRange.split('-').map(num => num === '+' ? Infinity : Number(num));
                matchesPrice = productPrice >= min && productPrice < (max || Infinity);
            }

            product.style.display = matchesSearch && matchesCategory && matchesPrice ? 'block' : 'none';
        });
    }
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            signOutUser(); // This calls your existing signOut function
        });
    }

    // Add event listeners
    searchBar.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
});

