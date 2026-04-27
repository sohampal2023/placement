import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Configuration
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

// --- 1. LOGIN LOGIC ---
export async function handleLogin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Requirement 4: Admin check
        if (email === "admin@admin.com" && password === "Admin@1234") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "student.html";
        }
    } catch (error) {
        alert("Access Denied: " + error.message);
    }
}

// --- 2. AI VOICE MODE ---
export function speakQuestion(text) {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
}

export function recordAnswer(callback) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = (event) => {
        callback(event.results[0][0].transcript);
    };
    recognition.start();
}
