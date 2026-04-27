import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBKqBYNRY_80b_UOLg1ls9pIKdX-Y8b3CM",
    authDomain: "placement-96094.firebaseapp.com",
    projectId: "placement-96094",
    storageBucket: "placement-96094.firebasestorage.app",
    messagingSenderId: "1061247846675",
    appId: "1:1061247846675:web:c6885811fcf1884582b2e6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 1. Login Logic ---
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            if(email === "admin@admin.com" && pass === "Admin@1234") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "student.html";
            }
        } catch (err) { alert("Login Error: " + err.message); }
    });
}

// --- 2. AI Voice & Interview ---
const askBtn = document.getElementById('askBtn');
const recordBtn = document.getElementById('recordBtn');

if(askBtn) {
    askBtn.onclick = () => {
        const msg = new SpeechSynthesisUtterance("Please introduce yourself and explain your project.");
        window.speechSynthesis.speak(msg);
    };
}

if(recordBtn) {
    recordBtn.onclick = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.start();
        recognition.onresult = (event) => {
            document.getElementById('transcript').innerText = event.results[0][0].transcript;
        };
    };
}

// --- 3. AI Proctoring ---
document.addEventListener("visibilitychange", () => {
    if (document.hidden && window.location.pathname.includes("student")) {
        alert("PROCTOR ALERT: Tab switching is monitored!");
    }
});
