import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

// Password strength checker function
function isPasswordStrong(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar;
}

// Get elements
const passwordInput = document.getElementById('signup-password');
const strengthPopup = document.getElementById('passwordStrengthPopup');
const submit = document.getElementById('signup-button');

// Real-time password strength check
passwordInput.addEventListener('input', function () {
    if (this.value && !isPasswordStrong(this.value)) {
        strengthPopup.style.display = 'block';
    } else {
        strengthPopup.style.display = 'none';
    }
});

// Submit button event listener
submit.addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = passwordInput.value;

    // Check password strength first
    submit.addEventListener("click", function (event) {
        event.preventDefault();

        const email = document.getElementById('signup-email').value;
        const password = passwordInput.value;

        // Check password strength first
        if (!isPasswordStrong(password)) {
            strengthPopup.style.display = 'block';
            return;
        }

        strengthPopup.style.display = 'none';

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Send verification email
                return sendEmailVerification(user);
            })
            .then(() => {
                signOut(auth); // Sign out the user until they verify
                alert("Account created successfully! Please check your email for verification link. You must verify your email before logging in.");
                window.location.href = './login.html';
            })
            .catch((error) => {
                alert(error.message);
            });
    });
})