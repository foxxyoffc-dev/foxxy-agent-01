// ========== FOXXY AI - FULL FEATURE (Tanpa API Error) ==========
// Semua fitur non-API TETAP JALAN meskipun GROQ_API_KEY kosong

// ========== GLOBAL ==========
let hacker = false, maxMode = false;
let chatHistory = [];
let realtimeInterval = null;
let isRecording = false, mediaRec = null;
let btcChart = null;
let redAlert = false, nightVision = false;

// DOM Elements
const chatBox = document.getElementById('chatBox');
const userMsg = document.getElementById('userMsg');
const sendBtn = document.getElementById('sendMsgBtn');
const voiceBtn = document.getElementById('voiceBtn');
const hackerToggle = document.getElementById('hackerToggle');
const newsFeed = document.getElementById('newsFeed');
const tickerDiv = document.getElementById('ticker');

// ========== SYSTEM STATS (Simulasi Real-time) ==========
let fps = 60, cpu = 18, ram = 42, latency = 38;
setInterval(() => {
    cpu = Math.min(92, cpu + (Math.random() - 0.5) * 4);
    ram = Math.min(86, ram + (Math.random() - 0.5) * 3);
    fps = Math.min(75, Math.max(28, fps + (Math.random() - 0.5) * 4));
    latency = Math.min(160, Math.max(28, latency + (Math.random() - 0.5) * 6));
    if (document.getElementById('cpuVal')) {
        document.getElementById('cpuVal').innerText = Math.floor(cpu);
        document.getElementById('cpuBar').style.width = cpu + '%';
        document.getElementById('ramVal').innerHTML = Math.floor(ram) + '%';
        document.getElementById('ramBar').style.width = ram + '%';
        document.getElementById('fpsVal').innerText = fps;
        document.getElementById('latVal').innerText = latency;
    }
}, 1500);
if (document.getElementById('netVal')) document.getElementById('netVal').innerText = '24 Mbps';
if (document.getElementById('batVal')) document.getElementById('batVal').innerText = '92%';

// ========== THREAT MAP (Simulasi) ==========
const threatMapDiv = document.getElementById('threatMap');
if (threatMapDiv) {
    threatMapDiv.innerHTML = `
        <div class="threat-item">⚠️ C2 Server: 185.165.29.xx (Russia)</div>
        <div class="threat-item">⚠️ C2 Server: 45.227.254.xx (Brazil)</div>
        <div class="threat-item">⚠️ C2 Server: 103.231.4.xx (Indonesia)</div>
        <div class="threat-item">⚠️ C2 Server: 89.45.23.xx (Germany)</div>
        <div class="threat-item">⚠️ C2 Server: 196.52.43.xx (South Africa)</div>
    `;
}

// ========== GLOBAL NEWS (Simulasi) ==========
const newsFeedDiv = document.getElementById('newsFeed');
if (newsFeedDiv) {
    const dummyNews = [
        { title: "Trump: 'Kesepakatan Iran hampir rampung'", source: "Reuters", time: "1 jam lalu" },
        { title: "Pasar saham AS menguat", source: "Bloomberg", time: "2 jam lalu" },
        { title: "Bitcoin kembali menyentuh $50.000", source: "CoinDesk", time: "3 jam lalu" }
    ];
    newsFeedDiv.innerHTML = dummyNews.map(n => `<div class='news-item'><strong>${n.title}</strong><br>${n.source} • ${n.time}</div>`).join('');
}

// ========== MARKET TICKER (Simulasi) ==========
const tickerDivEl = document.getElementById('ticker');
if (tickerDivEl) {
    let btcPrice = 48200;
    setInterval(() => {
        btcPrice += (Math.random() - 0.5) * 100;
        tickerDivEl.innerHTML = `₿ BTC $${btcPrice.toFixed(0)} | Ξ ETH $3100`;
    }, 5000);
}

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

async function sendAgentMessage() {
    if (!userMsg) return;
    const msg = userMsg.value.trim();
    if (!msg) return;
    
    // TERMINAL COMMANDS
    if (msg.startsWith('/')) {
        const cmd = msg.slice(1).toLowerCase();
        if (cmd === 'scan') addMessage('🔍 Scanning network...\n✅ 3 devices found.\n⚠️ 1 unknown threat detected.', false);
        else if (cmd === 'trace') addMessage('📍 Tracing IP...\n🌐 Origin: Moscow, Russia\n🕒 Latency: 187ms', false);
        else if (cmd === 'hack') addMessage('💀 Hacking target...\n🔓 Access granted.\n📁 Data extracted.', false);
        else if (cmd === 'help') addMessage('📟 Commands: /scan, /trace, /hack, /help', false);
        else addMessage(`❌ Unknown command: ${cmd}. Available: /scan, /trace, /hack`, false);
        userMsg.value = '';
        return;
    }
    
    addMessage(msg, true);
    userMsg.value = '';
    
    // AI Response (tanpa API)
    const responses = [
        "Siap, Komandan! Perintah diterima.",
        "Sistem dalam keadaan aman. Tidak ada ancaman terdeteksi.",
        "Intelijen terbaru: pasar crypto fluktuatif, pantau terus.",
        "Foxxy AI siap membantu. Ada perintah lain?",
        hacker ? "🕶️ Hacker Mode: Data sedang dianalisis dalam format HEX." : "Mode normal. Ketik /help untuk bantuan."
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => addMessage(reply, false), 500);
}

if (sendBtn) sendBtn.onclick = sendAgentMessage;
if (userMsg) userMsg.addEventListener('keypress', e => e.key === 'Enter' && sendAgentMessage());

// ========== RED ALERT ==========
const redAlertBtn = document.getElementById('redAlertBtn');
if (redAlertBtn) {
    let alarm = null;
    redAlertBtn.onclick = () => {
        redAlert = !redAlert;
        if (redAlert) {
            document.body.classList.add('red-alert');
            if (!alarm) {
                alarm = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
                alarm.loop = true;
            }
            alarm.play();
            addMessage('🔴 RED ALERT! Emergency protocol activated.', false);
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
        if (confirm('⚠️ SELF-DESTRUCT: Hapus semua data chat secara permanen?')) {
            if (chatBox) chatBox.innerHTML = '';
            for (let i = 5; i > 0; i--) {
                setTimeout(() => {
                    if (chatBox) chatBox.innerHTML += `<div class="ai-message"><div class="message-content">💥 SYSTEM ERASE: ${i}...</div></div>`;
                    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
                }, (5-i) * 300);
            }
            setTimeout(() => {
                chatHistory = [];
                localStorage.removeItem('foxxy_history');
                if (chatBox) chatBox.innerHTML = '<div class="ai-message"><div class="message-content">💀 System wiped. Operasi dimulai ulang, Komandan.</div></div>';
                addMessage('🔄 Sistem direboot.', false);
            }, 1800);
        }
    };
}

// ========== NIGHT VISION ==========
const nightVisionBtn = document.getElementById('nightVisionBtn');
if (nightVisionBtn) {
    nightVisionBtn.onclick = () => {
        nightVision = !nightVision;
        document.body.classList.toggle('night-vision', nightVision);
        addMessage(nightVision ? '🌙 Night Vision aktif.' : '☀️ Mode normal.', false);
    };
}

// ========== HACKER MODE ==========
if (hackerToggle) {
    hackerToggle.onclick = () => {
        hacker = !hacker;
        const badge = document.getElementById('hackerBadge');
        if (badge) badge.classList.toggle('hidden', !hacker);
        addMessage(hacker ? '🕶️ Hacker Mode aktif.' : 'Mode intelijen normal.', false);
    };
}

// ========== VOICE ==========
if (voiceBtn) {
    voiceBtn.onclick = async () => {
        if (isRecording) {
            if (mediaRec) mediaRec.stop();
            isRecording = false;
            voiceBtn.innerText = '🎤 Suara';
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const ctx = new AudioContext();
            const src = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            src.connect(analyser);
            const data = new Uint8Array(analyser.frequencyBinCount);
            function draw() {
                if (!isRecording) return;
                analyser.getByteFrequencyData(data);
                const waveDiv = document.getElementById('voiceWave');
                if (waveDiv) {
                    waveDiv.innerHTML = '';
                    for (let i = 0; i < 24; i++) {
                        let b = document.createElement('div');
                        b.className = 'wave-bar';
                        b.style.height = (data[i] / 3) + 'px';
                        waveDiv.appendChild(b);
                    }
                }
                requestAnimationFrame(draw);
            }
            mediaRec = new MediaRecorder(stream);
            mediaRec.start();
            isRecording = true;
            voiceBtn.innerText = '⏹️ Stop';
            draw();
            setTimeout(() => {
                if (isRecording) {
                    mediaRec.stop();
                    isRecording = false;
                    voiceBtn.innerText = '🎤 Suara';
                    if (document.getElementById('voiceWave')) document.getElementById('voiceWave').innerHTML = '';
                }
            }, 5000);
        } catch (e) { alert('Microphone access denied'); }
    };
}

// ========== HISTORY ==========
function loadHistory() {
    const saved = localStorage.getItem('foxxy_history');
    if (saved && chatBox) {
        chatHistory = JSON.parse(saved);
        chatHistory.forEach(h => addMessage(h.content, h.role === 'user'));
    }
}
const historyBtn = document.getElementById('historyBtn');
if (historyBtn) {
    historyBtn.onclick = () => {
        const modal = document.getElementById('historyModal');
        const historyList = document.getElementById('historyList');
        if (modal && historyList) {
            historyList.innerHTML = chatHistory.map(h => `<div><strong>${h.role === 'user' ? '🧑‍💻' : '🦊'}:</strong> ${h.content}</div>`).join('');
            modal.style.display = 'flex';
        }
    };
}
const closeHistoryModal = document.getElementById('closeHistoryModal');
if (closeHistoryModal) closeHistoryModal.onclick = () => document.getElementById('historyModal').style.display = 'none';
const forceClearHistory = document.getElementById('forceClearHistory');
if (forceClearHistory) {
    forceClearHistory.onclick = () => {
        chatHistory = [];
        localStorage.removeItem('foxxy_history');
        if (chatBox) chatBox.innerHTML = '';
        document.getElementById('historyModal').style.display = 'none';
        addMessage('History chat dihapus.', false);
    };
}
const closeGitModal = document.getElementById('closeGitModal');
if (closeGitModal) closeGitModal.onclick = () => document.getElementById('githubModal').style.display = 'none';
const openGitBtn = document.getElementById('openGitBtn');
if (openGitBtn) openGitBtn.onclick = () => window.open('https://github.com/foxxyoffc', '_blank');
const toggleSysPanel = document.getElementById('toggleSysPanel');
if (toggleSysPanel) toggleSysPanel.onclick = () => document.getElementById('sysPanel').classList.toggle('expanded');

// ========== LIVE NEWS CONTROL ==========
const startLiveNews = document.getElementById('startLiveNewsBtn');
const stopLiveNews = document.getElementById('stopLiveNewsBtn');
if (startLiveNews && stopLiveNews) {
    startLiveNews.onclick = () => addMessage('📡 Live news feed diaktifkan.', false);
    stopLiveNews.onclick = () => addMessage('⏹️ Live news feed dinonaktifkan.', false);
}

// Load history and start
loadHistory();
addMessage('🦊 Foxxy AI siap, Komandan! Coba /scan, /trace, /hack', false);
