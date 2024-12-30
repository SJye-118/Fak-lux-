import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

// Simulated cart data with structure
const cartState = JSON.parse(localStorage.getItem('cartState')) || { items: [] };

// Helper function to calculate subtotal dynamically
cartState.getSubtotal = function () {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Check user state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        console.log("Paying Details");
    } else {
        // No user is logged in
        alert("Please login before proceed your purchase.");
        window.location.href = 'authentication/login.html'; // Redirect to login page
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("subtotal");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const orderNumberEl = document.getElementById("order-number");

    // Generate a unique order number
    const orderNumber = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    orderNumberEl.textContent = `Order #${orderNumber}`;

    // Populate the cart items table
    if (cartState.items.length > 0) {
        cartState.items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            `;
            cartItems.appendChild(row);
        });
    } else {
        // Show a message if the cart is empty
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="4">Your cart is empty.</td>`;
        cartItems.appendChild(row);
    }

    // Calculate totals
    const subtotal = cartState.getSubtotal();
    const tax = subtotal * 0.99; // 99% tax
    const total = subtotal + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    // Confirm Payment Button
    document.getElementById("confirm-payment").addEventListener("click", () => {
        if (cartState.items.length === 0) {
            alert("Your cart is empty. Please add items before confirming payment.");
            return;
        }

        // Get delivery information
        const address = document.getElementById('address').value.trim();
        const postcode = document.getElementById('postcode').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country').value;

        // Validate all fields are filled
        if (!address || !postcode || !city || !country) {
            alert("Please fill in all delivery information fields before confirming order.");
            return;
        }

        const deliveryInfo = {
            address,
            postcode,
            city,
            country
        };

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const order = {
                orderNumber,
                items: cartState.items,
                subtotal,
                tax,
                total,
                date: new Date().toISOString(),
                deliveryInfo
            };

            // Get existing orders or initialize empty array
            const existingOrders = JSON.parse(localStorage.getItem(`orderHistory_${user.uid}`)) || [];

            // Add new order
            existingOrders.push(order);

            // Save updated orders
            localStorage.setItem(`orderHistory_${user.uid}`, JSON.stringify(existingOrders));

            // Clear the cart
            localStorage.setItem("cartState", JSON.stringify({ items: [] }));

            // Redirect to the main page
            setTimeout(() => {
                window.location.href = "payment-method.html";
            }, 1000);
        }
    });

    // Back to Cart Button
    document.getElementById("back-to-cart").addEventListener("click", () => {
        window.location.href = "main.html";
    });
});