import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBMigO8NopC4FB-FXXgmvkdowozMBcHO4Y",
    authDomain: "systemanalysis-5fe44.firebaseapp.com",
    projectId: "systemanalysis-5fe44",
    storageBucket: "systemanalysis-5fe44.firebasestorage.app",
    messagingSenderId: "307308613981",
    appId: "1:307308613981:web:7abf11abc2d7430db298b4",
    measurementId: "G-971FV62XNW"
};

// Initialize Firebase Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Submit button
const submitButton = document.getElementById('reset-password-button');
submitButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Input
    const email = document.getElementById('reset-email').value;

    // Send password reset email
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Password reset email sent! Check your inbox.');
            // Optionally, redirect to another page
            window.location.href = './login.html'; // Redirect to login after success
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
        });
});