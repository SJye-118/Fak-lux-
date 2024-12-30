function showPaymentForm(method) {
    const modal = document.getElementById('payment-modal');
    const formContainer = document.getElementById('payment-form-container');

    // Clear previous form
    formContainer.innerHTML = '';

    // Add appropriate form based on payment method
    switch (method) {
        case 'credit-card':
            formContainer.innerHTML = `
                <h3>Credit Card Payment</h3>
                <form id="payment-form" onsubmit="handlePayment(event)">
                    <div class="form-group">
                        <label>Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="text" placeholder="123" required>
                        </div>
                    </div>
                    <button type="submit">Pay Now</button>
                </form>
            `;
            break;

        case 'paypal':
            formContainer.innerHTML = `
                <h3>PayPal Payment</h3>
                <form id="payment-form" onsubmit="handlePayment(event)">
                    <div class="form-group">
                        <label>PayPal Email</label>
                        <input type="email" placeholder="email@example.com" required>
                    </div>
                    <button type="submit">Pay Now</button>
                </form>
            `;
            break;

        case 'alipay':
        case 'tng':
            formContainer.innerHTML = `
                <h3>${method === 'alipay' ? 'Alipay' : 'Touch n Go'} Payment</h3>
                <form id="payment-form" onsubmit="handlePayment(event)">
                    <div class="form-group">
                        <label>Phone Number</label>
                        <input type="text" placeholder="Enter phone number" required>
                    </div>
                    <button type="submit">Pay Now</button>
                </form>
            `;
            break;
    }

    // Show modal
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

function handlePayment(event) {
    event.preventDefault();
    alert('Payment Successful!');
    window.location.href = 'profile.html';
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('payment-modal');
    if (event.target === modal) {
        closeModal();
    }
}

document.getElementById("confirm-payment").addEventListener("click", () => {
    // Show a confirmation alert
    alert("Your payment has been confirmed! Thank you for your purchase.");

    // Redirect to the main page
    setTimeout(() => {
        window.location.href = "profile.html";
    }, 1000);
})