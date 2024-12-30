// Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBMigO8NopC4FB-FXXgmvkdowozMBcHO4Y",
    authDomain: "systemanalysis-5fe44.firebaseapp.com",
    projectId: "systemanalysis-5fe44",
    storageBucket: "systemanalysis-5fe44.firebasestorage.app",
    messagingSenderId: "307308613981",
    appId: "1:307308613981:web:7abf11abc2d7430db298b4",
    measurementId: "G-971FV62XNW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);


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

const profileManager = {
    async updateProfilePicture(file) {
        if (!file || !auth.currentUser) return;

        try {
            // Show loading state
            document.querySelectorAll('.profile-img').forEach(img => {
                img.style.opacity = '0.5';
            });

            const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update all profile images in the UI
            document.querySelectorAll('.profile-img, .side-profile-img, .profile-image').forEach(img => {
                img.src = downloadURL;
                img.style.opacity = '1';
            });

            // Update Firebase profile
            await updateProfile(auth.currentUser, {
                photoURL: downloadURL
            });

            // Save to localStorage for persistence
            localStorage.setItem('userProfilePic', downloadURL);
            return downloadURL;
        } catch (error) {
            // Reset opacity in case of error
            document.querySelectorAll('.profile-img').forEach(img => {
                img.style.opacity = '1';
            });
            console.error("Error updating profile picture:", error);
            throw error;
        }
    },

    updateUIWithUserData(user) {
        // Update display name and email
        const displayNameElements = document.querySelectorAll('#display-name');
        const userEmailElement = document.getElementById('user-email');

        displayNameElements.forEach(element => {
            if (element) element.textContent = user.displayName || user.email.split('@')[0];
        });

        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }

        // Update all profile pictures in the UI
        const profileURL = user.photoURL || 'image/default_profilePIC.png';
        document.querySelectorAll('.profile-img, .side-profile-img, .profile-image').forEach(img => {
            img.src = profileURL;
        });

        // Save to localStorage for persistence
        if (user.photoURL) {
            localStorage.setItem('userProfilePic', user.photoURL);
        }
    }
};

// Order Manager
const orderManager = {
    displayOrders(userId) {
        const orders = JSON.parse(localStorage.getItem(`orderHistory_${userId}`)) || [];
        const orderHistoryContainer = document.getElementById('orderHistory');

        if (!orderHistoryContainer) return;

        orderHistoryContainer.innerHTML = orders.map(order => `
            <div class="order-card"style="margin-bottom:30px">
                <div class="order-header">
                    <span>Order #${order.orderNumber}</span>
                    <span>Date: ${new Date(order.date).toLocaleDateString('en-UK', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace(/,/g, '/')}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <div class="order-subtotal" style="display: flex; justify-content: space-between;margin-bottom:10px">
                        <span>Subtotal:</span>
                        <span>$${order.total.toFixed(2)}</span>
                    </div>
                    <div class="order-tax" style="display: flex; justify-content: space-between;">
                        <span>Tax (99%):</span>
                        <span>$${(order.total * 0.99).toFixed(2)}</span>
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <div class="order-total" style="display: flex; justify-content: space-between;font-size:25px">
                        <strong>Total:</strong>
                        <strong>$${(order.total + (order.total * 0.99)).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `).join('');
    },

    clearHistory(userId) {
        localStorage.removeItem(`orderHistory_${userId}`);
        document.getElementById('orderHistory').innerHTML = '';
    }
};

// Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Initialize UI elements
    const elements = {
        profilePicInput: document.getElementById('profile-pic-input'),
        sidebarBtn: document.querySelector('.menu-btn'),
        sidebar: document.getElementById('mySidebar'),
        closeBtn: document.querySelector('.close-btn'),
        logoutButton: document.getElementById('logout-button'),
        cartIcon: document.getElementById('cart-icon'),
        cartDropdown: document.getElementById('cartDropdown'),
        clearHistoryBtn: document.getElementById('clearHistory')
    };

    // Cart dropdown handler
    if (elements.cartIcon && elements.cartDropdown) {
        elements.cartDropdown.style.display = 'none';

        elements.cartIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = elements.cartDropdown.style.display === 'none';
            elements.cartDropdown.style.display = isHidden ? 'block' : 'none';
            elements.cartDropdown[isHidden ? 'removeAttribute' : 'setAttribute']('hidden', '');
            if (isHidden) cartManager.updateUI();
        });
    }

    // Sidebar handlers
    if (elements.sidebarBtn && elements.sidebar) {
        elements.sidebarBtn.addEventListener('click', () => {
            elements.sidebar.classList.add('active');
        });
    }

    if (elements.closeBtn && elements.sidebar) {
        elements.closeBtn.addEventListener('click', () => {
            elements.sidebar.classList.remove('active');
        });
    }

    // Logout handler
    if (elements.logoutButton) {
        elements.logoutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                localStorage.removeItem('cartState');
                window.location.href = 'authentication/login.html';
            } catch (error) {
                console.error('Error signing out:', error);
                alert('Failed to log out. Please try again.');
            }
        });
    }

    // Clear history handler
    if (elements.clearHistoryBtn) {
        elements.clearHistoryBtn.addEventListener('click', () => {
            if (auth.currentUser) {
                orderManager.clearHistory(auth.currentUser.uid);
                alert('Order history cleared successfully!');
            }
        });
    }

});

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        profileManager.updateUIWithUserData(user);
        orderManager.displayOrders(user.uid);
    } else {
        window.location.href = 'authentication/login.html';
    }
});

export { profileManager, orderManager };



const cartManager = {
    updateCartUI() {
        const cartCount = document.querySelector('#cart-count');
        const cartDropdown = document.getElementById('cartDropdown');
        const cartItemsList = document.getElementById('cartItems');

        // Load the latest cart state from localStorage
        const cartState = JSON.parse(localStorage.getItem('cartState')) || { items: [], total: 0 };

        if (!cartItemsList) return;

        // Clear existing items
        cartItemsList.innerHTML = '';

        // Update items
        cartState.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${item.name} x${item.quantity} - $${(item.quantity * item.price).toFixed(2)}
            `;
            cartItemsList.appendChild(listItem);
        });

        // Update total
        const totalItem = document.createElement('li');
        totalItem.className = 'cart-total';
        totalItem.textContent = `Total: $${cartState.total.toFixed(2)}`;
        cartItemsList.appendChild(totalItem);

        // Update cart count if it exists
        if (cartCount) {
            const totalQuantity = cartState.items.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalQuantity;
        }
    }
};

// Checkout Button functionality
document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.querySelector('#cartDropdown button'); // Checkout button in dropdown

    checkoutButton.addEventListener('click', () => {
        // Redirect to the checkout page
        window.location.href = 'checkout.html';
    });
});

// Add event listener for cart updates
window.addEventListener('cartStateUpdated', () => {
    cartManager.updateCartUI();
});

// Update cart UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    cartManager.updateCartUI();
});


