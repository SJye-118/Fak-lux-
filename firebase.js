import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { auth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBMigO8NopC4FB-FXXgmvkdowozMBcHO4Y",
    authDomain: "systemanalysis-5fe44.firebaseapp.com",
    projectId: "systemanalysis-5fe44",
    storageBucket: "systemanalysis-5fe44.firebasestorage.app",
    messagingSenderId: "307308613981",
    appId: "1:307308613981:web:2a7a29ace3baf6d1b298b4",
    measurementId: "G-4SV0RV4WDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Monitor Authentication State
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user);
        document.body.innerHTML = `<h1>Welcome, ${user.email}</h1><button onclick="logout()">Logout</button>`;
    } else {
        // No user is signed in
        console.log('No user signed in');
    }
});

// JavaScript: Login Function
function login(event) {
    event.preventDefault(); // Prevent the form from submitting
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log('User logged in:', userCredential.user);
            alert('Login Successful');
            // Redirect to main page or show user info
            window.location.href = "../main.html";  // Example redirect
        })
        .catch((error) => {
            console.error('Error during login:', error.message);
            // Handle different Firebase Authentication error codes
            if (error.code === 'auth/invalid-email') {
                alert('The email address is not valid.');
            } else if (error.code === 'auth/user-not-found') {
                alert('No user found with that email.');
            } else if (error.code === 'auth/wrong-password') {
                alert('The password is incorrect.');
            } else {
                alert('Error: ' + error.message);  // For other errors
            }
        });
}

// JavaScript: Logout Function
function logout() {
    signOut(auth)
        .then(() => {
            console.log('User logged out');
            alert('Logged out successfully');
            // Redirect to login page
            window.location.href = "login.html";  // Example redirect
        })
        .catch((error) => {
            console.error('Error during logout:', error.message);
            alert('Error: ' + error.message);
        });
}
