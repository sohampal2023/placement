import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// --- SHARED LOGIN LOGIC ---
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
        } catch (err) { alert("Invalid Credentials"); }
    });
}

// --- PUBLIC NOTICE LOGIC (INDEX.HTML) ---
const noticeList = document.getElementById('noticeList');
if(noticeList) {
    const loadNotices = async () => {
        const snap = await getDocs(collection(db, "notices"));
        noticeList.innerHTML = "";
        snap.forEach(doc => {
            noticeList.innerHTML += `<div class="notice-card">${doc.data().text}</div>`;
        });
    };
    loadNotices();
}

// --- ADMIN SIDE LOGIC (ADMIN.HTML) ---
if(window.location.pathname.includes("admin.html")) {
    const loadStats = async () => {
        const userSnap = await getDocs(collection(db, "users"));
        document.getElementById('enrollmentCount').innerText = userSnap.size;
        
        const qSnap = await getDocs(collection(db, "questions"));
        const bankList = document.getElementById('currentBankList');
        bankList.innerHTML = "";
        qSnap.forEach(doc => {
            bankList.innerHTML += `<li>[${doc.data().category}] ${doc.data().text}</li>`;
        });
    };
    
    document.getElementById('addQuestionBtn').onclick = async () => {
        const text = document.getElementById('questionInput').value;
        const cat = document.getElementById('bankCategory').value;
        if(text) {
            await addDoc(collection(db, "questions"), { text, category: cat });
            location.reload();
        }
    };
    loadStats();
}

// --- STUDENT & AI INTERVIEW LOGIC (STUDENT.HTML) ---
const askBtn = document.getElementById('askBtn');
if(askBtn) {
    askBtn.onclick = () => {
        const speech = new SpeechSynthesisUtterance("Welcome to the interview. Please describe your project experience.");
        window.speechSynthesis.speak(speech);
    };

    const recordBtn = document.getElementById('recordBtn');
    recordBtn.onclick = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.start();
        recognition.onresult = (event) => {
            document.getElementById('transcriptText').innerText = event.results[0][0].transcript;
        };
    };

    // AI Proctoring: Tab Switch Detection
    document.addEventListener("visibilitychange", () => {
        if(document.hidden) {
            alert("AI PROCTOR WARNING: Tab switch recorded. This incident will be reported to admin.");
            addDoc(collection(db, "violations"), { student: "Student_User", type: "Tab Switch", time: new Date() });
        }
    });
}

// Logout Global
const lBtn = document.getElementById('logoutBtn');
if(lBtn) { lBtn.onclick = () => { signOut(auth); window.location.href="index.html"; }; }
