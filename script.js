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

// DOM
const chatBox = document.getElementById('chatBox');
const userMsg = document.getElementById('userMsg');
const sendBtn = document.getElementById('sendMsgBtn');
const voiceBtn = document.getElementById('voiceBtn');
const hackerToggle = document.getElementById('hackerToggle');
const newsFeed = document.getElementById('newsFeed');
const tickerDiv = document.getElementById('ticker');

// ========== 3D EARTH BACKGROUND ==========
const container = document.createElement('div');
container.style.position = 'fixed'; container.style.top = '0'; container.style.left = '0';
container.style.width = '100%'; container.style.height = '100%'; container.style.zIndex = '-1';
document.body.appendChild(container);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
const earthMat = new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'), emissive: '#113355' });
const earth = new THREE.Mesh(new THREE.SphereGeometry(2.5, 128, 128), earthMat);
scene.add(earth);
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.02, 64, 1000), new THREE.MeshStandardMaterial({ color: 0x0cf, emissive: 0x0cf }));
scene.add(ring);
scene.add(new THREE.AmbientLight(0x333366));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);
camera.position.set(0, 0, 6);
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.8;
function animate() { requestAnimationFrame(animate); controls.update(); ring.rotation.y += 0.005; renderer.render(scene, camera); }
animate();
window.addEventListener('resize', () => { renderer.setSize(window.innerWidth, window.innerHeight); camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); });

// ========== BIOMETRIC LOCK ==========
async function checkBiometric() {
    try {
        if ('PublicKeyCredential' in window && window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
            const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
            if (available) {
                const credential = await navigator.credentials.get({
                    publicKey: {
                        challenge: new Uint8Array(32),
                        rpId: window.location.hostname,
                        allowCredentials: [],
                        userVerification: 'required'
                    }
                });
                if (credential) document.getElementById('biometricModal').style.display = 'none';
                else throw new Error('Verifikasi gagal');
            } else throw new Error('Biometric not available');
        } else throw new Error('WebAuthn not supported');
    } catch(e) {
        const pwd = prompt('🔐 Masukkan kode akses (foxxy2024):');
        if (pwd === 'foxxy2024') document.getElementById('biometricModal').style.display = 'none';
        else alert('Akses ditolak!');
    }
}
document.getElementById('biometricBtn').onclick = checkBiometric;

// ========== LIVE THREAT MAP (Leaflet + Feodo) ==========
function initThreatMap() {
    threatMap = L.map('threatMap').setView([20, 0], 2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '© OSM' }).addTo(threatMap);
}
async function updateThreatMarkers() {
    if (!threatMap) initThreatMap();
    try {
        const res = await fetch('https://feodotracker.abuse.ch/downloads/ipblocklist_recommended.txt');
        const text = await res.text();
        const ips = text.split('\n').slice(0, 15);
        ips.forEach(ip => {
            fetch(`https://ipapi.co/${ip.trim()}/json/`).then(r => r.json()).then(data => {
                if (data.latitude && data.longitude) {
                    L.circleMarker([data.latitude, data.longitude], { radius: 5, color: '#ff0040', fillOpacity: 0.7 }).addTo(threatMap).bindPopup(`C2 Server: ${ip}`);
                }
            }).catch(()=>{});
        });
    } catch(e) { console.log('Threat map error'); }
}
initThreatMap();
setInterval(updateThreatMarkers, 120000);
updateThreatMarkers();

// ========== SATELLITE VIEW ==========
document.getElementById('satelliteToggle').onclick = () => {
    satelliteMode = !satelliteMode;
    threatMap.eachLayer(layer => { if (layer._url) threatMap.removeLayer(layer); });
    if (satelliteMode) {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Satellite' }).addTo(threatMap);
    } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: 'Dark' }).addTo(threatMap);
    }
    addMessage(`🛰️ Satellite view ${satelliteMode ? 'aktif' : 'nonaktif'}`, false);
};

// ========== GLOBAL NEWS + TRUMP ==========
let newsCache = [];
async function fetchGlobalNews() {
    try {
        const res = await fetch('/api/news');
        const data = await res.json();
        newsCache = data.articles?.slice(0, 8) || [];
        newsFeed.innerHTML = newsCache.map(n => `<div class='news-item'><strong>${n.title}</strong><br>${n.source?.name || 'Unknown'} • ${new Date(n.publishedAt).toLocaleTimeString()}</div>`).join('');
    } catch(e) { newsFeed.innerHTML = '<div class="news-item">⚠️ Gagal memuat berita</div>'; }
}
fetchGlobalNews();
setInterval(fetchGlobalNews, 60000);

// ========== MARKET + CHART ==========
async function fetchMarketAndChart() {
    try {
        const res = await fetch('/api/market');
        const data = await res.json();
        tickerDiv.innerHTML = `₿ BTC $${data.btc?.usd || '48.2k'} (${data.btc?.usd_24h_change?.toFixed(2) || '0'}%) | Ξ ETH $${data.eth?.usd || '3.1k'}`;
        const chartRes = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1');
        const chartData = await chartRes.json();
        const prices = chartData.prices?.map(p => p[1]) || [];
        if (btcChart) btcChart.destroy();
        const ctx = document.getElementById('btcChart').getContext('2d');
        btcChart = new Chart(ctx, { type: 'line', data: { labels: prices.map((_,i)=>i), datasets: [{ label: 'BTC (USD)', data: prices, borderColor: '#0cf', fill: false }] }, options: { responsive: true, maintainAspectRatio: true } });
    } catch(e) { tickerDiv.innerHTML = '₿ BTC $49.2k | Ξ ETH $3.1k'; }
}
fetchMarketAndChart();
setInterval(fetchMarketAndChart, 30000);

// ========== AI GROQ ==========
async function callGroqAI(message) {
    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, history: chatHistory.slice(-6), maxMode })
        });
        const data = await res.json();
        return data.reply || 'Maaf, AI sedang sibuk.';
    } catch(e) { return 'Groq API error, tapi saya tetap siap membantu, Komandan.'; }
}

// ========== ENCRYPTION ANIMATION + TERMINAL COMMANDS ==========
async function sendAgentMessage() {
    const msg = userMsg.value.trim();
    if (!msg) return;
    
    // TERMINAL COMMANDS
    if (msg.startsWith('/')) {
        const cmd = msg.slice(1).toLowerCase();
        if (cmd === 'scan') addMessage('🔍 Scanning network...\n✅ 3 devices found.\n⚠️ 1 unknown threat detected.', false);
        else if (cmd === 'trace') addMessage('📍 Tracing IP...\n🌐 Origin: Moscow, Russia\n🕒 Latency: 187ms', false);
        else if (cmd === 'hack') addMessage('💀 Hacking target...\n🔓 Access granted.\n📁 Data extracted.', false);
        else addMessage(`❌ Unknown command: ${cmd}. Available: /scan, /trace, /hack`, false);
        userMsg.value = '';
        return;
    }
    
    addMessage(msg, true);
    userMsg.value = '';
    
    // ENCRYPTION ANIMATION
    const encryptDiv = document.createElement('div');
    encryptDiv.className = 'ai-message';
    encryptDiv.innerHTML = `<div class="message-content">🔒 Encrypting message... 🔑</div>`;
    chatBox.appendChild(encryptDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    await new Promise(r => setTimeout(r, 600));
    encryptDiv.remove();
    
    const aiReply = await callGroqAI(msg);
    addMessage(aiReply, false);
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

sendBtn.onclick = sendAgentMessage;
userMsg.addEventListener('keypress', e => e.key === 'Enter' && sendAgentMessage());

// ========== RED ALERT ==========
document.getElementById('redAlertBtn').onclick = () => {
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

// ========== SELF DESTRUCT ==========
document.getElementById('selfDestructBtn').onclick = () => {
    if (confirm('⚠️ SELF-DESTRUCT: Semua data chat akan dihapus secara permanen. Lanjutkan?')) {
        chatBox.innerHTML = '';
        for (let i = 5; i > 0; i--) {
            setTimeout(() => {
                chatBox.innerHTML += `<div class="ai-message"><div class="message-content">💥 SYSTEM ERASE: ${i}...</div></div>`;
                chatBox.scrollTop = chatBox.scrollHeight;
            }, (5-i) * 300);
        }
        setTimeout(() => {
            chatHistory = [];
            localStorage.removeItem('foxxy_history');
            chatBox.innerHTML = '<div class="ai-message"><div class="message-content">💀 System wiped. Operasi dimulai ulang, Komandan.</div></div>';
            addMessage('🔄 Sistem direboot. Siap menerima perintah baru.', false);
        }, 1800);
    }
};

// ========== NIGHT VISION ==========
document.getElementById('nightVisionBtn').onclick = () => {
    nightVision = !nightVision;
    document.body.classList.toggle('night-vision', nightVision);
    addMessage(nightVision ? '🌙 Night Vision aktif. Mode termal diaktifkan.' : '☀️ Kembali ke mode normal.', false);
};

// ========== MODE MAKSIMAL OTOMATIS ==========
async function detectMaxMode() {
    try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('key') || '';
        if (ipData.ip === 'YOUR_DEV_IP' || keyword === 'foxxy-ultimate' || keyword === 'maxmode') {
            maxMode = true;
            document.getElementById('maxModeBadge').classList.remove('hidden');
            addMessage('🔥 MAX MODE aktif. Akses intelijen global penuh.', false);
        }
    } catch(e) {}
}
detectMaxMode();

// ========== VOICE ==========
async function startVoice() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    function draw() { if (!isRecording) return; analyser.getByteFrequencyData(data); const waveDiv = document.getElementById('voiceWave'); waveDiv.innerHTML = ''; for (let i=0;i<24;i++) { let b = document.createElement('div'); b.className = 'wave-bar'; b.style.height = (data[i]/3)+'px'; waveDiv.appendChild(b); } requestAnimationFrame(draw); }
    mediaRec = new MediaRecorder(stream);
    mediaRec.start();
    isRecording = true;
    voiceBtn.innerText = '⏹️';
    draw();
    setTimeout(() => stopVoice(), 5000);
}
function stopVoice() { if (mediaRec && isRecording) { mediaRec.stop(); mediaRec.stream.getTracks().forEach(t=>t.stop()); isRecording=false; voiceBtn.innerText='🎤'; document.getElementById('voiceWave').innerHTML=''; } }
voiceBtn.onclick = () => isRecording ? stopVoice() : startVoice();

// ========== HISTORY & HACKER MODE ==========
function loadHistory() { const saved = localStorage.getItem('foxxy_history'); if (saved) { chatHistory = JSON.parse(saved); chatHistory.forEach(h => addMessage(h.content, h.role === 'user')); } }
document.getElementById('historyBtn').onclick = () => { document.getElementById('historyModal').style.display = 'flex'; document.getElementById('historyList').innerHTML = chatHistory.map(h => `<div><strong>${h.role === 'user' ? '🧑‍💻' : '🦊'}:</strong> ${h.content}</div>`).join(''); };
document.getElementById('closeHistoryModal').onclick = () => document.getElementById('historyModal').style.display = 'none';
document.getElementById('forceClearHistory').onclick = () => { chatHistory = []; localStorage.removeItem('foxxy_history'); chatBox.innerHTML = ''; document.getElementById('historyModal').style.display = 'none'; addMessage('History chat dihapus.', false); };
document.getElementById('closeGitModal').onclick = () => document.getElementById('githubModal').style.display = 'none';
document.getElementById('openGitBtn').onclick = () => window.open('https://github.com/foxxyoffc', '_blank');
hackerToggle.onclick = () => { hacker = !hacker; document.getElementById('hackerBadge').classList.toggle('hidden', !hacker); addMessage(hacker ? '🕶️ Hacker Mode aktif.' : 'Mode intelijen normal.'); };
document.getElementById('toggleSysPanel').onclick = () => document.getElementById('sysPanel').classList.toggle('expanded');
loadHistory();

// ========== LIVE NEWS CONTROL ==========
window.liveNewsActive = true;
document.getElementById('startLiveNewsBtn').onclick = () => { window.liveNewsActive = true; if (realtimeInterval) clearInterval(realtimeInterval); realtimeInterval = setInterval(fetchGlobalNews, 30000); addMessage('📡 Live news feed diaktifkan.', false); };
document.getElementById('stopLiveNewsBtn').onclick = () => { window.liveNewsActive = false; if (realtimeInterval) clearInterval(realtimeInterval); addMessage('⏹️ Live news feed dinonaktifkan.', false); };
