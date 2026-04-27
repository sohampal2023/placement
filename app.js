import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- AUTHENTICATION ---
const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            // Requirement 4: Admin Logic
            if(email === "admin@admin.com" && pass === "Admin@1234") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "student.html";
            }
        } catch (err) { alert("Login Failed: Check Credentials"); }
    });
}

// --- ADMIN FEATURES ---
if(window.location.pathname.includes("admin.html")) {
    const loadStats = async () => {
        const snap = await getDocs(collection(db, "users"));
        document.getElementById('studentCount').innerText = snap.size;
    };
    document.getElementById('addQBtn').onclick = async () => {
        const text = document.getElementById('qInput').value;
        const cat = document.getElementById('bankType').value;
        await addDoc(collection(db, "questions"), { text, category: cat });
        alert("Added to Bank!");
    };
    loadStats();
}

// --- STUDENT & AI FEATURES ---
const askBtn = document.getElementById('askBtn');
if(askBtn) {
    askBtn.onclick = () => {
        const speech = new SpeechSynthesisUtterance("What is your primary technical skill?");
        window.speechSynthesis.speak(speech);
    };

    const recordBtn = document.getElementById('recordBtn');
    recordBtn.onclick = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.start();
        recognition.onresult = (e) => {
            document.getElementById('transcriptOutput').innerText = e.results[0][0].transcript;
        };
    };

    // AI Proctoring Requirement
    document.addEventListener("visibilitychange", () => {
        if(document.hidden) {
            alert("AI PROCTOR: Stay on this tab!");
            addDoc(collection(db, "violations"), { type: "Tab Switch", time: serverTimestamp() });
        }
    });
}

// Logout
const lo = document.getElementById('logoutBtn');
if(lo) lo.onclick = () => { signOut(auth); window.location.href="index.html"; };
