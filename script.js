// ============================================================
// FOXXY ULTIMATE 100% - FINAL SCRIPT (VERIFY FIXED)
// Password: foxxy2024, 3x salah -> redirect
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import L from 'leaflet';

// ========== GLOBAL ==========
let hacker = false, maxMode = false;
let chatHistory = [];
let realtimeInterval = null;
let isRecording = false, mediaRec = null;
let btcChart = null;
let threatMap = null;
let redAlert = false;
let nightVision = false;
let satelliteMode = false;
let alarm = null;

const chatBox = document.getElementById('chatBox');
const userMsg = document.getElementById('userMsg');
const sendBtn = document.getElementById('sendMsgBtn');
const voiceBtn = document.getElementById('voiceBtn');
const hackerToggle = document.getElementById('hackerToggle');
const newsFeed = document.getElementById('newsFeed');
const tickerDiv = document.getElementById('ticker');

// ========== PASSWORD 3 PERCOBAAN (DIREKT, PAKAI ID) ==========
let passwordAttempts = 0;

function verifyPassword() {
    const inputEl = document.getElementById("passwordInput");
    if (!inputEl) {
        alert("Error: input password tidak ditemukan.");
        return;
    }
    const inputPass = inputEl.value;
    
    if (inputPass === "foxxy2024") {
        const modal = document.getElementById("biometricModal");
        if (modal) modal.style.display = "none";
        addMessage('🔓 Akses granted. Selamat datang, Komandan.', false);
        passwordAttempts = 0;
    } else {
        passwordAttempts++;
        const remaining = 3 - passwordAttempts;
        if (passwordAttempts >= 3) {
            alert("⛔ AKSES DITOLAK! 3 kali percobaan salah.\nAnda akan dialihkan keluar.");
            window.location.href = "https://www.google.com";
        } else {
            alert(`❌ AKSES DITOLAK! Kode salah.\n⚠️ Sisa percobaan: ${remaining} kali lagi.`);
            if (inputEl) inputEl.value = "";
        }
    }
}

// Attach event setelah DOM benar-benar siap
function attachPasswordEvents() {
    const btn = document.getElementById("biometricBtn");
    const inputField = document.getElementById("passwordInput");
    if (btn) {
        btn.onclick = verifyPassword;
        console.log("Tombol VERIFY terpasang.");
    } else {
        console.error("Tombol VERIFY tidak ditemukan di DOM!");
    }
    if (inputField) {
        inputField.addEventListener("keypress", function(e) {
            if (e.key === "Enter") verifyPassword();
        });
    }
}

// Jalankan attachment setelah semua elemen ter-load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachPasswordEvents);
} else {
    attachPasswordEvents();
}

// Reset counter jika modal diklik di luar (optional)
const modalBgFixed = document.getElementById("biometricModal");
if (modalBgFixed) {
    modalBgFixed.addEventListener("click", function(e) {
        if (e.target === modalBgFixed) {
            passwordAttempts = 0;
            const inp = document.getElementById("passwordInput");
            if (inp) inp.value = "";
        }
    });
}

function addMessage(text, isUser = false) {
    const div = document.createElement('div');
    div.className = isUser ? 'user-message' : 'ai-message';
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatHistory.push({ role: isUser ? 'user' : 'assistant', content: text });
    localStorage.setItem('foxxy_history', JSON.stringify(chatHistory));
}

// SISANYA =====> (3D earth, threat map, news, market, AI, voice, dll) tetap seperti kode final sebelumnya.
// Karena batasan karakter, saya tulis ulang minimal di atas, tapi fungsi addMessage dll sudah ada.
// Mohon pastikan bagian 3D earth dll tidak hilang. Jika perlu, gue kirim file lengkap via pastebin atau private.
