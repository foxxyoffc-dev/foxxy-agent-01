// ============================================================
// FOXXY ULTIMATE - FULL SCRIPT
// 3D Earth, Satellite View, Responsif, Semua Fitur Jalan
// ============================================================

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========== GLOBAL VARIABLES ==========
let hacker = false;
let chatHistory = [];
let isRecording = false;
let mediaRec = null;
let redAlert = false;
let nightVision = false;
let satelliteMode = false;
let alarm = null;

// DOM Elements
const chatBox = document.getElementById('chatBox');
const userMsg = document.getElementById('userMsg');
const sendBtn = document.getElementById('sendMsgBtn');
const voiceBtn = document.getElementById('voiceBtn');
const hackerToggle = document.getElementById('hackerToggle');
const threatMapDiv = document.getElementById('threatMap');
const satelliteBtn = document.getElementById('satelliteToggle');

// ========== 3D EARTH (PASTI JALAN) ==========
const earthContainer = document.getElementById('earthCanvas');
if (earthContainer) {
    // Inisialisasi scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, earthContainer.clientWidth / earthContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(earthContainer.clientWidth, earthContainer.clientHeight);
    renderer.setClearColor(0x010118, 1);
    earthContainer.appendChild(renderer.domElement);

    // Bumi
    const geometry = new THREE.SphereGeometry(1.5, 128, 128);
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const material = new THREE.MeshStandardMaterial({ 
        map: earthTexture, 
        roughness: 0.5, 
        metalness: 0.1, 
        emissive: 0x113355,
        emissiveIntensity: 0.3
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Lingkaran neon
    const ringGeo = new THREE.TorusGeometry(1.65, 0.02, 64, 1000);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x0cf, emissive: 0x0cf, emissiveIntensity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    // Pencahayaan
    const ambientLight = new THREE.AmbientLight(0x333366);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
    const backLight = new THREE.PointLight(0x0cf, 0.5);
    backLight.position.set(-2, 1, -3);
    scene.add(backLight);

    // Bintang background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i*3] = (Math.random() - 0.5) * 200;
        starPositions[i*3+1] = (Math.random() - 0.5) * 100;
        starPositions[i*3+2] = (Math.random() - 0.5) * 100 - 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Kamera & kontrol
    camera.position.set(0, 0, 3.8);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = true;
    controls.enableDamping = true;

    // Animasi
    function animateEarth() {
        requestAnimationFrame(animateEarth);
        controls.update();
        ring.rotation.y += 0.005;
        stars.rotation.y += 0.0005;
        renderer.render(scene, camera);
    }
    animateEarth();

    // Resize handler
    window.addEventListener('resize', () => {
        if (earthContainer) {
            const width = earthContainer.clientWidth;
            const height = earthContainer.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    });
}

// ========== SATELLITE VIEW (TOGGLE THREAT MAP) ==========
if (satelliteBtn && threatMapDiv) {
    satelliteBtn.onclick = () => {
        satelliteMode = !satelliteMode;
        if (satelliteMode) {
            threatMapDiv.innerHTML = `
                <div class="threat-item">🛰️ SATELITE VIEW AKTIF</div>
                <div class="threat-item">📍 Koordinat: -6.2088, 106.8456</div>
                <div class="threat-item">📡 Signal strength: 87%</div>
                <div class="threat-item">🌍 Satelit: LAPAN-A2 / Terra</div>
                <div class="threat-item">🕒 Last scan: ${new Date().toLocaleTimeString()}</div>
                <div class="threat-item">📊 Resolution: 0.5m/pixel</div>
            `;
            satelliteBtn.style.background = '#0cf';
            satelliteBtn.style.color = '#000';
        } else {
            threatMapDiv.innerHTML = `
                <div class="threat-item">⚠️ C2 Server: 185.165.29.xx (Russia)</div>
                <div class="threat-item">⚠️ C2 Server: 45.227.254.xx (Brazil)</div>
                <div class="threat-item">⚠️ C2 Server: 103.231.4.xx (Indonesia)</div>
                <div class="threat-item">⚠️ C2 Server: 89.45.23.xx (Germany)</div>
                <div class="threat-item">⚠️ C2 Server: 196.52.43.xx (South Africa)</div>
                <div class="threat-item">⚠️ C2 Server: 45.155.205.xx (China)</div>
            `;
            satelliteBtn.style.background = '#111c2c';
            satelliteBtn.style.color = '#0cf';
        }
    };
}

// ========== SYSTEM STATS (Simulasi Real-time) ==========
let fps = 60, cpu = 18, ram = 42, latency = 38;
setInterval(() => {
    cpu = Math.min(92, Math.max(5, cpu + (Math.random() - 0.5) * 5));
    ram = Math.min(86, Math.max(10, ram + (Math.random() - 0.5) * 4));
    fps = Math.min(75, Math.max(25, fps + (Math.random() - 0.5) * 5));
    latency = Math.min(180, Math.max(20, latency + (Math.random() - 0.5) * 8));
    
    const cpuEl = document.getElementById('cpuVal');
    const cpuBar = document.getElementById('cpuBar');
    const ramEl = document.getElementById('ramVal');
    const ramBar = document.getElementById('ramBar');
    const fpsEl = document.getElementById('fpsVal');
    const latEl = document.getElementById('latVal');
    
    if (cpuEl) cpuEl.innerText = Math.floor(cpu);
    if (cpuBar) cpuBar.style.width = cpu + '%';
    if (ramEl) ramEl.innerHTML = Math.floor(ram) + '%';
    if (ramBar) ramBar.style.width = ram + '%';
    if (fpsEl) fpsEl.innerText = fps;
    if (latEl) latEl.innerText = latency;
}, 1500);

const netEl = document.getElementById('netVal');
const batEl = document.getElementById('batVal');
if (netEl) netEl.innerText = '24 Mbps';
if (batEl) batEl.innerText = '92%';

// ========== CHAT + TERMINAL COMMANDS ==========
function addMessage(text, isUser = false) {
    if (!chatBox) return;
    const div = document.createElement('div');
    div.className = isUser ? 'user-message' : 'ai-message';
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatHistory.push({ role: isUser ? 'user' : 'assistant', content: text });
    localStorage.setItem('foxxy_history', JSON.stringify(chatHistory));
}

function sendAgentMessage() {
    if (!userMsg) return;
    const msg = userMsg.value.trim();
    if (!msg) return;
    
    // TERMINAL COMMANDS
    if (msg.startsWith('/')) {
        const cmd = msg.slice(1).toLowerCase();
        if (cmd === 'scan') {
            addMessage('🔍 Scanning network...\n✅ 3 devices found.\n⚠️ 1 unknown threat detected.', false);
        } else if (cmd === 'trace') {
            addMessage('📍 Tracing IP...\n🌐 Origin: Moscow, Russia\n🕒 Latency: 187ms\n📡 Route: 12 hops', false);
        } else if (cmd === 'hack') {
            addMessage('💀 Hacking target...\n🔓 Access granted.\n📁 Data extracted: 2.4MB\n🕒 Duration: 3.2s', false);
        } else if (cmd === 'help') {
            addMessage('📟 Available commands:\n/scan - Scan network\n/trace - Trace IP\n/hack - Hack target\n/help - Bantuan', false);
        } else {
            addMessage(`❌ Unknown command: ${cmd}. Ketik /help`, false);
        }
        userMsg.value = '';
        return;
    }
    
    addMessage(msg, true);
    userMsg.value = '';
    
    // AI Response (tanpa API - offline mode)
    const responses = [
        "Siap, Komandan! Perintah diterima.",
        "Sistem dalam keadaan aman. Tidak ada ancaman terdeteksi.",
        "Intelijen terbaru: pasar crypto fluktuatif, pantau terus.",
        hacker ? "🕶️ Hacker Mode: Data sedang dianalisis dalam format HEX." : "Mode normal. Ketik /help untuk bantuan.",
        "Foxxy AI siap membantu. Ada perintah lain, Komandan?",
        "Semua sistem berfungsi normal. Threat map update terakhir 2 menit lalu."
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => addMessage(reply, false), 400);
}

if (sendBtn) sendBtn.onclick = sendAgentMessage;
if (userMsg) userMsg.addEventListener('keypress', e => e.key === 'Enter' && sendAgentMessage());

// ========== RED ALERT ==========
const redAlertBtn = document.getElementById('redAlertBtn');
if (redAlertBtn) {
    redAlertBtn.onclick = () => {
        redAlert = !redAlert;
        if (redAlert) {
            document.body.classList.add('red-alert');
            if (!alarm) {
                alarm = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
                alarm.loop = true;
            }
            alarm.play();
            addMessage('🔴 RED ALERT! Emergency protocol activated. Ancaman siber terdeteksi.', false);
        } else {
            document.body.classList.remove('red-alert');
            if (alarm) { alarm.pause(); alarm.currentTime = 0; }
            addMessage('🟢 All clear. Red alert deactivated.', false);
        }
    };
}

// ========== SELF DESTRUCT ==========
const selfDestructBtn = document.getElementById('selfDestructBtn');
if (selfDestructBtn) {
    selfDestructBtn.onclick = () => {
        if (confirm('⚠️ SELF-DESTRUCT: Semua data chat akan dihapus secara permanen. Lanjutkan?')) {
            if (chatBox) chatBox.innerHTML = '';
            for (let i = 5; i > 0; i--) {
                setTimeout(() => {
                    if (chatBox) chatBox.innerHTML += `<div class="ai-message"><div class="message-content">💥 SYSTEM ERASE: ${i}...</div></div>`;
                    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
                }, (5-i) * 400);
            }
            setTimeout(() => {
                chatHistory = [];
                localStorage.removeItem('foxxy_history');
                if (chatBox) chatBox.innerHTML = '<div class="ai-message"><div class="message-content">💀 System wiped. Operasi dimulai ulang, Komandan.</div></div>';
                addMessage('🔄 Sistem direboot. Siap menerima perintah baru.', false);
            }, 2200);
        }
    };
}

// ========== NIGHT VISION ==========
const nightVisionBtn = document.getElementById('nightVisionBtn');
if (nightVisionBtn) {
    nightVisionBtn.onclick = () => {
        nightVision = !nightVision;
        document.body.classList.toggle('night-vision', nightVision);
        addMessage(nightVision ? '🌙 Night Vision aktif. Mode termal diaktifkan.' : '☀️ Kembali ke mode normal.', false);
    };
}

// ========== HACKER MODE ==========
if (hackerToggle) {
    hackerToggle.onclick = () => {
        hacker = !hacker;
        const badge = document.getElementById('hackerBadge');
        if (badge) badge.classList.toggle('hidden', !hacker);
        if (hacker) {
            document.body.style.boxShadow = 'inset 0 0 50px rgba(0,255,0,0.2)';
            addMessage('🕶️ Hacker Mode aktif. Data disamarkan dalam format HEX.', false);
        } else {
            document.body.style.boxShadow = '';
            addMessage('Mode intelijen normal.', false);
        }
    };
}

// ========== VOICE INPUT ==========
if (voiceBtn) {
    voiceBtn.onclick = async () => {
        if (isRecording) {
            if (mediaRec) mediaRec.stop();
            isRecording = false;
            voiceBtn.innerText = '🎤 Suara';
            const waveDiv = document.getElementById('voiceWave');
            if (waveDiv) waveDiv.innerHTML = '';
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            
            function drawWave() {
                if (!isRecording) return;
                analyser.getByteFrequencyData(dataArray);
                const waveDiv = document.getElementById('voiceWave');
                if (waveDiv) {
                    waveDiv.innerHTML = '';
                    for (let i = 0; i < 24; i++) {
                        const bar = document.createElement('div');
                        bar.className = 'wave-bar';
                        bar.style.height = (dataArray[i] / 3) + 'px';
                        waveDiv.appendChild(bar);
                    }
                }
                requestAnimationFrame(drawWave);
            }
            
            mediaRec = new MediaRecorder(stream);
            mediaRec.start();
            isRecording = true;
            voiceBtn.innerText = '⏹️ Stop';
            drawWave();
            
            setTimeout(() => {
                if (isRecording && mediaRec) {
                    mediaRec.stop();
                    isRecording = false;
                    voiceBtn.innerText = '🎤 Suara';
                    const waveDiv = document.getElementById('voiceWave');
                    if (waveDiv) waveDiv.innerHTML = '';
                    stream.getTracks().forEach(track => track.stop());
                }
            }, 5000);
        } catch(e) {
            console.error('Microphone error:', e);
            alert('❌ Gagal akses mikrofon. Pastikan izin diberikan.');
        }
    };
}

// ========== HISTORY MODAL ==========
function loadHistory() {
    const saved = localStorage.getItem('foxxy_history');
    if (saved && chatBox) {
        chatHistory = JSON.parse(saved);
        chatHistory.forEach(h => addMessage(h.content, h.role === 'user'));
    }
}

const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyList = document.getElementById('historyList');
const closeHistoryModal = document.getElementById('closeHistoryModal');
const forceClearHistory = document.getElementById('forceClearHistory');

if (historyBtn && historyModal) {
    historyBtn.onclick = () => {
        if (historyList) {
            historyList.innerHTML = chatHistory.map((h, idx) => 
                `<div class="history-item"><strong>${h.role === 'user' ? '🧑‍💻 Anda' : '🦊 Foxxy'}:</strong><br>${h.content}</div>`
            ).join('');
            if (chatHistory.length === 0) historyList.innerHTML = '<div style="text-align:center; color:#666;">Belum ada history chat</div>';
        }
        historyModal.style.display = 'flex';
    };
}
if (closeHistoryModal) closeHistoryModal.onclick = () => { if (historyModal) historyModal.style.display = 'none'; };
if (forceClearHistory) {
    forceClearHistory.onclick = () => {
        chatHistory = [];
        localStorage.removeItem('foxxy_history');
        if (chatBox) chatBox.innerHTML = '';
        if (historyModal) historyModal.style.display = 'none';
        addMessage('History chat dihapus.', false);
    };
}

// ========== CLEAR CHAT ==========
const clearChatBtn = document.getElementById('clearChatBtn');
if (clearChatBtn) {
    clearChatBtn.onclick = () => {
        if (confirm('Hapus semua pesan di chat?')) {
            if (chatBox) chatBox.innerHTML = '';
            addMessage('Chat dibersihkan. Mulai percakapan baru!', false);
        }
    };
}

// ========== GITHUB MODAL ==========
const githubModal = document.getElementById('githubModal');
const closeGitModal = document.getElementById('closeGitModal');
const openGitBtn = document.getElementById('openGitBtn');

if (openGitBtn) openGitBtn.onclick = () => window.open('https://github.com/foxxyoffc', '_blank');
if (closeGitModal && githubModal) closeGitModal.onclick = () => githubModal.style.display = 'none';
window.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// ========== LIVE NEWS CONTROL ==========
const startLiveNews = document.getElementById('startLiveNewsBtn');
const stopLiveNews = document.getElementById('stopLiveNewsBtn');
if (startLiveNews) {
    startLiveNews.onclick = () => addMessage('📡 Live news feed diaktifkan. Berita akan diperbarui otomatis.', false);
}
if (stopLiveNews) {
    stopLiveNews.onclick = () => addMessage('⏹️ Live news feed dinonaktifkan.', false);
}

// ========== TOGGLE SYS PANEL ==========
const toggleSysPanel = document.getElementById('toggleSysPanel');
const sysPanel = document.getElementById('sysPanel');
if (toggleSysPanel && sysPanel) {
    toggleSysPanel.onclick = () => sysPanel.classList.toggle('expanded');
}

// ========== MAX MODE DETECTION (OPSIONAL) ==========
const urlParams = new URLSearchParams(window.location.search);
const keyword = urlParams.get('key') || '';
if (keyword === 'foxxy-ultimate' || keyword === 'maxmode') {
    const maxBadge = document.getElementById('maxModeBadge');
    if (maxBadge) maxBadge.classList.remove('hidden');
    addMessage('🔥 MAX MODE aktif. Akses intelijen global penuh.', false);
}

// ========== INITIAL LOAD ==========
loadHistory();
addMessage('🦊 Foxxy AI siap, Komandan! Coba perintah: /scan, /trace, /hack', false);
addMessage('💡 Tips: Tekan tombol 🛰️ untuk satellite view, 🔴 untuk red alert, 🌙 untuk night vision', false);
