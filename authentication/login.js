import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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

// Set persistence to session storage
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // submit buttons
    const submit = document.getElementById('login-button');
    submit.addEventListener("click", function (event) {
      event.preventDefault()

      // inputs
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Log In 
          const user = userCredential.user;
          if (user.emailVerified) {
            // User is verified, proceed with login
            window.location.href = '../main.html';
          } else {
            // User is not verified, sign them out and show message
            signOut(auth);
            alert("Please verify your email before logging in. Check your inbox for the verification link.");
          }
        })
        .catch((error) => {
          alert("Error: " + error.message);
        });
    });
  })
  .catch((error) => {
    console.error("Error setting persistence:", error.message);
  })

// In login.js
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    if (user.emailVerified) {
      // User is verified, proceed with login
      window.location.href = '../main.html';
    } else {
      // User is not verified, sign them out and show message
      signOut(auth).then(() => {
        alert("Please verify your email before logging in. Check your inbox for the verification link.");
      });
    }
  })
  .catch((error) => {
    alert("Error: " + error.message);
  });

